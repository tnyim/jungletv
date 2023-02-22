<script lang="ts">
    import { acceptCompletion, autocompletion, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
    import { defaultKeymap, history, historyKeymap, indentWithTab, insertNewlineAndIndent } from "@codemirror/commands";
    import { javascript } from "@codemirror/lang-javascript";
    import {
        bracketMatching,
        defaultHighlightStyle,
        foldKeymap,
        indentOnInput,
        syntaxHighlighting,
    } from "@codemirror/language";
    import { lintKeymap } from "@codemirror/lint";
    import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
    import { Compartment, EditorState } from "@codemirror/state";
    import {
        crosshairCursor,
        drawSelection,
        dropCursor,
        highlightSpecialChars,
        keymap,
        rectangularSelection,
    } from "@codemirror/view";
    import { EditorView } from "codemirror";
    import { createEventDispatcher, onDestroy } from "svelte";
    import { closeBrackets } from "../closebrackets";
    import { darkMode } from "../stores";
    import { editorHighlightStyle, editorTheme } from "./codeEditor";

    const dispatch = createEventDispatcher();

    export let autoFocus: boolean;

    let currentCommand = "";
    let commandHistory: string[] = [];
    let currentCommandBackup = "";
    let commandHistoryCursor = -1;

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

    function replaceCommandAndMoveCursorToEnd(view: EditorView, command: string) {
        view.dispatch(
            view.state.update({
                changes: {
                    from: 0,
                    to: view.state.doc.length,
                    insert: command,
                },
                selection: { anchor: command.length },
            })
        );
    }

    function replaceWithHistoryEntryAbove(view: EditorView): boolean {
        if (commandHistory.length > commandHistoryCursor + 1) {
            if (commandHistoryCursor <= -1) {
                currentCommandBackup = view.state.doc.toString();
            }
            let c = commandHistory[++commandHistoryCursor];
            replaceCommandAndMoveCursorToEnd(view, c);
            return true;
        }
        return false;
    }

    function setupEditor() {
        editorView = new EditorView({
            state: EditorState.create({
                doc: currentCommand,
                extensions: [
                    EditorView.updateListener.of((viewUpdate) => {
                        if (viewUpdate.docChanged) {
                            currentCommand = viewUpdate.state.doc.toString();
                        }
                    }),
                    highlightSpecialChars(),
                    history(),
                    drawSelection(),
                    dropCursor(),
                    EditorState.allowMultipleSelections.of(true),
                    indentOnInput(),
                    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                    bracketMatching(),
                    closeBrackets(),
                    autocompletion(),
                    rectangularSelection(),
                    crosshairCursor(),
                    highlightSelectionMatches(),
                    highlightCompartment.of(editorHighlightStyle($darkMode)),
                    keymap.of([
                        {
                            key: "ArrowUp",
                            run: (view): boolean => {
                                let d = view.state.doc.toString();
                                let atEnd =
                                    view.state.selection.ranges.length == 1 &&
                                    view.state.selection.main.from == view.state.selection.main.to &&
                                    view.state.selection.main.from == d.length;
                                if (!d.includes("\n") && atEnd) {
                                    // special behavior when at the end of a single-line command history
                                    return replaceWithHistoryEntryAbove(view);
                                }
                                return false; // will be handled at the bottom of this array, after cursor movement is evaluated
                            },
                        },
                        {
                            key: "Enter",
                            run: (view): boolean => {
                                let wouldChangeThings = false;
                                // we take advantage of how powerful codemirror and its commands are,
                                // (allowing us to run the command with our own dispatch function, so no changes are actually made)
                                // and the fact that we're using indentOnInput,
                                // to check whether the insert newline command would simply add an empty new line.
                                // If yes, the expression is probably ready for execution as-is.
                                // If it would also e.g. indent a new line, that means it's probably more convenient
                                // to add the newline instead of executing the command as-is
                                insertNewlineAndIndent({
                                    state: view.state,
                                    dispatch: (transaction) => {
                                        transaction.changes.iterChanges((_fromA, _toA, _fromB, _toB, inserted) => {
                                            wouldChangeThings = inserted.toString().length > 1;
                                        });
                                    },
                                });
                                if (wouldChangeThings) {
                                    return false;
                                }
                                let command = view.state.doc.toString();
                                dispatch("command", command);
                                commandHistory = [command, ...commandHistory];
                                commandHistoryCursor = -1;
                                view.dispatch({
                                    changes: { from: 0, to: view.state.doc.length, insert: "" },
                                    scrollIntoView: true,
                                });
                                return true;
                            },
                            shift: insertNewlineAndIndent,
                        },
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
                            key: "ArrowUp",
                            run: replaceWithHistoryEntryAbove,
                        },
                        {
                            key: "ArrowDown",
                            run: (view): boolean => {
                                if (commandHistoryCursor > -1) {
                                    commandHistoryCursor--;
                                    let c =
                                        commandHistoryCursor <= -1
                                            ? currentCommandBackup
                                            : commandHistory[commandHistoryCursor];
                                    replaceCommandAndMoveCursorToEnd(view, c);
                                    return true;
                                }
                                return false;
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
        if (autoFocus) {
            editorView.focus();
        }
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
    $: updateEditorContents(currentCommand);
</script>

<div class="w-full text-base" style="padding-top: 1px" bind:this={editorContainer} />
