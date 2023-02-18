<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { hrefButtonStyleClasses } from "./utils";

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
            <a href="." on:click={() => dispatch("retry")} class={hrefButtonStyleClasses()}>Try again</a>
        </div>
    </div>
</div>
