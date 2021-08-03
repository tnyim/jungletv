<script lang="ts">
	import { onMount } from "svelte";

	import { Router, Route, useParams } from "svelte-navigator";
	import About from "./About.svelte";
	import { apiClient } from "./api_client";
	import Enqueue from "./Enqueue.svelte";
	import Homepage from "./Homepage.svelte";
	import Moderate from "./Moderate.svelte";
	import Navbar from "./Navbar.svelte";
	import { PermissionLevel } from "./proto/jungletv_pb";
	import SetRewardsAddress from "./SetRewardsAddress.svelte";
	import ModerateUserChatHistory from "./ModerateUserChatHistory.svelte";
	import { badRepresentative, darkMode, rewardAddress, rewardBalance } from "./stores";
	import ModerateDisallowedMedia from "./ModerateDisallowedMedia.svelte";
	import ModerateEditDocument from "./ModerateEditDocument.svelte";
	import Document from "./Document.svelte";
	import Rewards from "./Rewards.svelte";
	import Leaderboards from "./Leaderboards.svelte";

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
	});
</script>

<Navbar />
<div class="flex justify-center lg:min-h-screen pt-16 bg-gray-100 dark:bg-gray-900 dark:text-gray-300">
	<Router {url}>
		<Route path="/" component={Homepage} />
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
				<ModerateUserChatHistory address={params.address} />
			{:else}
				<a href="/admin/signin">Sign in</a>
			{/if}
		</Route>
		<Route path="/moderate/media/disallowed" let:params>
			{#if isAdmin}
				<ModerateDisallowedMedia />
			{:else}
				<a href="/admin/signin">Sign in</a>
			{/if}
		</Route>
		<Route path="/moderate/documents/:documentID" let:params>
			{#if isAdmin}
				<ModerateEditDocument documentID={params.documentID} />
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
	}
</style>
