<script lang="ts">
    import QrCode from "svelte-qrcode";
    import { UserRole, type User } from "../proto/common_pb";
    import { darkMode } from "../stores";
    import { buildMonKeyURL } from "../utils";

    export let extraClasses = "";
    export let user: User;

    $: rolesList = user?.getRolesList() ?? [];
    $: messageFromApplication = rolesList.includes(UserRole.APPLICATION) ?? false;
</script>

<div class="flex flex-row {extraClasses}" on:mouseenter>
    {#if messageFromApplication}
        <div class="flex justify-center h-20 w-20 text-5xl">
            <i class="self-center fas fa-robot text-gray-300 dark:text-gray-700" title="" />
        </div>
    {:else}
        <img
            src={buildMonKeyURL(user.getAddress())}
            alt="&nbsp;"
            title="monKey for this user's address"
            class="h-20 w-20"
        />
    {/if}
    <div class="grow overflow-x-hidden">
        {#if user.hasNickname()}
            <span class="font-semibold text-md whitespace-nowrap">{user.getNickname()}</span>
            <br />
        {/if}
        {#if !messageFromApplication}
            <span class="font-mono text-md">
                {user.getAddress().substring(0, 14)}
            </span>
        {/if}
        {#if rolesList.includes(UserRole.VIP) && rolesList.includes(UserRole.MODERATOR)}
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
            value={(user.getAddress().startsWith("nano_") ? "nano:" : "ban:") + user.getAddress()}
            size="80"
            padding="0"
            background={$darkMode ? "#000000" : "#e5e7eb"}
            color={$darkMode ? "#e5e7eb" : "#000000"}
        />
    {/if}
</div>
