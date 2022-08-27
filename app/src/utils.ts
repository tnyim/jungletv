import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { tags } from "@lezer/highlight";
import emojiRegex from "emoji-regex";
import * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";
import { DateTime, Duration } from "luxon";
import { marked } from "marked";
import { get } from 'svelte/store';
import { apiClient } from "./api_client";
import { ForcedTicketEnqueueType, ForcedTicketEnqueueTypeMap, PermissionLevel, QueueSoundCloudTrackData, User } from "./proto/jungletv_pb";
import { permissionLevel, playerVolume } from "./stores";

export const copyToClipboard = async function (content: string) {
    try {
        await navigator.clipboard.writeText(content);
    } catch (err) {
        console.error("Failed to copy!", err);
    }
}

export const getReadableUserString = function (user: User): string {
    if (user.hasNickname()) {
        return user.getNickname();
    }
    return user.getAddress().substr(0, 14);
}

export const editNicknameForUser = async function (user: User) {
    let address = user.getAddress();
    let nickname = prompt("Enter new nickname, leave empty to remove nickname");
    if (nickname != "") {
        if ([...nickname].length < 3) {
            alert("The nickname must be at least 3 characters long.");
            return;
        } else if ([...nickname].length > 16) {
            alert("The nickname must be at most 16 characters long.");
            return;
        }
    }
    try {
        await apiClient.setUserChatNickname(address, nickname);
        if (nickname != "") {
            alert("Nickname set successfully");
        } else {
            alert("Nickname removed successfully");
        }
    } catch (e) {
        alert("Error editing nickname: " + e);
    }
}

export const setNickname = async function (nickname: string): Promise<[boolean, string]> {
    if (nickname != "") {
        if ([...nickname].length < 3) {
            return [false, "The nickname must be at least 3 characters long."];
        } else if ([...nickname].length > 16) {
            return [false, "The nickname must be at most 16 characters long."];
        }
    }
    try {
        await apiClient.setChatNickname(nickname);
    } catch (ex) {
        if (ex.includes("rate limit reached")) {
            return [false, "You've set your nickname too recently. Please wait before trying again."];
        }
        return [false, "An error occurred when setting the nickname."];
    }
    return [true, ""];
}

export const formatQueueEntryThumbnailDuration = function (duration: google_protobuf_duration_pb.Duration, offset?: google_protobuf_duration_pb.Duration): string {
    if (typeof offset !== 'undefined') {
        let offsetEnd = new google_protobuf_duration_pb.Duration();
        offsetEnd.setSeconds(offset.getSeconds() + duration.getSeconds());
        offsetEnd.setNanos(offset.getNanos() + duration.getNanos());
        let part = Duration.fromMillis(offset.getSeconds() * 1000 + offset.getNanos() / 1000000).toFormat("mm:ss");
        let part2 = Duration.fromMillis(offsetEnd.getSeconds() * 1000 + offsetEnd.getNanos() / 1000000).toFormat("mm:ss");
        return (part + " - " + part2).replace(/^00:00 - /, "");
    }
    return Duration.fromMillis(duration.getSeconds() * 1000 + duration.getNanos() / 1000000).toFormat("mm:ss");
}

export const formatSoundCloudTrackAttribution = function (trackData: QueueSoundCloudTrackData): string {
    let artist = trackData.getArtist();
    let uploader = trackData.getUploader();
    if (artist !== "" && uploader !== "") {
        if (artist.toLowerCase().indexOf(uploader.toLowerCase()) !== -1) {
            return artist;
        }
        return artist + " via " + uploader;
    }
    if (artist !== "") {
        return artist;
    }
    return uploader;
}

export const insertAtCursor = function (input: HTMLInputElement | HTMLTextAreaElement, textToInsert: string) {
    const value = input.value;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = value.slice(0, start) + textToInsert + value.slice(end);
    input.selectionStart = input.selectionEnd = start + textToInsert.length;
}

export const openPopout = function (tabID: string) {
    let w = window.open(window.location.href, "JungleTV-Popout-" + tabID, "popup,width=400,height=600");
    w.name = "JungleTV-Popout-" + tabID;
}

export const ordinalSuffix = function ordinalSuffix(i: number) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

