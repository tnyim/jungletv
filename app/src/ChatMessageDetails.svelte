<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import QrCode from "svelte-qrcode";
    import { fade } from "svelte/transition";
    import { openUserProfile } from "./profile_utils";
    import { UserRole } from "./proto/common_pb";
    import { ChatMessage, PermissionLevel } from "./proto/jungletv_pb";
    import { darkMode, permissionLevel } from "./stores";
    import DetailsButton from "./uielements/DetailsButton.svelte";
    import { buildMonKeyURL, copyToClipboard } from "./utils";

    export let msg: ChatMessage;
    export let allowReplies: boolean;
    let copied = false;

    const dispatch = createEventDispatcher();

    let isChatModerator = false;
    $: isChatModerator = $permissionLevel == PermissionLevel.ADMIN;

    let clientHeight = 168;

    $: rolesList = msg?.getUserMessage()?.getAuthor()?.getRolesList() ?? [];
    $: messageFromApplication = rolesList.includes(UserRole.APPLICATION) ?? false;

    function openProfile() {
        openUserProfile(msg.getUserMessage().getAuthor().getAddress());
    }

    function openExplorer() {
        window.open(
            "https://creeper.banano.cc/account/" + msg.getUserMessage().getAuthor().getAddress(),
            "",
            "noopener"
        );
    }

    async function copyAddress() {
        await copyToClipboard(msg.getUserMessage().getAuthor().getAddress());
        copied = true;
    }

    function keyDown(ev: KeyboardEvent) {
        if (ev.key == "Escape") {
            dispatch("mouseLeft");
        }
    }
</script>

<div
    class="absolute w-full max-w-md left-0"
    style="top: {-clientHeight}px"
    transition:fade|local={{ duration: 200 }}
    on:keydown={keyDown}
    bind:clientHeight
>
    <div class="bg-gray-200 dark:bg-black rounded flex flex-col shadow-md">
        <div class="flex flex-row px-2 pt-2 overflow-x-hidden max-w-full" on:mouseenter={() => dispatch("mouseLeft")}>
            {#if messageFromApplication}
                <div class="flex justify-center h-20 w-20 text-5xl">
                    <i class="self-center fas fa-robot text-gray-300 dark:text-gray-700" title="" />
                </div>
            {:else}
                <img
                    src={buildMonKeyURL(msg.getUserMessage().getAuthor().getAddress())}
                    alt="&nbsp;"
                    title="monKey for this user's address"
                    class="h-20 w-20"
                />
            {/if}
            <div class="grow overflow-x-hidden">
                {#if msg.getUserMessage().getAuthor().hasNickname()}
                    <span class="font-semibold text-md whitespace-nowrap"
                        >{msg.getUserMessage().getAuthor().getNickname()}</span
                    >
                    <br />
                {/if}
                {#if !messageFromApplication}
                    <span class="font-mono text-md">
                        {msg.getUserMessage().getAuthor().getAddress().substr(0, 14)}
                    </span>
                {/if}
                {#if rolesList.includes(UserRole.VIP) && msg
                        .getUserMessage()
                        .getAuthor()
                        .getRolesList()
                        .includes(UserRole.MODERATOR)}
                    <br />
                    <span class="text-sm">
                        <i class="fas fa-shield-alt text-yellow-400 dark:text-yellow-600" title="" />
                        VIP chat moderator
                    </span>
                {:else if rolesList.includes(UserRole.VIP)}
                    <br />
                    <span class="text-sm">
                        <i class="fas fa-crown text-yellow-400 dark:text-yellow-600" title="" />
                        VIP
                    </span>
                {:else if rolesList.includes(UserRole.MODERATOR)}
                    <br />
                    <span class="text-sm">
                        <i class="fas fa-shield-alt text-purple-700 dark:text-purple-500" title="" />
                        Chat moderator
                    </span>
                {:else if messageFromApplication}
                    <br />
                    <span class="text-sm">
                        <i class="fas fa-robot text-red-700 dark:text-red-500" title="" />
                        Application
                    </span>
                {:else if rolesList.includes(UserRole.CURRENT_ENTRY_REQUESTER)}
                    <br />
                    <span class="text-sm">
                        <i class="fas fa-coins text-green-700 dark:text-green-500" title="" />
                        Media requester
                    </span>
                {:else if rolesList.includes(UserRole.TIER_1_REQUESTER)}
                    <br />
                    <span class="text-sm text-blue-600 dark:text-blue-400">Tier 1 media requester</span>
                {:else if rolesList.includes(UserRole.TIER_2_REQUESTER)}
                    <br />
                    <span class="text-sm text-yellow-600 dark:text-yellow-200">Tier 2 media requester</span>
                {:else if rolesList.includes(UserRole.TIER_3_REQUESTER)}
                    <br />
                    <span class="text-sm text-green-500 dark:text-green-300">Tier 3 media requester</span>
                {/if}
            </div>
            {#if !messageFromApplication}
                <QrCode
                    value={"ban:" + msg.getUserMessage().getAuthor().getAddress()}
                    size="80"
                    padding="0"
                    background={$darkMode ? "#000000" : "#e5e7eb"}
                    color={$darkMode ? "#e5e7eb" : "#000000"}
                />
            {/if}
        </div>
        <div class="grid grid-cols-6 gap-2 place-items-center px-2 pb-2">
            {#if isChatModerator}
                <DetailsButton
                    extraClasses="col-span-2"
                    iconClasses="fas fa-trash"
                    label="Delete"
                    on:click={() => dispatch("delete")}
                />
                <DetailsButton
                    extraClasses="col-span-2"
                    iconClasses="fas fa-history"
                    label="History"
                    on:click={() => dispatch("history")}
                />
                <DetailsButton
                    extraClasses="col-span-2"
                    iconClasses="fas fa-edit"
                    label="Nickname"
                    on:click={() => dispatch("changeNickname")}
                />
            {/if}
            {#if !messageFromApplication}
                <DetailsButton
                    extraClasses={isChatModerator ? "col-span-3" : "col-span-6"}
                    iconClasses="fas fa-id-card"
                    label="Profile"
                    on:click={openProfile}
                />
            {/if}
            {#if isChatModerator}
                <DetailsButton
                    extraClasses="col-span-3"
                    iconClasses="fas fa-search-dollar"
                    label="Explorer"
                    on:click={openExplorer}
                />
            {/if}
            {#if allowReplies}
                <DetailsButton
                    extraClasses="col-span-3"
                    iconClasses="fas fa-reply"
                    label="Reply"
                    on:click={() => dispatch("reply")}
                />
            {/if}
            {#if !messageFromApplication}
                <DetailsButton
                    extraClasses={allowReplies ? "col-span-3" : "col-span-6"}
                    iconClasses="fas fa-copy"
                    label={copied ? "Copied!" : "Copy address"}
                    on:click={copyAddress}
                />
            {/if}
        </div>
    </div>
</div>
