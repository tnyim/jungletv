<script lang="ts">
    // This component is available for use in JAF application pages as <jungletv-tab-button>
    export let selected = false; // part of JAF API
    export let bgClasses = "hover:bg-gray-200 dark:hover:bg-gray-800";
    export let extraClasses = ""; // part of JAF API
</script>

<!-- outer div needed for dark mode to work when used as a web component -->
<div>
    <button
        on:click
        on:dblclick
        on:mousedown
        class="block {extraClasses} {selected
            ? 'font-semibold'
            : 'text-purple-700 dark:text-purple-500'} focus-visible:ring-1 focus-visible:ring-purple-500 focus-visible:ring-inset text-lg px-1.5 py-1 rounded hover:shadow-lg {bgClasses} outline-none focus:outline-none ease-linear transition-all duration-150 whitespace-nowrap"
    >
        <slot />
    </button>
</div>
