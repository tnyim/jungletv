import { apiClient } from "./api_client";
import type { User } from "./proto/jungletv_pb";
import * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";
import { DateTime, Duration } from "luxon";
import { marked } from "marked";

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
        const rule = /^<t:([0-9]+):([d|f|t|D|F|R|C|T])(?:\/{0,1})>/;
        const match = rule.exec(src);
        if (match) {
            return {
                type: "timestamp", // Should match "name" above
                raw: match[0], // Text to consume from the source
                timestamp: parseInt(match[1].trim()),
                timestampType: match[2].trim(),
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
    childTokens: ['span']
}

const spoilerTokenizerMarkedExtension = {
    name: "spoiler",
    level: "inline",
    start(src) {
        return src.match(/\|\|/)?.index;
    },
    tokenizer(src, tokens) {
        const rule = /^\|\|(.+)\|\|/;
        const match = rule.exec(src);
        if (match) {
            return {
                type: "spoiler", // Should match "name" above
                raw: match[0], // Text to consume from the source
                text: this.lexer.inlineTokens(match[1].trim()),
            };
        }
    },
    renderer(token) {
        return `<span class="filter blur-sm hover:blur-none active:blur-none transition-all">${this.parser.parseInline(token.text)}</span>`;
    },
    childTokens: ['span']
}

const disableLinksTokenizer = {
    tag: (): false => undefined,
    link: (): false => undefined,
    reflink: (): false => undefined,
    autolink: (): false => undefined,
    url: (): false => undefined,
}

let configuredMarked: typeof marked = undefined;

const configureMarked = function() {
    if(typeof(configuredMarked) === "undefined") {
        marked.setOptions({
            gfm: true,
            breaks: true,
        });
        marked.use({ extensions: [timestampTokenizerMarkedExtension, spoilerTokenizerMarkedExtension], tokenizer: disableLinksTokenizer });
        configuredMarked = marked;
    }
}

export const parseUserMessageMarkdown = function(markdown: string): string {
    configureMarked();
    return configuredMarked.parseInline(markdown);
}

export const parseCompleteMarkdownInline = function(markdown: string): string {
    configureMarked();
    return configuredMarked.parseInline(markdown, { tokenizer: undefined });
}

export const parseCompleteMarkdown = function(markdown: string): string {
    configureMarked();
    return configuredMarked.parse(markdown, { tokenizer: undefined });
}