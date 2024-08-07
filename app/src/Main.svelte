<script lang="ts">
	import { BroadcastChannel } from "broadcast-channel";
	import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
	import { DateTime } from "luxon";
	import { afterUpdate, onDestroy, onMount } from "svelte";
	import { Route, Router, globalHistory, navigate } from "svelte-navigator";
	import Modal from "svelte-simple-modal";
	import About from "./About.svelte";
	import ApplicationPage from "./ApplicationPage.svelte";
	import Authorize from "./Authorize.svelte";
	import Document from "./Document.svelte";
	import Enqueue from "./Enqueue.svelte";
	import Homepage from "./Homepage.svelte";
	import Leaderboards from "./Leaderboards.svelte";
	import Moderate from "./Moderate.svelte";
	import Navbar from "./Navbar.svelte";
	import NoConnection from "./NoConnection.svelte";
	import NotFound from "./NotFound.svelte";
	import PlayedMediaHistory from "./PlayedMediaHistory.svelte";
	import PlayerContainer from "./PlayerContainer.svelte";
	import Points from "./Points.svelte";
	import PointsFromBanano from "./PointsFromBanano.svelte";
	import Rewards from "./Rewards.svelte";
	import SetRewardsAddress from "./SetRewardsAddress.svelte";
	import UserProfile from "./UserProfile.svelte";
	import UserProfilePage from "./UserProfilePage.svelte";
	import { apiClient } from "./api_client";
	import {
		applicationName,
		faviconURL,
		processStateFromOtherTab,
		produceConfigurableState,
		setApplicationPageComponent,
		type ConfigurableState,
	} from "./configurationStores";
	import { defaultTabs } from "./defaultTabs";
	import { closeModal, modalSetContext, onModalClosed } from "./modal/modal";
	import { addNavigationDestination, removeNavigationDestination } from "./navigationStores";
	import { pageTitleApplicationPage, pageTitleMedia, pageTitlePopoutTab } from "./pageTitleStores";
	import { setUserProfileComponent } from "./profile_utils";
	import { PermissionLevel } from "./proto/jungletv_pb";
	import {
		autoCloseBrackets,
		autoCloseMediaPickerOnInsert,
		autoCloseMediaPickerOnSend,
		badRepresentative,
		collapseGifs,
		convertEmoticons,
		currentPopoutTabID,
		currentSubscription,
		darkMode,
		featureFlags,
		mainContentBottomPadding,
		mainContentBottomPaddingAppliedByChild,
		permissionLevel,
		playerVolume,
		rewardAddress,
		rewardBalance,
		unreadChatMention,
	} from "./stores";
	import { sidebarTabs, type SidebarTab } from "./tabStores";
	import { formatMarkdownTimestamp, ttsAudioAlert } from "./utils";

	export let url = "";

	// these are being set here to avoid a circular dependency involving tabStores
	$sidebarTabs = defaultTabs;

	// another dirty hack to quickly break a cyclic dependency
	setApplicationPageComponent(ApplicationPage);
	setUserProfileComponent(UserProfile);

	// the purpose of this div is to be our <body> inside the shadow DOM so we can apply the dark mode class
	let rootInsideShadowRoot: HTMLElement;

	apiClient.setAuthNeededCallback(() => {
		//navigate("/auth/login");
	});

	$: localStorage.darkMode = $darkMode;
	$: localStorage.collapseGifs = $collapseGifs;
	$: localStorage.convertEmoticons = $convertEmoticons;
	$: localStorage.autoCloseBrackets = $autoCloseBrackets;
	$: localStorage.autoCloseMediaPickerOnInsert = $autoCloseMediaPickerOnInsert;
	$: localStorage.autoCloseMediaPickerOnSend = $autoCloseMediaPickerOnSend;
	$: localStorage.playerVolume = $playerVolume + "";

	let isAdmin = false;
	let isOnline = true;
	function refreshOnLineStatus() {
		isOnline = !("onLine" in navigator) || navigator.onLine;
	}

	function selfXSSWarning() {
		console.log(
			"%cSTOP\n%cThis is a feature intended for developers. If you were told to paste something here, " +
				"do not do it - they are trying to get access to your JungleTV account.",
			"font-size: 100px; color: white; font-family: sans-serif; background: red",
			"font-size: 20px; color: red; font-family: sans-serif",
		);
	}

	const darkModeBroadcastChannel = new BroadcastChannel<boolean>("darkMode");

	interface configurableStateBroadcastChannelMessage {
		type: "request" | "response";
		state?: ConfigurableState;
	}
	// this channel allows tabs to receive an initial configurable state even when they don't connect to the server via the player
	const configurableStateBroadcastChannel = new BroadcastChannel<configurableStateBroadcastChannelMessage>(
		"configurableState",
	);

	let updateBasicInfoTimeout: number;
	async function updateBasicInfo() {
		updateBasicInfoTimeout = undefined;
		try {
			let rewardInfo = await apiClient.rewardInfo();
			rewardAddress.update((_) => rewardInfo.getRewardsAddress());
			rewardBalance.update((_) => rewardInfo.getRewardBalance());
			badRepresentative.update((_) => rewardInfo.getBadRepresentative());

			let pointsInfo = await apiClient.pointsInfo();
			$currentSubscription = pointsInfo.getCurrentSubscription();

			let response = await apiClient.userPermissionLevel();
			isAdmin = response.getPermissionLevel() == PermissionLevel.ADMIN;
			permissionLevel.update((_) => response.getPermissionLevel());
		} catch (ex) {
			rewardAddress.update((_) => "");
			rewardBalance.update((_) => "");
			$currentSubscription = null;
			permissionLevel.update((_) => PermissionLevel.UNAUTHENTICATED);
			if (!ex.includes("access token is invalid")) {
				updateBasicInfoTimeout = window.setTimeout(updateBasicInfo, 10000);
			}
		}
	}

	onDestroy(() => {
		if (updateBasicInfoTimeout) {
			window.clearTimeout(updateBasicInfoTimeout);
		}
	});

	onMount(async () => {
		// Use "Twemoji Mozilla" font-family name because emoji-picker-element places that first in the font-family list
		polyfillCountryFlagEmojis("Twemoji Mozilla");
		await updateBasicInfo();
		refreshOnLineStatus();

		darkMode.subscribe((newSetting) => {
			darkModeBroadcastChannel.postMessage(newSetting);
		});
		darkModeBroadcastChannel.addEventListener("message", (e) => {
			$darkMode = e;
		});

		configurableStateBroadcastChannel.addEventListener("message", (e) => {
			switch (e.type) {
				case "request":
					let state = produceConfigurableState();
					if (state) {
						configurableStateBroadcastChannel.postMessage({
							type: "response",
							state,
						});
					}
					break;
				case "response":
					processStateFromOtherTab(e.state);
					break;
			}
		});
		configurableStateBroadcastChannel.postMessage({ type: "request" });

		window.addEventListener("message", (e) => {
			if (e.origin != window.origin) {
				return;
			}
			switch (e.data.type) {
				case "navigate":
					if (!popoutTab) {
						navigate(e.data.location);
					}
					break;
			}
		});

		setInterval(() => {
			rootInsideShadowRoot.querySelectorAll(".markdown-timestamp.relative").forEach((e) => {
				if (!(e instanceof HTMLElement)) {
					return;
				}
				let date = DateTime.fromSeconds(parseInt(e.dataset.timestamp));
				e.innerText = formatMarkdownTimestamp(date, e.dataset.timestampType);
			});
		}, 1000);

		if (globalThis.PRODUCTION_BUILD && !globalThis.LAB_BUILD) {
			selfXSSWarning();
			setInterval(selfXSSWarning, 20000);
		}
	});

	let popoutTab: SidebarTab;
	function transformPopoutProps(props: {}): {} {
		let newProps = Object.assign({}, props);
		return Object.assign(newProps, { mode: "popout" });
	}

	$: {
		if (window.name.startsWith("JungleTV-Popout-")) {
			let tabID = window.name.substring("JungleTV-Popout-".length);
			let tab = $sidebarTabs.find((t) => tabID == t.id);
			if (typeof tab !== "undefined") {
				popoutTab = tab;
			} else {
				popoutTab = undefined;
			}
		} else {
			popoutTab = undefined;
		}
	}

	const historyStore = { subscribe: globalHistory.listen };
	let isOnHomepage = false;
	let hashToJumpTo = "";
	historyStore.subscribe((v) => {
		isOnHomepage = v.location.pathname == "/" || v.location.pathname == "";
		closeModal();
		refreshOnLineStatus();

		if (popoutTab && !isOnHomepage) {
			if (window.opener) {
				window.opener.postMessage(
					{
						type: "navigate",
						location: v.location.pathname + v.location.search + v.location.hash,
					},
					window.location.origin,
				);
				window.opener.focus();
			} else {
				window.open(window.location.origin + v.location.pathname + v.location.search + v.location.hash);
			}
			window.close();
			return;
		}

		let hash = v.location.hash;
		if (
			hash.startsWith("#") &&
			hash.length > 1 &&
			!hash.endsWith("#") &&
			typeof rootInsideShadowRoot !== "undefined"
		) {
			hashToJumpTo = hash;
		}
	});

	afterUpdate(() => {
		if (hashToJumpTo != "") {
			let element = rootInsideShadowRoot.querySelector(hashToJumpTo);
			if (element != null) {
				element.scrollIntoView({ behavior: "smooth" });
				// we do this so that consecutive clicks to the same hash can work
				// (hashchange doesn't fire otherwise)
				window.location.hash += "#";
			}
			hashToJumpTo = "";
		}
	});

	featureFlags.subscribe((v) => {
		localStorage.featureFlags = JSON.stringify(v);
	});

	let playerContainer: PlayerContainer;
	let fullSizePlayerContainer: HTMLElement = null;
	let fullSizePlayerContainerWidth: number = 0;
	let fullSizePlayerContainerHeight: number = 0;
	let resizingSidebar: boolean = false;
	let sidebarWidth: number = 384;

	$: pageTitlePopoutTab.set(popoutTab?.tabTitle ?? "");
	$: currentPopoutTabID.set(popoutTab?.id ?? null);

	$: {
		let t = $pageTitlePopoutTab;
		let m = $pageTitleMedia;
		let a = $pageTitleApplicationPage;
		let n = $applicationName;
		if (t) {
			document.title = t + " - " + n;
		} else if (m && isOnHomepage) {
			document.title = m + " - " + n;
		} else if (a) {
			document.title = a + " - " + n;
		} else {
			document.title = n;
		}
	}

	$: {
		let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
		link.href = $faviconURL;
	}

	onMount(() => {
		document.addEventListener("visibilitychange", onVisibilityChange);
	});

	onDestroy(() => {
		document.removeEventListener("visibilitychange", onVisibilityChange);
	});

	let lastTTSAlertAt = 0;

	function onVisibilityChange() {
		if (document.hidden) {
			lastTTSAlertAt = 0;
		}
	}

	$: {
		if (!isOnHomepage) {
			lastTTSAlertAt = 0;
		}
	}

	function chatMentionTTSAlert(m?: string) {
		if (!m) {
			return;
		}
		let now = new Date().getTime();
		if (
			(document.hidden || document.fullscreenElement != null || !isOnHomepage) &&
			$playerVolume > 0 &&
			now - lastTTSAlertAt > 30000
		) {
			ttsAudioAlert("New Jungle TV chat reply");
			lastTTSAlertAt = now;
		}
	}

	$: chatMentionTTSAlert($unreadChatMention);

	$: if ($permissionLevel == PermissionLevel.ADMIN) {
		addNavigationDestination(
			{
				builtIn: true,
				id: "controlpanel",
				href: "/moderate",
				icon: "fas fa-cogs",
				label: "Control Panel",
				highlighted: false,
			},
			"about",
		);
	} else {
		removeNavigationDestination("controlpanel");
	}
