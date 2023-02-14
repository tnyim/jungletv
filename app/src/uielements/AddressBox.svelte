<script lang="ts">
    import { onDestroy } from "svelte";

    import QrCode from "svelte-qrcode";
    import { apiClient } from "../api_client";

    export let address = "";
    export let allowQR = false;
    export let showQR = false;
    export let showBananoVaultLink = false;
    export let paymentAmount = "";
    export let isRepresentativeChange = false;
    export let qrCodeBackground = "";
    export let qrCodeForeground = "";

    let uri = "";
    let webWalletURI = "";
    let copySuccess = false;
    let copySuccessTimeout: number;

    let uriPrefix: string;
    let qrPrefix: string;
    let currency: "BAN" | "XNO";
    let webWalletName: string;
    let webWalletHost: string;
    $: if (address.startsWith("ban_")) {
        uriPrefix = "banano";
        qrPrefix = isRepresentativeChange ? "banrep" : "ban";
        currency = "BAN";
        webWalletName = "BananoVault";
        webWalletHost = "vault.banano.cc";
    } else if (address.startsWith("nano_")) {
        uriPrefix = "nano";
        qrPrefix = isRepresentativeChange ? "nanorep" : "nano";
        currency = "XNO";
        webWalletName = "Nault";
        webWalletHost = "nault.cc";
    }

    $: {
        if (isRepresentativeChange) {
            uri = `${uriPrefix}rep:${address}`;
        } else {
            uri = `${uriPrefix}:${address}`;
            if (paymentAmount != "") {
                uri += "?amount=" + paymentAmount;
            }
            webWalletURI =
                "https://" +
                webWalletHost +
                "/send?to=" +
                address +
                (paymentAmount != "" ? "&amount=" + apiClient.formatPrice(paymentAmount, currency) : "");
        }
    }

    async function copyAddress() {
        try {
            await navigator.clipboard.writeText(address);
            copySuccess = true;
            if (typeof copySuccessTimeout !== "undefined") {
                clearTimeout(copySuccessTimeout);
            }
            copySuccessTimeout = setTimeout(() => {
                copySuccess = false;
                copySuccessTimeout = undefined;
            }, 5000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    }
    onDestroy(() => {
        if (typeof copySuccessTimeout !== "undefined") {
            clearTimeout(copySuccessTimeout);
        }
    });

    function selectAddress(event) {
        var range = document.createRange();
        range.selectNode(event.target);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
</script>

<div class="flex justify-center">
    <div
        class="bg-white dark:bg-gray-950 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 flex-shrink block shadow-sm rounded-md rounded-r-none text-sm border border-gray-300 p-2 overflow-auto hide-scrollbar"
        on:click={selectAddress}
    >
        {address}
    </div>
    {#if allowQR}
        <button
            class="inline-flex items-center px-3 shadow-sm border border-l-0 border-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-950 text-gray-500 text-sm"
            on:click={() => {
                showQR = !showQR;
            }}
        >
            <i class="fas fa-qrcode" />
        </button>
    {/if}
    <a
        class="inline-flex items-center px-3 shadow-sm border border-l-0 border-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-950 text-gray-500 dark:text-gray-500 text-sm no-underline hover:no-underline"
        href={uri}
    >
        <i class="fas fa-external-link-square-alt" />
    </a>
    <button
        class="inline-flex items-center px-3 shadow-sm rounded-r-md border border-l-0 border-gray-300 {copySuccess
            ? 'bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800'
            : 'bg-gray-50 hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-950'} text-gray-500 text-sm"
        on:click={copyAddress}
        disabled={!navigator.clipboard}
    >
        <i class="fas {copySuccess ? 'fa-check' : 'fa-copy'}" />
    </button>
</div>
<slot />
{#if showQR}
    <div class="mt-4 flex justify-center">
        {#key qrCodeBackground + qrCodeForeground}
            <QrCode
                value={qrPrefix + ":" + address + (paymentAmount != "" ? "?amount=" + paymentAmount : "")}
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
            Send <a target="_blank" rel="noopener" href={webWalletURI}>from {webWalletName}</a> •
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
