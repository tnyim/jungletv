interface Require {
    (id: string): any;
    (id: "jungletv:chat"): typeof import("jungletv:chat");
    (id: "jungletv:pages"): typeof import("jungletv:pages");
    (id: "jungletv:points"): typeof import("jungletv:points");
    (id: "jungletv:rpc"): typeof import("jungletv:rpc");
    (id: "node:console" | "console"): typeof import("node:console");
    (id: "node:process" | "process"): typeof import("node:process");
}

declare var console: typeof import("node:console");
declare var process: typeof import("node:process");
declare var require: Require;


interface Window {
    appbridge: AppBridge;
}

/** Allows for interaction with the JungleTV chat subsystem. */
declare module "jungletv:chat" {
    /** Arguments to a chat event */
    export interface EventArgs {
        type: keyof ChatEventMap;
    }

    /** Arguments to the 'chatenabled' event */
    export interface ChatEnabledEventArgs extends EventArgs {
        /** Guaranteed to be `chatenabled`. */
        type: "chatenabled";
    }

    /** Arguments to the 'chatdisabled' event */
    export interface ChatDisabledEventArgs extends EventArgs {
        /** Guaranteed to be `chatdisabled`. */
        type: "chatdisabled";

        /** Unused field. The type and presence of this field is not guaranteed. */
        reason: unknown;
    }

    /** Arguments to the 'messagecreated' event */
    export interface MessageCreatedEventArgs extends EventArgs {
        /** Guaranteed to be `messagecreated`. */
        type: "messagecreated";

        /** The created message. */
        message: ChatMessage;
    }

    /** Arguments to the 'messagedeleted' event */
    export interface MessageDeletedEventArgs extends EventArgs {
        /** Guaranteed to be `messagedeleted`. */
        type: "messagedeleted";

        /** The ID of the deleted message. */
        messageID: string;
    }

    /** A relation between event types and the arguments passed to the respective listeners */
    export interface ChatEventMap {
        /** This event is fired when the chat is enabled after having been disabled. */
        "chatenabled": ChatEnabledEventArgs;

        /** This event is fired when the chat is disabled after having been enabled. */
        "chatdisabled": ChatDisabledEventArgs;

        /** This event is fired when a new chat message is sent to chat, even if that message is shadowbanned. */
        "messagecreated": MessageCreatedEventArgs;

        /** This event is fired when a chat message is deleted. */
        "messagedeleted": MessageDeletedEventArgs;
    }
    /**
     * Registers a function to be called whenever the specified event occurs.
     * Depending on the event, the function may be invoked with arguments containing information about the event.
     * Refer to the documentation about each event type for details.
     * @param eventType A case-sensitive string representing the event to listen for.
     * @param listener A function that will be called when an event of the specified type occurs.
     */
    export function addEventListener<K extends keyof ChatEventMap>(eventType: K, listener: (this: unknown, args: ChatEventMap[K]) => void): void;

    /**
     * Ceases calling a function previously registered with {@link Chat.addEventListener} whenever the specified event occurs.
     * @param eventType A case-sensitive string corresponding to the event type from which to unsubscribe.
     * @param listener The function previously passed to {@link Chat.addEventListener}, that should no longer be called whenever an event of the given {@param eventType} occurs.
     */
    export function removeEventListener<K extends keyof ChatEventMap>(eventType: K, listener: (this: unknown, args: ChatEventMap[K]) => void): void;

    /**
     * Creates a new chat message, that is immediately sent to all connected chat clients and registered in the chat message history.
     * The message will appear as having been sent by the application, with the {@link nickname} that is currently set.
     * Optionally, the message may reference another non-system message to which it is a reply.
     * @param content A string containing the content of the message.
     * It must not be empty or consist of only whitespace characters.
     * The content will be parsed as a restricted subset of {@link https://github.github.com/gfm/ | GitHub Flavored Markdown} by the JungleTV clients.
     * Consider escaping any characters that may unintentionally constitute Markdown formatting.
     * Message contents are subject to some of the validation rules of chat messages sent by users, but do not have an explicit length limit.
     * @param [referenceID] An optional string containing the ID of another message to which this one is a reply.
     * The message must not be a system message.
     * This message reference may be removed from the message at a later point, if the referenced message is deleted.
     * @returns A {@link ChatMessage} representing the created chat message.
     */
    export function createMessage(content: string, referenceID?: string): ChatMessage;

    /**
     * Similar to {@link createMessage}, creates a new chat message including an application page as an attachment.
     * The message will appear as having been sent by the application, with the {@link nickname} that is currently set.
     * The specified page must correspond to a page published by the caller application.
     * Optionally, the message may reference another non-system message to which it is a reply.
     * @param content A string containing the content of the message.
     * Unlike with {@link createMessage}, **the content may be empty**.
     * The content will be parsed as a restricted subset of {@link https://github.github.com/gfm/ | GitHub Flavored Markdown} by the JungleTV clients.
     * Consider escaping any characters that may unintentionally constitute Markdown formatting.
     * Message contents are subject to some of the validation rules of chat messages sent by users, but do not have an explicit length limit.
     * @param pageID The ID of the application page to attach, as specified when publishing the page using e.g. {@link "jungletv:pages".publishFile}.
     * @param height The non-zero height of the application page in pixels as it will be displayed in the chat history.
     * The maximum height is 512 pixels.
     * @param referenceID An optional string containing the ID of another message to which this one is a reply.
     * The message must not be a system message.
     * This message reference may be removed from the message at a later point, if the referenced message is deleted.
     * @returns A {@link ChatMessage} representing the created chat message.
     */
    export function createMessageWithPageAttachment(content: string, pageID: string, height: number, referenceID?: string): ChatMessage;

