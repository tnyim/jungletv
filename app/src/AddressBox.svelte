<script lang="ts">
    import QrCode from "svelte-qrcode";
    import { apiClient } from "./api_client";

    export let address = "";
    export let allowQR = false;
    export let showQR = false;
    export let showBananoVaultLink = false;
    export let paymentAmount = "";
    export let isRepresentativeChange = false;
    export let qrCodeBackground = "";
    export let qrCodeForeground = "";

    let uri = "";
    let bananoVaultURI = "";

    $: {
        if (isRepresentativeChange) {
            uri = `bananorep:${address}`;
        } else {
            uri = `banano:${address}`;
            if (paymentAmount != "") {
                uri += "?amount=" + paymentAmount;
            }
            bananoVaultURI =
                "https://vault.banano.cc/send?to=" +
                address +
                (paymentAmount != "" ? "&amount=" + apiClient.formatBANPrice(paymentAmount) : "");
        }
    }

    async function copyAddress() {
        try {
            await navigator.clipboard.writeText(address);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    }

    function selectAddress(event) {
        var range = document.createRange();
        range.selectNode(event.target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }

    function openBananoVault() {
        window.open();
    }
</script>

<div class="flex justify-center">
    <div
        class="bg-white dark:bg-gray-950 focus:ring-yellow-500 focus:border-yellow-500 flex-shrink block shadow-sm rounded-md rounded-r-none sm:text-sm border border-gray-300 p-2 overflow-auto hide-scrollbar"
        on:click={selectAddress}
    >
        {address}
    </div>
    {#if allowQR}
        <button
            class="inline-flex items-center px-3 shadow-sm border border-l-0 border-gray-300 bg-gray-50 dark:bg-black hover:dark:bg-gray-950 text-gray-500 text-sm"
            on:click={() => {
                showQR = !showQR;
            }}
        >
            <i class="fas fa-qrcode" />
        </button>
    {/if}
    <a
        class="inline-flex items-center px-3 shadow-sm border border-l-0 border-gray-300 bg-gray-50 dark:bg-black hover:dark:bg-gray-950 text-gray-500 dark:text-gray-500 text-sm no-underline hover:no-underline"
        href={uri}
    >
        <i class="fas fa-external-link-square-alt" />
    </a>
    <button
        class="inline-flex items-center px-3 shadow-sm rounded-r-md border border-l-0 border-gray-300 bg-gray-50 dark:bg-black hover:dark:bg-gray-950 text-gray-500 text-sm"
        on:click={copyAddress}
        disabled={!navigator.clipboard}
    >
        <i class="fas fa-copy" />
    </button>
</div>
{#if showQR}
    <div class="mt-4 flex justify-center">
        {#key qrCodeBackground + qrCodeForeground}
            <QrCode
                value={"ban:" + address + (paymentAmount != "" ? "?amount=" + paymentAmount : "")}
                size="150"
                background={qrCodeBackground != "" ? qrCodeBackground : "#FFFFFF"}
                color={qrCodeForeground != "" ? qrCodeForeground : "#000000"}
            />
        {/key}
    </div>
{/if}
{#if showBananoVaultLink}
    <div class="mt-4 flex justify-center">
        <p>
            Send <a target="_blank" rel="noopener" href={bananoVaultURI}>from BananoVault</a> •
            <a href={uri}>from installed wallet</a>
        </p>
    </div>
{/if}

<style>
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
