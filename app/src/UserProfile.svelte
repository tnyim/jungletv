<script lang="ts">
    import { DateTime } from "luxon";

    import { onDestroy, onMount } from "svelte";
    import { navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import Document from "./Document.svelte";
    import { UserRole, UserRoleMap, UserStatus, UserStatusMap } from "./proto/common_pb";
    import { PermissionLevel, PlayedMedia, UserProfileResponse } from "./proto/jungletv_pb";
    import { blockedUsers, darkMode, permissionLevel, rewardAddress } from "./stores";
    import AddressBox from "./uielements/AddressBox.svelte";
    import TabButton from "./uielements/TabButton.svelte";
    import UserModerationInfo from "./UserModerationInfo.svelte";
    import UserProfileFeaturedMediaSoundCloud from "./UserProfileFeaturedMediaSoundCloud.svelte";
    import UserProfileFeaturedMediaYouTube from "./UserProfileFeaturedMediaYouTube.svelte";
    import UserProfileInfo from "./UserProfileInfo.svelte";
    import UserRecentRequests from "./UserRecentRequests.svelte";
    import UserStats from "./UserStats.svelte";
    import { buildMonKeyURL, copyToClipboard, setNickname } from "./utils";

    export let userAddress: string;

    let selectedTab: "info" | "featuredMedia" | "recents" | "tip" | "stats" | "moderation" = "recents";

    let userProfile: UserProfileResponse;
    let nickname = "";
    let rolesList: Array<UserRoleMap[keyof UserRoleMap]> = [];
    let userStatus: UserStatusMap[keyof UserStatusMap];
    let recentRequests: Array<PlayedMedia> = [];
    let biography = "";
    let hasFeaturedMedia = false;

    let isSelf = false;

    let editedNickname = "";
    let nicknameEditingError = "";
    $: editedNickname = nickname;
    $: isSelf = userAddress == $rewardAddress;

    let nicknameInput: HTMLInputElement;

    onMount(async () => {
        await refreshProfile();

        if (hasFeaturedMedia) {
            selectedTab = "featuredMedia";
        } else if (biography != "" || isSelf) {
            selectedTab = "info";
        } else {
            selectedTab = "tip";
        }
    });

    onDestroy(async () => {
        if (isSelf) {
            await editNickname();
        }
    });

    async function refreshProfile() {
        userProfile = await apiClient.userProfile(userAddress);
        nickname = userProfile.getUser().hasNickname() ? userProfile.getUser().getNickname() : "";
        rolesList = userProfile.getUser().getRolesList();
        userStatus = userProfile.getUser().getStatus();
        recentRequests = userProfile.getRecentlyPlayedRequestsList();
        biography = userProfile.getBiography();
        hasFeaturedMedia =
            userProfile.getFeaturedMediaCase() != UserProfileResponse.FeaturedMediaCase.FEATURED_MEDIA_NOT_SET;
    }

    let copiedAddress = false;
    function copyAddress() {
        copiedAddress = true;
        copyToClipboard(userAddress);
    }

    function focusOnNicknameEditing() {
        nicknameInput.focus();
        nicknameInput.select();
    }

    async function editNickname(): Promise<boolean> {
        if (nickname == editedNickname) {
            // do not waste rate limiter tokens for nothing
            return true;
        }
        let [success, errMsg] = await setNickname(editedNickname);
        if (success) {
            nicknameEditingError = "";
            nickname = editedNickname;
        } else {
            nicknameEditingError = errMsg;
            editedNickname = nickname;
        }
        return success;
    }

    async function nicknameKeydown(e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
        if (e.key == "Enter") {
            await editNickname();
            e.currentTarget.blur();
        }
    }

    async function clearFeaturedMedia() {
        await apiClient.setProfileFeaturedMedia();
        await refreshProfile();
    }

    async function blockUser() {
        await apiClient.blockUser(userAddress);
        $blockedUsers = $blockedUsers.add(userAddress);
    }

    async function unblockUser() {
        await apiClient.unblockUser(undefined, userAddress);
        let bu = $blockedUsers;
        bu.delete(userAddress);
        $blockedUsers = bu;
    }

    function formatSubscriptionDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOpts().locale)
            .toLocal()
            .toLocaleString(DateTime.DATE_MED);
    }