    /**
     * Creates a new chat message with the appearance of a system message (centered content within a rectangle, without an identified author), that is immediately sent to all connected chat clients and registered in the chat message history.
     * @param content A string containing the content of the message. The content will be parsed as {@link https://github.github.com/gfm/ | GitHub Flavored Markdown} by the JungleTV clients. Consider escaping any characters that may unintentionally constitute Markdown formatting. System message contents do not have an explicit length limit.
     * @returns A {@link ChatMessage} representing the created chat message.
     */
    export function createSystemMessage(content: string): ChatMessage;

    /**
     * Retrieves chat messages created between two dates.
     * @param since A Date representing the start of the time range for which to retrieve chat messages.
     * @param until A Date representing the end of the time range for which to retrieve chat messages.
     * @returns An array of {@link ChatMessage} sent in the specified time range.
     * Shadowbanned messages are not included.
     */
    export function getMessages(since: Date, until: Date): Promise<ChatMessage[]>;

    /**
     * This writable property indicates whether the chat is enabled.
     * When the chat is disabled, users are not able to send messages.
     * Users may still be able to see recent chat history up to the point when the chat was disabled.
     * System messages can still be created (e.g. using {@link createSystemMessage}) and may be visible to users subscribed to the chat, but this behavior is not guaranteed.
     * When the chat is disabled, applications are still able to fetch chat message history using {@link getMessages}.
     */
    export let enabled: boolean;

    /**
     * This writable property indicates whether the chat is in slow mode.
     * When the chat is in slow mode, most users are limited to sending one message every 20 seconds.
     * Slow mode does not affect chat moderators nor the creation of system messages.
     */
    export let slowMode: boolean;

    /**
     * This writable property corresponds to the nickname set for this application, visible in chat messages sent by the application.
     * When set to `null`, `undefined` or the empty string, the application will appear in chat using its ID.
     * The nickname is subject to similar restrictions as nicknames set by users.
     */
    export let nickname: string;

    /** Represents a message sent in the JungleTV chat. */
    export interface ChatMessage {
        /** The unique ID of the chat message. */
        id: string;

        /** When the message was created. */
        createdAt: Date;

        /** The contents of the message. */
        content: string;

        /** Whether this message is shadowbanned, i.e. whether it should only be shown to its author. */
        shadowbanned: boolean;

        /** The author of the message, only present if the message has an author. Messages without an author are considered system messages. */
        author?: Author;

        /**
         * A partial representation of the message to which this message is a reply.
         * Not present if the message is not a reply to another message.
         * The partial representation is guaranteed to include the message {@link id}, {@link content} and {@link author} and guaranteed **not** to include a {@link reference}.
         */
        reference?: Omit<Partial<ChatMessage> & { id: string, content: string }, "reference">;

        /** The list of message attachments. */
        attachments: (TenorGifAttachment | AppPageAttachment)[];
    }

    /** Represents the author of a {@link ChatMessage} */
    export interface Author {
        /** Reward address of the message author. */
        address: string;

        /** Application ID responsible for this user, may be empty if this user is not controlled by an application. */
        applicationID: string;

        /** Whether the {@link address} is from a currency system that is not the one native to JungleTV. Currently guaranteed to be false in the context of the chat system. */
        isFromAlienChain: false;

        /** Nickname of the message author, may be empty if the user does not have a nickname set. */
        nickname: string;
    }

    /** Represents an attachment of a {@link ChatMessage}. Each type of attachment has its own interface. */
    export interface Attachment {
        type: "tenorgif" | "apppage";
    }

    /** Corresponds to an attached Tenor GIF.
     * Note that despite the "GIF" name, these are typically served as web-compatible video.
     */
    export interface TenorGifAttachment extends Attachment {
        /** Guaranteed to be `tenorgif` for this type of attachment. */
        type: "tenorgif";

        /** The Tenor GIF ID. */
        id: string;

        /** The URL of the video for the GIF. */
        videoURL: string;

        /** The URL of an alternative video for the GIF, using a suboptimal but more compatible format. */
        videoFallbackURL: string;

        /** The title of the Tenor GIF. */
        title: string;

        /** The width of the GIF in pixels. */
        width: number;

        /** The height of the GIF in pixels. */
        height: number;
    }

    /** Corresponds to an attached application page, e.g. as attached using {@link createMessageWithPageAttachment} by this or other application. */
    export interface AppPageAttachment extends Attachment {
        /** Guaranteed to be `apppage` for this type of attachment. */
        type: "apppage";

        /** The ID of the application the attached page belongs to. */
        applicationID: string;

        /** The version of the application the attached page belongs to. */
        applicationVersion: string;

        /** The ID of the page. */
        pageID: string;

        /** The default title of the application page. */
        pageTitle: string;

        /** The height of the application page in pixels as it would be displayed in the chat history. */
        height: number;
    }
}

/** Allows for serving application pages, which is web content that can be presented as stand-alone pages within the JungleTV website, or as part of the main JungleTV interface, with the help of the {@link "jungletv:configuration"} module. */
declare module "jungletv:pages" {

    /** Customizable response headers for application pages */
    export type AllowlistedHeaders = "Content-Security-Policy" | "Permissions-Policy" | "Cross-Origin-Opener-Policy" | "Cross-Origin-Embedder-Policy" | "Cross-Origin-Resource-Policy";

