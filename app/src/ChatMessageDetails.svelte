<script lang="ts">
    import { fade } from "svelte/transition";
    import QrCode from "svelte-qrcode";
    import { darkMode, permissionLevel } from "./stores";
    import { ChatMessage, PermissionLevel, UserRole } from "./proto/jungletv_pb";
    import { copyToClipboard } from "./utils";
    import { createEventDispatcher } from "svelte";

    export let msg: ChatMessage;
    let copied = false;

    const dispatch = createEventDispatcher();

    let isChatModerator = false;
    let topOffset = isChatModerator ? -208 : -168;
    $: topOffset = isChatModerator ? -208 : -168;
    permissionLevel.subscribe((level) => {
        isChatModerator = level == PermissionLevel.ADMIN;
    });

    function tipAuthor() {
        window.open("https://vault.banano.cc/send?to=" + msg.getUserMessage().getAuthor().getAddress());
    }

    function openExplorer() {
        window.open("https://www.yellowspyglass.com/account/" + msg.getUserMessage().getAuthor().getAddress());
    }

    async function copyAddress() {
        await copyToClipboard(msg.getUserMessage().getAuthor().getAddress());
        copied = true;
    }

    // this is a workaround
    // stuff like dark: and hover: doesn't work in the postcss @apply
    // https://github.com/tailwindlabs/tailwindcss/discussions/2917
    const commonButtonClasses =
        "text-purple-700 dark:text-purple-500 px-1.5 py-1 rounded hover:shadow-sm " +
        "hover:bg-gray-100 dark:hover:bg-gray-800 outline-none focus:outline-none " +
        "ease-linear transition-all duration-150 cursor-pointer";
</script>

<div class="absolute w-full max-w-md left-0" style="top: {topOffset}px" transition:fade|local={{ duration: 200 }}>
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
                    <span class="font-semibold text-md">{msg.getUserMessage().getAuthor().getNickname()}</span>
                    <br />
                {/if}
                <span class="font-mono text-md">
                    {msg.getUserMessage().getAuthor().getAddress().substr(0, 14)}
                </span>
                {#if msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.MODERATOR)}
                    <br />
                    <span class="text-sm">
                        <i class="fas fa-shield-alt text-purple-700 dark:text-purple-500" title="" />
                        Chat moderator
                    </span>
                {:else if msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.CURRENT_ENTRY_REQUESTER)}
                    <br />
                    <span class="text-sm">
                        <i class="fas fa-coins text-green-700 dark:text-green-500" title="" />
                        Video requester
                    </span>
                {:else if msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.TIER_1_REQUESTER)}
                    <br />
                    <span class="text-sm text-blue-600 dark:text-blue-400">Tier 1 video requester</span>
                {:else if msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.TIER_2_REQUESTER)}
                    <br />
                    <span class="text-sm text-yellow-600 dark:text-yellow-200">Tier 2 video requester</span>
                {:else if msg.getUserMessage().getAuthor().getRolesList().includes(UserRole.TIER_3_REQUESTER)}
                    <br />
                    <span class="text-sm text-green-500 dark:text-green-300">Tier 3 video requester</span>
                {/if}
            </div>
            <QrCode
                value={"ban:" + msg.getUserMessage().getAuthor().getAddress()}
                size="80"
                padding="0"
                background={$darkMode ? "#000000" : "#e5e7eb"}
                color={$darkMode ? "#e5e7eb" : "#000000"}
            />
        </div>
        <div class="grid grid-cols-6 gap-2 place-items-center px-2 pb-2">
            {#if isChatModerator}
                <div class="{commonButtonClasses} col-span-2" on:click={() => dispatch("delete")}>
                    <i class="fas fa-trash" /> Delete
                </div>
                <div class="{commonButtonClasses} col-span-2" on:click={() => dispatch("history")}>
                    <i class="fas fa-history" /> History
                </div>
                <div class="{commonButtonClasses} col-span-2" on:click={() => dispatch("changeNickname")}>
                    <i class="fas fa-edit" /> Nickname
                </div>
            {/if}
            <div
                class="{commonButtonClasses} {isChatModerator ? 'col-span-3 text-xs' : 'col-span-6'}"
                on:click={tipAuthor}
            >
                <i class="fas fa-heart" /> Tip in BananoVault
            </div>
            {#if isChatModerator}
                <div class="{commonButtonClasses} col-span-3" on:click={() => openExplorer()}>
                    <i class="fas fa-search-dollar" /> Explorer
                </div>
            {/if}
            <div class="{commonButtonClasses} col-span-3" on:click={() => dispatch("reply")}>
                <i class="fas fa-reply" /> Reply
            </div>
            <div class="{commonButtonClasses} col-span-3" on:click={copyAddress}>
                <i class="fas fa-copy" />
                {copied ? "Copied!" : "Copy address"}
            </div>
        </div>
    </div>
</div>
