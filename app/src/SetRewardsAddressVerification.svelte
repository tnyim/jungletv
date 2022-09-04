<script lang="ts">
    import { createEventDispatcher, onDestroy, onMount } from "svelte";
    import type { SignInProgress, SignInVerification } from "./proto/jungletv_pb";
    import { DateTime } from "luxon";
    import { Moon } from "svelte-loading-spinners";
    import AddressBox from "./AddressBox.svelte";
    import Wizard from "./Wizard.svelte";
    import { darkMode } from "./stores";

    const dispatch = createEventDispatcher();

    export let verification: SignInVerification;

    let ticketTimeRemainingFormatted = "";
    let updateTicketTimeRemainingTimeout = 0;

    onMount(updateTicketTimeRemaining);

    onDestroy(() => {
        clearTimeout(updateTicketTimeRemainingTimeout);
    });

    function updateTicketTimeRemaining() {
        let endTime = DateTime.fromJSDate(verification.getExpiration().toDate());
        ticketTimeRemainingFormatted = endTime.diff(DateTime.now()).toFormat("mm:ss");
        updateTicketTimeRemainingTimeout = setTimeout(updateTicketTimeRemaining, 1000);
    }

    function cancel() {
        dispatch("userCanceled");
    }

    function gbmRepChange() {
        (window as any).banano.request_rep_change(verification.getVerificationRepresentativeAddress());
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            We will provide better instructions for this step in the future. If you get stuck, please ask for help in
            the Banano Discord.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            For now, a few hints:<br />
            To do this in <strong>Kalium</strong>, start by selecting the right account, then open the side bar and
            select <strong>Change Representative</strong>.<br />
            To do this in <strong>BananoVault</strong>, choose <strong>Settings</strong> in the side bar and select
            <strong>Representatives</strong>.
        </p>
    </div>
    <div slot="main-content">
        <p>
            In order to prevent other users from stealing your rewards and impersonating you in chat, you must verify
            that you own this address.
            <br />
            To do so, please <strong>set the representative of your address</strong> to the address shown below.
        </p>
        <div class="mt-1 mb-4">
            <AddressBox
                address={verification.getVerificationRepresentativeAddress()}
                allowQR={false}
                showQR={true}
                isRepresentativeChange={true}
                qrCodeBackground={$darkMode ? "#1F2937" : "#FFFFFF"}
                qrCodeForeground={$darkMode ? "#FFFFFF" : "#000000"}
            />
        </div>
        <p class="mt-2">
            <strong
                >Setting your representative is a free operation that does not allow JungleTV - or anyone - to steal
                your Banano or do anything nefarious with your address.</strong
            > This is a temporary representative change that we will instruct you to undo immediately after verification
            is complete.
        </p>
        {#if (window as any).banano}
            <p class="mt-2">
                Click
                <a on:click={gbmRepChange}>here</a> to change rep with GoBanMe. To do this, make sure the address provided in the previous step is the same as the one on GoBanMe.
            </p>
        {/if}
        <p class="mt-2">
            If in doubt, please ask for help in the
            <a href="https://chat.banano.cc" target="_blank" rel="noopener">Banano Discord</a> (not affiliated with JungleTV).
        </p>
        <p class="mt-2">
            This verification process will expire in <span class="font-bold">{ticketTimeRemainingFormatted}</span>.
        </p>
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <button
            type="button"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
            on:click={cancel}
        >
            Cancel
        </button>
        <div class="flex-grow" />
        <button
            disabled
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-300 cursor-default"
        >
            <span class="mr-1"><Moon size="20" color="#FFFFFF" unit="px" duration="2s" /></span>
            Awaiting representative change
        </button>
    </div>
</Wizard>
