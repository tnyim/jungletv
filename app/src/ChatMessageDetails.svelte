<script lang="ts">
    import { fade } from "svelte/transition";
    import QrCode from "svelte-qrcode";
    import { darkMode } from "./stores";
    import type { ChatMessage } from "./proto/jungletv_pb";
    import { copyToClipboard } from "./utils";
    import { createEventDispatcher } from "svelte";

    export let msg: ChatMessage;
    let copied = false;

    const dispatch = createEventDispatcher();

    function tipAuthor() {
        window.open("https://vault.banano.cc/send?to=" + msg.getUserMessage().getAuthor().getAddress());
    }

    async function copyAddress() {
        await copyToClipboard(msg.getUserMessage().getAuthor().getAddress());
        copied = true;
    }

    // this is a workaround
    // stuff like dark: and hover: doesn't work in the postcss @apply
    // https://github.com/tailwindlabs/tailwindcss/discussions/2917
    const commonButtonClasses = "text-purple-700 dark:text-purple-500 px-1.5 py-1 rounded hover:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 outline-none focus:outline-none ease-linear transition-all duration-150 cursor-pointer";
</script>

<div class="absolute w-full left-0" style="top: -168px" transition:fade|local={{ duration: 200 }}>
    <div class="bg-gray-200 dark:bg-black rounded flex flex-col shadow-md">
        <div class="flex flex-row px-2 pt-2" on:mouseenter={() => dispatch("mouseLeft")}>
            <img
                src="https://monkey.banano.cc/api/v1/monkey/{msg.getUserMessage().getAuthor().getAddress()}"
                alt="&nbsp;"
                title="monKey for this user's address"
                class="h-20"
            />
            <div class="flex-grow">
                {#if msg.getUserMessage().getAuthor().hasNickname()}
                    <span class="text-l">{msg.getUserMessage().getAuthor().getNickname()}</span>
                    <br />
                {/if}
                <span class="font-mono text-m">
                    {msg.getUserMessage().getAuthor().getAddress().substr(0, 14)}
                </span>
            </div>
            <QrCode
                value={"ban:" + msg.getUserMessage().getAuthor().getAddress()}
                size="80"
                padding="0"
                background={$darkMode ? "#000000" : "#e5e7eb"}
                color={$darkMode ? "#e5e7eb" : "#000000"}
            />
        </div>
        <div class="grid grid-cols-2 gap-2 place-items-center px-2 pb-2">
            <div class="{commonButtonClasses} col-span-2" on:click={tipAuthor}>
                <i class="fas fa-heart" /> Tip in BananoVault
            </div>
            <div
                class="{commonButtonClasses}"
                on:click={copyAddress}
            >
                <i class="fas fa-copy" /> {copied ? 'Copied!' : 'Copy address'}
            </div>
            <div class="{commonButtonClasses}" on:click={() => dispatch("reply")}>
                <i class="fas fa-reply" /> Reply
            </div>
        </div>
    </div>
</div>