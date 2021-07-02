<script lang="ts">
	import { onMount } from "svelte";

	import { Router, Route, navigate } from "svelte-navigator";
	import About from "./About.svelte";
	import { apiClient } from "./api_client";
	import Enqueue from "./Enqueue.svelte";
	import Homepage from "./Homepage.svelte";
	import Moderate from "./Moderate.svelte";
	import Navbar from "./Navbar.svelte";
	import SetRewardsAddress from "./SetRewardsAddress.svelte";
	import { darkMode, rewardAddress } from "./stores";

	export let url = "";

	apiClient.setAuthNeededCallback(() => {
		//navigate("/auth/login");
	});

	darkMode.subscribe((enabled) => {
		if (enabled) {
			document.documentElement.classList.add('dark');
			document.documentElement.classList.add('bg-gray-900');
		} else {
			document.documentElement.classList.remove('dark');
			document.documentElement.classList.remove('bg-gray-900');
		}
		localStorage.darkMode = enabled;
	})

	onMount(async () => {
		try {
			let rewardInfo = await apiClient.rewardInfo();
			rewardAddress.update((_) => rewardInfo.getRewardAddress());
		} catch (ex) {
			rewardAddress.update((_) => "");
		}
	});
</script>

<Navbar />
<div class="flex justify-center lg:min-h-screen pt-16 bg-gray-100 dark:bg-gray-900 dark:text-gray-300">
	<Router {url}>
		<Route path="/" component={Homepage} />
		<Route path="/about" component={About} />
		<Route path="/enqueue" component={Enqueue} />
		<Route path="/rewards/address" component={SetRewardsAddress} />
		<Route path="/moderate" component={Moderate} />
	</Router>
</div>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