export const formatMarkdownTimestamp = function (date: DateTime, format: string): string {
    const n = "numeric", s = "short", l = "long";
    let short = "";
    switch (format) {
        case "d":
            short = date.toLocaleString({ year: n, month: n, day: n });
            break;
        case "f":
            short = date.toLocaleString({ year: n, month: l, day: n, hour: n, minute: n });
            break;
        case "t":
            short = date.toLocaleString({ hour: n, minute: n });
            break;
        case "D":
            short = date.toLocaleString({ year: n, month: l, day: n });
            break;
        case "F":
            short = date.toLocaleString({ year: n, month: l, day: n, weekday: l, hour: n, minute: n, second: n });
            break;
        case "R":
            short = date.toRelative();
            break;
        case "C":
            let duration = date.diffNow();
            let negative = false;
            if (duration.toMillis() < 0) {
                negative = true;
                duration = duration.negate();
            }
            let formatString = "d 'days,' h 'hours,' m 'minutes and' s 'seconds'";
            if (duration.as("days") > 1) {
                formatString = "d 'days and' h 'hours";
            }
            short = duration
                .toFormat(formatString)
                .replace(/^0 days, 0 hours, 0 minutes and /, "")
                .replace(/^0 days, 0 hours, /, "")
                .replace(/^0 days, /, "")
                .replace(/(^|\s)1 seconds/, " 1 second")
                .replace(/(^|\s)1 minutes/, " 1 minute")
                .replace(/(^|\s)1 hours/, " 1 hour")
                .replace(/(^|\s)1 days/, " 1 day").trim();
            if (negative) {
                short += " ago"
            } else {
                short = "in " + short;
            }
            break;
        case "T":
            short = date.toLocaleString({ hour: n, minute: n, second: n });
            break;
    }
    return short;
}

const timestampTokenizerMarkedExtension = {
    name: "timestamp",
    level: "inline",
    start(src) {
        return src.match(/<t:/)?.index;
    },
    tokenizer(src, tokens) {
        const rule = /^(\\{0,1})<t:([0-9]+):([d|f|t|D|F|R|C|T])(\/{0,1})>/;
        const match = rule.exec(src);
        if (match && match[1] != "\\") {
            return {
                type: "timestamp", // Should match "name" above
                raw: match[0], // Text to consume from the source
                timestamp: parseInt(match[2].trim()),
                timestampType: match[3].trim(),
            };
        }
    },
    renderer(token) {
        const n = "numeric", s = "short", l = "long";
        let date = DateTime.fromSeconds(token.timestamp);
        let long = date.toLocaleString({ year: n, month: l, day: n, hour: n, minute: n, second: n });
        let short = formatMarkdownTimestamp(date, token.timestampType);

        if (token.timestampType == "R" || token.timestampType == "C") {
            return `<span
                title="${long}"
                class="markdown-timestamp relative"
                data-timestamp="${token.timestamp}"
                data-timestamp-type="${token.timestampType}">
                    ${short}
                </span>`;
        } else {
            return `<span title="${long}" class="markdown-timestamp">${short}</span>`;
        }
    },
}

const spoilerTokenizerMarkedExtension = {
    name: "spoiler",
    level: "inline",
    start(src) {
        return src.match(/\|\|/)?.index;
    },
    tokenizer(src, tokens) {
        const rule = /^(\\{0,1})\|\|(.+)\|\|/;
        const match = rule.exec(src);
        if (match && match[1] != "\\") {
            return {
                type: "spoiler", // Should match "name" above
                raw: match[0], // Text to consume from the source
                text: this.lexer.inlineTokens(match[2].trim()),
            };
        }
    },
    renderer(token) {
        return `<span class="filter blur-sm hover:blur-none active:blur-none transition-all">${this.parser.parseInline(token.text)}</span>`;
    },
    childTokens: ['text']
}

const regexEmojiForStart = new RegExp(emojiRegex().toString().substring(1).replace("/g", ""));
const regexEmojiForTokenizer = new RegExp("^(?:" + emojiRegex().toString().substring(1).replace("/g", ")"));

// this is just so we can make unicode emojis larger and also make it easier to check whether a message only contains emotes and emoji
const emojiTokenizerMarkedExtension = {
    name: "emoji",
    level: "inline",
    start(src) {
        return src.match(regexEmojiForStart)?.index;
    },
    tokenizer(src, tokens) {
        const match = regexEmojiForTokenizer.exec(src);
        if (match) {
            return {
                type: "emoji", // Should match "name" above
                raw: match[0], // Text to consume from the source
            };
        }
    },
    renderer(token) {
        return `<span class="markdown-emoji">${token.raw}</span>`;
    },
}

