<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { navigate } from "svelte-navigator";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    import Wizard from "./uielements/Wizard.svelte";

    const dispatch = createEventDispatcher();

    function tryAgain() {
        dispatch("tryAgain");
    }

    function cancel() {
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
        <ButtonButton color="purple" on:click={cancel}>Cancel</ButtonButton>
        <div class="flex-grow" />
        <ButtonButton type="submit" on:click={tryAgain}>Try again</ButtonButton>
    </div>
</Wizard>
