export const BRIDGE_VERSION = 1;
// methods the child can call on the parent
export type ParentMethods = {
    bridgeVersion: () => number;
    applicationID: () => string;
    serverRequest: (method: string, ...args: any[]) => any;
}

// events that the parent can trigger on the child
export type ParentEvents = {
    "mounted": MountEventArgs,
    "destroyed": void,
    "connected": void,
    "disconnected": void,
    "eventForClient": ApplicationEventArgs,
}

// methods the parent can call on the child
export type ChildMethods = {}

// events that the child can trigger on the parent
export type ChildEvents = {
    "handshook": void,
    "eventForServer": ApplicationEventArgs,
    "pageTitleUpdated": string,
}

export type MountEventArgs = {
    role: "standalone" | "activity",
    applicationID: string,
    applicationVersion: Date,
    pageID: string,
}

export type ApplicationEventArgs = {
    name: string,
    args: any[],
}
