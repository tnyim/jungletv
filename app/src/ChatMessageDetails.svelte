<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import { openUserProfile } from "./profile_utils";
    import { UserRole } from "./proto/common_pb";
    import { ChatMessage, PermissionLevel } from "./proto/jungletv_pb";
    import { permissionLevel } from "./stores";
    import DetailsButton from "./uielements/DetailsButton.svelte";
    import UserBanner from "./uielements/UserBanner.svelte";
    import { copyToClipboard } from "./utils";

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
        <UserBanner
            user={msg.getUserMessage().getAuthor()}
            on:mouseenter={() => dispatch("mouseLeft")}
            extraClasses="px-2 pt-2 overflow-x-hidden max-w-full"
        />
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
