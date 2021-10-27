<script lang="ts">
	import { onMount } from "svelte";
	import { Router, Route, globalHistory } from "svelte-navigator";
	import About from "./About.svelte";
	import { apiClient } from "./api_client";
	import Enqueue from "./Enqueue.svelte";
	import Homepage from "./Homepage.svelte";
	import Moderate from "./Moderate.svelte";
	import Navbar from "./Navbar.svelte";
	import { PermissionLevel } from "./proto/jungletv_pb";
	import SetRewardsAddress from "./SetRewardsAddress.svelte";
	import UserChatHistory from "./moderation/UserChatHistory.svelte";
	import { badRepresentative, darkMode, permissionLevel, rewardAddress, rewardBalance, modal } from "./stores";
	import DisallowedMedia from "./moderation/DisallowedMedia.svelte";
	import EditDocument from "./moderation/EditDocument.svelte";
	import Document from "./Document.svelte";
	import Rewards from "./Rewards.svelte";
	import Leaderboards from "./Leaderboards.svelte";
	import Player from "./Player.svelte";
	import PlayerContainer from "./PlayerContainer.svelte";
	import Modal from "svelte-simple-modal";
	import UserBans from "./moderation/UserBans.svelte";

	export let url = "";

	apiClient.setAuthNeededCallback(() => {
		//navigate("/auth/login");
	});

	darkMode.subscribe((enabled) => {
		if (enabled) {
			document.documentElement.classList.add("dark");
			document.documentElement.classList.add("bg-gray-900");
		} else {
			document.documentElement.classList.remove("dark");
			document.documentElement.classList.remove("bg-gray-900");
		}
		localStorage.darkMode = enabled;
	});

	let isAdmin = false;

	onMount(async () => {
		try {
			let rewardInfo = await apiClient.rewardInfo();
			rewardAddress.update((_) => rewardInfo.getRewardAddress());
			rewardBalance.update((_) => rewardInfo.getRewardBalance());
			badRepresentative.update((_) => rewardInfo.getBadRepresentative());
		} catch (ex) {
			rewardAddress.update((_) => "");
			rewardBalance.update((_) => "");
		}
		let response = await apiClient.userPermissionLevel();
		isAdmin = response.getPermissionLevel() == PermissionLevel.ADMIN;
		permissionLevel.update((_) => response.getPermissionLevel());
	});

	const historyStore = { subscribe: globalHistory.listen };
	let isOnHomepage = false;
	historyStore.subscribe((v) => {
		isOnHomepage = v.location.pathname == "/" || v.location.pathname == "";
	});

	let mainContentBottomPadding = "";
	let playerContainer: PlayerContainer;
	let fullSizePlayerContainer: HTMLElement = null;
	let fullSizePlayerContainerWidth: number = 0;
	let fullSizePlayerContainerHeight: number = 0;

	let modalOpen: any;
	let modalClose: any;
	function modalSetContext(key: string, props: any) {
		modalOpen = props.open;
		modalClose = props.close;
	}
	modal.subscribe((p) => {
		if (p == null || p == undefined) {
			if (modalClose !== undefined) {
				modalClose();
			}
		} else {
			modalOpen(p.component, p.props, p.options, p.callbacks);
		}
	});
</script>

<Modal setContext={modalSetContext} />
<Navbar />
<div
	class="flex justify-center lg:min-h-screen pt-16 bg-gray-100 dark:bg-gray-900
	dark:text-gray-300 {mainContentBottomPadding}"
>
	<PlayerContainer
		bind:this={playerContainer}
		bind:mainContentBottomPadding
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
				on:sidebarCollapseStart={playerContainer.onSidebarCollapseStart}
				on:sidebarCollapseEnd={playerContainer.onSidebarCollapseEnd}
				on:sidebarOpenStart={playerContainer.onSidebarOpenStart}
				on:sidebarOpenEnd={playerContainer.onSidebarOpenEnd}
			/>
		</Route>
		<Route path="/about" component={About} />
		<Route path="/enqueue" component={Enqueue} />
		<Route path="/rewards" component={Rewards} />
		<Route path="/rewards/address" component={SetRewardsAddress} />
		<Route path="/leaderboards" component={Leaderboards} />
		<Route path="/guidelines" component={Document} documentID="guidelines" />
		<Route path="/faq" component={Document} documentID="faq" />
		<Route path="/documents/:documentID" component={Document} />
		<Route path="/moderate">
			{#if isAdmin}
				<Moderate />
			{:else}
				<a href="/admin/signin">Sign in</a>
			{/if}
		</Route>
		<Route path="/moderate/users/:address/chathistory" let:params>
			{#if isAdmin}
				<UserChatHistory address={params.address} />
			{:else}
				<a href="/admin/signin">Sign in</a>
			{/if}
		</Route>
		<Route path="/moderate/media/disallowed" let:params>
			{#if isAdmin}
				<DisallowedMedia />
			{:else}
				<a href="/admin/signin">Sign in</a>
			{/if}
		</Route>
		<Route path="/moderate/bans" let:params>
			{#if isAdmin}
				<UserBans />
			{:else}
				<a href="/admin/signin">Sign in</a>
			{/if}
		</Route>
		<Route path="/moderate/documents/:documentID" let:params>
			{#if isAdmin}
				<EditDocument documentID={params.documentID} />
			{:else}
				<a href="/admin/signin">Sign in</a>
			{/if}
		</Route>
	</Router>
</div>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	@layer base {
		a {
			@apply text-blue-600 dark:text-blue-400 hover:underline cursor-pointer;
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

		.chat-user-glow {
			animation-duration: 3s;
			animation-name: text-glow;
			animation-iteration-count: infinite;
			animation-direction: alternate;
			animation-timing-function: ease-in-out;
		}

		@media (prefers-reduced-motion) {
			.chat-user-glow {
				animation-name: none;
			}
		}

		@keyframes text-glow {
			from {
				text-shadow: rgba(167, 139, 250, 1) 0px 0px 10px;
			}
			to {
				text-shadow: rgba(167, 139, 250, 1) 0px 0px 0px;
			}
		}
	}
</style>