    /**
     * Publishes a new application page, or replaces a previously published one, that will have the specified file as its contents.
     * The page will have the URL `https://jungletv.live/apps/applicationID/pageID`, where `applicationID` is the ID of the running application, and {@link pageID} is the page ID specified.
     * The file to serve as the page contents must have the Public property set.
     * While this is not enforced, the file _should_ have the `text/html` MIME type, contain HTML and make use of the App bridge script, so that communication can occur between the application page and the rest of the JungleTV application and service.
     * Optionally, a set of specific headers can be overridden so that the served application page has access to web capabilities that are otherwise blocked by default, either by the relevant standards or by the defaults of the JungleTV AF.
     * @param pageID A case-sensitive string representing the ID of the page, that will define part of its URL.
     * This ID is also used to reference the page in other methods, such as {@link unpublish}.
     * This ID must contain only characters in the set A-Z, a-z, 0-9, `-` and `_`.
     * If a page with this ID is already published, it will be replaced.
     * @param fileName The name of the application file to serve as the contents for this page.
     * This file must have the Public property enabled.
     * @param defaultTitle A default, or initial, title for the page.
     * This is the title that will be shown while the page is loading within the JungleTV application, or in other states where the final/current title of the application page can't be determined.
     * When the page makes use of the App bridge, its document title will be automatically synchronized, shadowing the value of this parameter.
     * @param headers An optional object containing a key-value set of strings representing HTTP headers and the respective values, that will be sent when the page is served.
     */
    export function publishFile(pageID: string, fileName: string, defaultTitle: string, headers?: Partial<{ [key in AllowlistedHeaders]: string }>): void;

    /**
     * Unpublishes a previously published application page.
     * If the page is being used as part of the interface through the {@link "jungletv:configuration"} module, then unpublishing the page will also cancel such usages.
     * @param pageID A case-sensitive string representing the ID of the page to unpublish.
     * This ID must match the one used when the page was originally published.
     * If the page is already unpublished, this function has no effect.
     */
    export function unpublish(pageID: string): void;
}

/**
 * Provides access to a simple key-value storage that is private to the server component of the application and persists across application executions and across application versions.
 * Both the key names and values are stored as strings; non-string names and values are converted to string, using the JavaScript rules for automatic string conversion.
 * Applications can store and retrieve complex values by encoding and decoding them, e.g. using {@link JSON.stringify} and {@link JSON.parse}.
 * Key names are limited to a maximum length of 2048 bytes **as measured when the name is encoded using UTF-8**. Values do not have an explicit length limit. There is no explicit limit to the amount of keys an application can have in storage.
 */
declare module "jungletv:keyvalue" {
    /**
     * Returns the name of the storage key at the specified index.
     * Thanks to this method, it is possible to iterate over all the keys in storage even when their names are not known.
     * @param index An integer corresponding to the zero-based index of the key whose name is to be retrieved.
     * @returns A string containing the name of the storage key at the specified index, or `null` if a key at that index does not exist.
     */
    export function key(index: number): string | null;

    /**
     * Returns the value of the storage key with the specified name.
     * @param keyName A string corresponding to the name of the key to retrieve from storage. This string can be up to 2048 bytes long, **as measured when encoded using UTF-8**.
     * @returns A string containing the value of the storage item with the specified name, or `null` if such a key does not exist.
     * @throws {@link TypeError} if the first argument is longer than 2048 bytes, as measured when encoded using UTF-8.
     */
    export function getItem(keyName: string): string | null;

    /**
     * Updates the value of the storage key with the specified name, creating a new key/value pair if necessary.
     * @param keyName A string corresponding to the name of the key to create or update in storage. This string can be up to 2048 bytes long, **as measured when encoded using UTF-8**.
     * @param keyValue A string containing the value to save in storage under the given key name.
     * @throws {@link TypeError} if the first argument is longer than 2048 bytes, as measured when encoded using UTF-8.
     */
    export function setItem(keyName: string, keyValue: string): void;

    /**
     * Deletes the key with the specified name from storage.
     * This method does nothing if a key with the specified name does not exist in storage.
     * @param keyName A string corresponding to the name of the key to remove from storage.
     * @throws {@link TypeError} if the first argument is longer than 2048 bytes, as measured when encoded using UTF-8.
     */
    export function removeItem(keyName: string): void;

    /** Clears all the keys in storage, emptying it. */
    export function clear(): void;

    /** The number of items (keys) in storage. */
    export let length: number;
}

/**
 * Allows for communication between the client-side pages, configured using the {@link "jungletv:pages"} module, and the server-side application logic.
 * RPC stands for {@link https://en.wikipedia.org/wiki/Remote_procedure_call | Remote procedure call}.
 * Keep in mind this page documents just the module that is available to the server scripts.
 * It should be used to define how to handle method calls and events originating from the client-side pages.
 */
