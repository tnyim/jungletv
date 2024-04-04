<script lang="ts">
    import { DateTime } from "luxon";

    import { onDestroy, onMount } from "svelte";
    import watchMedia from "svelte-media";
    import { link, navigate } from "svelte-navigator";
    import ApplicationPage from "./ApplicationPage.svelte";
    import Document from "./Document.svelte";
    import UserModerationInfo from "./UserModerationInfo.svelte";
    import UserProfileFeaturedMediaSoundCloud from "./UserProfileFeaturedMediaSoundCloud.svelte";
    import UserProfileFeaturedMediaYouTube from "./UserProfileFeaturedMediaYouTube.svelte";
    import UserProfileInfo from "./UserProfileInfo.svelte";
    import UserProfileMaybeTransition from "./UserProfileMaybeTransition.svelte";
    import UserRecentRequests from "./UserRecentRequests.svelte";
    import UserStats from "./UserStats.svelte";
    import { apiClient } from "./api_client";
    import type { ProfileTab } from "./profile_utils";
    import { UserRole, UserStatus, type UserRoleMap, type UserStatusMap } from "./proto/common_pb";
    import { PermissionLevel, PlayedMedia, UserProfileResponse } from "./proto/jungletv_pb";
    import {
        blockedUsers,
        darkMode,
        mainContentBottomPadding,
        mainContentBottomPaddingAppliedByChild,
        permissionLevel,
        rewardAddress,
    } from "./stores";
    import AddressBox from "./uielements/AddressBox.svelte";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import TabButton from "./uielements/TabButton.svelte";
    import TabButtonBar from "./uielements/TabButtonBar.svelte";
    import { buildMonKeyURL, copyToClipboard, setNickname } from "./utils";

    export let userAddressOrApplicationID: string;
    export let mode: "page" | "modal" = "modal";

    const media = watchMedia({
        large: "(min-width: 1024px)",
    });

    let largeScreen = false;
    const mediaUnsubscribe = media.subscribe((obj: any) => {
        largeScreen = obj.large;
    });
    onDestroy(() => {
        mediaUnsubscribe();
    });

    let profileTabs: ProfileTab[] = [];
    export let selectedTab: string = undefined;

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
    $: isSelf = userAddressOrApplicationID == $rewardAddress;

    $: isApplication = rolesList.includes(UserRole.APPLICATION);

    // keep page URL updated as user switches tabs:
    $: if (mode == "page" && userAddressOrApplicationID && selectedTab)
        navigate("/profile" + "/" + userAddressOrApplicationID + "/" + selectedTab);

    let nicknameInput: HTMLInputElement;

    onMount(async () => {
        if (mode == "page") {
            $mainContentBottomPaddingAppliedByChild = true;
        }
        await refreshProfile();
    });

    onDestroy(async () => {
        if (isSelf) {
            await editNickname();
        }
        if (mode == "page") {
            $mainContentBottomPaddingAppliedByChild = false;
        }
    });

    async function refreshProfile() {
        userProfile = await apiClient.userProfile(userAddressOrApplicationID);
        nickname = userProfile.getUser().hasNickname() ? userProfile.getUser().getNickname() : "";
        rolesList = userProfile.getUser().getRolesList();
        userStatus = userProfile.getUser().getStatus();
        recentRequests = userProfile.getRecentlyPlayedRequestsList();
        biography = userProfile.getBiography();
        hasFeaturedMedia =
            userProfile.getFeaturedMediaCase() != UserProfileResponse.FeaturedMediaCase.FEATURED_MEDIA_NOT_SET;

        let tabs: ProfileTab[] = [];
        if (hasFeaturedMedia) {
            tabs.push({ id: "featuredmedia", tabTitle: "Featured media", isApplicationTab: false });
        }
        if (biography != "" || isSelf || isApplication) {
            tabs.push({
                id: "info",
                tabTitle: isApplication ? "Application info" : "User info",
                isApplicationTab: false,
            });
        }
        if (!isApplication) {
            tabs.push({ id: "tip", tabTitle: "Tip user", isApplicationTab: false });
            if (recentRequests.length > 0) {
                tabs.push({ id: "recents", tabTitle: "Last requests", isApplicationTab: false });
            }
            tabs.push({ id: "stats", tabTitle: "Stats", isApplicationTab: false });
            if ($permissionLevel == PermissionLevel.ADMIN) {
                tabs.push({ id: "moderation", tabTitle: "Moderation", isApplicationTab: false });
            }
        }
        for (const applicationTab of userProfile.getApplicationTabsList()) {
            const newTab: ProfileTab = {
                id: applicationTab.getTabId(),
                tabTitle: applicationTab.getTabTitle(),
                isApplicationTab: true,
                applicationID: applicationTab.getApplicationId(),
                pageID: applicationTab.getPageId(),
            };
            const relativeTabIndex = tabs.findIndex((t) => applicationTab.getBeforeTabId() === t.id);
            if (relativeTabIndex >= 0) {
                tabs.splice(relativeTabIndex, 0, newTab);
            } else {
                tabs.push(newTab);
            }
        }
        profileTabs = tabs;

        if (!selectedTab || !profileTabs.find((x) => x.id == selectedTab)) {
            if (hasFeaturedMedia) {
                selectedTab = "featuredmedia";
            } else if (biography != "" || isSelf || isApplication) {
                selectedTab = "info";
            } else {
                selectedTab = "tip";
            }
        }
    }

    let copiedAddress = false;
    function copyAddress() {
        copiedAddress = true;
        copyToClipboard(userProfile.getUser().getAddress());
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
        await apiClient.blockUser(userProfile.getUser().getAddress());
        $blockedUsers = $blockedUsers.add(userProfile.getUser().getAddress());
    }

    async function unblockUser() {
        await apiClient.unblockUser(undefined, userProfile.getUser().getAddress());
        let bu = $blockedUsers;
        bu.delete(userProfile.getUser().getAddress());
        $blockedUsers = bu;
    }

    function formatSubscriptionDate(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOptions().locale)
            .toLocal()
            .toLocaleString(DateTime.DATE_MED);
    }

    $: qrCodeBackground = $darkMode
        ? mode == "modal"
            ? "#1F2937"
            : "#111827"
        : mode == "modal"
          ? "#E5E7EB"
          : "#F3F4F6";
    $: qrCodeForeground = $darkMode ? "#FFFFFF" : "#000000";

    $: userAddressForTopDisplay =
        largeScreen && mode == "page" ? userAddressOrApplicationID : userAddressOrApplicationID.substring(0, 14);

    function setTabTitle(tabID: string, tabTitle: string) {
        profileTabs = profileTabs.map((tab) => {
            if (tab.id == tabID) {
                tab.tabTitle = tabTitle;
            }
            return tab;
        });
    }
