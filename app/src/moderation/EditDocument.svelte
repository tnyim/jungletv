<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "../api_client";
    import { Document } from "../proto/jungletv_pb";
    import CodeMirror from "@svelte-parts/editor/codemirror";
    import ActualCodeMirror from "codemirror";
    import "codemirror/mode/gfm/gfm";
    import "codemirror/lib/codemirror.css";
    import "codemirror/theme/monokai.css";
    import "codemirror/theme/base16-light.css";
    import { HSplitPane } from "svelte-split-pane";
    import { darkMode } from "../stores";
    import watchMedia from "svelte-media";
    import { parseCompleteMarkdown } from "../utils";

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

    const editorConfig = {
        lineNumbers: true,
        lineWrapping: true,
        mode: {
            name: "gfm",
            highlightFormatting: true,
            emoji: false,
        },
    };
    let codeMirrorEditor: any;
    const accessEditor = (editor) => {
        editor.setSize("100%", "100%");
        editor.on("change", (e) => {
            content = e.getValue();
        });
        editor.setValue(content);
        ActualCodeMirror.commands.save = save;
        codeMirrorEditor = editor;
    };

    function refreshEditor() {
        if (typeof codeMirrorEditor !== "undefined") {
            codeMirrorEditor.refresh();
        }
    }

    $: {
        if (typeof codeMirrorEditor !== "undefined") {
            codeMirrorEditor.setOption("theme", $darkMode ? "monokai" : "base16-light");
        }
    }

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
    media.subscribe((obj) => {
        if (firstMedia) {
            firstMedia = false;
            if (!obj.large) {
                leftPaneSize = "100%";
                rightPaneSize = "0%";
            }
        }
    });
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

    <div class="overflow-hidden">
        {#await fetchDocument()}
            <p>Loading document...</p>
        {:then}
            <HSplitPane updateCallback={refreshEditor} {leftPaneSize} {rightPaneSize}>
                <div slot="left" class="h-full max-h-full relative">
                    <CodeMirror config={editorConfig} {accessEditor} />
                </div>
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
