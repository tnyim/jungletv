<script lang="ts">
    import { DoubleBounce } from "svelte-loading-spinners";
    import { link } from "svelte-navigator";
    import type { ButtonColor } from "../utils";

    export let iconClasses: string;
    export let label: string;
    export let href: string;
    export let color: ButtonColor = "gray";
    export let isHero = false;
    export let highlighted = false;

    let backgroundClasses = "";
    let colorClasses = "";

    $: {
        if (isHero) {
            colorClasses = "text-white dark:text-white";
            switch (color) {
                case "gray":
                    backgroundClasses =
                        "dark:bg-gray-600 bg-gray-400 hover:bg-gray-500 dark:hover:bg-gray-500 focus:bg-gray-500 dark:focus:bg-gray-500";
                    break;
                case "red":
                    backgroundClasses =
                        "dark:bg-red-600 bg-red-400 hover:bg-red-500 dark:hover:bg-red-500 focus:bg-red-500 dark:focus:bg-red-500";
                    break;
                case "yellow":
                    backgroundClasses =
                        "dark:bg-yellow-600 bg-yellow-400 hover:bg-yellow-500 dark:hover:bg-yellow-500 focus:bg-yellow-500 dark:focus:bg-yellow-500";
                    break;
                case "green":
                    backgroundClasses =
                        "dark:bg-green-600 bg-green-400 hover:bg-green-500 dark:hover:bg-green-500 focus:bg-green-500 dark:focus:bg-green-500";
                    break;
                case "blue":
                    backgroundClasses =
                        "dark:bg-blue-600 bg-blue-400 hover:bg-blue-500 dark:hover:bg-blue-500 focus:bg-blue-500 dark:focus:bg-blue-500";
                    break;
                case "indigo":
                    backgroundClasses =
                        "dark:bg-indigo-600 bg-indigo-400 hover:bg-indigo-500 dark:hover:bg-indigo-500 focus:bg-indigo-500 dark:focus:bg-indigo-500";
                    break;
                case "purple":
                    backgroundClasses =
                        "dark:bg-purple-600 bg-purple-400 hover:bg-purple-500 dark:hover:bg-purple-500 focus:bg-purple-500 dark:focus:bg-purple-500";
                    break;
                case "pink":
                    backgroundClasses =
                        "dark:bg-pink-600 bg-pink-400 hover:bg-pink-500 dark:hover:bg-pink-500 focus:bg-pink-500 dark:focus:bg-pink-500";
                    break;
            }
        } else {
            backgroundClasses = "hover:bg-gray-200 dark:hover:bg-gray-800 focus:bg-gray-200 dark:focus:bg-gray-800";
            switch (color) {
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
        }
    }
</script>

<a
    class="text-center p-1 lg:py-2 h-full flex flex-col items-center rounded
        hover:shadow-lg focus:shadow-lg
        outline-none focus:outline-none hover:no-underline
        ease-linear transition-all duration-150
        {colorClasses} {backgroundClasses} relative"
    use:link
    {href}
>
    <i class="px-1.5 {iconClasses}" />
    <div class="flex-grow flex items-center max-w-28 pt-0.5">
        <span class="text-xs font-bold uppercase line-clamp-2 overflow-ellipsis leading-none">{label}</span>
    </div>
    {#if highlighted}
        <div class="absolute top-0 right-0 m-1 pointer-events-none">
            <DoubleBounce size="14" color="#F59E0B" unit="px" duration="3s" />
        </div>
    {/if}
</a>
