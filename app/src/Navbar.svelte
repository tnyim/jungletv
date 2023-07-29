<script lang="ts">
    import { onDestroy } from "svelte";
    import watchMedia from "svelte-media";
    import { globalHistory, link, navigate } from "svelte-navigator";
    import Toggle from "svelte-toggle";
    import NavbarAlert from "./NavbarAlert.svelte";
    import { applicationName, logoURL } from "./configurationStores";
    import { formatBANPrice } from "./currency_utils";
    import { darkMode, rewardAddress, rewardBalance } from "./stores";
    import NavbarButton from "./uielements/NavbarButton.svelte";
    import NavbarLink from "./uielements/NavbarLink.svelte";
    import { buildMonKeyURL } from "./utils";

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

    let moreCloseTimeout: number;
    $: {
        if (navbarOpen) {
            moreOpen = false;
        }
        if (moreOpen) {
            if (typeof moreCloseTimeout != "undefined") {
                clearTimeout(moreCloseTimeout);
            }
            moreCloseTimeout = setTimeout(() => {
                moreOpen = false;
            }, 20000);
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
                {#if moreOpen}
                    <li style="margin-right:48px;">
                        <NavbarButton
                            iconClasses="fas fa-arrow-left"
                            label="Back"
                            on:click={() => (moreOpen = false)}
                        />
                    </li>
                {:else if !navbarOpen}
                    <li>
                        <NavbarButton iconClasses="fas fa-ellipsis-h" label="More" on:click={() => (moreOpen = true)} />
                    </li>
                {/if}
                {#if navbarOpen || moreOpen}
                    <li class="md:col-span-3">
                        <NavbarLink iconClasses="fas fa-info" label="About" href="/about" />
                    </li>

                    <li class="md:col-span-3">
                        <NavbarLink iconClasses="fas fa-question" label="FAQ" href="/faq" />
                    </li>

                    <li class="md:col-span-3">
                        <NavbarLink iconClasses="fas fa-scroll" label="Rules" href="/guidelines" />
                    </li>

                    <li class="md:col-span-3">
                        <NavbarLink iconClasses="fas fa-history" label="Play history" href="/history" />
                    </li>
                {/if}

                {#if !moreOpen}
                    <li class="md:col-span-4">
                        <NavbarLink
                            color="green"
                            iconClasses="fas fa-trophy"
                            label="Leaderboards"
                            href="/leaderboards"
                        />
                    </li>

                    <li class="md:col-span-4">
                        <NavbarLink
                            color="purple"
                            iconClasses="fas fa-coins"
                            label={rAddress ? "Rewards" : "Earn rewards"}
                            href={rAddress ? "/rewards" : "/rewards/address"}
                        />
                    </li>

                    <li class="col-span-3 md:col-span-4">
                        <NavbarLink
                            color="white"
                            backgroundClasses="dark:bg-yellow-600 bg-yellow-400 hover:bg-yellow-500 dark:hover:bg-yellow-500 focus:bg-yellow-500 dark:focus:bg-yellow-500"
                            iconClasses="fas fa-plus"
                            label="Enqueue media"
                            href="/enqueue"
                        />
                    </li>
                {/if}
            </ul>
        </div>
    </div>
</nav>
