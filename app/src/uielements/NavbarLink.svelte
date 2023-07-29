<script lang="ts">
    import { link } from "svelte-navigator";
    import type { ButtonColor } from "../utils";

    export let iconClasses: string;
    export let label: string;
    export let href: string;
    export let color: ButtonColor | "white" = "gray";
    export let backgroundClasses = "hover:bg-gray-200 dark:hover:bg-gray-800 focus:bg-gray-200 dark:focus:bg-gray-800";

    let colorClasses = "";

    $: switch (color) {
        case "white":
            colorClasses = "text-white dark:text-white";
            break;
        case "gray":
            colorClasses = "text-gray-700 dark:text-gray-300";
            break;
        case "red":
            colorClasses = "text-red-600 dark:text-red-500";
            break;
        case "yellow":
            colorClasses = "text-yellow-600 dark:text-yellow-500";
            break;
        case "green":
            colorClasses = "text-green-600 dark:text-green-500";
            break;
        case "blue":
            colorClasses = "text-blue-600 dark:text-blue-500";
            break;
        case "indigo":
            colorClasses = "text-indigo-600 dark:text-indigo-500";
            break;
        case "purple":
            colorClasses = "text-purple-700 dark:text-purple-500";
            break;
        case "pink":
            colorClasses = "text-pink-600 dark:text-pink-500";
            break;
    }
</script>

<a
    class="p-1 lg:py-2 flex flex-col items-center rounded
        hover:shadow-lg focus:shadow-lg
        outline-none focus:outline-none hover:no-underline
        ease-linear transition-all duration-150
        {colorClasses} {backgroundClasses}"
    use:link
    {href}
>
    <i class={iconClasses} />
    <div class="text-xs font-bold uppercase">{label}</div>
</a>
