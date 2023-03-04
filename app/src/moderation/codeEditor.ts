import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { oneDarkHighlightStyle } from "@codemirror/theme-one-dark";
import { EditorView } from "codemirror";

export const editorTheme = function (darkMode: boolean): Extension {
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
            "& .cm-cursor": {
                "border-left-color": darkMode ? "#FFF" : "#000",
            },
        },
        {
            dark: darkMode,
        }
    );
}

export const mimeTypeIsEditable = function (mimeType: string): boolean {
    return mimeType.startsWith("text/") ||
        mimeType == "application/json" ||
        mimeType == "application/javascript" ||
        mimeType == "application/x-javascript";
}

export const editorHighlightStyle = function (darkMode: boolean): Extension {
    if (darkMode) {
        return syntaxHighlighting(oneDarkHighlightStyle);
    } else {
        return syntaxHighlighting(defaultHighlightStyle);
    }
}