</script>

<UserProfileMaybeTransition hasTransitionOut={mode == "modal"}>
    {@const appTab = userProfile ? profileTabs.find((x) => x.id == selectedTab && x.isApplicationTab) : undefined}
    <div
        class="flex flex-col justify-center bg-gray-300 dark:bg-gray-700 text-black dark:text-white
            {mode == 'modal' ? 'rounded-t-lg relative' : ''}"
    >
        <div class="flex flex-row p-2 pr-12 overflow-x-hidden">
            <div class="relative h-28">
                {#if isApplication}
                    <div class="flex justify-center h-28 w-28 text-6xl">
                        <i class="self-center fas fa-robot text-gray-700 dark:text-gray-400" title="" />
                    </div>
                    <div class="absolute bottom-2 right-4">
                        {#if userStatus == UserStatus.USER_STATUS_OFFLINE}
                            <i class="fas fa-stop text-gray-600 dark:text-gray-500" title="Not running" />
                        {:else if userStatus == UserStatus.USER_STATUS_WATCHING}
                            <i class="fas fa-play-circle text-green-600 dark:text-green-500" title="Running" />
                        {/if}
                    </div>
                {:else}
                    <img
                        src={buildMonKeyURL(userAddressOrApplicationID)}
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
                            <i
                                class="fas fa-play-circle text-green-600 dark:text-green-500"
                                title="Actively watching"
                            />
                        {/if}
                    </div>
                {/if}
            </div>
            <div class="grow overflow-x-hidden pt-4">
                {#if nickname != "" || isSelf}
                    {#if isSelf}
                        <div class="flex flex-row">
                            <button
                                type="button"
                                title="Edit nickname"
                                on:click={focusOnNicknameEditing}
                                class="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 self-center mr-2"
                            >
                                <i class="fas fa-edit" />
                            </button>
                            <input
                                bind:this={nicknameInput}
                                class="text-lg font-semibold bg-transparent grow"
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
                {#if !isApplication}
                    <span class="font-mono {nickname != '' ? 'text-base' : 'text-lg'}">
                        {userAddressForTopDisplay}
                    </span>
                    <button
                        type="button"
                        title="Copy address"
                        on:click={copyAddress}
                        class="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500"
                    >
                        <i class="fas fa-copy" />
                    </button>
                    {#if copiedAddress}
                        <i class="fas fa-check" />
                    {/if}
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
                {#if isApplication}
                    <br />
                    <span class="text-sm">
                        <i class="fas fa-robot text-red-700 dark:text-red-500" title="" />
                        Application
                    </span>
                {:else if rolesList.includes(UserRole.TIER_1_REQUESTER)}
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
                        <button
                            type="button"
                            class="text-green-600 dark:text-green-400 font-semibold hover:underline cursor-pointer"
                            on:click={() => navigate("/points#nice")}>Nice</button
                        >
                        subscriber since
                        {formatSubscriptionDate(userProfile.getCurrentSubscription().getSubscribedAt().toDate())}
                    </span>
                {/if}
            </div>
            {#if !isSelf && $rewardAddress && !isApplication}
                {#if $blockedUsers.has(userAddressOrApplicationID)}
                    <div class="flex flex-col justify-center">
                        <ButtonButton color="purple" on:click={unblockUser}>Unblock</ButtonButton>
                    </div>
                {:else}
                    <div class="flex flex-col justify-center">
                        <ButtonButton color="red" on:click={blockUser}>Block</ButtonButton>
                    </div>
                {/if}
            {/if}
            {#if mode == "modal"}
                <a
                    class="absolute bottom-0 right-0 w-10 h-10 z-50 text-xl text-center place-content-center
                        text-black bg-black bg-opacity-10 hover:bg-opacity-20 focus:bg-opacity-20
                        dark:text-white dark:bg-white dark:bg-opacity-10 dark:hover:bg-opacity-20 dark:focus:bg-opacity-20
                        ease-linear transition-all duration-150
                        rounded-tl-lg"
                    use:link
                    href="/profile/{isApplication
                        ? userProfile.getApplicationId()
                        : userAddressOrApplicationID}/{selectedTab}"
                    tabindex="0"
                >
                    <i class="fas fa-external-link-alt" />
                </a>
            {/if}
        </div>
    </div>
    <div
        class="flex flex-col justify-center
            {mode == 'modal' ? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-b-lg' : 'flex-grow'}"
    >
        <TabButtonBar extraClasses="px-2 my-0.5">
            {#each profileTabs as tab}
                <TabButton
                    bgClasses="hover:bg-gray-300 dark:hover:bg-gray-700"
                    selected={selectedTab == tab.id}
                    on:click={() => (selectedTab = tab.id)}
                >
                    {tab.tabTitle}
                    {#if tab.id == "featuredmedia" && isSelf}
                        <button
                            class="hover:text-yellow-700 dark:hover:text-yellow-500"
                            on:click|stopPropagation={clearFeaturedMedia}
                        >
                            <i class="fas fa-trash" />
                        </button>
                    {/if}
                </TabButton>
            {/each}
        </TabButtonBar>
        <div
            class="flex flex-col {mode == 'modal' ? 'h-80' : 'flex-grow basis-0'} overflow-y-auto {mode == 'page' &&
            !appTab
                ? $mainContentBottomPadding
                : ''}"
        >
            {#if userProfile && selectedTab == "featuredmedia"}
                {#if userProfile.getFeaturedMediaCase() == UserProfileResponse.FeaturedMediaCase.YOUTUBE_VIDEO_DATA}
                    <UserProfileFeaturedMediaYouTube data={userProfile.getYoutubeVideoData()} />
                {:else if userProfile.getFeaturedMediaCase() == UserProfileResponse.FeaturedMediaCase.SOUNDCLOUD_TRACK_DATA}
                    <UserProfileFeaturedMediaSoundCloud data={userProfile.getSoundcloudTrackData()} />
                {:else if userProfile.getFeaturedMediaCase() == UserProfileResponse.FeaturedMediaCase.DOCUMENT_DATA}
                    <Document mode="player" documentID={userProfile.getDocumentData().getId()} />
                {/if}
            {:else if userProfile && selectedTab == "info"}
                <div class="p-2 px-4">
                    <UserProfileInfo bind:biography {isSelf} {isApplication} limitHeight={mode == "modal"} />
                </div>
            {:else if userProfile && selectedTab == "recents"}
                <UserRecentRequests {recentRequests} {isSelf} on:featured={refreshProfile} />
            {:else if userProfile && selectedTab == "tip"}
                <div class="flex flex-col p-2 px-4">
                    <AddressBox
                        address={userProfile.getUser().getAddress()}
                        showQR={true}
                        showWebWalletLink={true}
                        {qrCodeBackground}
                        {qrCodeForeground}
                    />
                </div>
            {:else if userProfile && selectedTab == "stats"}
                <div class="p-2 px-4">
                    <UserStats
                        userAddress={userProfile.getUser().getAddress()}
                        userIsStaff={rolesList.includes(UserRole.MODERATOR)}
                    />
                </div>
            {:else if userProfile && selectedTab == "moderation"}
                <div class="p-2 px-4">
                    <UserModerationInfo userAddress={userProfile.getUser().getAddress()} on:cleared={refreshProfile} />
                </div>
            {:else if userProfile && appTab}
                <div class="h-full overflow-y-auto {mode == 'page' ? $mainContentBottomPadding : ''}">
                    <ApplicationPage
                        applicationID={appTab.applicationID}
                        pageID={appTab.pageID}
                        mode={mode == "page" ? "profilepage" : "profile"}
                        on:setTabTitle={(e) => setTabTitle(appTab.id, e.detail)}
                        on:pageUnpublished={refreshProfile}
                    />
                </div>
            {/if}
        </div>
    </div>
</UserProfileMaybeTransition>