declare module "jungletv:rpc" {
    /**
     * Sets the function that is called when the remote method with the given name is called by the client, and which can optionally return a value back to the client.
     * A minimum required permission level can be set for the method to be handled.
     * If a method handler had been previously defined for the provided method name, the handler will be replaced with the newly provided one.
     * Similarly, the required permission level will be updated to the newly provided one.
     * @param methodName A case-sensitive string identifying the method.
     * @param requiredPermissionLevel A string indicating the minimum permission level a user must have to be able to call this method.
     * If the user doesn't have sufficient permissions to call the method, the client script throws an exception and the server script is never informed about the call.
     * If you require more nuanced permission checks on this method, you should set this to the minimum permission level and perform the checks within the handler logic.
     * @param handler A function that will be executed whenever this remote method is called by a client with sufficient permissions.
     * The function will be called with at least one argument, a {@link CallContext}, followed by any arguments included by the client in the invocation.
     * The return value of the function will be serialized using JSON and sent back to the client.
     */
    export function registerMethod(methodName: string, requiredPermissionLevel: MethodRequiredPermissionLevel, handler: RPCHandler): void;

    /**
     * Unregisters a remote method with the given name, that had been previously registered using {@link registerMethod}.
     * Until the method is registered again, an exception will be thrown on any clients that attempt to call it.
     * @param methodName A case-sensitive string identifying the method.
     * This string must match the one passed to {@link registerMethod}.
     * If a method with this name is not registered, this function has no effect.
     */
    export function unregisterMethod(methodName: string): void;

    /**
     * Registers a function to be called whenever the remote event with the specified name is emitted by a client.
     * Unlike with methods, more than one listener may be registered to be called for each event type.
     * Clients can pass arguments when they trigger an event, but it is not possible for the server to return values to the client, and the client is notified of event delivery before server listeners for the event finish running, or even if they throw an exception.
     * @param eventName A case-sensitive string identifying the event type.
     * In addition to application-defined events, there is a set of runtime-emitted events.
     * @param listener A function that will be executed whenever this type of remote event is emitted by a client.
     * The function will be called with at least one argument, a {@link RemoteContext}, followed by any arguments included by the client when emitting the event.
     */
    export function addEventListener(eventName: string, listener: EventHandler): void;

    /**
     * Set up an event listener for a possibly trusted (runtime-originated) event (`connected` when an application page connects to the server, `disconnected` when an application page disconnects).
     * You must check the {@link RemoteContext.trusted} field to confirm the event is runtime-originated.
     */
    export function addEventListener(eventName: "connected" | "disconnected", listener: PossiblyTrustedEventHandler): void;

    /**
     * Ceases calling a function previously registered with {@link addEventListener} whenever an event of the specified type is emitted by a client.
     * @param eventName A case-sensitive string identifying the event type.
     * @param listener The function previously passed to {@link addEventListener}, that should no longer be called whenever an event of the specified type occurs.
     */
    export function removeEventListener(eventName: string, listener: EventHandler): void;

    /**
     * Emits an event to all currently connected clients on any application page belonging to this application.
     * This method does not wait for event delivery before returning.
     * Using this method alone, it is not possible to know which, if any, clients received the event.
     * @param eventName A case-sensitive string identifying the event type.
     * @param serverParams An indefinite number of additional parameters of arbitrary types, that will be serialized using JSON and transmitted to the clients.
     */
    export function emitToAll(eventName: string, ...serverParams: any[]): void;

    /**
     * Emits an event to all currently connected clients on the specified application page.
     * This method does not wait for event delivery before returning.
     * Using this method alone, it is not possible to know which, if any, clients received the event.
     * @param pageID A case-sensitive string representing the ID of the page to target.
     * This must match the ID passed to {@link "jungletv:pages".publishFile}.
     * @param eventName A case-sensitive string identifying the event type.
     * @param serverParams An indefinite number of additional parameters of arbitrary types, that will be serialized using JSON and transmitted to the clients.
     */
    export function emitToPage(pageID: string, eventName: string, ...serverParams: any[]): void;

    /**
     * Emits an event to all currently connected clients authenticated as the specified user.
     * This method does not wait for event delivery before returning.
     * Using this method alone, it is not possible to know which, if any, clients received the event.
     * @param user A string representing the reward address of the user to target.
     * Pass the empty string, or null or undefined, to target exclusively unauthenticated users.
     * @param eventName A case-sensitive string identifying the event type.
     * @param serverParams An indefinite number of additional parameters of arbitrary types, that will be serialized using JSON and transmitted to the clients.
     */
    export function emitToUser(user: string | null | undefined, eventName: string, ...serverParams: any[]): void;

    /**
     * Emits an event to all currently connected clients on the specified application page that are also authenticated as the specified user.
     * This method does not wait for event delivery before returning.
     * Using this method alone, it is not possible to know which, if any, clients received the event.
     * @param pageID A case-sensitive string representing the ID of the page to target.
     * This must match the ID passed to {@link "jungletv:pages".publishFile}.
     * @param user A string representing the reward address of the user to target.
     * Pass the empty string, or null or undefined, to target exclusively unauthenticated users.
     * @param eventName A case-sensitive string identifying the event type.
     * @param serverParams An indefinite number of additional parameters of arbitrary types, that will be serialized using JSON and transmitted to the clients.
     */
    export function emitToPageUser(pageID: string, user: string, eventName: string, ...serverParams: any[]): void;

    /** The permission levels a user can have */
    export enum PermissionLevelEnum {
        /** The method can be called by any user, even unauthenticated ones. */
        Unauthenticated = "unauthenticated",

        /** The method can only be called by authenticated users (users registered to receive rewards). */
        User = "user",

        /** The method can only be called by JungleTV staff. */
        Admin = "admin",
    }

    export type PermissionLevel = `${PermissionLevelEnum}`;

    export type MethodRequiredPermissionLevel = PermissionLevel | "";

