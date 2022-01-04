<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
</script>

<div
    class="flex justify-center min-h-screen
           bg-gray-100 dark:bg-gray-900 dark:text-gray-300"
>
    <div class="m-4 w-96 text-center flex flex-col align-center self-center">
        <img src="/assets/brand/logo.svg" alt="JungleTV" class="h-20 mb-4" />
        <p class="text-3xl"><i class="fas fa-wifi" /> <i class="fas fa-toggle-off" /></p>
        <p>
            You are offline. JungleTV requires an internet connection to work.<br />
            Connect to the internet and try again.
        </p>
        <div class="mt-6">
            <a
                href="."
                on:click={() => dispatch("retry")}
                class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md
            text-white dark:text-white bg-yellow-600 hover:bg-yellow-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow-lg
            ease-linear transition-all duration-150"
            >
                Try again
            </a>
        </div>
    </div>
</div>
