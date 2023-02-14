<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { navigate } from "svelte-navigator";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    import Wizard from "./uielements/Wizard.svelte";

    const dispatch = createEventDispatcher();

    function tryAgain() {
        dispatch("tryAgain");
    }

    function closeEnqueue() {
        navigate("/");
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">⏲💥😞</p>
    </div>
    <div slot="main-content">
        <ErrorMessage>Verification not completed in time. Please try again.</ErrorMessage>
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <button
            type="button"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
            on:click={closeEnqueue}
        >
            Cancel
        </button>
        <div class="flex-grow" />
        <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
            on:click={tryAgain}
        >
            Try again
        </button>
    </div>
</Wizard>