    /** The type of function that handles RPC method calls on the server */
    export type RPCHandler = (context: CallContext, ...clientParams: any[]) => any;

    /** The type of function that listens for client events on the server */
    export type EventHandler = (context: RemoteContext, ...clientParams: any[]) => any;

    /** The type of function that listens for events, that have a chance of being runtime-originated, on the server */
    export type PossiblyTrustedEventHandler = (context: RemoteContext | TrustedRemoteContext) => any;

    /** The context of a remote method invocation or client event */
    export interface RemoteContext {
        /** ID of the page from where this event or method invocation originates, as passed to {@link "jungletv:pages".publishFile} */
        page: string;

        /** The authenticated user originating this event or invocation, will be undefined if the operation originates from an unauthenticated visitor. */
        sender?: Sender;

        /** Whether this event is from a trusted origin. `true` on events emitted by the JungleTV AF itself. Guaranteed to be `false` on method invocations. */
        trusted: boolean;
    }

    /** The context of a remote method invocation */
    export interface CallContext extends RemoteContext {
        /** Whether this event is from a trusted origin. Guaranteed to be `false` on method invocations. */
        trusted: false;
    }

    /** The context of a trusted (runtime-originated) remote method invocation */
    export interface TrustedRemoteContext extends RemoteContext {
        trusted: true;
    }

    /** Represents the authenticated sender of a remote event or remote method invocation. */
    export interface Sender {
        /* Reward address of the user. */
        address: string;

        /** Nickname of the user, may be empty if the user does not have a nickname set. */
        nickname: string;

        /** Either `admin` or `user` depending on whether the user is a JungleTV staff member. */
        permissionLevel: Exclude<PermissionLevel, "unauthenticated">;
    }
}

/** Lets applications use their own server-side debug console in order to log debug messages, warnings and errors. */
declare module "node:console" {
    /**
     * Outputs a message to the application console.
     * This is a synchronous method that is intended as a debugging tool; some input values can cause this method to block the event loop for a noticeable period.
     * Avoid using this method in a hot code path, especially if making use of complex formatting options or when passing parameters whose string representations are computationally intensive to obtain.
     * This method accepts an indefinite number of parameters.
     * Parameters may be a format string followed by an indefinite number of substitutions, or an indefinite number of any objects.
     * For details on the format options available and the resulting string depending on the number and type of parameters, see the [Node.js documentation for `util.format()`](https://nodejs.org/api/util.html#utilformatformat-args).
     * Note that not all format specifiers and their features may be supported by the JungleTV AF.
     * @param message Optional format string - see method documentation for details
     * @param optionalParams Optional parameters - see method documentation for details
     */
    export function log(message?: any, ...optionalParams: any[]): void;

    /**
     * Outputs a warning message to the application console.
     * Warning messages are shown in the debug console with a yellow background next to a ⚠️ warning symbol.
     * This is a synchronous method that is intended as a debugging tool; some input values can cause this method to block the event loop for a noticeable period.
     * Avoid using this method in a hot code path, especially if making use of complex formatting options or when passing parameters whose string representations are computationally intensive to obtain.
     * This method accepts the same parameters as {@link log}.
     * @param message Optional format string - see method documentation for details
     * @param optionalParams Optional parameters - see method documentation for details
     */
    export function warn(message?: any, ...optionalParams: any[]): void;

    /**
     * Outputs an error message to the application console.
     * Error messages are shown in the debug console with a red background next to a ❗ exclamation symbol.
     * This is a synchronous method that is intended as a debugging tool; some input values can cause this method to block the event loop for a noticeable period.
     * Avoid using this method in a hot code path, especially if making use of complex formatting options or when passing parameters whose string representations are computationally intensive to obtain.
     * This method accepts the same parameters as {@link log}.
     * @param message Optional format string - see method documentation for details
     * @param optionalParams Optional parameters - see method documentation for details
     */
    export function error(message?: any, ...optionalParams: any[]): void;
}
declare module "console" {
    const m = typeof import("node:console");
    export default m;
}

/** Lets applications control and obtain information about their own execution instance and operating environment. */
declare module "node:process" {
    /** Terminates the application instance immediately. */
    export function abort(): never;

    /**
     * Terminates the application instance immediately with the specified exit code, or otherwise with the current value of {@link exitCode}.
     * @param code Optional integer indicating the code with which the application instance should terminate.
     * A value of zero indicates success.
     * If omitted, the current value of {@link exitCode} is used instead.
     */
    export function exit(code?: number): never;

    /**
     * Determines the application instance exit code when the application instance is exited.
     * If a code is specified in the call to {@link exit}, this value is ignored.
     */
    export let exitCode: number;

    /** Read-only string indicating the current platform. Guaranteed to be `jungletv`. */
    export let platform: string;

    /** Read-only string indicating the ID of the currently running application. */
    export let title: string;

    /** Read-only number indicating the version of the runtime running the application. */
    export let version: number;

    /** Read-only property that returns an object listing the version strings of different components associated with the current application instance. */
    export let versions: {
        "application": string,
        "jungletv": string,
        [key: string]: string;
    };
}
declare module "process" {
    const m = typeof import("node:process");
    export default m;
}

/** Allows for interaction with the JungleTV points subsystem. */
declare module "jungletv:points" {
    /** Arguments to a chat event */
    export interface EventArgs {
        type: keyof PointsEventMap;
    }

    /** Arguments to the 'transactioncreated' event */
    export interface TransactionCreatedEventArgs extends EventArgs {
        /** Guaranteed to be `transactioncreated`. */
        type: "transactioncreated";

