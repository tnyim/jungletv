<script lang="ts">
    import { onMount } from "svelte";
    import AddressBox from "./AddressBox.svelte";
    import { apiClient } from "./api_client";
    import { PermissionLevel, UserRole, UserRoleMap } from "./proto/jungletv_pb";
    import SidebarTabButton from "./SidebarTabButton.svelte";
    import { darkMode, permissionLevel } from "./stores";
    import UserModerationInfo from "./UserModerationInfo.svelte";
    import UserStats from "./UserStats.svelte";
    import { copyToClipboard } from "./utils";

    export let userAddress: string;

    let selectedTab = "tip";
    let nickname = "";
    let rolesList: Array<UserRoleMap[keyof UserRoleMap]> = [];

    onMount(async () => {
        let userProfile = await apiClient.userProfile(userAddress);
        nickname = userProfile.getUser().hasNickname() ? userProfile.getUser().getNickname() : "";
        rolesList = userProfile.getUser().getRolesList();
    });

    let copiedAddress = false;
    function copyAddress() {
        copiedAddress = true;
        copyToClipboard(userAddress);
    }
</script>

<div class="flex flex-col justify-center bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-t-lg">
    <div class="flex flex-row p-2 pr-12 overflow-x-hidden max-w-full">
        <img
            src="https://monkey.banano.cc/api/v1/monkey/{userAddress}"
            alt="&nbsp;"
            title="monKey for this user's address"
            class="h-28"
        />
        <div class="flex-grow overflow-x-hidden pt-4">
            {#if nickname != ""}
                <span class="font-semibold text-lg whitespace-nowrap">{nickname}</span>
                <br />
            {/if}
            <span class="font-mono {nickname != '' ? 'text-base' : 'text-lg'}">
                {userAddress.substring(0, 14)}
            </span>
            <i
                class="fas fa-copy cursor-pointer hover:text-purple-700 hover:dark:text-purple-500"
                title="Copy address"
                on:click={copyAddress}
            />
            {#if copiedAddress}
                <i class="fas fa-check" />
            {/if}
            {#if rolesList.includes(UserRole.MODERATOR)}
                <br />
                <span class="text-sm">
                    <i class="fas fa-shield-alt text-purple-700 dark:text-purple-500" title="" />
                    Chat moderator
                </span>
            {/if}
            {#if rolesList.includes(UserRole.CURRENT_ENTRY_REQUESTER)}
                <br />
                <span class="text-sm">
                    <i class="fas fa-coins text-green-700 dark:text-green-500" title="" />
                    Requester of currently playing video
                </span>
            {/if}
            {#if rolesList.includes(UserRole.TIER_1_REQUESTER)}
                <br />
                <span class="text-sm text-blue-600 dark:text-blue-400">Tier 1 video requester</span>
            {:else if rolesList.includes(UserRole.TIER_2_REQUESTER)}
                <br />
                <span class="text-sm text-yellow-600 dark:text-yellow-200">Tier 2 video requester</span>
            {:else if rolesList.includes(UserRole.TIER_3_REQUESTER)}
                <br />
                <span class="text-sm text-green-500 dark:text-green-300">Tier 3 video requester</span>
            {/if}
        </div>
    </div>
</div>
<div class="flex flex-col justify-center bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-b-lg">
    <div class="flex flex-row px-2">
        <SidebarTabButton selected={selectedTab == "tip"} on:click={() => (selectedTab = "tip")}>
            Tip user
        </SidebarTabButton>
        <SidebarTabButton selected={selectedTab == "stats"} on:click={() => (selectedTab = "stats")}>
            Stats
        </SidebarTabButton>
        {#if $permissionLevel == PermissionLevel.ADMIN}
            <SidebarTabButton selected={selectedTab == "moderation"} on:click={() => (selectedTab = "moderation")}>
                Moderation
            </SidebarTabButton>
        {/if}
    </div>
    <div class="p-2 px-4 h-80 overflow-y-auto">
        {#if selectedTab == "tip"}
            <div class="flex flex-col">
                <AddressBox
                    address={userAddress}
                    showQR={true}
                    showBananoVaultLink={true}
                    qrCodeBackground={$darkMode ? "#1F2937" : "#E5E7EB"}
                    qrCodeForeground={$darkMode ? "#FFFFFF" : "#000000"}
                />
            </div>
        {:else if selectedTab == "stats"}
            <UserStats {userAddress} userIsStaff={rolesList.includes(UserRole.MODERATOR)} />
        {:else if selectedTab == "moderation"}
            <UserModerationInfo {userAddress} />
        {/if}
    </div>
</div>
