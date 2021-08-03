<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import { badRepresentative, rewardReceived } from "./stores";
    import { fade, fly } from "svelte/transition";
    import { onDestroy } from "svelte";
    import watchMedia from "svelte-media";

    const media = watchMedia({
        large: "(min-width: 1500px)",
    });

    let largeScreen = false;
    media.subscribe((obj: any) => {
        largeScreen = obj.large;
    });

    let hideRewardTimeout: number;

    let lastReward = "";
    let badRep = false;

    rewardReceived.subscribe((reward) => {
        clearTimeout(hideRewardTimeout);
        if (reward != "") {
            lastReward = reward;
        }
        hideRewardTimeout = setTimeout(() => {
            lastReward = "";
            hideRewardTimeout = undefined;
        }, 7000);
    });

    badRepresentative.subscribe((b) => (badRep = b));

    onDestroy(() => {
        if (hideRewardTimeout !== undefined) {
            clearTimeout(hideRewardTimeout);
            hideRewardTimeout = undefined;
        }
    });
</script>

{#if lastReward !== ""}
    <span
        class="text-sm text-gray-700 bg-yellow-200 ml-5 p-1 rounded h-7 self-center"
        in:fly={{ x: 200, duration: 1000 }}
        out:fade
    >
        Received <span class="font-bold">{apiClient.formatBANPrice(lastReward)} BAN</span>!
    </span>
{:else if badRep}
    <span
        class="text-sm text-gray-700 bg-gray-200 ml-5 p-1 rounded self-center"
        in:fly={{ x: 200, duration: 1000 }}
        out:fade
    >
        {#if largeScreen}
            Switch your Banano address to a good representative!
            <a class="font-semibold" href="/documents/badrepresentativehelp" use:link>More information</a>
        {:else}
            Switch representatives!<br />
            <a class="font-semibold" href="/documents/badrepresentativehelp" use:link>More information</a>
        {/if}
    </span>
{/if}
