<script lang="ts">
    import { navigate } from "svelte-navigator";
    import { modal } from "./stores";

    function accept() {
        modal.set(null);
        navigate("/points#nice");
    }
</script>

<div class="flex flex-col bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-t-lg p-4">
    <p>
        Subscribe to <span class="font-semibold text-green-600 dark:text-green-400">JungleTV Nice</span> to solve fewer captchas
        and enjoy a number of other exclusive perks!
    </p>
</div>
<div
    class="flex flex-row justify-center px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 text-black dark:text-gray-100 rounded-b-lg"
>
    <button
        type="button"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
        on:click={() => modal.set(null)}
    >
        Dismiss
    </button>
    <div class="flex-grow" />
    <button
        type="submit"
        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
        on:click={accept}
    >
        More information
    </button>
</div>
