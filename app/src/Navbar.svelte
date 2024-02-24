<script lang="ts">
    import { onDestroy } from "svelte";
    import watchMedia from "svelte-media";
    import { globalHistory, link, navigate } from "svelte-navigator";
    import Toggle from "svelte-toggle";
    import NavbarAlert from "./NavbarAlert.svelte";
    import NavbarDestination from "./NavbarDestination.svelte";
    import { applicationName, logoURL } from "./configurationStores";
    import { formatBANPrice } from "./currency_utils";
    import { navigationDestinations } from "./navigationStores";
    import { darkMode, rewardAddress, rewardBalance } from "./stores";
    import NavbarButton from "./uielements/NavbarButton.svelte";
    import NavbarLink from "./uielements/NavbarLink.svelte";
    import { buildMonKeyURL, clickOutside } from "./utils";

    const media = watchMedia({
        large: "(min-width: 1024px)",
    });

    let largeScreen = false;
    let navbarOpen = false;
    let moreOpen = false;
    const mediaUnsubscribe = media.subscribe((obj: any) => {
        largeScreen = obj.large;
        if (obj.large) {
            navbarOpen = false;
        }
    });
    onDestroy(mediaUnsubscribe);

    function setNavbarOpen() {
        navbarOpen = !navbarOpen;
    }

    let rAddress = "";

    const rewardAddressUnsubscribe = rewardAddress.subscribe(async (address) => {
        rAddress = address;
    });
    onDestroy(rewardAddressUnsubscribe);

    let hasAlert = false;

    const historyStore = { subscribe: globalHistory.listen };
    const historyStoreUnsubscribe = historyStore.subscribe(() => {
        moreOpen = false;
        navbarOpen = false;
    });
    onDestroy(historyStoreUnsubscribe);

    $: {
        if (navbarOpen) {
            moreOpen = false;
        }
    }

    let overflowDestinations = $navigationDestinations.slice(0, -3);
    let primaryDestinations = $navigationDestinations.slice(-3, -1);
    let heroDestinations = $navigationDestinations.slice(-1);
    let overflowGridClasses = "grid-cols-3 min-w-96";
    let moreButtonHighlighted = false;
    $: {
        if (overflowDestinations.length % 3 != 0 && overflowDestinations.length % 2 == 0) {
            overflowGridClasses = "grid-cols-2 min-w-64";
        }
        moreButtonHighlighted = overflowDestinations.some((d) => d.highlighted);
    }
    let lastOutsideClickEvent: Event;
</script>

<nav
    class="top-0 fixed {navbarOpen
        ? 'h-auto'
        : 'h-16'} w-full flex flex-wrap items-center justify-between py-3 lg:py-0 px-2 navbar-expand-lg bg-white shadow dark:bg-gray-950 dark:text-gray-300"
    style="z-index: 60;"
>
    <div class="container max-w-none w-full h-full px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="lg:py-3 w-full relative flex lg:w-auto lg:static lg:block lg:justify-start h-full">
            <a
                use:link
                class="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 whitespace-nowrap uppercase"
                href="/"
            >
                <img src={$logoURL} alt={$applicationName} class="h-11 -mb-2" />
            </a>
            {#if !largeScreen}
                <NavbarAlert bind:hasAlert />
                <div class="ml-auto flex flex-row gap-3">
                    {#if !hasAlert && !navbarOpen}
                        <NavbarLink
                            color="purple"
                            iconClasses="fas fa-coins"
                            label="Rewards"
                            href={rAddress ? "/rewards" : "/rewards/address"}
                        />
                        <NavbarLink
                            color="white"
                            backgroundClasses="dark:bg-yellow-600 bg-yellow-400 hover:bg-yellow-500 dark:hover:bg-yellow-500 focus:bg-yellow-500 dark:focus:bg-yellow-500"
                            iconClasses="fas fa-plus"
                            label="Enqueue"
                            href="/enqueue"
                        />
                    {/if}
                    <NavbarButton
                        iconClasses="fas {navbarOpen ? 'fa-times' : 'fa-bars'}"
                        label=""
                        extraClasses="text-xl px-3 justify-center"
                        on:click={setNavbarOpen}
                    />
                </div>
            {/if}
        </div>
        <div class="lg:flex grow items-center {navbarOpen ? 'block mt-4' : 'hidden'}">
            <ul class="flex grow flex-row list-none mr-auto">
                <li class="flex items-center">
                    {#if rAddress}
                        <button
                            class="text-xs text-gray-700 dark:text-gray-300 mt-2 mb-4 lg:mt-0 lg:mb-0 flex flex-row text-left"
                            on:click={() => navigate("/rewards")}
                        >
                            <img
                                src={buildMonKeyURL(rAddress)}
                                alt="&nbsp;"
                                title="MonKey for your address"
                                class="h-9 w-9"
                                style="margin-top: -3px;"
                            />
                            <div class="flex flex-col">
                                <div>
                                    <span class="hidden xl:inline">Rewarding</span>
                                    <span class="font-mono">{rAddress.substring(0, 16)}</span>
                                </div>
                                <div>
                                    Balance:
                                    <span class="font-bold">
                                        {formatBANPrice($rewardBalance)} BAN
                                    </span>
                                </div>
                            </div>
                        </button>
                    {/if}
                    {#if largeScreen}
                        <NavbarAlert bind:hasAlert />
                    {/if}
                </li>
                <li class="lg:py-3 flex items-center ml-auto">
                    <div class="lg:mb-0 ml-3 mb-3 flex flex-row">
                        <i class="fas fa-sun text-lg leading-lg mr-2 text-gray-500" />
                        <Toggle
                            bind:toggled={$darkMode}
                            hideLabel
                            label="Toggle dark mode"
                            toggledColor="#6b7280"
                            untoggledColor="#6b7280"
                        />
                        <i class="fas fa-moon text-lg leading-lg ml-2 text-gray-500" />
                    </div>
                </li>
            </ul>
            <ul
                class="grid grid-cols-3 md:grid-cols-12 lg:flex lg:flex-row gap-3 content-center list-none lg:ml-4 mb-3 lg:mb-0"
            >
                {#if !navbarOpen}
                    <li class="relative">
                        <NavbarButton
                            iconClasses="fas fa-ellipsis-h"
                            label="More"
                            highlighted={moreButtonHighlighted}
                            on:click={(event) => {
                                if (event != lastOutsideClickEvent) {
                                    moreOpen = !moreOpen;
                                }
                            }}
                        />
                        {#if moreOpen}
                            <div
                                class="absolute mt-2 left-1/2 mx-auto max-h-72 overflow-y-auto grid {overflowGridClasses} gap-3 p-3 bg-white dark:bg-gray-950 rounded-b-lg shadow"
                                style="transform: translate(-50%, 0)"
                                use:clickOutside
                                on:clickoutside={(event) => {
                                    lastOutsideClickEvent = event.detail;
                                    moreOpen = false;
                                }}
                            >
                                {#each overflowDestinations as destination}
                                    <NavbarDestination {destination} />
                                {/each}
                            </div>
                        {/if}
                    </li>
                {/if}
                {#if navbarOpen}
                    {#each overflowDestinations as destination}
                        <li class="md:col-span-3">
                            <NavbarDestination {destination} />
                        </li>
                    {/each}
                {/if}
                {#each primaryDestinations as destination}
                    <li class="md:col-span-4">
                        <NavbarDestination {destination} />
                    </li>
                {/each}
                {#each heroDestinations as destination}
                    <li class="col-span-3 md:col-span-4">
                        <NavbarDestination {destination} />
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</nav>