</script>

<div class="flex flex-col justify-center bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-t-lg">
    <div class="flex flex-row p-2 pr-12 overflow-x-hidden">
        <div class="relative h-28">
            <img
                src={buildMonKeyURL(userAddress)}
                alt="&nbsp;"
                title="monKey for this user's address"
                class="h-28 w-28"
            />
            <div class="absolute bottom-1 right-1/4">
                {#if userStatus == UserStatus.USER_STATUS_OFFLINE}
                    <i class="fas fa-dot-circle text-gray-600 dark:text-gray-500" title="Disconnected" />
                {:else if userStatus == UserStatus.USER_STATUS_AWAY}
                    <i
                        class="fas fa-moon text-yellow-600 dark:text-yellow-500"
                        title="Connected but not actively watching"
                    />
                {:else if userStatus == UserStatus.USER_STATUS_WATCHING}
                    <i class="fas fa-play-circle text-green-600 dark:text-green-500" title="Actively watching" />
                {/if}
            </div>
        </div>
        <div class="flex-grow overflow-x-hidden pt-4">
            {#if nickname != "" || isSelf}
                {#if isSelf}
                    <div class="flex flex-row">
                        <i
                            title="Edit nickname"
                            class="fas fa-edit  text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 self-center mr-2 cursor-pointer"
                            on:click={focusOnNicknameEditing}
                        />
                        <input
                            bind:this={nicknameInput}
                            class="text-lg font-semibold bg-transparent flex-grow"
                            type="text"
                            placeholder="Set a nickname..."
                            maxlength="16"
                            bind:value={editedNickname}
                            on:blur={editNickname}
                            on:keydown={nicknameKeydown}
                        />
                    </div>
                    {#if nicknameEditingError != ""}
                        <div class="text-xs text-red-500">{nicknameEditingError}</div>
                    {/if}
                {:else}
                    <div class="font-semibold text-lg whitespace-nowrap">{nickname}</div>
                {/if}
            {/if}
            <span class="font-mono {nickname != '' ? 'text-base' : 'text-lg'}">
                {userAddress.substring(0, 14)}
            </span>
            <i
                class="fas fa-copy cursor-pointer text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500"
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
            {#if rolesList.includes(UserRole.VIP)}
                <br />
                <span class="text-sm">
                    <i class="fas fa-crown text-yellow-400 dark:text-yellow-600" title="" />
                    VIP
                </span>
            {/if}
            {#if rolesList.includes(UserRole.CURRENT_ENTRY_REQUESTER)}
                <br />
                <span class="text-sm">
                    <i class="fas fa-coins text-green-700 dark:text-green-500" title="" />
                    Requester of currently playing queue entry
                </span>
            {/if}
            {#if rolesList.includes(UserRole.TIER_1_REQUESTER)}
                <br />
                <span class="text-sm text-blue-600 dark:text-blue-400">Tier 1 media requester</span>
                <span class="text-xs">- between 1 and 4 queue entries recently played or currently enqueued</span>
            {:else if rolesList.includes(UserRole.TIER_2_REQUESTER)}
                <br />
                <span class="text-sm text-yellow-600 dark:text-yellow-200">Tier 2 media requester</span>
                <span class="text-xs">- between 5 and 9 queue entries recently played or currently enqueued</span>
            {:else if rolesList.includes(UserRole.TIER_3_REQUESTER)}
                <br />
                <span class="text-sm text-green-500 dark:text-green-300">Tier 3 media requester</span>
                <span class="text-xs">- 10 or more queue entries recently played or currently enqueued</span>
            {/if}
            {#if userProfile?.hasCurrentSubscription()}
                <br />
                <span class="text-sm">
                    <span
                        class="text-green-600 dark:text-green-400 font-semibold hover:underline cursor-pointer"
                        on:click={() => navigate("/points#nice")}>Nice</span
                    >
                    subscriber since
                    {formatSubscriptionDate(userProfile.getCurrentSubscription().getSubscribedAt().toDate())}
                </span>
            {/if}
        </div>
        {#if !isSelf && $rewardAddress != ""}
            {#if $blockedUsers.has(userAddress)}
                <div class="flex flex-col justify-center">
                    <button
                        type="button"
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
                        on:click={unblockUser}
                    >
                        Unblock
                    </button>
                </div>
            {:else}
                <div class="flex flex-col justify-center">
                    <button
                        class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:shadow ease-linear transition-all duration-150"
                        on:click={blockUser}
                    >
                        Block
                    </button>
                </div>
            {/if}
        {/if}
    </div>
</div>
<div class="flex flex-col justify-center bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-b-lg">
    <div class="flex flex-row px-2 py-0.5 overflow-x-auto disable-scrollbars">
        {#if hasFeaturedMedia}
            <TabButton
                bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                selected={selectedTab == "featuredMedia"}
                on:click={() => (selectedTab = "featuredMedia")}
            >
                Featured media
                {#if hasFeaturedMedia && isSelf}
                    <i
                        class="fas fa-trash cursor-pointer hover:text-yellow-700 dark:hover:text-yellow-500"
                        on:click|stopPropagation={clearFeaturedMedia}
                    />
                {/if}
            </TabButton>
        {/if}
        {#if biography != "" || isSelf}
            <TabButton
                bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                selected={selectedTab == "info"}
                on:click={() => (selectedTab = "info")}
            >
                User info
            </TabButton>
        {/if}
        <TabButton
            bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
            selected={selectedTab == "tip"}
            on:click={() => (selectedTab = "tip")}
        >
            Tip user
        </TabButton>
        {#if recentRequests.length > 0}
            <TabButton
                bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                selected={selectedTab == "recents"}
                on:click={() => (selectedTab = "recents")}
            >
                Last requests
            </TabButton>
        {/if}
        <TabButton
            bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
            selected={selectedTab == "stats"}
            on:click={() => (selectedTab = "stats")}
        >
            Stats
        </TabButton>
        {#if $permissionLevel == PermissionLevel.ADMIN}
            <TabButton
                bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                selected={selectedTab == "moderation"}
                on:click={() => (selectedTab = "moderation")}
            >
                Moderation
            </TabButton>
        {/if}
    </div>
    <div class="h-80 overflow-y-auto">
        {#if selectedTab == "featuredMedia"}
            {#if userProfile.getFeaturedMediaCase() == UserProfileResponse.FeaturedMediaCase.YOUTUBE_VIDEO_DATA}
                <UserProfileFeaturedMediaYouTube data={userProfile.getYoutubeVideoData()} />
            {:else if userProfile.getFeaturedMediaCase() == UserProfileResponse.FeaturedMediaCase.SOUNDCLOUD_TRACK_DATA}
                <UserProfileFeaturedMediaSoundCloud data={userProfile.getSoundcloudTrackData()} />
            {:else if userProfile.getFeaturedMediaCase() == UserProfileResponse.FeaturedMediaCase.DOCUMENT_DATA}
                <Document mode="player" documentID={userProfile.getDocumentData().getId()} />
            {/if}
        {:else if selectedTab == "info"}
            <div class="p-2 px-4">
                <UserProfileInfo bind:biography {isSelf} />
            </div>
        {:else if selectedTab == "recents"}
            <UserRecentRequests {recentRequests} {isSelf} on:featured={refreshProfile} />
        {:else if selectedTab == "tip"}
            <div class="flex flex-col p-2 px-4">
                <AddressBox
                    address={userAddress}
                    showQR={true}
                    showBananoVaultLink={true}
                    qrCodeBackground={$darkMode ? "#1F2937" : "#E5E7EB"}
                    qrCodeForeground={$darkMode ? "#FFFFFF" : "#000000"}
                />
            </div>
        {:else if selectedTab == "stats"}
            <div class="p-2 px-4">
                <UserStats {userAddress} userIsStaff={rolesList.includes(UserRole.MODERATOR)} />
            </div>
        {:else if selectedTab == "moderation"}
            <div class="p-2 px-4">
                <UserModerationInfo {userAddress} on:cleared={refreshProfile} />
            </div>
        {/if}
    </div>
</div>

<style>
    .disable-scrollbars {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE 10+ */
    }
</style>
