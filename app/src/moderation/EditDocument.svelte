<script lang="ts">
    import { acceptCompletion, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
    import { basicSetup } from "@codemirror/basic-setup";
    import { defaultKeymap, historyKeymap, indentWithTab } from "@codemirror/commands";
    import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
    import { foldKeymap } from "@codemirror/language";
    import { lintKeymap } from "@codemirror/lint";
    import { searchKeymap } from "@codemirror/search";
    import { Compartment, EditorState, Extension } from "@codemirror/state";
    import { EditorView, keymap } from "@codemirror/view";
    import { Emoji, Strikethrough } from "@lezer/markdown";
    import { onDestroy } from "svelte";
    import watchMedia from "svelte-media";
    import { link } from "svelte-navigator";
    import { HSplitPane } from "svelte-split-pane";
    import { apiClient } from "../api_client";
    import { Document } from "../proto/jungletv_pb";
    import { darkMode } from "../stores";
    import { codeMirrorHighlightStyle, parseCompleteMarkdown } from "../utils";

    export let documentID = "";
    let content = "";
    let editing = false;

    async function fetchDocument(): Promise<Document> {
        try {
            let response = await apiClient.getDocument(documentID);
            content = response.getContent();
            editing = true;
            return response;
        } catch {
            content = "";
            editing = false;
            return new Document();
        }
    }

    async function save() {
        let document = new Document();
        document.setId(documentID);
        document.setContent(content);
        document.setFormat("markdown");
        await apiClient.updateDocument(document);
        alert("Document updated");
        editing = true;
    }

    async function triggerAnnouncementsNotification() {
        await apiClient.triggerAnnouncementsNotification();
        alert("Announcements notification triggered");
    }

    let editorContainer: HTMLElement;
    let editorView: EditorView;

    const themeCompartment = new Compartment();
    const highlightCompartment = new Compartment();

    const darkModeUnsubscribe = darkMode.subscribe((dm) => {
        if (typeof editorView !== "undefined") {
            editorView.dispatch({
                effects: [
                    themeCompartment.reconfigure(theme(dm)),
                    highlightCompartment.reconfigure(codeMirrorHighlightStyle(dm)),
                ],
            });
        }
    });
    onDestroy(darkModeUnsubscribe);

    function theme(darkMode: boolean): Extension {
        return EditorView.theme(
            {
                "&.cm-editor": {
                    height: "100%",
                },
                ".cm-scroller": {
                    overflow: "auto",
                },
                "&.cm-editor.cm-focused": {
                    outline: "2px solid transparent",
                    "outline-offset": "2px",
                },
                ".cm-tooltip.cm-tooltip-autocomplete > ul": {
                    "max-height": "200px",
                    "font-family": "inherit",
                    padding: "8px",
                },
                ".cm-tooltip.cm-tooltip-autocomplete > ul > li": {
                    "font-family": "inherit",
                    "font-size": "1rem",
                    "line-height": "1.5rem",
                    padding: "3px 8px 3px 2px",
                    "text-color": darkMode ? "white" : "black",
                    "border-radius": "2px",
                },
                ".cm-completionIcon": {
                    "padding-right": "22px",
                    "font-size": "125%",
                },
                ".cm-completionIcon.cm-completionIcon-emoji": {
                    display: "none",
                },
                ".cm-completionEmoji": {
                    display: "inline-block",
                    "text-align": "center",
                    "min-width": "2.1rem",
                    "padding-right": "0.3rem",
                },
                ".cm-tooltip-autocomplete ul li[aria-selected]": {
                    "background-color": darkMode ? "rgba(75,85,99,1)" : "rgba(156,163,175,1)",
                    "text-color": darkMode ? "white" : "black",
                },
                ".cm-tooltip": {
                    background: darkMode ? "rgba(31,41,55,1)" : "rgba(229,231,235,1)",
                    "border-radius": "2px",
                    "border-width": "1px",
                    "border-color": darkMode ? "rgba(75,85,99,1)" : "rgba(156,163,175,1)",
                },
            },
            {
                dark: darkMode,
            }
        );
    }

    function setupEditor() {
        editorView = new EditorView({
            state: EditorState.create({
                doc: content,
                extensions: [
                    EditorView.updateListener.of((viewUpdate) => {
                        if (viewUpdate.docChanged) {
                            content = viewUpdate.state.doc.toString();
                        }
                    }),
                    basicSetup,
                    highlightCompartment.of(codeMirrorHighlightStyle($darkMode)),
                    keymap.of([
                        ...closeBracketsKeymap,
                        ...defaultKeymap,
                        ...searchKeymap,
                        ...historyKeymap,
                        ...foldKeymap,
                        ...completionKeymap,
                        ...lintKeymap,
                        {
                            key: "Tab",
                            run: acceptCompletion,
                        },
                        indentWithTab,
                        {
                            key: "Mod-s",
                            preventDefault: true,
                            run: (_): boolean => {
                                save();
                                return true;
                            },
                        },
                    ]),
                    markdown({
                        extensions: [Strikethrough, Emoji],
                        base: markdownLanguage,
                    }),
                    EditorView.lineWrapping,
                    themeCompartment.of(theme($darkMode)),
                ],
            }),
            parent: editorContainer,
        });
        editorView.focus();
        onDestroy(() => {
            editorView.destroy();
        });
    }

    $: {
        // reactive block to trigger editor initialization once editorContainer is bound
        if (typeof editorContainer !== "undefined" && typeof editorView === "undefined") {
            setupEditor();
        }
    }

    function updateEditorContents(newContents: string) {
        if (typeof editorView !== "undefined") {
            let curContents = editorView.state.doc.toString();
            if (newContents != curContents) {
                editorView.dispatch({
                    changes: { from: 0, to: curContents.length, insert: newContents },
                });
            }
        }
    }

    // reactive block to update the editor contents when content is updated
    $: updateEditorContents(content);

    let leftPaneSize = "50%";
    let rightPaneSize = "50%";

    function toggleEditorPreview() {
        if (leftPaneSize == "0%") {
            leftPaneSize = "100%";
            rightPaneSize = "0%";
        } else {
            leftPaneSize = "0%";
            rightPaneSize = "100%";
        }
    }
    const media = watchMedia({ large: "(min-width: 640px)" });
    let firstMedia = true;
    // make sure we don't attempt to even split the screen on narrow screens
    const mediaUnsubscribe = media.subscribe((obj) => {
        if (firstMedia) {
            firstMedia = false;
            if (!obj.large) {
                leftPaneSize = "100%";
                rightPaneSize = "0%";
            }
        }
    });
    onDestroy(mediaUnsubscribe);
</script>

<div class="flex-grow mx-auto editor-container flex flex-col">
    <div class="flex flex-row flex-wrap space-x-2">
        <a
            use:link
            href="/moderate"
            class="block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
            <i class="fas fa-arrow-left" />
        </a>
        <h1 class="text-lg block pt-1">
            <span class="hidden md:inline">{editing ? "Editing" : "Creating"} document</span>
            <span class="font-mono">{documentID}</span>
        </h1>
        <div class="flex-grow" />
        <button
            type="submit"
            class="block lg:hidden justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            on:click={toggleEditorPreview}
        >
            Toggle preview
        </button>
        <div class="flex-grow" />
        <button
            type="submit"
            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            on:click={save}
        >
            Save
        </button>
        {#if documentID == "announcements"}
            <button
                type="submit"
                class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                on:click={triggerAnnouncementsNotification}
            >
                Trigger new announcement notification
            </button>
        {/if}
    </div>

    <div class="overflow-hidden h-full">
        {#await fetchDocument()}
            <p>Loading document...</p>
        {:then}
            <HSplitPane {leftPaneSize} {rightPaneSize}>
                <div slot="left" class="h-full max-h-full relative" bind:this={editorContainer} />
                <div slot="right" class="h-full max-h-full px-6 pb-6 overflow-auto markdown-document">
                    {@html parseCompleteMarkdown(content)}
                </div>
            </HSplitPane>
        {/await}
    </div>
</div>

<style>
    .editor-container {
        width: 100%;
        height: calc(100vh - 4rem);
    }
</style>