</script>

<div bind:this={rootInsideShadowRoot} class={$darkMode ? "bg-gray-900 dark" : "bg-gray-100"} style="height: 100vh">
	<Modal setContext={modalSetContext} styleWindowWrap={{ margin: "1rem" }} on:closed={onModalClosed} />
	{#if isOnline && typeof popoutTab !== "undefined"}
		<div class="min-h-screen bg-white dark:bg-gray-900 dark:text-white overflow-x-hidden">
			<svelte:component this={popoutTab.component} {...transformPopoutProps(popoutTab.props)} />
		</div>
	{:else if isOnline}
		<Navbar />
		<div
			class="flex justify-center min-h-screen pt-16 bg-gray-100 dark:bg-gray-900
			dark:text-gray-300 {$mainContentBottomPaddingAppliedByChild ? '' : $mainContentBottomPadding}"
		>
			<PlayerContainer
				bind:this={playerContainer}
				{resizingSidebar}
				{sidebarWidth}
				fullSize={isOnHomepage}
				{fullSizePlayerContainer}
				{fullSizePlayerContainerWidth}
				{fullSizePlayerContainerHeight}
			/>
			<Router {url}>
				<Route path="/">
					<Homepage
						bind:playerContainer={fullSizePlayerContainer}
						bind:playerContainerWidth={fullSizePlayerContainerWidth}
						bind:playerContainerHeight={fullSizePlayerContainerHeight}
						bind:resizingSidebar
						bind:sidebarWidth
						on:sidebarCollapseStart={playerContainer.onSidebarCollapseStart}
						on:sidebarCollapseEnd={playerContainer.onSidebarCollapseEnd}
						on:sidebarOpenStart={playerContainer.onSidebarOpenStart}
						on:sidebarOpenEnd={playerContainer.onSidebarOpenEnd}
					/>
				</Route>
				<Route path="/authorize/:processID" component={Authorize} />
				<Route path="/about" component={About} />
				<Route path="/enqueue" component={Enqueue} />
				<Route path="/rewards" component={Rewards} />
				<Route path="/rewards/address" component={SetRewardsAddress} />
				<Route path="/points" component={Points} />
				<Route path="/points/frombanano" component={PointsFromBanano} />
				<Route path="/leaderboards" component={Leaderboards} />
				<Route path="/guidelines" component={Document} documentID="guidelines" />
				<Route path="/faq" component={Document} documentID="faq" />
				<Route path="/documents/:documentID" component={Document} />
				<Route path="/history" component={PlayedMediaHistory} />
				<Route path="/profile/:userAddressOrApplicationID/*selectedTab" component={UserProfilePage} />
				<Route path="/apps/:applicationID/*" let:params>
					<Route path="/" component={ApplicationPage} applicationID={params.applicationID} pageID="" />
					<Route path=":pageID/*subpath" component={ApplicationPage} applicationID={params.applicationID} />
				</Route>
				<Route path="/moderate/*">
					{#if isAdmin}
						<Route component={Moderate} />
					{:else}
						<a href="/admin/signin">Sign in</a>
					{/if}
				</Route>
				<Route path="*">
					<NotFound />
				</Route>
			</Router>
		</div>
	{:else}
		<NoConnection on:retry={refreshOnLineStatus} />
	{/if}
	<!-- workaround to avoid the preprocessor deleting CSS selectors that are used by JavaScript functions that produce dynamic class lists -->
	{#if false}
		<span class="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500" />
		<span class="bg-red-600 hover:bg-red-700 focus:ring-red-500" />
		<span class="bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500" />
		<span class="bg-green-600 hover:bg-green-700 focus:ring-green-500" />
		<span class="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" />
		<span class="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500" />
		<span class="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500" />
		<span class="bg-pink-600 hover:bg-pink-700 focus:ring-pink-500" />
	{/if}
</div>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	@layer base {
		/* prefer Twemoji on Firefox - makes the rest of the page consistent with the emoji picker */
		html,
		:host {
			font-family:
				ui-sans-serif,
				system-ui,
				-apple-system,
				BlinkMacSystemFont,
				"Segoe UI",
				Roboto,
				"Helvetica Neue",
				Arial,
				"Noto Sans",
				sans-serif,
				"Twemoji Mozilla",
				"Apple Color Emoji",
				"Segoe UI Emoji",
				"Segoe UI Symbol",
				"Noto Color Emoji";
		}
		a {
			@apply text-blue-600 dark:text-blue-400 hover:underline cursor-pointer;
		}

		button:disabled {
			@apply cursor-not-allowed;
		}

		.markdown-document h1 {
			@apply text-2xl mt-6 mb-2;
		}
		.markdown-document h2 {
			@apply text-xl mt-6 mb-2;
		}
		.markdown-document h3 {
			@apply text-lg mt-4 mb-1;
		}
		.markdown-document h4 {
			@apply text-base font-extrabold mt-4;
		}

		.markdown-document ul {
			@apply list-disc list-outside;
			margin: 1em 0;
			padding: 0 0 0 20px;
		}

		.markdown-document ol {
			@apply list-decimal list-outside;
			margin: 1em 0;
			padding: 0 0 0 30px;
		}

		.markdown-document li > p {
			display: inline;
			margin-top: 0;
		}

		.markdown-document li {
			@apply mb-3;
			display: list-item;
		}

		.markdown-document p {
			@apply mb-4;
		}

		.markdown-timestamp {
			background-color: rgba(6, 6, 7, 0.06);
			padding: 0 2px;
			border-radius: 3px;
		}

		.dark .markdown-timestamp {
			background-color: hsla(0, 0%, 100%, 0.06);
		}

		.markdown-emoji {
			/* used for unicode emoji */
			font-size: 137%;
			vertical-align: sub;
		}
		.align-middle > .markdown-emoji {
			vertical-align: middle;
			display: inline-block;
			height: 33px;
			margin-top: -7px;
			margin-bottom: 2px;
		}

		.markdown-emote {
			height: 1.375em;
			width: 1.375em;
			min-height: 1.375em;
			object-fit: contain;
		}

		@media screen and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
			.markdown-emote {
				image-rendering: -webkit-optimize-contrast !important;
			}
		}

		/* Unset for Safari 11+ */
		@media not all and (min-resolution: 0.001dpcm) {
			@supports (-webkit-appearance: none) and (stroke-color: transparent) {
				.markdown-emote {
					image-rendering: unset !important;
				}
			}
		}

		em .markdown-emote {
			transform: skewX(-12deg);
		}

		.player-minimized {
			@apply fixed;
			--tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25);
			box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
		}
		.player-maximized {
			@apply absolute;
		}

		.chat-user-address {
			font-size: 0.7rem;
			@apply font-mono;
		}

		.chat-user-nickname {
			font-size: 0.8rem;
			@apply font-semibold;
			max-width: 150px;
			display: inline-flex;
			overflow: hidden;
			white-space: nowrap;
		}

		.chat-user-hyper {
			background-color: #10b981;
			background-image: linear-gradient(45deg, #10b981, #fbbf24, #6d28d9);
			background-size: 100%;
			-webkit-background-clip: text;
			background-clip: text;
			-webkit-text-fill-color: transparent;
			text-fill-color: transparent;
		}
		.dark .chat-user-hyper {
			background-color: #6ee7b7;
			background-image: linear-gradient(45deg, #6ee7b7, #fbdd11, #a78bfa);
		}

		.cm-tooltip {
			@apply shadow-md;
		}

		#videoRangeSlider .pip > .pipVal {
			@apply text-gray-500 text-xs;
		}
		#videoRangeSlider .pip.first > .pipVal,
		#videoRangeSlider .pip.last > .pipVal {
			@apply text-gray-500 text-base;
		}
		#videoRangeSlider .pip.selected > .pipVal {
			@apply text-gray-700 dark:text-gray-300;
		}

		#videoRangeSlider {
			--range-slider: theme("colors.gray.300");
			--range-handle: theme("colors.purple.600");
			--range-range: theme("colors.purple.400");
			--range-handle-focus: theme("colors.purple.700");
			--range-float: theme("colors.purple.600");
		}

		.dark #videoRangeSlider {
			--range-slider: theme("colors.gray.600");
		}

		#soundcloudVolumeSlider {
			margin: 11px;
		}
		#soundcloudVolumeSlider > .rangeHandle {
			height: 1em;
			width: 1em;
		}
	}
</style>