const emoteTokenizerMarkedExtension = {
    name: "emote",
    level: "inline",
    start(src) {
        return src.match(/<[ae]:/)?.index;
    },
    tokenizer(src, tokens) {
        const rule = /^<([ae])(:[a-zA-Z0-9_]+){0,1}:([0-9]{1,20})(\/{0,1})>/;
        const match = rule.exec(src);
        if (match) {
            return {
                type: "emote", // Should match "name" above
                raw: match[0], // Text to consume from the source
                animated: match[1].trim() == "a",
                shortcode: match[2]?.trim().substring(1),
                id: match[3].trim(),
            };
        }
    },
    renderer(token) {
        let alt = token.shortcode ? ":" + token.shortcode + ":" : "";
        return `<img
            class="inline align-middle -mt-0.5 markdown-emote"
            alt="${alt}"
            title="${alt}"
            src="${emoteURLFromID(token.id, token.animated)}" />`;
    },
}

export const emoteURLFromID = function (id: string, animated: boolean): string {
    return `/emotes/${id}.${animated ? "gif" : "webp"}`;
}

const disableLinksTokenizer = {
    tag: (): false => undefined,
    link: (): false => undefined,
    reflink: (): false => undefined,
    autolink: (): false => undefined,
    url: (): false => undefined,
}

let configuredMarked: typeof marked = undefined;

const configureMarked = function () {
    if (typeof (configuredMarked) === "undefined") {
        marked.setOptions({
            gfm: true,
            breaks: true,
        });
        marked.use({
            extensions: [
                timestampTokenizerMarkedExtension,
                spoilerTokenizerMarkedExtension,
                emojiTokenizerMarkedExtension,
                emoteTokenizerMarkedExtension
            ],
            tokenizer: disableLinksTokenizer
        });
        configuredMarked = marked;
    }
}

export const parseSystemMessageMarkdown = function (markdown: string): string {
    configureMarked();
    let t = new marked.Tokenizer();
    // avoid links in queue entry titles becoming clickable
    t.autolink = () => undefined;
    t.url = () => undefined;
    return configuredMarked.parseInline(markdown, { tokenizer: t });
}

export const parseUserMessageMarkdown = function (markdown: string, isModerator: boolean): [string, boolean] {
    configureMarked();
    let onlyEmotes = markdown.trim().length > 0;
    let emoteCount = 0;
    const walkTokens = (token) => {
        if (token.type === 'text' || token.type === 'codespan') {
            onlyEmotes = onlyEmotes && token.text.trim().length === 0;
        }
        if (token.type === 'emote') {
            emoteCount++;
        }
        if (token.type === 'emoji') {
            emoteCount++;
        }
    };
    let rendered = "";
    if (isModerator) {
        rendered = configuredMarked.parseInline(markdown, { tokenizer: undefined, walkTokens })
    } else {
        rendered = configuredMarked.parseInline(markdown, { walkTokens })
    }
    return [rendered, onlyEmotes && emoteCount < 7];
}

export const parseCompleteMarkdown = function (markdown: string): string {
    configureMarked();
    return configuredMarked.parse(markdown, { tokenizer: undefined });
}

export const codeMirrorHighlightStyle = function (darkMode: boolean): Extension {
    return syntaxHighlighting(HighlightStyle.define([
        { tag: tags.link, textDecoration: "underline" },
        { tag: tags.heading, textDecoration: "underline", fontWeight: "bold" },
        { tag: tags.emphasis, fontStyle: "italic" },
        { tag: tags.strong, fontWeight: "bold" },
        { tag: tags.strikethrough, textDecoration: "line-through" },
        { tag: tags.keyword, color: "#708" },
        {
            tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
            color: darkMode ? "rgba(96, 165, 250, 1)" : "rgba(37, 99, 235, 1)",
        },
        { tag: [tags.literal, tags.inserted], color: "#164" },
        { tag: [tags.string, tags.deleted], color: "#a11" },
        { tag: [tags.regexp, tags.escape, tags.special(tags.string)], color: "#e40" },
        { tag: tags.definition(tags.variableName), color: "#00f" },
        { tag: tags.local(tags.variableName), color: "#30a" },
        { tag: [tags.typeName, tags.namespace], color: "#085" },
        { tag: tags.className, color: "#167" },
        { tag: [tags.special(tags.variableName), tags.macroName], color: "#256" },
        { tag: tags.definition(tags.propertyName), color: "#00c" },
        { tag: tags.comment, color: "#940" },
        { tag: tags.meta, color: "#7a757a" },
        { tag: tags.invalid, color: "#f00" },
        { tag: tags.monospace, fontFamily: "monospace", fontSize: "110%" },
    ]));
}