        /** The created points transaction. */
        transaction: PointsTransaction<keyof PointsTransactionTypeMap>;
    }

    /** Arguments to the 'transactionupdated' event */
    export interface TransactionUpdatedEventArgs extends EventArgs {
        /** Guaranteed to be `transactionupdated`. */
        type: "transactionupdated";

        /** The updated points transaction. */
        transaction: PointsTransaction<keyof PointsTransactionTypeMap>;

        /** The amount of points the transaction was adjusted by. */
        pointsAdjustment: number;
    }

    /** A relation between event types and the arguments passed to the respective listeners */
    export interface PointsEventMap {
        /** This event is fired when a completely new points transaction is created. */
        "transactioncreated": TransactionCreatedEventArgs;

        /**
         * This event is fired when an existing points transaction has its value updated.
         * This can only happen for specific transaction types, for which consecutive transactions of the same type are essentially collapsed as a single transaction.
         * The updated transaction retains its creation date but its update date and its value changes.
         */
        "transactionupdated": TransactionUpdatedEventArgs;
    }

    /**
     * Registers a function to be called whenever the specified event occurs.
     * Depending on the event, the function may be invoked with arguments containing information about the event.
     * Refer to the documentation about each event type for details.
     * @param eventType A case-sensitive string representing the event to listen for.
     * @param listener A function that will be called when an event of the specified type occurs.
     */
    export function addEventListener<K extends keyof PointsEventMap>(eventType: K, listener: (this: unknown, args: PointsEventMap[K]) => void): void;

    /**
     * Ceases calling a function previously registered with {@link Points.addEventListener} whenever the specified event occurs.
     * @param eventType A case-sensitive string corresponding to the event type from which to unsubscribe.
     * @param listener The function previously passed to {@link Points.addEventListener}, that should no longer be called whenever an event of the given {@param eventType} occurs.
     */
    export function removeEventListener<K extends keyof PointsEventMap>(eventType: K, listener: (this: unknown, args: PointsEventMap[K]) => void): void;

    /**
     * Adjusts a user’s point balance by creating a new points transaction.
     * @param address Reward address of the account to add/remove points from.
     * @param description The user-visible description for the transaction.
     * @param points A non-zero integer corresponding to the amount to adjust the balance by.
     * @returns The created {@link PointsTransaction}.
     */
    export function createTransaction(address: string, description: string, points: number): PointsTransaction<"application_defined">;

    /**
     * Returns the current points balance of a user.
     * @param address The reward address of the account for which to get the balance.
     * @returns A non-negative integer representing the available points balance of the user.
     */
    export function getBalance(address: string): number;

    /**
     * Returns the current JungleTV Nice subscription of a user.
     * @param address The reward address of the account for which to get the subscription.
     * @returns The currently active {@link NiceSubscription} for the specified user, or null if the user is not currently subscribed to JungleTV Nice.
     */
    export function getNiceSubscription(address: string): NiceSubscription;

    /** Represents a JungleTV Nice subscription. */
    export interface NiceSubscription {
        /** The reward address of the subscriber. */
        address: string;

        /** When the user subscribed. */
        startsAt: Date;

        /** When the subscription will expire. */
        endsAt: Date;

        /** The unique IDs of the points transactions used to pay for the subscription. */
        paymentTransactions: string[];
    }

    /** Represents a points transaction. */
    export interface PointsTransaction<K extends keyof PointsTransactionTypeMap> {
        /** The unique ID of the transaction. */
        id: string;

        /** The reward address of the user affected by this transaction. */
        address: string;

        /** When the transaction was created. */
        createdAt: Date;

        /** When the transaction was last updated. */
        updatedAt: Date;

        /** The points value of the transaction. */
        value: number;

        /** The type of the transaction. */
        transactionType: K;

        /** Extra transaction properties. Varies based on transaction type and may be an empty object. */
        extra: PointsTransactionTypeMap[K];
    }

    /** A relation between points transaction types and the extra field of the respective transactions */
    export interface PointsTransactionTypeMap {
        "activity_challenge_reward": {};
        "chat_activity_reward": {};
        "media_enqueued_reward": MediaEnqueuedRewardExtraFields;
        "chat_gif_attachment": {};
        "manual_adjustment": ManualAdjustmentExtraFields;
        "media_enqueued_reward_reversal": MediaEnqueuedRewardReversalExtraFields;
        "conversion_from_banano": ConversionFromBananoExtraFields;
        "queue_entry_reordering": QueueEntryReorderingExtraFields;
        "monthly_subscription": {};
        "skip_threshold_reduction": {};
        "skip_threshold_increase": {};
        "concealed_entry_enqueuing": ConcealedEntryEnqueuingExtraFields;
        "application_defined": ApplicationDefinedExtraFields;
    }

    /** Extra object for the transaction type media_enqueued_reward */
    export interface MediaEnqueuedRewardExtraFields {
        /** The ID of the enqueued media. */
        media: string;
    }

    /** Extra object for the transaction type manual_adjustment */
    export interface ManualAdjustmentExtraFields {
        /** The user-provided reason for the change. */
        reason: string;

        /** The reward address of the staff member that performed the change. */
        adjusted_by: string;
    }

    /** Extra object for the transaction type media_enqueued_reward_reversal */
    export interface MediaEnqueuedRewardReversalExtraFields {
        /** The ID of the media which was removed from the queue. */
        media: string;
    }

