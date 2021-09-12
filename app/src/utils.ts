import { apiClient } from "./api_client";
import type { User } from "./proto/jungletv_pb";
import type * as google_protobuf_duration_pb from "google-protobuf/google/protobuf/duration_pb";
import { Duration } from "luxon";

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

export const formatQueueEntryThumbnailDuration = function (duration: google_protobuf_duration_pb.Duration): string {
    return Duration.fromMillis(duration.getSeconds() * 1000 + duration.getNanos() / 1000000).toFormat("mm:ss");
}

export const insertAtCursor = function (input: HTMLInputElement | HTMLTextAreaElement, textToInsert: string) {
    const value = input.value;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = value.slice(0, start) + textToInsert + value.slice(end);
    input.selectionStart = input.selectionEnd = start + textToInsert.length;
}