export const buildMonKeyURL = function (address: string, format?: string): string {
    if (typeof format !== "undefined") {
        return "https://monkey.banano.cc/api/v1/monkey/" + address + "?format=" + format;
    }
    return "https://monkey.banano.cc/api/v1/monkey/" + address;
}

export type MediaSelectionKind = "video" | "track" | "document";

type BaseMediaSelectionParseResult = {
    readonly valid: boolean;
}

type InvalidMediaSelectionParseResult = BaseMediaSelectionParseResult & {
    readonly valid: false;
}

type PossiblyValidMediaSelectionParseResult = BaseMediaSelectionParseResult & {
    readonly valid: boolean,
    readonly selectionKind: MediaSelectionKind,
    readonly type: "yt_video" | "sc_track" | "document",
}

type YouTubeVideoSelectionParseResult = PossiblyValidMediaSelectionParseResult & {
    readonly selectionKind: "video",
    readonly type: "yt_video",
    readonly videoID: string,
    readonly extractedTimestamp: number,
}

type SoundCloudTrackSelectionParseResult = PossiblyValidMediaSelectionParseResult & {
    readonly selectionKind: "track",
    readonly type: "sc_track",
    readonly trackURL: string,
}

type DocumentSelectionParseResult = PossiblyValidMediaSelectionParseResult & {
    readonly selectionKind: "document",
    readonly type: "document",
    readonly documentID: string,
    readonly title: string,
    readonly enqueueType?: ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap],
}

export type MediaSelectionParseResult = InvalidMediaSelectionParseResult | YouTubeVideoSelectionParseResult | SoundCloudTrackSelectionParseResult | DocumentSelectionParseResult;

export const parseURLForMediaSelection = function (urlString: string): MediaSelectionParseResult {
    urlString = urlString.trim();
    let idRegExp = /^[A-Za-z0-9\-_]{11}$/;
    if (idRegExp.test(urlString)) {
        // we were provided just a video ID
        return {
            valid: true,
            videoID: urlString,
            extractedTimestamp: 0,
            selectionKind: "video",
            type: "yt_video",
        };
    }

    try {
        let url: URL;
        try {
            url = new URL(urlString)
        } catch {
            urlString = "https://" + urlString;
            url = new URL(urlString)
        }

        if (url.protocol == "document:" && get(permissionLevel) == PermissionLevel.ADMIN && url.pathname != "") {
            let title = url.searchParams.get("title");
            if (title == null || title == "") {
                return { valid: false };
            }
            let enqueueType: ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap];
            switch (url.searchParams.get("play")) {
                case "now":
                    enqueueType = ForcedTicketEnqueueType.PLAY_NOW;
                    break;
                case "next":
                    enqueueType = ForcedTicketEnqueueType.PLAY_NEXT;
                    break;
                case "enqueue":
                    enqueueType = ForcedTicketEnqueueType.ENQUEUE;
                    break;
            }
            return {
                valid: true,
                documentID: url.pathname,
                title: title,
                selectionKind: "document",
                type: "document",
                enqueueType: enqueueType,
            };
        }

        if (/^(.*\.){0,1}youtube.com$/.test(url.host)) {
            let t = url.searchParams.get("t");
            let extractedTimestamp = 0;
            if (t != null && !isNaN(Number(t))) {
                extractedTimestamp = Number(t);
            }

            if (url.pathname == "/watch") {
                let v = url.searchParams.get("v");
                if (idRegExp.test(v)) {
                    return {
                        valid: v.length == 11,
                        videoID: v,
                        extractedTimestamp: extractedTimestamp,
                        selectionKind: "video",
                        type: "yt_video",
                    };
                }
            } else if (url.pathname.startsWith("/shorts/")) {
                let parts = url.pathname.split("/");
                if (idRegExp.test(parts[parts.length - 1])) {
                    return {
                        valid: parts[parts.length - 1].length == 11,
                        videoID: parts[parts.length - 1],
                        extractedTimestamp: extractedTimestamp,
                        selectionKind: "video",
                        type: "yt_video",
                    };
                }
            }
        } else if (url.host == "youtu.be") {
            let t = url.searchParams.get("t");
            let extractedTimestamp = 0;
            if (t != null && !isNaN(Number(t))) {
                extractedTimestamp = Number(t);
            }

            let parts = url.pathname.split("/");
            if (idRegExp.test(parts[parts.length - 1])) {
                return {
                    valid: parts[parts.length - 1].length == 11,
                    videoID: parts[parts.length - 1],
                    extractedTimestamp: extractedTimestamp,
                    selectionKind: "video",
                    type: "yt_video",
                };
            }
        } else if (url.host == "soundcloud.com") {
            // TODO do some more sanity checking
            return {
                valid: true,
                trackURL: urlString,
                selectionKind: "track",
                type: "sc_track",
            };
        }
    } catch { }
    return {
        valid: false,
    };
}

