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
        medium: "(min-width: 768px)",
    });

    let largeScreen = false;
    let mediumScreen = false;
    let navbarOpen = false;
    let moreOpen = false;
    const mediaUnsubscribe = media.subscribe((obj: any) => {
        largeScreen = obj.large;
        mediumScreen = obj.medium;
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

    $: heroDestinations = $navigationDestinations.slice(0, 1);
    $: primaryDestinations = $navigationDestinations.slice(1, 3).reverse();
    $: overflowDestinations = $navigationDestinations.slice(3);
    let overflowGridClasses = "grid-cols-3 min-w-96";
    let heroClasses = "col-span-full";
    let moreButtonHighlighted = false;
    $: {
        if (
            overflowDestinations.length % 3 != 0 &&
            overflowDestinations.length % 2 == 0 &&
            overflowDestinations.length < 9
        ) {
            overflowGridClasses = "grid-cols-2 min-w-64";
        } else {
            overflowGridClasses = "grid-cols-3 min-w-96";
        }
        moreButtonHighlighted = overflowDestinations.some((d) => d.highlighted);
    }
    $: {
        let remainder = (overflowDestinations.length + primaryDestinations.length) % (mediumScreen ? 4 : 3);
        switch (remainder) {
            case 0:
                heroClasses = "col-span-full";
                break;
            case 1:
                heroClasses = mediumScreen ? "col-span-3" : "col-span-2";
                break;
            case 2:
                heroClasses = mediumScreen ? "col-span-2" : "";
                break;
            case 3:
                heroClasses = "";
                break;
        }
    }

    let lastOutsideClickEvent: Event;
    let moreButton: HTMLButtonElement;
    function onMoreClicked(event: MouseEvent) {
        if (event != lastOutsideClickEvent) {
            moreOpen = !moreOpen;
        }
        if (!moreOpen) {
            // if the button retains the focus after the overflow menu is closed, it looks weird
            moreButton.blur();
        }
    }
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
                            color="yellow"
                            isHero={true}
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
                class="grid grid-cols-3 md:grid-cols-4 lg:flex lg:flex-row gap-3 content-center list-none lg:ml-4 mb-3 lg:mb-0"
            >
                {#if !navbarOpen}
                    <li class="relative">
                        <NavbarButton
                            iconClasses="fas fa-ellipsis-h"
                            label="More"
                            highlighted={moreButtonHighlighted}
                            bind:button={moreButton}
                            on:click={onMoreClicked}
                        />
                        {#if moreOpen}
                            <div
                                class="absolute left-1/2 mx-auto max-h-72 overflow-y-auto grid {overflowGridClasses} gap-3 p-3 bg-white dark:bg-gray-950 rounded-lg shadow"
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
                        <li>
                            <NavbarDestination {destination} />
                        </li>
                    {/each}
                {/if}
                {#each primaryDestinations as destination}
                    <li>
                        <NavbarDestination {destination} />
                    </li>
                {/each}
                {#each heroDestinations as destination}
                    <li class={heroClasses}>
                        <NavbarDestination {destination} isHero={true} />
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</nav>
