<script lang="ts">
    import { createEventDispatcher, onDestroy } from "svelte";
    import { apiClient } from "./api_client";
    import { enqueuingPassword, enqueuingPasswordEdition } from "./stores";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";

    const dispatch = createEventDispatcher();

    let enteredPassword = "";
    export let passwordIsNumeric;

    let failureReason: string = "";

    async function handleEnter(event: KeyboardEvent) {
        if (event.key === "Enter") {
            await handleSubmit();
            return false;
        }
        return true;
    }

    async function submit() {
        if (errorTimeout !== undefined) {
            clearTimeout(errorTimeout);
            errorTimeout = undefined;
        }

        try {
            let response = await apiClient.checkMediaEnqueuingPassword(enteredPassword);
            // if it's wrong, it throws an exception

            $enqueuingPassword = enteredPassword;
            $enqueuingPasswordEdition = response.getPasswordEdition();
            dispatch("passwordCorrect");
        } catch (e) {
            if (e.includes("incorrect password")) {
                failureReason = "Incorrect password";
            } else if (e.includes("rate limit reached")) {
                failureReason = "Too many incorrect password attempts. Wait some minutes before trying again";
            } else {
                failureReason = "An error occurred. If the problem persists, refresh the page and try again";
            }
        }
    }

    export let submitting = false;
    export async function handleSubmit() {
        if (submitting) {
            return;
        }
        submitting = true;
        await submit();
        submitting = false;
    }

    let errorTimeout: number;

    onDestroy(() => {
        if (errorTimeout !== undefined) {
            clearTimeout(errorTimeout);
            errorTimeout = undefined;
        }
    });
</script>

<p class="mb-4">
    Media enqueuing is currently available only to users who know a secret previously shared with them. Enter this
    secret to proceed.
</p>

<label for="enqueue_pw" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
    {passwordIsNumeric ? "PIN" : "Password"} for enqueuing
</label>
<div class="mt-1 flex rounded-md shadow-sm">
    {#if passwordIsNumeric}
        <input
            on:input={() => (failureReason = "")}
            on:keydown={handleEnter}
            type="password"
            inputmode="numeric"
            name="enqueue_pw"
            id="enqueue_pw"
            class="text-xl w-32 dark:bg-gray-950 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 block rounded-md border {failureReason !==
            ''
                ? 'border-red-600'
                : 'border-gray-300'} p-2"
            bind:value={enteredPassword}
        />
    {:else}
        <input
            on:input={() => (failureReason = "")}
            on:keydown={handleEnter}
            type="password"
            name="enqueue_pw"
            id="enqueue_pw"
            class="dark:bg-gray-950 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 flex-1 block w-full rounded-md text-sm border {failureReason !==
            ''
                ? 'border-red-600'
                : 'border-gray-300'} p-2"
            bind:value={enteredPassword}
        />
    {/if}
</div>
{#if failureReason !== ""}
    <div class="mt-3">
        <ErrorMessage>{failureReason}</ErrorMessage>
    </div>
{/if}
