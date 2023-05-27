<script lang="ts">
    import { useFocus } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import { PermissionLevel } from "./proto/jungletv_pb";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    const registerFocus = useFocus();

    export let processID: string;

    let promise = apiClient.authorizationProcessData(processID);
    let allowed = false;
    let denied = false;

    async function respond(consent: boolean) {
        await apiClient.consentOrDissentToAuthorization(processID, consent);
        if (consent) {
            allowed = true;
        } else {
            denied = true;
        }
    }
</script>

<div class="flex-grow w-full max-w-screen-sm">
    <div class="sm:m-4 md:m-6 shadow sm:rounded-md sm:overflow-hidden bg-white dark:bg-gray-800">
        <span use:registerFocus class="hidden" />
        <div class="px-4 py-5 sm:p-6">
            <h1 class="text-2xl mb-4">Authorize third-party or external system</h1>
            {#await promise}
                <p>Loading...</p>
            {:then processData}
                {#if allowed}
                    <p>
                        <span class="font-bold">{processData.getApplicationName()}</span> authorized to act on behalf of
                        your account. You may now close this window.
                    </p>
                {:else if denied}
                    <p>Authorization request denied. You may now close this window.</p>
                {:else}
                    <p>A third-party or external system that is reporting to be</p>
                    <p class="font-bold text-lg my-2 ml-5">{processData.getApplicationName()}</p>
                    <p>wants to perform actions on behalf of your JungleTV account</p>
                    <ul class="list-disc list-outside my-2 pl-5 font-semibold text-yellow-700 dark:text-yellow-600">
                        {#if processData.getDesiredPermissionLevel() == PermissionLevel.ADMIN}
                            <li>Perform moderation and administration actions</li>
                            <li>Edit and manage applications and their execution status</li>
                            <li>Perform all actions available to regular users</li>
                        {:else if processData.getDesiredPermissionLevel() == PermissionLevel.APPEDITOR}
                            <li>Edit and manage applications and their execution status</li>
                            <li>Perform all actions available to regular users</li>
                        {:else if processData.getDesiredPermissionLevel() == PermissionLevel.USER}
                            <li>Perform all actions available to regular users</li>
                        {/if}
                    </ul>
                    <p>with the following justification:</p>
                    <blockquote class="whitespace-pre-wrap my-2 ml-3 pl-2 border-l-4 border-gray-500 text-sm">
                        {processData.getReason()}
                    </blockquote>
                    <p class="mt-4">
                        If you have not initiated this request, or if it does not match your expectations, you should
                        deny it.
                    </p>
                {/if}
            {:catch e}
                <ErrorMessage>
                    {#if e.includes("permissions above the current")}
                        The third-party or external system is requesting more encompassing permissions than those of
                        your current account.
                    {:else}
                        Could not load authorization process. The process may be expired or complete.
                    {/if}
                </ErrorMessage>
            {/await}
        </div>
        {#await promise then}
            {#if !allowed && !denied}
                <div class="flex px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6">
                    <ButtonButton color="purple" on:click={() => respond(false)}>Deny</ButtonButton>
                    <div class="flex-grow" />
                    <ButtonButton on:click={() => respond(true)}>Authorize</ButtonButton>
                </div>
            {/if}
        {/await}
    </div>
</div>
