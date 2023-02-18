<script lang="ts">
    import { acceptCompletion, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
    import { defaultKeymap, historyKeymap, indentWithTab } from "@codemirror/commands";
    import { javascript } from "@codemirror/lang-javascript";
    import { foldKeymap } from "@codemirror/language";
    import { lintKeymap } from "@codemirror/lint";
    import { searchKeymap } from "@codemirror/search";
    import { Compartment, EditorState } from "@codemirror/state";
    import { EditorView, keymap } from "@codemirror/view";
    import { basicSetup } from "codemirror";
    import { onDestroy } from "svelte";
    import watchMedia from "svelte-media";
    import { link } from "svelte-navigator";
    import { HSplitPane } from "svelte-split-pane";
    import { apiClient } from "../api_client";
    import { modalAlert, modalPrompt } from "../modal/modal";
    import { ApplicationFile } from "../proto/application_editor_pb";
    import { darkMode } from "../stores";
    import ButtonButton from "../uielements/ButtonButton.svelte";
    import { hrefButtonStyleClasses } from "../utils";
    import ApplicationConsole from "./ApplicationConsole.svelte";
    import { editorHighlightStyle, editorTheme } from "./codeEditor";

    export let applicationID;
    export let fileName;
    let content = "";
    let editing = false;
    let fileType: string;

    async function fetchFile(): Promise<ApplicationFile> {
        try {
            let response = await apiClient.getApplicationFile(applicationID, fileName);
            content = new TextDecoder().decode(response.getContent_asU8());
            fileType = response.getType();
            editing = true;
            return response;
        } catch {
            content = "";
            editing = false;
            if (fileName.endsWith(".js")) {
                fileType = "text/javascript";
            } else if (fileName.endsWith(".json")) {
                fileType = "application/json";
            } else if (fileName.endsWith(".html") || fileName.endsWith(".htm")) {
                fileType = "text/html";
            } else {
                fileType = "text/plain";
            }
            return new ApplicationFile();
        }
    }

    async function save() {
        let file = new ApplicationFile();
        file.setApplicationId(applicationID);
        file.setName(fileName);
        file.setContent(new TextEncoder().encode(content));
        let message = `${editing ? "Update" : "Create"} ${fileName}`;
        message = await modalPrompt("Enter an edit message:", message, "", message);
        if (message === null) {
            return;
        }
        file.setEditMessage(message);
        if (!editing) {
            let t = await modalPrompt("Enter a file type:", `Create ${fileName}`, "", fileType);
            if (t === null) {
                return;
            }
            fileType = t;
        }
        file.setType(fileType);
        await apiClient.updateApplicationFile(file);
        await modalAlert("File updated");
        editing = true;
    }

    let editorContainer: HTMLElement;
    let editorView: EditorView;

    const themeCompartment = new Compartment();
    const highlightCompartment = new Compartment();

    const darkModeUnsubscribe = darkMode.subscribe((dm) => {
        if (typeof editorView !== "undefined") {
            editorView.dispatch({
                effects: [
                    themeCompartment.reconfigure(editorTheme(dm)),
                    highlightCompartment.reconfigure(editorHighlightStyle(dm)),
                ],
            });
        }
    });
    onDestroy(darkModeUnsubscribe);

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
                    highlightCompartment.of(editorHighlightStyle($darkMode)),
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
                    javascript(),
                    EditorView.lineWrapping,
                    themeCompartment.of(editorTheme($darkMode)),
                ],
            }),
            parent: editorContainer,
            root: editorContainer.getRootNode() as ShadowRoot,
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

    function toggleConsole() {
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
        <a use:link href="/moderate/applications/{applicationID}" class="block {hrefButtonStyleClasses()}">
            <i class="fas fa-arrow-left" />
        </a>
        <h1 class="text-lg block pt-1">
            <span class="hidden md:inline">{editing ? "Editing" : "Creating"} file</span>
            <span class="font-mono">{fileName}</span>
            on
            <span class="font-mono">{applicationID}</span>
        </h1>
        <div class="flex-grow" />
        <ButtonButton color="gray" on:click={toggleConsole} extraClasses="block lg:hidden">Toggle console</ButtonButton>
        <div class="flex-grow" />
        <ButtonButton type="submit" on:click={save} extraClasses="block">Save</ButtonButton>
    </div>

    <div class="overflow-hidden h-full">
        {#await fetchFile()}
            <p>Loading file...</p>
        {:then}
            <HSplitPane {leftPaneSize} {rightPaneSize}>
                <div slot="left" class="h-full max-h-full relative" bind:this={editorContainer} />
                <div slot="right" class="h-full max-h-full overflow-auto">
                    <ApplicationConsole {applicationID} />
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
