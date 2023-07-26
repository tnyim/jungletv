<script lang="ts">
    // This component is available for use in JAF application pages as <jungletv-button>
    import type { HTMLButtonAttributes } from "svelte/elements";
    import type { ButtonColor } from "../utils";
    export let type: HTMLButtonAttributes["type"] = "button"; // part of JAF API
    export let disabled: HTMLButtonAttributes["disabled"] = undefined; // part of JAF API
    export let color: ButtonColor = disabled ? "gray" : "yellow"; // part of JAF API
    export let baseClasses =
        "inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-lg";
    export let animationClasses = "ease-linear transition-all duration-150";
    export let extraClasses = ""; // part of JAF API
    export let colorClasses = "";
    export let textColorClasses = "text-white dark:text-white";

    export let innerButton: HTMLButtonElement = undefined;

    $: colorClassesInternal =
        colorClasses == "" ? `bg-${color}-600 hover:bg-${color}-700 focus:ring-${color}-500` : colorClasses;

    $: classList =
        `${baseClasses} ${textColorClasses} ${colorClassesInternal} ${animationClasses} ${extraClasses}`
            .split(" ")
            .filter((c) => !disabled || (!c.startsWith("hover:") && !c.startsWith("focus:")))
            .join(" ") + (disabled ? " cursor-default" : "");
</script>

<button {type} {disabled} class={classList} on:click bind:this={innerButton}>
    <slot />
</button>