    /** Extra object for the transaction type conversion_from_banano */
    export interface ConversionFromBananoExtraFields {
        /** The hash of the state block that sent the banano. */
        tx_hash: string;
    }

    /** Extra object for the transaction type queue_entry_reordering */
    export interface QueueEntryReorderingExtraFields {
        /** The ID of the media entry that was moved in the queue. */
        media: string;

        /** A string indicating whether the entry was moved up or down. */
        direction: "up" | "down";
    }

    /** Extra object for the transaction type concealed_entry_enqueuing */
    export interface ConcealedEntryEnqueuingExtraFields {
        /** The ID of the enqueued media. */
        media: string;
    }

    /** Extra object for the transaction type application_defined */
    export interface ApplicationDefinedExtraFields {
        /** The application that created the transaction. */
        application_id: string;

        /** The version of the application. */
        application_version: string;

        /** The user-visible transaction description, as set by the application. */
        description: string;
    }
}

/** Allows for altering different aspects of JungleTV's presentation and behavior. */
declare module "jungletv:configuration" {
    /**
     * Defines a custom website name to be used in place of "JungleTV".
     * The change is immediately reflected on all connected media-consuming clients, and is automatically undone when the application terminates.
     * Multiple JAF applications can request to override this configuration.
     * In such cases, the reflected value will be that of the application that most recently requested to override the configuration, and which is yet to terminate or cease overriding the configuration value.
     * @param name The name to temporarily use for the JungleTV web application.
     * When set to `null`, `undefined` or the empty string, the AF application will stop overriding the JungleTV web application name.
     * @returns true in circumstances where the AF runtime is working as expected.
     */
    export function setAppName(name?: string): boolean;

    /**
     * Defines a custom website logo to be used in place of the default one.
     * The image to use must be an application file that has the Public property set and has an image MIME type.
     * The change is immediately reflected on all connected media-consuming clients, and is automatically undone when the application terminates.
     * Multiple JAF applications can request to override this configuration.
     * In such cases, the reflected value will be that of the application that most recently requested to override the configuration, and which is yet to terminate or cease overriding the configuration value.
     * @param filename The name of the application file to serve as the JungleTV website logo.
     * This file must have the Public property enabled and have an image MIME type.
     * When set to `null`, `undefined` or the empty string, the AF application will stop overriding the JungleTV website logo.
     * @returns true in circumstances where the AF runtime is working as expected.
     */
    export function setAppLogo(filename?: string): boolean;

    /**
     * Defines a custom website favicon to be used in place of the default one.
     * The image to use must be an application file that has the Public property set and has an image MIME type.
     * The change is immediately reflected on all connected media-consuming clients, and is automatically undone when the application terminates.
     * Multiple JAF applications can request to override this configuration.
     * In such cases, the reflected value will be that of the application that most recently requested to override the configuration, and which is yet to terminate or cease overriding the configuration value.
     * @param filename The name of the application file to serve as the JungleTV website favicon.
     * This file must have the Public property enabled and have an image MIME type.
     * When set to `null`, `undefined` or the empty string, the JAF application will stop overriding the JungleTV website favicon.
     * @returns true in circumstances where the AF runtime is working as expected.
     */
    export function setAppFavicon(filename?: string): boolean;

    /**
     * Sets an application page, registered with {@link "jungletv:pages".publishFile}, to be shown as an additional sidebar tab on the JungleTV homepage.
     * The tab's initial title will be the default title passed to {@link "jungletv:pages".publishFile} when publishing the page.
     * When the page makes use of the app bridge script, its document title will be automatically synchronized with the tab title, **while the tab is visible/selected**.
     * When not selected, the tab **may** retain the most recent title until it is reopened or removed, **or** it **may** revert to the page's default title.
     * Currently, application sidebar tabs can't be popped out of the main JungleTV application window like built-in tabs can (e.g. by middle-clicking on the tab title).
     * The new sidebar tab becomes immediately available (but not immediately visible, i.e. the selected sidebar tab will not change) on all connected media-consuming clients, and is automatically removed when the application terminates or when the page is {@link "jungletv:pages".unpublish unpublished}.
     * Each JAF application can elect to show a single one of their application pages as a sidebar tab.
     * If the same application invokes this function with different pages as the argument, the sidebar tab slot available to that application will contain the page passed on the most recent invocation.
     * @param pageID A case-sensitive string representing the ID of the page to use as the content for the tab, as was specified when invoking {@link "jungletv:pages".publishFile}.
     * When set to `null`, `undefined` or the empty string, the sidebar tab slot for the JAF application will be removed.
     * Connected users with the application's tab active will see an immediate switch to another sidebar tab.
     * @param beforeTabID An optional string that allows for controlling the placement of the new sidebar tab relative to the built-in sidebar tabs.
     * The application's tab will appear to the left of the specified built-in tab. The built-in tab IDs are: `queue`, `skipandtip`, `chat` and `announcements`.
     * If this argument is not specified, the tab will appear to the right of all the built-in tabs.
     * The application framework is not designed to let applications control the placement of their tab relative to the tabs of other JAF applications.
     * The placement of an application's tab relative to the tabs of other applications may change every time this function is invoked.
     * @returns true in circumstances where the AF runtime is working as expected.
     */
    export function setSidebarTab(pageID?: string, beforeTabID?: string);
}

/**
 * Represents the permission level of the current user as provided by the client-side appbridge script.
 */
type UserPermissionLevel = "unauthenticated" | "user" | "appeditor" | "admin";

