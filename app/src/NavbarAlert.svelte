<script lang="ts">
    import { onDestroy } from "svelte";
    import watchMedia from "svelte-media";
    import { link } from "svelte-navigator";
    import NavbarAlertFlyer from "./NavbarAlertFlyer.svelte";
    import { navbarToasts } from "./navigationStores";
    import { badRepresentative, currentSubscription } from "./stores";
    import { isSubscriptionAboutToExpire, parseSystemMessageMarkdown } from "./utils";

    const media = watchMedia({
        large: "(min-width: 1500px)",
    });

    let largeScreen = false;
    const mediaUnsubscribe = media.subscribe((obj: any) => {
        largeScreen = obj.large;
    });

    export let hasAlert = false;
    $: hasAlert = $badRepresentative || $navbarToasts.length > 0 || showSubExpirationWarning;

    onDestroy(() => {
        mediaUnsubscribe();
    });

    let showSubExpirationWarning = false;
    let shownSubExpireWarning = false;
    $: {
        let aboutToExpire = isSubscriptionAboutToExpire($currentSubscription);
        if (!aboutToExpire) {
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

{#if $navbarToasts.length > 0}
    {#key $navbarToasts[0].id}
        <NavbarAlertFlyer
            classes="text-gray-700 bg-yellow-200"
            duration={$navbarToasts[0].duration}
            href={$navbarToasts[0].href}
            on:done={() => {
                navbarToasts.update((toasts) => toasts.slice(1));
            }}
        >
            {#await parseSystemMessageMarkdown($navbarToasts[0].content) then content}
                {@html content}
            {/await}
        </NavbarAlertFlyer>
    {/key}
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
