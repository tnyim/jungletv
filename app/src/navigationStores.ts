import { writable } from "svelte/store";
import type { ButtonColor } from "./utils";

export type NavigationDestination = {
    id: string;
    href: string | string[2];
    icon: string;
    label: string | string[2];
    color?: ButtonColor | "white";
    background?: string;
    highlighted: boolean;
};

export const navigationDestinations = writable([
    {
        id: "about",
        href: "/about",
        icon: "fas fa-info",
        label: "About",
        highlighted: false,
    },
    {
        id: "faq",
        href: "/faq",
        icon: "fas fa-question",
        label: "FAQ",
        highlighted: false,
    },
    {
        id: "guidelines",
        href: "/guidelines",
        icon: "fas fa-scroll",
        label: "Rules",
        highlighted: false,
    },
    {
        id: "playhistory",
        href: "/history",
        icon: "fas fa-history",
        label: "Play history",
        highlighted: false,
    },
    {
        id: "leaderboards",
        href: "/leaderboards",
        icon: "fas fa-trophy",
        label: "Leaderboards",
        color: "green",
        highlighted: false,
    },
    {
        id: "rewards",
        href: ["/rewards", "/rewards/address"],
        icon: "fas fa-coins",
        label: ["Rewards", "Earn rewards"],
        color: "purple",
        highlighted: false,
    },
    {
        id: "enqueue",
        href: "/enqueue",
        icon: "fas fa-plus",
        label: "Enqueue media",
        color: "white",
        background: "dark:bg-yellow-600 bg-yellow-400 hover:bg-yellow-500 dark:hover:bg-yellow-500 focus:bg-yellow-500 dark:focus:bg-yellow-500",
        highlighted: false,
    },
] as NavigationDestination[]);