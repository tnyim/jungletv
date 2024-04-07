<script lang="ts">
    import { DateTime } from "luxon";
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import { Moon } from "svelte-loading-spinners";
    import { link } from "svelte-navigator";
    import QrCode from "svelte-qrcode";
    import { apiClient } from "./api_client";
    import type { SignInMessageToSign } from "./proto/jungletv_pb";
    import { darkMode } from "./stores";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    import TabButton from "./uielements/TabButton.svelte";
    import Wizard from "./uielements/Wizard.svelte";
    import { copyToClipboard, hrefButtonStyleClasses } from "./utils";

    const dispatch = createEventDispatcher();

    export let messageToSign: SignInMessageToSign;
    export let rewardsAddress: string;

    let ticketTimeRemainingFormatted = "";
    let updateTicketTimeRemainingTimeout = 0;
    let usingSoftware: "thebananostand" | "qrcode" | "installed" | "other" = "thebananostand";
    let failureReason = "";
    let messageSignature = "";

    onMount(updateTicketTimeRemaining);

    onDestroy(() => {
        clearTimeout(updateTicketTimeRemainingTimeout);
    });

    function updateTicketTimeRemaining() {
        let endTime = DateTime.fromJSDate(messageToSign.getExpiration().toDate());
        ticketTimeRemainingFormatted = endTime.diff(DateTime.now()).toFormat("mm:ss");
        updateTicketTimeRemainingTimeout = setTimeout(updateTicketTimeRemaining, 1000);
    }

    function cancel() {
        dispatch("userCanceled");
    }

    $: signingURL = `https://thebananostand.com/sign-message#message=${encodeURIComponent(
        messageToSign.getMessage(),
    )}&url=${encodeURIComponent(messageToSign.getSubmissionUrl())}&address=${encodeURIComponent(rewardsAddress)}`;

    $: qrValue = `bansign:?message=${encodeURIComponent(messageToSign.getMessage())}&url=${encodeURIComponent(
        messageToSign.getSubmissionUrl(),
    )}&address=${encodeURIComponent(rewardsAddress)}`;

    async function handleEnter(event: KeyboardEvent) {
        if (event.key === "Enter") {
            await submit();
            return false;
        }
        return true;
    }

    async function submit() {
        try {
            await apiClient.verifySignInSignature(messageToSign.getProcessId(), messageSignature);
        } catch {
            failureReason = "Failed to verify signature.";
        }
    }

    function copy() {
        copyToClipboard(messageToSign.getMessage());
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Signing a message with your address proves your ownership of the address and your agreement to the
            <a href="/guidelines" use:link>JungleTV guidelines</a>. This is a free and safe operation that does not
            allow JungleTV to spend your funds or represent you or your address in any way.
        </p>
    </div>
    <div slot="main-content">
        <p>
            In order to prevent other users from stealing your rewards and impersonating you in chat, you must verify
            that you own this address.
            <br />
            To do so, please <strong>sign the message below</strong> using your address.
        </p>
        <div
            class="mt-2 font-mono dark:bg-gray-950 w-full rounded-md text-sm border border-gray-300 p-2 whitespace-pre-wrap"
        >
            {messageToSign.getMessage()}
        </div>

        <div class="flex flex-row flex-wrap justify-center mt-4">
            <div class="text-lg py-1 px-1.5">Sign with</div>
            <TabButton
                bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                selected={usingSoftware == "thebananostand"}
                on:click={() => {
                    usingSoftware = "thebananostand";
                }}
            >
                The Banano Stand
            </TabButton>
            <TabButton
                bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                selected={usingSoftware == "qrcode"}
                on:click={() => {
                    usingSoftware = "qrcode";
                }}
            >
                QR code
            </TabButton>
            <TabButton
                bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                selected={usingSoftware == "installed"}
                on:click={() => {
                    usingSoftware = "installed";
                }}
            >
                Installed software
            </TabButton>
            <TabButton
                bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                selected={usingSoftware == "other"}
                on:click={() => {
                    usingSoftware = "other";
                }}
            >
                Other
            </TabButton>
        </div>
        {#if usingSoftware == "thebananostand"}
            <div class="mt-2 flex flex-row justify-center">
                <a href={signingURL} target="_blank" rel="noopener" class={hrefButtonStyleClasses("green")}>
                    Sign message with The Banano Stand
                </a>
            </div>
        {:else if usingSoftware == "qrcode"}
            <div class="mt-2 flex flex-row justify-center">
                <QrCode
                    value={qrValue}
                    size="400"
                    background={$darkMode ? "#1F2937" : "#FFFFFF"}
                    color={$darkMode ? "#FFFFFF" : "#000000"}
                />
            </div>
        {:else if usingSoftware == "installed"}
            <div class="mt-2 flex flex-row justify-center">
                <a href={qrValue} target="_blank" rel="noopener" class={hrefButtonStyleClasses("green")}>
                    Sign message with installed software
                </a>
            </div>
            <div class="mt-2">
                Use the above link to sign the message with software installed on this device, that supports the
                <code>bansign</code> Banano message signing URI scheme.
            </div>
        {:else}
            <div class="mt-2">
                To use other software that does not support QR codes or the <code>bansign</code> URI scheme, but which
                supports Banano message signing nevertheless:
                <ul class="list-disc list-inside">
                    <li>
                        Copy the complete message displayed in the above box to the clipboard,<br />
                        <ButtonButton on:click={copy}>Copy message to clipboard</ButtonButton>
                    </li>
                    <li>Paste it on the signing tool,</li>
                    <li>Sign it with the address you specified previously,</li>
                    <li>And finally, paste the signature below, in hexadecimal format, and press Next:</li>
                </ul>
            </div>
            <label for="message_signature" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message signature
            </label>
            <div class="mt-1 flex rounded-md shadow-sm">
                <input
                    on:input={() => {
                        failureReason = "";
                    }}
                    on:keydown={handleEnter}
                    type="text"
                    name="message_signature"
                    id="message_signature"
                    class="font-mono dark:bg-gray-950 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500 flex-1 block w-full rounded-md text-sm border {failureReason !==
                    ''
                        ? 'border-red-600'
                        : 'border-gray-300'} p-2"
                    bind:value={messageSignature}
                />
            </div>
            {#if failureReason !== ""}
                <div class="mt-3">
                    <ErrorMessage>{failureReason}</ErrorMessage>
                </div>
            {/if}
        {/if}
        <p class="mt-4">
            If you run into problems, please ask for help in the
            <a href="https://chat.banano.cc" target="_blank" rel="noopener">Banano Discord</a>, where you can find a
            channel dedicated to JungleTV.
        </p>
        <p class="mt-2">
            This verification process will expire in <span class="font-bold">{ticketTimeRemainingFormatted}</span>.
        </p>
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <ButtonButton color="purple" on:click={cancel}>Cancel</ButtonButton>
        <div class="grow" />
        {#if usingSoftware != "other"}
            <ButtonButton disabled colorClasses="bg-gray-300">
                <span class="mr-1"><Moon size="20" color="#FFFFFF" unit="px" duration="2s" /></span>
                Awaiting message signature
            </ButtonButton>
        {:else}
            <ButtonButton type="submit" on:click={() => submit()}>Next</ButtonButton>
        {/if}
    </div>
</Wizard>
