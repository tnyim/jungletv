<script lang="ts">
    import { onDestroy } from "svelte";
    import watchMedia from "svelte-media";
    import { link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import NavbarAlertFlyer from "./NavbarAlertFlyer.svelte";
    import { badRepresentative, currentSubscription, rewardReceived } from "./stores";
    import { isSubscriptionAboutToExpire } from "./utils";

    const media = watchMedia({
        large: "(min-width: 1500px)",
    });

    let largeScreen = false;
    const mediaUnsubscribe = media.subscribe((obj: any) => {
        largeScreen = obj.large;
    });

    export let hasAlert = false;
    $: hasAlert = $badRepresentative || lastReward != "" || showSubExpirationWarning;

    let lastReward = "";

    const rewardReceivedUnsubscribe = rewardReceived.subscribe((reward) => {
        if (reward != "") {
            lastReward = reward;
        }
    });

    onDestroy(() => {
        mediaUnsubscribe();
        rewardReceivedUnsubscribe();
    });

    let showSubExpirationWarning = false;
    let shownSubExpireWarning = false;
    $: {
        let aboutToExpire = isSubscriptionAboutToExpire($currentSubscription);
        if(!aboutToExpire) {
            showSubExpirationWarning = false;
            shownSubExpireWarning = false;
        } else if (!shownSubExpireWarning) {
            showSubExpirationWarning = aboutToExpire;
            if (showSubExpirationWarning) {
                shownSubExpireWarning = true;
            }
        }
    }
</script>

{#if lastReward !== ""}
    <NavbarAlertFlyer
        classes="text-gray-700 bg-yellow-200"
        duration={7000}
        on:done={() => {
            lastReward = "";
        }}
    >
        Received <span class="font-bold">{apiClient.formatBANPrice(lastReward)} BAN</span>!
    </NavbarAlertFlyer>
{:else if showSubExpirationWarning}
    <NavbarAlertFlyer
        classes="text-gray-700 bg-gray-200"
        duration={10000}
        on:done={() => {
            showSubExpirationWarning = false;
        }}
    >
        {#if largeScreen}
            Your <span class="font-semibold text-green-500">Nice</span>
            subscription is about to expire.
            <a class="font-semibold text-blue-600" href="/points#nice" use:link>Renew</a>
        {:else}
            <a class="font-semibold text-blue-600" href="/points#nice" use:link>Renew</a> your
            <span class="font-semibold text-green-500">Nice</span>
            subscription
        {/if}
    </NavbarAlertFlyer>
{:else if $badRepresentative}
    <NavbarAlertFlyer classes="text-gray-700 bg-gray-200">
        {#if largeScreen}
            Switch your Banano address to a good representative!
            <a class="font-semibold" href="/documents/badrepresentativehelp" use:link>More information</a>
        {:else}
            Switch representatives!<br />
            <a class="font-semibold" href="/documents/badrepresentativehelp" use:link>More information</a>
        {/if}
    </NavbarAlertFlyer>
{/if}
