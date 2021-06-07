<script>
    import QrCode from "svelte-qrcode";

    export let address = "";
    export let allowQR = false;
    export let showQR = false;
    export let qrAmount = "";
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
</script>

<div class="flex justify-center">
    <div
        class="bg-white focus:ring-yellow-500 focus:border-yellow-500 flex-shrink block shadow-sm rounded-md rounded-r-none sm:text-sm border border-gray-300 p-2 overflow-auto"
        on:click={selectAddress}
    >
        {address}
    </div>
    {#if allowQR}
        <button
            class="inline-flex items-center px-3 shadow-sm border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
            on:click={() => {showQR = !showQR}}
        >
            <i class="fas fa-qrcode" />
        </button>
    {/if}
    <button
        class="inline-flex items-center px-3 shadow-sm rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
        on:click={copyAddress}
        disabled={!navigator.clipboard}
    >
        <i class="fas fa-copy" />
    </button>
</div>
{#if showQR}
<div class="mt-4 flex justify-center">
    <QrCode value={"ban:" + address + (qrAmount != "" ? "?amount=" + qrAmount : "")} size="150" />
</div>
{/if}