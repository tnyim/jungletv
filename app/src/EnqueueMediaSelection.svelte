<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Moon } from "svelte-loading-spinners";
    import { link } from "svelte-navigator";
    import EnqueueMediaSelectionForm from "./EnqueueMediaSelectionForm.svelte";
    import EnqueueMediaSelectionPasswordEntry from "./EnqueueMediaSelectionPasswordEntry.svelte";
    import { apiClient } from "./api_client";
    import { AllowedMediaEnqueuingType, MediaEnqueuingPermissionStatus } from "./proto/jungletv_pb";
    import { consumeStreamRPCFromSvelteComponent } from "./rpcUtils";
    import { darkMode, enqueuingPasswordEdition } from "./stores";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    import WarningMessage from "./uielements/WarningMessage.svelte";
    import Wizard from "./uielements/Wizard.svelte";
    import type { MediaSelectionKind } from "./utils";

    const dispatch = createEventDispatcher();

    let mediaKind: MediaSelectionKind = "video";
    let submitting = false;
    let handleSubmit: () => Promise<void>;

    function cancel() {
        dispatch("userCanceled");
    }

    let formStage: "loading" | "disabled" | "staff-only" | "password-entry" | "available" = "loading";
    let onlyBecauseStaff = false;
    let passwordIsNumeric = false;
    consumeStreamRPCFromSvelteComponent<MediaEnqueuingPermissionStatus>(
        20000,
        5000,
        apiClient.monitorMediaEnqueuingPermission.bind(apiClient),
        updateFormStage
    );

    function updateFormStage(status: MediaEnqueuingPermissionStatus) {
        onlyBecauseStaff = status.getHasElevatedPrivileges();
        if (status.getAllowedMediaEnqueuing() == AllowedMediaEnqueuingType.ENABLED) {
            formStage = "available";
            onlyBecauseStaff = false;
            return;
        }

        if (
            status.getAllowedMediaEnqueuing() == AllowedMediaEnqueuingType.STAFF_ONLY &&
            status.getHasElevatedPrivileges()
        ) {
            formStage = "available";
            return;
        }

        if (
            status.getAllowedMediaEnqueuing() == AllowedMediaEnqueuingType.PASSWORD_REQUIRED &&
            $enqueuingPasswordEdition === status.getPasswordEdition()
        ) {
            formStage = "available";
            onlyBecauseStaff = false;
            return;
        }

        if (
            status.getAllowedMediaEnqueuing() == AllowedMediaEnqueuingType.PASSWORD_REQUIRED &&
            status.getHasElevatedPrivileges()
        ) {
            formStage = "available";
            return;
        }

        if (status.getAllowedMediaEnqueuing() == AllowedMediaEnqueuingType.PASSWORD_REQUIRED) {
            passwordIsNumeric = status.getPasswordIsNumeric();
            formStage = "password-entry";
            return;
        }

        if (status.getAllowedMediaEnqueuing() == AllowedMediaEnqueuingType.STAFF_ONLY) {
            formStage = "staff-only";
            return;
        }

        formStage = "disabled";
        onlyBecauseStaff = false;
    }
    $: {
        if (formStage != "available" && formStage != "password-entry") {
            handleSubmit = undefined;
        }
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Enqueue media</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            You can add most YouTube videos and SoundCloud tracks to the JungleTV programming. Make sure to check the
            <a href="/guidelines" use:link>JungleTV guidelines for content</a> before enqueuing media.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            There is a minimum price to enqueue content, which depends on its length, the number of entries in queue,
            and the current JungleTV viewership.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Longer {mediaKind}s suffer an increasing price penalty.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            The amount you pay will be distributed among eligible spectators by the time your {mediaKind} ends. If none are
            around by then, you will be reimbursed.
        </p>
    </div>
    <div slot="main-content">
        {#if formStage == "loading"}
            <p><Moon size="28" color={$darkMode ? "#FFFFFF" : "#444444"} unit="px" duration="2s" /></p>
        {:else if formStage == "password-entry"}
            <EnqueueMediaSelectionPasswordEntry
                bind:handleSubmit
                {passwordIsNumeric}
                on:passwordCorrect={() => {
                    formStage = "available";
                }}
            />
        {:else if formStage == "available"}
            {#if onlyBecauseStaff}
                <div class="mb-4">
                    <WarningMessage>
                        You are able to enqueue media only because of your elevated privileges
                    </WarningMessage>
                </div>
            {/if}
            <EnqueueMediaSelectionForm on:mediaSelected bind:mediaKind bind:submitting bind:handleSubmit />
        {:else if formStage == "staff-only"}
            <ErrorMessage>At this moment, only JungleTV staff can enqueue media</ErrorMessage>
            <p class="mt-4">
                Media enqueuing may be restricted to JungleTV staff due to ongoing or upcoming maintenance, or an
                ongoing or upcoming special event. If you stay on this page, the media enqueuing form will become
                available as soon as you are allowed to enqueue.
            </p>
        {:else if formStage == "disabled"}
            <ErrorMessage>Media enqueuing is currently disabled due to upcoming maintenance</ErrorMessage>
            <p class="mt-4">
                If you stay on this page, the media enqueuing form will become available as soon as you are allowed to
                enqueue.
            </p>
        {/if}
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <ButtonButton color="purple" on:click={cancel}>Cancel</ButtonButton>
        <div class="flex-grow" />
        {#if submitting}
            <ButtonButton disabled colorClasses="bg-gray-300">
                <span class="mr-1"><Moon size="20" color="#FFFFFF" unit="px" duration="2s" /></span>
                Loading
            </ButtonButton>
        {:else if typeof handleSubmit !== "undefined"}
            <ButtonButton type="submit" on:click={handleSubmit}>Next</ButtonButton>
        {:else}
            <ButtonButton disabled colorClasses="bg-gray-300">Next</ButtonButton>
        {/if}
    </div>
    <div slot="extra_1">
        <slot name="raffle-info" />
    </div>
</Wizard>