/**
 * Strongly-typed event targets
 * via https://dev.to/marcogrcr/type-safe-eventtarget-subclasses-in-typescript-1nkf
 */
interface CustomEventTarget<EventMap> extends EventTarget {
    addEventListener<K extends keyof EventMap>(
        type: K,
        callback: (
            event: EventMap[K] extends Event ? EventMap[K] : never
        ) => EventMap[K] extends Event ? void : never,
        options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject | null,
        options?: EventListenerOptions | boolean
    ): void;
}

/**
 * Arguments of the "mounted" page event
 */
type MountEventArgs = {
    role: "standalone" | "activity" | "sidebar" | "chatattachment",
}

interface AppBridge {
    /**
     * Version of the bridge between the application page code and the host JungleTV page.
     */
    readonly BRIDGE_VERSION: number;

    /**
     * Event target for events sent from the JungleTV server.
     * Events will have the name of the corresponding server events and the arguments of the event will be on the {@link CustomEvent.detail} field.
     */
    readonly server: Omit<CustomEventTarget<{
        [eventName: string]: CustomEvent;
    }>, "dispatchEvent">;

    /**
     * Event target for events sent from the host JungleTV page.
     */
    readonly page: Omit<CustomEventTarget<{
        "connected": Event;
        "disconnected": Event;
        "mounted": CustomEvent<MountEventArgs>;
        "destroyed": Event;
    }>, "dispatchEvent">;

    /**
     * Make a remote call to the application's server script.
     * @param method The remote method to call.
     * @param args The arguments of the call.
     * @returns The result of the call after JSON parsing.
     */
    serverMethod: <T>(method: string, ...args: any[]) => Promise<T>;

    /**
     * Emits an event for the server script.
     * @param eventName The name of the event to emit.
     * @param args The arguments of the event.
     */
    emitToServer: (eventName: string, ...args: any[]) => Promise<void>;

    /**
     * Instructs the JungleTV host page to navigate to a different page, in this or another application.
     * @param pageID The ID of the page to navigate to.
     * @param applicationID The ID of the application the page belongs to, can be omitted if the page belongs to the current application.
     */
    navigateToApplicationPage: (pageID: string, applicationID?: string) => Promise<void>;

    /**
     * Instructs the JungleTV host page to navigate to a different JungleTV app route using svelte-navigator.
     * @param to The destination to navigate to.
     */
    navigate: (to: string) => Promise<void>;

    /**
     * Resolves the URL that can be used to reference a public file of this application, within the context of the page.
     * @param fileName The name of the file to resolve.
     * @returns The resolved URL, or undefined if the connection between the page and the host JungleTV page has not been established yet.
     */
    resolveApplicationFileURL: (fileName: string) => Promise<string>;

    /**
     * Resolves the ID of the application to which the page being executed belongs.
     * @returns The application ID.
     */
    getApplicationID: () => Promise<string>;

    /**
     * Resolves the version of the application to which the page being executed belongs.
     * @returns The application version. May have less precision than the version as recorded on the server.
     */
    getApplicationVersion: () => Promise<Date>;

    /**
     * Resolves the ID of the application page being executed.
     * @returns The page ID.
     */
    getApplicationPageID: () => Promise<string>;

    /**
     * Shows an alert modal to the user.
     * @param message The message to show.
     * @param title The title of the modal.
     * @param buttonLabel The label of the button to dismiss the message.
     * @returns A promise that resolves when the user closes the modal.
     */
    alert: (message: string, title?: string, buttonLabel?: string) => Promise<void>;

    /**
     * Shows a confirmation modal to the user.
     * @param question The question to show.
     * @param title The title of the modal.
     * @param positiveAnswerLabel The label of the button to accept the confirmation. Defaults to "Yes".
     * @param negativeAnswerLabel The label of the button to reject the confirmation. Defaults to "No".
     * @returns Whether the user accepted the confirmation.
     */
    confirm: (question: string, title?: string, positiveAnswerLabel?: string, negativeAnswerLabel?: string) => Promise<boolean>;

    /**
     * Shows a prompt modal to the user, allowing them to enter text.
     * @param question The question to show.
     * @param title The title of the modal.
     * @param placeholder The placeholder value of the text input.
     * @param initialValue The initial value of the text input.
     * @param positiveAnswerLabel The label of the button to submit the input. Defaults to "OK".
     * @param negativeAnswerLabel The label of the button to cancel the prompt. Defaults to "Cancel".
     * @returns The text entered by the user, or null if the user cancelled the prompt.
     */
    prompt: (question: string,
        title?: string,
        placeholder?: string,
        initialValue?: string,
        positiveAnswerLabel?: string,
        negativeAnswerLabel?: string) => Promise<string>;

    /**
     * Get the reward address of the currently logged in user.
     * @returns The reward address of the currently logged in user, or undefined if the user is not authenticated.
     */
    getUserAddress: () => Promise<string | undefined>;

    /**
     * Get the permission level of the current user.
     * @returns The permission level of the current user.
     */
    getUserPermissionLevel: () => Promise<UserPermissionLevel>;

    /**
     * Shows a modal containing the profile of a user.
     * The modal may not be opened immediately if a modal is presently being displayed, but the promise is resolved regardless.
     * @param userAddress The reward address of the user.
     * @returns A promise that resolves as soon as the request to open the profile is acknowledged.
     */
    showUserProfile: (userAddress: string) => Promise<void>;
}