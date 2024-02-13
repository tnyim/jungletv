interface Require {
    (id: string): any;
    (id: "jungletv:chat"): typeof import("jungletv:chat");
    (id: "jungletv:pages"): typeof import("jungletv:pages");
    (id: "jungletv:points"): typeof import("jungletv:points");
    (id: "jungletv:queue"): typeof import("jungletv:queue");
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
     * Ceases calling a function previously registered with {@link addEventListener} whenever the specified event occurs.
     * @param eventType A case-sensitive string corresponding to the event type from which to unsubscribe.
     * @param listener The function previously passed to {@link addEventListener}, that should no longer be called whenever an event of the given {@param eventType} occurs.
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
     * Deletes a chat message.
     * @param messageID The ID of the message to delete.
     * @returns The deleted {@link ChatMessage}.
     */
    export function removeMessage(messageID: string): ChatMessage;

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
    export let nickname: string | null | undefined;

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
        author?: User;

        /**
         * A partial representation of the message to which this message is a reply.
         * Not present if the message is not a reply to another message.
         * The partial representation is guaranteed to include the message {@link id}, {@link content} and {@link author} and guaranteed **not** to include a {@link reference}.
         */
        reference?: Omit<Partial<ChatMessage> & { id: string, content: string }, "reference">;

        /** The list of message attachments. */
        attachments: (TenorGifAttachment | AppPageAttachment)[];

        /**
         * Removes the chat message.
         * Equivalent to calling {@link removeMessage} with the {@link id} of this message.
         */
        remove: () => ChatMessage;
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
 * Keep in mind this corresponds to just the module that is available to the server scripts.
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
     * Pass the empty string, or `null` or `undefined`, to target exclusively unauthenticated users.
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
     * Pass the empty string, or `null` or `undefined`, to target exclusively unauthenticated users.
     * @param eventName A case-sensitive string identifying the event type.
     * @param serverParams An indefinite number of additional parameters of arbitrary types, that will be serialized using JSON and transmitted to the clients.
     */
    export function emitToPageUser(pageID: string, user: string | null | undefined, eventName: string, ...serverParams: any[]): void;

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
        sender?: User;

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
     * Ceases calling a function previously registered with {@link addEventListener} whenever the specified event occurs.
     * @param eventType A case-sensitive string corresponding to the event type from which to unsubscribe.
     * @param listener The function previously passed to {@link addEventListener}, that should no longer be called whenever an event of the given {@param eventType} occurs.
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

/** Allows for interaction with the JungleTV queue subsystem. */
declare module "jungletv:queue" {
    /** Arguments to a chat event */
    export interface EventArgs {
        type: keyof QueueEventMap;
    }

    /** Arguments to the 'queueupdated' event */
    export interface QueueUpdatedEventArgs extends EventArgs {
        /** Guaranteed to be `queueupdated`. */
        type: "queueupdated";
    }

    /** Arguments to the 'entryadded' event */
    export interface EntryAddedEventArgs extends EventArgs {
        /** Guaranteed to be `entryadded`. */
        type: "entryadded";

        /** The added entry. */
        entry: QueueEntry;

        /** The position of the added entry in the queue. */
        index: number;

        /** The requested type of queue placement. */
        placement: EnqueuePlacement;
    }

    /** Arguments to the 'entrymoved' event */
    export interface EntryMovedEventArgs extends EventArgs {
        /** Guaranteed to be `entrymoved`. */
        type: "entrymoved";

        /** The queue position occupied by the entry prior to being moved. */
        previousIndex: number;

        /** The queue position presently occupied by the entry, after being moved. */
        currentIndex: number;

        /** The user who moved the queue entry. */
        user: User;

        /** The moved entry. */
        entry: QueueEntry;

        /** Whether the entry was moved up (closer to the currently playing entry) or down (to be played later in the queue). */
        direction: "up" | "down";
    }

    /** Arguments to the 'entryremoved' event */
    export interface EntryRemovedEventArgs extends EventArgs {
        /** Guaranteed to be `entryremoved`. */
        type: "entryremoved";

        /** The queue position occupied by the entry prior to being removed. */
        index: number;

        /** Whether the removal of the entry was requested by the user who enqueued it. */
        selfRemoval: boolean;

        /** The removed entry. */
        entry: QueueEntry;
    }

    /** Arguments to the 'mediachanged' event */
    export interface MediaChangedEventArgs extends EventArgs {
        /** Guaranteed to be `mediachanged`. */
        type: "mediachanged";

        /** The queue entry which just started playing, or `undefined` if the queue became empty. */
        playingEntry?: QueueEntry;
    }

    /** Arguments to the 'skippingallowedchanged' event */
    export interface SkippingAllowedChangedEventArgs extends EventArgs {
        /** Guaranteed to be `skippingallowedchanged`. */
        type: "skippingallowedchanged";
    }


    /** A relation between event types and the arguments passed to the respective listeners */
    export interface QueueEventMap {
        /** This event is fired when the list of entries in the queue, or some of its associated settings, are updated. */
        "queueupdated": QueueUpdatedEventArgs;

        /** This event is fired when an entry is added to the queue. */
        "entryadded": EntryAddedEventArgs;

        /** This event is fired when an entry is moved in the queue. */
        "entrymoved": EntryMovedEventArgs;

        /** This event is fired when an entry is removed from the queue. */
        "entryremoved": EntryRemovedEventArgs;

        /** This event is fired when the currently playing media changes. */
        "mediachanged": MediaChangedEventArgs;

        /** This event is fired when the ability to skip entries is enabled or disabled. */
        "skippingallowedchanged": SkippingAllowedChangedEventArgs;
    }

    /**
     * Registers a function to be called whenever the specified event occurs.
     * Depending on the event, the function may be invoked with arguments containing information about the event.
     * Refer to the documentation about each event type for details.
     * @param eventType A case-sensitive string representing the event to listen for.
     * @param listener A function that will be called when an event of the specified type occurs.
     */
    export function addEventListener<K extends keyof QueueEventMap>(eventType: K, listener: (this: unknown, args: QueueEventMap[K]) => void): void;

    /**
     * Ceases calling a function previously registered with {@link addEventListener} whenever the specified event occurs.
     * @param eventType A case-sensitive string corresponding to the event type from which to unsubscribe.
     * @param listener The function previously passed to {@link addEventListener}, that should no longer be called whenever an event of the given {@param eventType} occurs.
     */
    export function removeEventListener<K extends keyof QueueEventMap>(eventType: K, listener: (this: unknown, args: QueueEventMap[K]) => void): void;

    /**
     * Sets what users can add new entries to the media queue.
     * Applications may be able to enqueue media regardless of this setting.
     * To read the current value of this setting, use {@link enqueuingPermission}.
     * @param permission The restriction applied to human-initiated enqueuing.
     */
    export function setEnqueuingPermission(permission: Exclude<EnqueuingPermission, "enabled_password_required">): void;

    /**
     * Sets who is able to add new entries to the queue.
     * @param permission The restriction applied to human-initiated enqueuing.
     * @param password The password users will need to provide in order to be able to enqueue.
     */
    export function setEnqueuingPermission(permission: `${EnqueuingPermissionEnum.EnabledPasswordRequired}`, password: string): void;

    /**
     * Removes an entry from the queue.
     * @param entryID The ID of the queue entry to remove.
     * @returns The removed queue entry.
     */
    export function removeEntry(entryID: string): QueueEntry;

    /**
     * Moves a queue entry to an adjacent position without costing the application JP.
     * Entries cannot be moved up when they are adjacent to the currently playing entry, or to the queue insert cursor if it is set.
     * Entries cannot be moved down when they are the last of the queue, or when they are adjacent to the queue insert cursor.
     * @param entryID The ID of the queue entry to move.
     * @param direction Whether to move the queue entry closer to the currently playing entry ("up") or further away ("down").
     */
    export function moveEntry(entryID: string, direction: "up" | "down"): void;

    /**
     * Equivalent to {@link moveEntry}, but will deduct from the application JP balance and fail if the application does not have sufficient JP.
     * @param entryID The ID of the queue entry to move.
     * @param direction Whether to move the queue entry closer to the currently playing entry ("up") or further away ("down").
     */
    export function moveEntryWithCost(entryID: string, direction: "up" | "down"): void;

    /**
     * Enqueues an application page, to be "played" as if it were any other form of media.
     *
     * The title of the created queue entry will default to the one passed to {@link "jungletv:pages".publishFile}, unless overridden via the {@link options} object.
     * The thumbnail of the created queue entry will default to a generic one, unless overridden via the {@link options} object.
     *
     * Once the created queue entry reaches the top of the queue and begins "playing," the specified application page will be displayed on JungleTV clients in the same place where a media player normally goes.
     * The page will display alongside other homepage UI elements, including the sidebar (where an application page may also be displaying as a sidebar tab).
     * The page may also be displayed in a very small size, namely, whenever the user browses to other pages of the JungleTV SPA, as the media player will collapse to the bottom right corner of the screen until closed by the user, or until the user returns to the homepage.
     * Regardless of the size and placement of the application page, users will be able to interact with it, as they normally would if they had navigated to it.
     *
     * If the application page is unpublished or the application is terminated, the queue entry will be removed.
     *
     * Application page queue entries, if not set to unskippable (which can be achieved using the {@link options} object), may be skipped as any other queue entry would - assuming skipping is enabled at the time the corresponding queue entry is playing.
     * @param pageID The ID of the application page to enqueue.
     * @param placement The desired placement of the new queue entry.
     * @param length An optional number indicating the desired length, in milliseconds, for the new queue entry.
     *
     * If not specified or if set to infinity, once the corresponding queue entry begins playing, it will only stop once skipped/removed.
     * A length for such queue entries will not be visible in the user interface.
     *
     * If a length is specified, it must be between one second and one hour, the period after which the media queue will automatically move to the next queue entry.
     * @param options An optional object containing additional options for the queue entry.
     * @returns The newly-created queue entry.
     */
    export function enqueuePage(pageID: string, placement: EnqueuePlacement, length?: number, options?: PageEnqueueOptions): Promise<QueueEntry>;

    /**
     * Retrieves the play history for the time period specified between {@link since} and {@link until}, with results sorted by the order in which they played.
     *
     * @param since The start of the time period to retrieve play history for.
     * @param until The end of the time period to retrieve play history for.
     * @param options An optional object containing additional options for the play history request.
     * @returns An array of {@link MediaPerformance} objects representing the play history sorted by the time of the performances.
     */
    export function getPlayHistory(since: Date, until: Date, options?: GetPlayHistoryOptions): Promise<MediaPerformance[]>;

    /**
     * Retrieves the enqueuing history for entries enqueued in the time period specified between {@link since} and {@link until}, with results sorted by the time at which they were enqueued.
     *
     * @param since The start of the time period to retrieve enqueue history for.
     * @param until The end of the time period to retrieve enqueue history for.
     * @param options An optional object containing additional options for the history request.
     * @returns An array of {@link MediaPerformance} objects representing the enqueuing history sorted by request time.
     */
    export function getEnqueueHistory(since: Date, until: Date, options?: GetPlayHistoryOptions): Promise<MediaPerformance[]>;

    /**
     * This read-only property indicates which users can add new entries to the media queue.
     * Applications may be able to enqueue media regardless of this setting.
     * To modify this setting, use {@link setEnqueuingPermission} (a setter function is necessary because some modes require extra arguments).
     */
    export let enqueuingPermission: EnqueuingPermission;

    /**
     * This read-only property represents the entries currently in the media queue, sorted in their current order.
     * The first entry is the currently playing entry.
     */
    export let entries: QueueEntry[];

    /**
     * This read-only property represents the currently playing queue entry.
     * It is `undefined` when no queue entry is currently playing.
     */
    export let playing: QueueEntry | undefined;

    /**
     * This read-only property represents the number of entries in the media queue.
     */
    export let length: number;

    /**
     * This read-only property represents the number of entries in the queue up to the insert cursor.
     * If no cursor is set, this property returns the same value as {@link length}.
     */
    export let lengthUpToCursor: number;

    /**
     * This writable property controls whether the user who added a given entry to the queue is allowed to remove it.
     * Users are still subject to rate limits when removing their own entries, even when this setting is set to `true`.
     * Does not apply to staff or applications.
     */
    export let removalOfOwnEntriesAllowed: boolean;

    /**
     * This writable property controls whether new queue entries are made unskippable at no additional cost,
     * regardless of whether users request for them to be unskippable.
     */
    export let newQueueEntriesAllUnskippable: boolean;

    /**
     * This writable property controls whether unprivileged users can use any forms of media skipping.
     * Does not affect entry self-removal, which is controlled by {@link removalOfOwnEntriesAllowed}.
     */
    export let skippingAllowed: boolean;

    /**
     * This writable property controls whether users are able to reorder queue entries by spending JP.
     */
    export let reorderingAllowed: boolean;

    /**
     * This writable property allows for defining the queue insert cursor,
     * i.e. the position at which entries are inserted in the queue when adding entries with placement {@link EnqueuePlacementEnum.Later}.
     * The property should be set to the ID of the media queue entry _below_ (i.e. at an higher index in `entries`) that where the cursor should appear.
     * Set to `null` or `undefined` to clear the cursor, causing new entries to be added to the end of the queue.
     */
    export let insertCursor: string | null | undefined;

    /**
     * This read-only property indicates since when the media queue has been playing non-stop.
     * It is `undefined` when no queue entry is currently playing.
     */
    export let playingSince: Date | undefined;

    /** Object containing properties and methods related to queue entry pricing. */
    export let pricing: Pricing;

    /** Object containing properties and methods related to crowdfunded transactions ("Skip & Tip"). */
    export let crowdfunding: Crowdfunding;


    /** Properties and methods related to queue entry pricing. */
    export interface Pricing {
        /**
         * Compute the current pricing for a new queue entry, which would be requested to a user as a requirement for enqueuing at different placements.
         * @param length Length of the media section in milliseconds.
         * @param unskippable Whether the entry is to be unskippable.
         * @param concealed Whether media information should be concealed until the media starts playing.
         */
        computeEnqueuePricing: (length: number, unskippable: boolean, concealed: boolean) => EnqueuePricing;

        /**
         * Writable integer property representing the general multiplier applied to the cost of enqueuing.
         * Cannot be set lower than 1.
         */
        finalMultiplier: number;

        /**
         * Writable integer property representing the minimum prices multiplier,
         * which sets a lower bound on the cost of enqueuing, in an attempt to ensure that all users get some reward
         * regardless of the conditions at the time an entry plays.
         * Cannot be set lower than 20.
         */
        minimumMultiplier: number;

        /**
         * Writable integer property representing the multiplier applied to the cost of crowdfunded skipping.
         * Cannot be set lower than 1.
         */
        crowdfundedSkipMultiplier: number;
    }

    /** Contains minimum prices to enqueue an entry using different placement types. */
    export interface EnqueuePricing {
        /** The minimum amount, in raw Banano units, required to enqueue the entry using {@link EnqueuePlacementEnum.Later} placement. */
        later: Amount;

        /** The minimum amount, in raw Banano units, required to enqueue the entry using {@link EnqueuePlacementEnum.AfterCurrent} placement. */
        aftercurrent: Amount;

        /** The minimum amount, in raw Banano units, required to enqueue the entry using {@link EnqueuePlacementEnum.Now} placement, effectively skipping the currently playing entry (if skipping is allowed and the entry is skippable). */
        now: Amount;
    }

    /** Properties and methods related to crowdfunded transactions ("Skip & Tip"). */
    export interface Crowdfunding {
        /**
         * Registers a function to be called whenever the specified event occurs.
         * Depending on the event, the function may be invoked with arguments containing information about the event.
         * Refer to the documentation about each event type for details.
         * @param eventType A case-sensitive string representing the event to listen for.
         * @param listener A function that will be called when an event of the specified type occurs.
         */
        addEventListener: <K extends keyof CrowdfundingEventMap>(eventType: K, listener: (this: unknown, args: CrowdfundingEventMap[K]) => void) => void;

        /**
         * Ceases calling a function previously registered with {@link Crowdfunding.addEventListener} whenever the specified event occurs.
         * @param eventType A case-sensitive string corresponding to the event type from which to unsubscribe.
         * @param listener The function previously passed to {@link Crowdfunding.addEventListener}, that should no longer be called whenever an event of the given {@param eventType} occurs.
         */
        removeEventListener: <K extends keyof CrowdfundingEventMap>(eventType: K, listener: (this: unknown, args: CrowdfundingEventMap[K]) => void) => void;

        /** Writable property controlling whether crowdfunded skipping is enabled. */
        skippingEnabled: boolean;

        /** Read-only property containing the status of crowdfunded skipping. */
        skipping: CrowdfundedSkippingStatus;

        /** Read-only property containing the status of crowdfunded tipping. */
        tipping: CrowdfundedTippingStatus;
    }

    /** Status of the crowdfunded skipping feature. */
    export interface CrowdfundedSkippingStatus {
        /** State of the crowdfunded skipping feature, indicating whether it is presently possible for the community to skip, or the reason why not. */
        status: CrowdfundedSkippingState;

        /** Address of the crowdfunded skipping account. */
        address: string;

        /** Balance, in raw Banano units, of the crowdfunded skipping account. */
        balance: string;

        /**
         * Balance of the crowdfunded skipping account at which skipping will occur.
         * In raw Banano units.
         */
        threshold: string;

        /** Whether users are able to spend JP in order to decrease the {@link threshold}. */
        thresholdLowerable: boolean;
    }

    /** Represents the state of the crowdfunded skipping feature. */
    export enum CrowdfundedSkippingStateEnum {
        /** Crowdfunded skipping is possible: the currently playing entry will be skipped as soon as the balance of the crowdfunded skipping account reaches the {@link CrowdfundedSkippingStatus.threshold}. */
        Possible = "possible",

        /** Crowdfunded skipping is impossible because the currently playing queue entry is unskippable. */
        ImpossibleUnskippable = "impossible_unskippable",

        /** Crowdfunded skipping is impossible because we are near the end of the currently playing queue entry. */
        ImpossibleEndOfMediaPeriod = "impossible_end_of_media_period",

        /** Crowdfunded skipping is impossible because there is no currently playing queue entry. */
        ImpossibleNoMedia = "impossible_no_media",

        /** Crowdfunded skipping is unavailable for technical reasons. */
        ImpossibleUnavailable = "impossible_unavailable",

        /** The crowdfunded skipping feature is disabled (e.g. via {@link Crowdfunding.skippingEnabled}). */
        ImpossibleDisabled = "impossible_disabled",

        /** Crowdfunded skipping is impossible because we are at the beginning of the currently playing queue entry. */
        ImpossibleStartOfMediaPeriod = "impossible_start_of_media_period",
    }

    /** Represents the state of the crowdfunded skipping feature. */
    export type CrowdfundedSkippingState = `${CrowdfundedSkippingStateEnum}`;

    /** Status of the crowdfunded tipping feature */
    export interface CrowdfundedTippingStatus {
        /** Address of the crowdfunded tipping account. */
        address: string;

        /** Balance, in raw Banano units, of the crowdfunded tipping account. */
        balance: string;
    }

    /** A relation between event types and the arguments passed to the respective listeners */
    export interface CrowdfundingEventMap {
        /** This event is fired when the skipping or tipping statuses are updated. */
        "statusupdated": CrowdfundingStatusUpdatedEventArgs;

        /** This event is fired when a skip threshold reduction milestone is reached. */
        "skipthresholdreductionmilestonereached": CrowdfundingSkipThresholdReductionMilestoneReachedEventArgs;

        /** This event is fired when currently playing entry is skipped via crowdfunding. */
        "skipped": CrowdfundingSkippedEventArgs;

        /** This event is fired when a transaction is received in the crowdfunded skipping or tipping accounts. */
        "transactionreceived": CrowdfundingTransactionReceivedEventArgs;
    }

    /** Arguments to the 'statusupdated' crowdfunding event */
    export interface CrowdfundingStatusUpdatedEventArgs {
        /** Guaranteed to be `statusupdated`. */
        type: `statusupdated`;

        /** The current status of the crowdfunded skipping feature. */
        skipping: CrowdfundedSkippingStatus;

        /** The current status of the crowdfunded tipping feature. */
        tipping: CrowdfundedTippingStatus;
    }

    /** Arguments to the 'skipthresholdreductionmilestonereached' crowdfunding event */
    export interface CrowdfundingSkipThresholdReductionMilestoneReachedEventArgs {
        /** Guaranteed to be `skipthresholdreductionmilestonereached`. */
        type: `skipthresholdreductionmilestonereached`;

        /** Fraction of the original skip threshold that has been reached in this milestone. */
        ratioOfOriginal: number;
    }

    /** Arguments to the 'skipped' crowdfunding event */
    export interface CrowdfundingSkippedEventArgs {
        /** Guaranteed to be `skipped`. */
        type: `skipped`;

        /** Amount, in raw Banano units, that the community paid to skip the playing entry. */
        balance: string;
    }

    /** Arguments to the 'transactionreceived' crowdfunding event */
    export interface CrowdfundingTransactionReceivedEventArgs {
        /** Guaranteed to be `transactionreceived`. */
        type: `transactionreceived`;

        /** Block hash of the received transaction. */
        txHash: string;

        /** Address of the sender of the received transaction. */
        fromAddress: string;

        /** Amount, in raw Banano units, that was received in this transaction. */
        amount: string;

        /** Time at which this transaction was received. */
        receivedAt: Date;

        /** Whether this was a crowdfunded skipping or a crowdfunded tipping transaction. */
        txType: "skip" | "tip";

        /** Unique {@link QueueEntry.id} of the queue entry that was playing at the time of the transaction. */
        forMedia?: string;
    }

    /** Contains additional options for media enqueuing */
    export interface EnqueueOptions {
        /**
         * Whether the resulting queue entry may be skipped by the users.
         * If set to true, the queue entry may only be skipped if it is removed by JungleTV staff or by an application.
         */
        unskippable?: boolean;

        /**
         * Whether the resulting queue entry will hide its details before it begins playing.
         * If set to true, the title, thumbnail and other information about the queue entry will not be revealed to unprivileged users, until it begins playing.
         */
        concealed?: boolean;

        /**
         * The minimum reward, as a Banano raw amount string, that will be paid to active spectators by the time the resulting queue entry finishes playing.
         * This reward may be increased by the community while the queue entry is playing, via the crowdfunded tipping feature.
         * The specified amount is debited from the application's wallet. If the wallet has insufficient funds, enqueuing will fail.
         * By default, enqueued media entries do not have a base reward.
         * {@link Pricing.computeEnqueuePricing} can be used to compute a base reward amount that takes into account the current queue conditions.
         */
        baseReward?: Amount;
    }

    /** Contains additional options for application page enqueuing */
    export interface PageEnqueueOptions extends EnqueueOptions {
        /**
         * When present, will override the title of the resulting queue entry.
         * If not present, the title of the created queue entry will be the one passed to {@link "jungletv:pages".publishFile}.
         */
        title?: string;

        /**
         * The name of an application file which, when present, will override the thumbnail of the resulting queue entry.
         * The file must be set to public and have an image file type.
         * On the JungleTV clients, the image will be resized to fit the thumbnail area.
         * Still, developers should be mindful not to provide images with unnecessarily large resolutions.
         * If not present, a generic thumbnail will be used.
         */
        thumbnail?: string;
    }

    /** Contains additional options for fetching play history */
    export interface GetPlayHistoryOptions {
        /**
         * Filter results by inexact title match or exact performance ID match.
         * The inexact matching algorithm is implementation-specific - not documented and subject to change.
         * This field powers the "search" function in the user-facing Play History page.
         */
        filter?: string;

        /**
         * When set to true, results will be sorted in descending order instead of ascending order.
         */
        descending?: boolean;

        /**
         * When set to true, history results will include media that is presently disallowed on the service.
         */
        includeDisallowed?: boolean;

        /**
         * When set to true, history results will include the currently playing media.
         */
        includePlaying?: boolean;

        /**
         * When specified, will set a maximum number of results to return.
         */
        limit?: number;

        /**
         * When specified, will set a zero-based offset from the start of the results, to then return up to {@link limit} results.
         */
        offset?: number;
    }

    /** Represents an entry that is in the media queue. */
    export interface QueueEntry extends MediaPerformance {
        /** Whether the media information will only be visible to unprivileged users once this entry begins playing. */
        concealed: boolean;

        /** List of the addresses of the users who moved this queue entry. */
        movedBy: string[];

        /**
         * Remove this queue entry from the queue.
         * Equivalent to calling {@link removeEntry} with the {@link id} of this entry.
         * */
        remove: () => QueueEntry;

        /**
         * Moves this queue entry to an adjacent position without costing the application JP.
         * Equivalent to calling {@link moveEntry} with this entry's {@link id}.
         * @param direction Whether to move the queue entry closer to the currently playing entry ("up") or further away ("down").
         */
        move: (direction: "up" | "down") => void;

        /**
         * Equivalent to {@link move}, but will deduct from the application JP balance and fail if the application does not have sufficient JP.
         * Equivalent to calling {@link moveEntryWithCost} with this entry's {@link id}.
         * @param direction Whether to move the queue entry closer to the currently playing entry ("up") or further away ("down").
         */
        moveWithCost: (direction: "up" | "down") => void;
    }

    /** Represents one performance of a media on the service, which is or has been associated with a queue entry. */
    export interface MediaPerformance {
        /** Information about the media of this queue entry. */
        media: MediaInfo;

        /** Whether this queue entry has finished playing, in which case {@link playedFor} will not increase further. */
        played: boolean;

        /** Duration in milliseconds corresponding to how long this queue entry has played. */
        playedFor: number;

        /**
         * Moment at which this queue entry began playing.
         * May be undefined if this queue entry is yet to begin playing.
         */
        startedAt: Date | undefined;

        /** Whether this queue entry is currently playing. */
        playing: boolean;

        /**
         * The globally unique identifier of this queue entry.
         * Can be used to refer to this queue entry even after it is done playing.
         */
        id: string;

        /** String representing how much the requester of this entry spent to enqueue this entry, in raw Banano units. */
        requestCost: Amount;

        /**
         * Moment when this entry was added to the queue.
         * May be undefined for queue entries which played early in the history of JungleTV.
         */
        requestedAt: Date | undefined;

        /**
         * The user who added this entry to the queue.
         * May be `undefined` in the case of entries automatically enqueued by JungleTV or by staff.
         */
        requestedBy: User | undefined;

        /** Whether this queue entry may be skipped by unprivileged users or through community skipping. */
        unskippable: boolean;
    }

    /** Information about the media associated with a queue entry. */
    export interface MediaInfo {
        /** Length of the media in milliseconds - just the duration that is meant to play on the service. */
        length: number;

        /**
         * Offset from the start of the media, in milliseconds, at which playback should start.
         * For an underlying media with a total duration of 10 minutes and where the requester wishes to play from 5:00 to 7:00,
         * {@link offset} will be 300000 and {@link length} will be 120000.
         */
        offset: number;

        /** Title of the media. */
        title: string;

        /** Media provider-specific unique identifier for the underlying media. */
        id: string;

        /** Type (media provider) of the media. */
        type: "yt_video" | "sc_track" | "document" | "app_page";
    }

    /** Represents the desired placement of a queue entry when it is being enqueued. */
    export enum EnqueuePlacementEnum {
        /** Used when the newly added queue entry is to be placed at the end of the queue, or wherever the insert cursor is placed. */
        Later = "later",

        /** Used when the newly added queue entry is to be placed after the currently playing entry. */
        AfterCurrent = "aftercurrent",

        /** Used when the newly added queue entry should replace any currently playing entry, skipping it. */
        Now = "now",
    }

    /** Represents the desired placement of a queue entry when it is being enqueued. */
    export type EnqueuePlacement = `${EnqueuePlacementEnum}`;

    /** Represents the restriction in who is able to add entries to the queue. */
    export enum EnqueuingPermissionEnum {
        /** Everyone can add entries to the queue. */
        Enabled = "enabled",

        /** Only JungleTV staff, and users who staff have marked as VIP, can add entries to the queue. */
        EnabledStaffOnly = "enabled_staff_only",

        /** Only JungleTV staff, users who staff have marked as VIP, and users with knowledge of a password can add entries to the queue. */
        EnabledPasswordRequired = "enabled_password_required",

        /** Nobody can add entries to the queue. */
        Disabled = "disabled",
    }

    /** Represents the restriction in who is able to add entries to the queue. */
    export type EnqueuingPermission = `${EnqueuingPermissionEnum}`;
}

/** Allows for interaction with JungleTV user profiles. */
declare module "jungletv:profile" {
    /**
     * Gets the user information for an arbitrary user, including their nickname.
     * @param address The reward address of the user to fetch.
     * @returns A {@link User} object containing the information for the specified user.
     * Note that a {@link User} object will be returned for any valid Banano address, even those that have never signed in to the service.
     */
    export function getUser(address: string): User;

    /**
     * Gets the profile information for an arbitrary user.
     * @param address The reward address of the user whose profile should be fetched.
     * @returns A {@link UserProfile} object containing the biography and featured media of the user.
     * An empty profile object will be returned for valid Banano addreses that have never signed in to the service.
     */
    export function getProfile(address: string): Promise<UserProfile>;

    /**
     * Sets the featured media on the profile of an arbitrary user.
     * Note that this function will change the profile of any valid Banano address, even those that are yet to sign in to the service.
     * @param address The reward address of the user whose profile should be updated.
     * @param featuredMediaID The ID of the {@link "jungletv:queue".MediaPerformance} to set as the featured media, or `undefined` to clear the featured media.
     */
    export function setProfileFeaturedMedia(address: string, featuredMediaID: string | undefined): Promise<void>;

    /**
     * Sets the biography on the profile of an arbitrary user.
     * Note that this function will set the biography of any valid Banano address, even those that are yet to sign in to the service.
     * @param address The reward address of the user whose profile should be updated.
     * @param biography The new biography for the user, which can be up to 512 characters long. May be an empty string to clear the biography.
     */
    export function setProfileBiography(address: string, biography: string): Promise<void>;

    /**
     * Clears the biography and featured media on the profile of an arbitrary user.
     * @param address The reward address of the user whose profile should be cleared.
     */
    export function clearProfile(address: string): Promise<void>;

    /**
     * Sets the nickname of an arbitrary user, visible in messages sent by the user in chat as well as in leaderboards and other contexts.
     * The nickname is subject to similar restrictions as if it were set by the user.
     * It must be between 3 and 16 characters long, cannot look like a Banano address, and will be subject to sanitization before being defined.
     * Note that this function will set the nickname associated with any valid Banano address, even those that are yet to sign in to the service.
     * @param address The reward address of the user whose nickname should be updated.
     * @param nickname The new nickname for the user. When set to `null`, `undefined` or the empty string, the user will appear in chat using its rewards address.
     */
    export function setUserNickname(address: string, nickname: string | undefined): Promise<void>;

    /**
     * Fetches statistics about a user since a certain point in time.
     * @param address The reward address of the user to fetch statistics for.
     * @param since The start of the time range for which to fetch statistics.
     * @returns A {@link ProfileStatistics} object containing the user statistics since the specified point in time.
     */
    export function getStatistics(address: string, since: Date): Promise<ProfileStatistics>;

    /** Contains extra fields about the user profile that are not present in the {@link User} type. */
    export interface UserProfile {
        /**
         * The biography of the user, set by them or via the {@link setProfileBiography} method.
         * May be the empty string if the user has not set a biography.
         */
        biography: string;

        /**
         * ID of the {@link "jungletv:queue".MediaPerformance} that is featured on the user profile, set by them or via the {@link setProfileFeaturedMedia} method.
         * May be `undefined` if the profile does not have a featured media.
         */
        featuredMediaID?: string;
    }

    /** Contains statistics about the user, relative to a certain period in time. */
    export interface ProfileStatistics {
        /** The amount, in raw Banano units, spent by the user in requesting media entries which have started playing. */
        spentRequesting: Amount;

        /** The amount, in raw Banano units, spent by the user in crowdfunding transactions (skipping or tipping). */
        spentCrowdfunding: Amount;

        /** The sum, in raw Banano units, of {@link spentRequesting} and {@link spentCrowdfunding}. */
        spent: Amount;

        /** The amount, in raw Banano units, withdrawn by the user. */
        withdrawn: Amount;

        /** The number of media performances requested by the user, which have started playing. */
        mediaRequestCount: number;

        /** The total play duration, in milliseconds, of the {@link mediaRequestCount} media performances requested by the user. */
        mediaRequestPlayTime: number;
    }
}

/** Allows for interaction with the application's own Banano account. */
declare module "jungletv:wallet" {
    /**
     * Obtains the usable balance of the Banano account that is associated with this application.
     * This is a sum of all the received balance and all non-dust receivable balance.
     * @returns The raw Banano amount effectively usable by the application.
     */
    export function getBalance(): Promise<Amount>;

    /**
     * Sends a Banano amount from the account associated with this application.
     * @param address The destination address to which to send Banano.
     * @param amount The amount of Banano to send, in raw units, which will be debited from the balance of the application account.
     * @param representative An optional argument containing the representative address to use on the send block.
     * Can be used to include extra information as part of on-chain encoding schemes (e.g. Banano NFTs).
     * @returns The hash of the transaction send block.
     */
    export function send(address: string, amount: Amount, representative?: string): Promise<string>;

    /**
     * Launches a new payment flow, allowing the application to receive Banano until a specific amount is received or other condition is met.
     * This temporarily allocates a separate Banano account, into which users should send Banano, and issues events whenever it receives new non-dust transactions.
     * This allows for building payment flows similar to those used for media enqueuing by JungleTV.
     * @param timeout The duration, in milliseconds, for which to wait for a payment, after which the flow will close and any amount received will be sent to the application's {@link address}.
     * Must be no shorter than 30 seconds and no longer than 10 minutes.
     * @returns A {@link PaymentReceiver} that can be used to monitor and prematurely close the payment flow.
     */
    export function receivePayment(timeout: number): Promise<PaymentReceiver>;

    /**
     * Utility function that compares two raw Banano amounts.
     * @param first The first amount to compare.
     * @param second The second amount to compare.
     * @returns -1 if the first amount is less than the second, 1 if the first amount is greater than the second, and 0 if the amounts are equal.
     */
    export function compareAmounts(first: Amount, second: Amount): 1 | 0 | -1;

    /**
     * Utility function that converts a raw Banano amount into a string containing its decimal representation, using a dot as decimal separator.
     * For example, the raw amount "123000000000000000000000000000" will be converted to "1.23".
     * @param amount The amount to format.
     * @returns The formatted amount.
     */
    export function formatAmount(amount: Amount): string;

    /**
     * Utility function that converts a Banano amount, encoded as decimal with an optional dot as decimal separator (e.g. "123", "1.23"), to a raw amount.
     * For example, the formatted amount "1.23" will be converted to the raw amount "123000000000000000000000000000".
     * @param decimalAmount The amount to parse.
     * @returns The parsed raw amount.
     */
    export function parseAmount(decimalAmount: string): Amount;

    /**
     * Utility function that adds together multiple raw amounts.
     * @param amounts An arbitrary number of amounts to sum.
     * @returns The sum of the specified amounts.
     */
    export function addAmounts(...amounts: Amount[]): Amount;

    /**
     * Utility function that calculates the negative of a raw amount.
     * @param amount The raw amount to negate.
     * @returns The specified amount, with its sign flipped.
     */
    export function negateAmount(amount: Amount): Amount;

    /** Represents a payment flow that was initiated by {@link receivePayment}. */
    export interface PaymentReceiver {
        /**
         * Registers a function to be called whenever the specified event occurs.
         * Depending on the event, the function may be invoked with arguments containing information about the event.
         * Refer to the documentation about each event type for details.
         * @param eventType A case-sensitive string representing the event to listen for.
         * @param listener A function that will be called when an event of the specified type occurs.
         */
        addEventListener<K extends keyof PaymentReceiverEventMap>(eventType: K, listener: (this: unknown, args: PaymentReceiverEventMap[K]) => void): void;

        /**
         * Ceases calling a function previously registered with {@link addEventListener} whenever the specified event occurs.
         * @param eventType A case-sensitive string corresponding to the event type from which to unsubscribe.
         * @param listener The function previously passed to {@link addEventListener}, that should no longer be called whenever an event of the given {@param eventType} occurs.
         */
        removeEventListener<K extends keyof PaymentReceiverEventMap>(eventType: K, listener: (this: unknown, args: PaymentReceiverEventMap[K]) => void): void;

        /**
         * Prematurely closes the payment flow, sending any received amount to the application account.
         * @returns A promise that resolves when the funds have been sent to the application account.
         */
        close(): Promise<void>;

        /**
         * Read-only property containing the address of the Banano account into which payments for this flow should be sent.
         * After a payment flow is closed, this account should not be used to receive further funds.
         */
        address: string;

        /**
         * Read-only property representing the amount, in raw Banano units, received in this payment flow so far.
         * To monitor this amount, use {@link addEventListener} to attach a listener to the "paymentreceived" event.
         */
        balance: Amount;

        /**
         * Read-only property that indicates whether this payment flow has closed, either by being prematurely closed via {@link close}, or by reaching the timeout specified in the call to {@link receivePayment}.
         * After a payment flow is closed, its {@link address} should not be used to receive further funds.
         * To monitor this property, use {@link addEventListener} to attach a listener to the "closed" event.
         */
        closed: boolean;
    }

    /** A relation between event types and the arguments passed to the respective listeners */
    interface PaymentReceiverEventMap {
        /** This event is fired when a new transaction is received in a payment flow. */
        "paymentreceived": PaymentReceivedEventArgs;

        /** This event is fired when the payment flow stops being monitored, either because it was explicitly closed via {@link close} or because it reached the timeout specified in the call to {@link receivePayment}. */
        "closed": ClosedEventArgs;
    }

    /** Arguments to a payment receiver event */
    export interface PaymentReceiverEventArgs {
        type: keyof PaymentReceiverEventMap;
    }

    /** Arguments to the 'paymentreceived' event */
    export interface PaymentReceivedEventArgs extends PaymentReceiverEventArgs {
        /** Guaranteed to be `paymentreceived`. */
        type: "paymentreceived";

        /** The amount, in raw Banano units, that was received in this transaction. */
        amount: Amount;

        /** The Banano account address of the sender of the transaction. */
        from: string;

        /** The block hash of the sending transaction. */
        blockHash: string;

        /** The amount, in raw Banano units, that was received in this payment flow so far. */
        balance: Amount;
    }

    /** Arguments to the 'closed' event */
    export interface ClosedEventArgs extends PaymentReceiverEventArgs {
        /** Guaranteed to be `closed`. */
        type: "closed";
    }

    /**
     * Read-only property that corresponds to the address of the Banano account associated with this application.
     */
    export let address: string;
}

export type Amount = string;

/** The permission levels a user can have */
export enum PermissionLevelEnum {
    /** The user is not identified. When used to restrict accessibility of remote calls, the resulting method can be called by any user, even unauthenticated ones. */
    Unauthenticated = "unauthenticated",

    /** The user has regular access permissions. When used to restrict accessibility of remote calls, the resulting method can only be called by authenticated users (users registered to receive rewards). */
    User = "user",

    /** The user has administrator permisions. When used to restrict accessibility of remote calls, the method can only be called by JungleTV staff. */
    Admin = "admin",
}

/** The permission levels a user can have */
export type PermissionLevel = `${PermissionLevelEnum}`;

/** Represents a user or application within the JungleTV service. */
export interface User {
    /** Reward address of the user. */
    address: string;

    /** Application ID responsible for this user, may be undefined if this user is not controlled by an application. */
    applicationID: string | undefined;

    /** Whether the {@link address} is from a currency system that is not the one native to JungleTV. */
    isFromAlienChain: false;

    /** Nickname of the user, may be undefined if the user does not have a nickname set. */
    nickname: string | undefined;

    /** Permission level of the user, may not be accurate in all contexts: may report a lower permission level than that which the user is able to achieve in a different context. */
    permissionLevel: PermissionLevel;
}

/**
 * Represents the permission level of the current user as provided by the client-side appbridge script.
 */
type ClientSideUserPermissionLevel = "unauthenticated" | "user" | "appeditor" | "admin";

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
    resolveApplicationFileURL: (fileName: string) => Promise<string | undefined>;

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
    getUserPermissionLevel: () => Promise<ClientSideUserPermissionLevel>;

    /**
     * Shows a modal containing the profile of a user.
     * The modal may not be opened immediately if a modal is presently being displayed, but the promise is resolved regardless.
     * @param userAddress The reward address of the user.
     * @returns A promise that resolves as soon as the request to open the profile is acknowledged.
     */
    showUserProfile: (userAddress: string) => Promise<void>;
}