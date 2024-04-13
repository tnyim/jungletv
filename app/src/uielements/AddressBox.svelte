<script lang="ts">
    // This component is available for use in JAF application pages as <jungletv-payment-address>
    import { onDestroy } from "svelte";

    import QrCode from "svelte-qrcode";
    import { formatPrice } from "../currency_utils";

    export let address = ""; // part of JAF API
    export let allowQR = false; // part of JAF API
    export let showQR = false; // part of JAF API
    export let showWebWalletLink = false; // part of JAF API
    export let paymentAmount = ""; // part of JAF API
    export let isRepresentativeChange = false;
    export let qrCodeBackground = "";
    export let qrCodeForeground = "";

    let uri = "";
    let webWalletURL = "";
    let copySuccess = false;
    let copySuccessTimeout: number;

    let uriPrefix: string;
    let qrPrefix: string;
    let currency: "BAN" | "XNO";
    let webWalletName: string;

    $: {
        let webWalletSendURLBuilder: undefined | ((address: string, amount: string, curr: typeof currency) => string);
        let webWalletChangeURLBuilder: (rep: string) => string;

        if (address.startsWith("ban_")) {
            uriPrefix = "banano";
            qrPrefix = isRepresentativeChange ? "banrep" : "ban";
            currency = "BAN";
            webWalletName = "The Banano Stand";
            webWalletSendURLBuilder = (address, amount, currency) => {
                if (amount != "") {
                    const p = formatPrice(amount, currency);
                    return `https://thebananostand.com?request=send&address=${address}&amount=${p}`;
                }
                return `https://thebananostand.com?request=send&address=${address}`;
            };
            webWalletChangeURLBuilder = (rep) => {
                return `https://thebananostand.com?request=change&address=${rep}`;
            };
        } else if (address.startsWith("nano_")) {
            uriPrefix = "nano";
            qrPrefix = isRepresentativeChange ? "nanorep" : "nano";
            currency = "XNO";
            webWalletName = "Nault";
            webWalletSendURLBuilder = (address, amount, currency) => {
                if (amount != "") {
                    return `https://nault.cc/send?to=${address}&amount=${formatPrice(amount, currency)}`;
                }
                return `https://nault.cc/send?to=${address}`;
            };
            webWalletChangeURLBuilder = undefined;
        }

        if (isRepresentativeChange) {
            uri = `${uriPrefix}rep:${address}`;
            if (webWalletChangeURLBuilder) {
                webWalletURL = webWalletChangeURLBuilder(address);
            } else {
                webWalletURL = "";
            }
        } else {
            uri = `${uriPrefix}:${address}`;
            if (paymentAmount != "") {
                uri += "?amount=" + paymentAmount;
            }
            if (webWalletSendURLBuilder) {
                webWalletURL = webWalletSendURLBuilder(address, paymentAmount, currency);
            } else {
                webWalletURL = "";
            }
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
    <button
        type="button"
        class="cursor-text bg-white dark:bg-gray-950 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 shrink block shadow-sm rounded-md rounded-r-none text-sm border border-gray-300 p-2 overflow-auto hide-scrollbar"
        on:click={selectAddress}
    >
        {address}
    </button>
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
        target="_blank"
        rel="noopener"
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
{#if showWebWalletLink && webWalletURL && webWalletName}
    <div class="mt-4 flex justify-center">
        <p>
            {#if isRepresentativeChange}
                Set representative
                <a target="_blank" rel="noopener" href={webWalletURL}>using {webWalletName}</a> •
                <a target="_blank" href={uri} rel="noopener">using installed wallet</a>
            {:else}
                Send
                <a target="_blank" rel="noopener" href={webWalletURL}>from {webWalletName}</a> •
                <a target="_blank" href={uri} rel="noopener">from installed wallet</a>
            {/if}
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
