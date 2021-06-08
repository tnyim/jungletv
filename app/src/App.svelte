<script lang="ts">
	import { onMount } from "svelte";

	import { Router, Route, navigate } from "svelte-navigator";
	import About from "./About.svelte";
	import { apiClient } from "./api_client";
	import Enqueue from "./Enqueue.svelte";
	import Homepage from "./Homepage.svelte";
	import Moderate from "./Moderate.svelte";
	import Navbar from "./Navbar.svelte";
	import RewardsAddress from "./RewardsAddress.svelte";
	import { rewardAddress } from "./stores";

	export let url = "";

	apiClient.setAuthNeededCallback(() => {
		//navigate("/auth/login");
	});

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
<div class="flex justify-center min-h-screen h-full pt-16 bg-gray-100">
	<Router {url}>
		<Route path="/" component={Homepage} />
		<Route path="/about" component={About} />
		<Route path="/enqueue" component={Enqueue} />
		<Route path="/rewards/address" component={RewardsAddress} />
		<Route path="/moderate" component={Moderate} />
	</Router>
</div>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