export const ttsAudioAlert = function (message: string) {
    if (typeof (window.speechSynthesis) === 'undefined') {
        return;
    }
    let speechSynth = window.speechSynthesis;
    let voices = speechSynth.getVoices();
    let usableVoice: SpeechSynthesisVoice = null;
    for (let voice of voices) {
        if (voice.lang === "en" || voice.lang.startsWith("en-")) {
            usableVoice = voice;
            break;
        }
    }
    if (usableVoice == null) {
        return;
    }

    let utterance = new SpeechSynthesisUtterance(message);
    utterance.voice = usableVoice;
    utterance.volume = get(playerVolume);
    utterance.lang = "en-US";
    utterance.addEventListener("start", () => {
        playerVolume.set(utterance.volume / 3);
    });
    utterance.addEventListener("end", () => {
        playerVolume.set(utterance.volume);
    })
    speechSynth.speak(utterance);
}

export const checkShadowRootIntegrity = function (container: HTMLElement, randSource: string): boolean {
    "use strict";
    let rootNode = container.getRootNode() as ShadowRoot;

    let valuesThatMustBeTrue = [
        () => rootNode.mode === "closed",
        () => typeof Object.getOwnPropertyDescriptor(rootNode, "mode") === "undefined",
        () => typeof Function.prototype.toString.prototype === "undefined",
        () => Function.prototype.toString.toString().startsWith("function toString"),
        () => Function.prototype.toString.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
        () => Node.prototype.getRootNode.toString === Function.prototype.toString,
        () => Node.prototype.getRootNode.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
        () => typeof Object.getOwnPropertyDescriptor.prototype === "undefined",
        () => Object.getOwnPropertyDescriptor.toString().startsWith("function getOwnPropertyDescriptor"),
        () => typeof Node.prototype.getRootNode.prototype === "undefined",
        () => Node.prototype.getRootNode.toString().startsWith("function getRootNode"),
        () => Object.getOwnPropertyDescriptor.toString === Function.prototype.toString,
        () => Object.getOwnPropertyDescriptor.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
        () =>
            /mode.*nativecode/.test(Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "mode")
                .get.toString()
                .replace(/\s+/g, "")),
        () => typeof Object.getOwnPropertyDescriptor(ShadowRoot.prototype, "mode").get == "function",
        () =>
            typeof Object.getOwnPropertyDescriptor(Navigator.prototype, "webdriver") === "undefined" ||
            typeof Object.getOwnPropertyDescriptor(navigator, "webdriver") === "undefined",
        () =>
            typeof Object.getOwnPropertyDescriptor(Navigator.prototype, "webdriver") === "undefined" ||
            navigator.webdriver === false,
        () =>
            typeof Object.getOwnPropertyDescriptor(Navigator.prototype, "webdriver") === "undefined" ||
            /webdriver.*nativecode/.test(Object.getOwnPropertyDescriptor(Navigator.prototype, "webdriver")
                .get.toString().replace(/\s+/g, "")),
        () =>
            typeof Object.getOwnPropertyDescriptor(Navigator.prototype, "webdriver") === "undefined" ||
            typeof Object.getOwnPropertyDescriptor(Navigator.prototype, "webdriver").get == "function",
        () =>
            typeof Object.getOwnPropertyDescriptor(Navigator.prototype, "webdriver") === "undefined" ||
            Object.getOwnPropertyDescriptor(Navigator.prototype, "webdriver").get === Object.getOwnPropertyDescriptor(Object.getPrototypeOf(navigator), "webdriver").get,
        () => function getOwnPropertyDescriptor(a, b) { }.toString().replace(/\s+/g, "").indexOf("[nativecode]") < 0,
        () => document.body.attachShadow === Element.prototype.attachShadow,
        () => Element.prototype.attachShadow.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
        () => Element.prototype.attachShadow.toString().startsWith("function attachShadow"),
        () => Element.prototype.attachShadow.toString === Function.prototype.toString,
        () => typeof Element.prototype.attachShadow.prototype === "undefined",
        () =>
            typeof window.speechSynthesis === "undefined" ||
            typeof Object.getOwnPropertyDescriptor(window.speechSynthesis, "getVoices") === "undefined",
        () =>
            typeof window.speechSynthesis === "undefined" ||
            typeof SpeechSynthesis === "undefined" ||
            SpeechSynthesis.prototype.getVoices.toString === Function.prototype.toString,
        () =>
            typeof window.speechSynthesis === "undefined" ||
            window.speechSynthesis.getVoices.toString === Function.prototype.toString,
        () =>
            typeof window.speechSynthesis === "undefined" ||
            typeof Object.getOwnPropertyDescriptor(window.speechSynthesis, "speak") === "undefined",
        () =>
            typeof window.speechSynthesis === "undefined" ||
            typeof SpeechSynthesis === "undefined" ||
            SpeechSynthesis.prototype.speak.toString === Function.prototype.toString,
        () =>
            typeof window.speechSynthesis === "undefined" ||
            window.speechSynthesis.speak.toString === Function.prototype.toString,
        () =>
            typeof window.speechSynthesis === "undefined" ||
            SpeechSynthesisUtterance.prototype.constructor.toString == Function.prototype.toString,
        () =>
            typeof window.speechSynthesis === "undefined" ||
            typeof SpeechSynthesis === "undefined" ||
            SpeechSynthesis.prototype.getVoices.toString().startsWith("function getVoices"),
        () =>
            typeof window.speechSynthesis === "undefined" ||
            typeof SpeechSynthesis === "undefined" ||
            SpeechSynthesis.prototype.speak.toString().startsWith("function speak"),
        () =>
            typeof window.speechSynthesis === "undefined" ||
            typeof SpeechSynthesis === "undefined" ||
            SpeechSynthesisUtterance.prototype.constructor.toString().replace(/\s+/g, "").indexOf("[nativecode]") >=
            0,
        () =>
            typeof window.speechSynthesis === "undefined" ||
            typeof SpeechSynthesis === "undefined" ||
            SpeechSynthesis.prototype.getVoices.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
        () =>
            typeof window.speechSynthesis === "undefined" ||
            typeof SpeechSynthesis === "undefined" ||
            SpeechSynthesis.prototype.speak.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
        () =>
            typeof window.speechSynthesis === "undefined" ||
            SpeechSynthesisUtterance.constructor.toString().replace(/\s+/g, "").indexOf("[nativecode]") >= 0,
        () =>
            typeof window.speechSynthesis === "undefined" ||
            SpeechSynthesisUtterance.constructor.toString === Function.prototype.toString,
        () =>
            typeof window.speechSynthesis === "undefined" ||
            SpeechSynthesisUtterance.constructor.toString().startsWith("function Function"),
        () => {
            let flag = false;
            try {
                HTMLMediaElement.prototype.canPlayType.call(document.createElement("video"), {
                    trim() {
                        flag = true;
                    }
                });
            } catch { }
            return !flag;
        },
        () => {
            if ((window as any).chrome) {
                return "app" in (window as any).chrome;
            }
            return true;
        },
        () => {
            if ((window as any).chrome) {
                return (navigator as any).plugins.length > 0;
            }
            return true;
        }
    ];

    // shuffle array so checks are not always carried out in the same order
    // avoid calling out to Math.random so we have one less function to check, the quality of this randomness doesn't need to be good
    let j = 0;
    for (let i = valuesThatMustBeTrue.length - 1; i > 0; i--) {
        j = (randSource.charCodeAt(i % randSource.length) * 3405983 + j) % valuesThatMustBeTrue.length;
        [valuesThatMustBeTrue[i], valuesThatMustBeTrue[j]] = [valuesThatMustBeTrue[j], valuesThatMustBeTrue[i]];
    }

    for (let f of valuesThatMustBeTrue) {
        if (!f()) {
            return false;
        }
    }
    return true;
}