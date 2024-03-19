import { writable } from "svelte/store";
import type { ButtonColor } from "./utils";

export type NavigationDestination = {
    builtIn: boolean;
    id: string;
    href: string | string[2];
    icon: string;
    label: string | string[2];
    color?: ButtonColor;
    highlighted: boolean;
};

export const navigationDestinations = writable([
    {
        builtIn: true,
        id: "enqueue",
        href: "/enqueue",
        icon: "fas fa-plus",
        label: "Enqueue media",
        color: "yellow",
        highlighted: false,
    },
    {
        builtIn: true,
        id: "rewards",
        href: ["/rewards", "/rewards/address"],
        icon: "fas fa-coins",
        label: ["Rewards", "Earn rewards"],
        color: "purple",
        highlighted: false,
    },
    {
        builtIn: true,
        id: "leaderboards",
        href: "/leaderboards",
        icon: "fas fa-trophy",
        label: "Leaderboards",
        color: "green",
        highlighted: false,
    },
    {
        builtIn: true,
        id: "about",
        href: "/about",
        icon: "fas fa-info",
        label: "About",
        highlighted: false,
    },
    {
        builtIn: true,
        id: "faq",
        href: "/faq",
        icon: "fas fa-question",
        label: "FAQ",
        highlighted: false,
    },
    {
        builtIn: true,
        id: "guidelines",
        href: "/guidelines",
        icon: "fas fa-scroll",
        label: "Rules",
        highlighted: false,
    },
    {
        builtIn: true,
        id: "playhistory",
        href: "/history",
        icon: "fas fa-history",
        label: "Play history",
        highlighted: false,
    },
] as NavigationDestination[]);

export const addNavigationDestination = function (destination: NavigationDestination, relativeToDestinationID?: string) {
    navigationDestinations.update((destinations) => {
        let relativeDestinationIndex = destinations.findIndex((t) => relativeToDestinationID === t.id);
        if (relativeDestinationIndex >= 0) {
            destinations.splice(relativeDestinationIndex, 0, destination);
        } else {
            destinations.push(destination);
        }
        return destinations;
    });
}

export const removeNavigationDestination = function (destinationID: string) {
    navigationDestinations.update((destinations) => {
        let index = destinations.findIndex((t) => destinationID == t.id);
        if (index >= 0) {
            destinations.splice(index, 1);
        }
        return destinations;
    });
}

export const setNavigationDestinationHighlighted = function (destinationID: string, highlighted = true) {
    navigationDestinations.update((destinations) => {
        let index = destinations.findIndex((t) => destinationID == t.id);
        if (index >= 0) {
            destinations[index].highlighted = highlighted;
        }
        return destinations;
    });
}

export const removeAllApplicationNavigationDestinations = function () {
    navigationDestinations.update((destinations) => {
        return destinations.filter(destination => destination.builtIn);
    });
}

export type NavbarToast = {
    id: number;
    content: string;
    duration: number;
    href?: string;
};

export const navbarToasts = writable([] as NavbarToast[]);

export const showNavbarToast = function (content: string, duration: number, href?: string) {
    navbarToasts.update((toasts) => [...toasts, {
        id: Math.random(),
        content,
        duration,
        href
    }]);
}