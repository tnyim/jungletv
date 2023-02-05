import { Database } from 'emoji-picker-element';
import { UserRole } from "./proto/common_pb";
import type { ChatMessage } from "./proto/jungletv_pb";
import { getReadableUserString } from "./utils";

export const emojiDatabase = new Database();

export function getReadableMessageAuthor(msg: ChatMessage): string {
    return getReadableUserString(msg.getUserMessage().getAuthor());
}

export function getClassForMessageAuthor(msg: ChatMessage, allowExpensiveCSSAnimations: boolean): string {
    let c = "chat-user-address";
    if (msg.getUserMessage().getAuthor().hasNickname()) {
        c = "chat-user-nickname";
    }
    if (msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.TIER_1_REQUESTER)) {
        c += " text-blue-600 dark:text-blue-400";
    }
    if (msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.TIER_2_REQUESTER)) {
        c += " text-yellow-600 dark:text-yellow-200";
    }
    if (msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.TIER_3_REQUESTER)) {
        c += " text-green-500 dark:text-green-300";
        if (allowExpensiveCSSAnimations) {
            c += " chat-user-glow";
        }
    }
    return c;
}