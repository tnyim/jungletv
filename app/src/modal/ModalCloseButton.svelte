<script lang="ts">
    // This property is used by svelte-simple-modal to pass down the close function
    export let onClose;
</script>

<button
    class="absolute top-0 right-0 w-10 h-10 z-50 text-xl text-center place-content-center
    text-black bg-black bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-20
    dark:text-white dark:bg-white dark:bg-opacity-10 dark:hover:bg-opacity-20 dark:focus:bg-opacity-20
    ease-linear transition-all duration-150
    rounded-tr rounded-bl-lg"
    on:click={onClose}
>
    <i class="fas fa-times" />
</button>
