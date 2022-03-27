<script lang="ts">
    import { globalHistory, link, navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import { darkMode, rewardAddress, rewardBalance } from "./stores";
    import Toggle from "svelte-toggle";
    import watchMedia from "svelte-media";
    import NavbarAlert from "./NavbarAlert.svelte";
import { onDestroy } from "svelte";

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
                <img src="/assets/brand/logo.svg" alt="JungleTV" class="h-11 -mb-2" />
            </a>
            {#if !largeScreen}
                <NavbarAlert bind:hasAlert />
            {/if}
            <div class="ml-auto lg:hidden flex flex-row gap-3">
                {#if !hasAlert && !navbarOpen}
                    <a
                        class="p-1 lg:py-2 flex flex-col items-center dark:text-purple-500 text-purple-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                        use:link
                        href={rAddress !== "" ? "/rewards" : "/rewards/address"}
                    >
                        <i class="fas fa-coins" />
                        <div class="text-xs font-bold uppercase">Rewards</div>
                    </a>
                    <a
                        class="dark:bg-yellow-600 bg-yellow-400 text-white dark:text-white p-1 lg:py-2 flex flex-col items-center rounded hover:shadow-lg hover:bg-yellow-500 dark:hover:bg-yellow-500 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                        use:link
                        href="/enqueue"
                    >
                        <i class="fas fa-plus" />
                        <div class="text-xs font-bold uppercase">Enqueue</div>
                    </a>
                {/if}
                <button
                    class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent outline-none focus:outline-none"
                    type="button"
                    on:click={setNavbarOpen}
                >
                    <i class="fas {navbarOpen ? 'fa-times' : 'fa-bars'}" />
                </button>
            </div>
        </div>
        <div class="lg:flex flex-grow items-center {navbarOpen ? 'block mt-4' : 'hidden'}">
            <ul class="flex flex-grow flex-row list-none mr-auto">
                <li class="flex items-center">
                    {#if rAddress !== ""}
                        <div
                            class="text-xs text-gray-700 dark:text-gray-300 mt-2 mb-4 lg:mt-0 lg:mb-0 flex flex-row cursor-pointer"
                            on:click={() => navigate("/rewards")}
                        >
                            <img
                                src="https://monkey.banano.cc/api/v1/monkey/{rAddress}?format=png"
                                alt="&nbsp;"
                                title="MonKey for your address"
                                class="h-9"
                                style="margin-top: -3px;"
                            />
                            <div class="flex flex-col">
                                <div>
                                    <span class="hidden xl:inline">Rewarding</span>
                                    <span class="font-mono">{rAddress.substr(0, 16)}</span>
                                </div>
                                <div>
                                    Balance:
                                    <span class="font-bold">
                                        {apiClient.formatBANPrice($rewardBalance)} BAN
                                    </span>
                                </div>
                            </div>
                        </div>
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
                    <li>
                        <div
                            style="margin-right:46px;"
                            class="cursor-pointer p-1 lg:py-2 flex flex-col items-center dark:text-gray-300 text-gray-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                            on:click={() => (moreOpen = false)}
                        >
                            <i class="fas fa-arrow-left" />
                            <div class="text-xs font-bold uppercase">Back</div>
                        </div>
                    </li>
                {:else if !navbarOpen}
                    <li>
                        <div
                            class="cursor-pointer p-1 lg:py-2 flex flex-col items-center dark:text-gray-300 text-gray-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                            on:click={() => (moreOpen = true)}
                        >
                            <i class="fas fa-ellipsis-h" />
                            <div class="text-xs font-bold uppercase">More</div>
                        </div>
                    </li>
                {/if}
                {#if navbarOpen || moreOpen}
                    <li class="md:col-span-3">
                        <a
                            class="p-1 lg:py-2 flex flex-col items-center dark:text-gray-300 text-gray-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                            use:link
                            href="/about"
                        >
                            <i class="fas fa-info" />
                            <div class="text-xs font-bold uppercase">About</div>
                        </a>
                    </li>

                    <li class="md:col-span-3">
                        <a
                            class="p-1 lg:py-2 flex flex-col items-center dark:text-gray-300 text-gray-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                            use:link
                            href="/faq"
                        >
                            <i class="fas fa-question" />
                            <div class="text-xs font-bold uppercase">FAQ</div>
                        </a>
                    </li>

                    <li class="md:col-span-3">
                        <a
                            class="p-1 lg:py-2 flex flex-col items-center dark:text-gray-300 text-gray-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                            use:link
                            href="/guidelines"
                        >
                            <i class="fas fa-scroll" />
                            <div class="text-xs font-bold uppercase">Rules</div>
                        </a>
                    </li>

                    <li class="md:col-span-3">
                        <a
                            class="p-1 lg:py-2 flex flex-col items-center dark:text-gray-300 text-gray-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                            use:link
                            href="/history"
                        >
                            <i class="fas fa-history" />
                            <div class="text-xs font-bold uppercase">Play history</div>
                        </a>
                    </li>
                {/if}

                {#if !moreOpen}
                    <li class="md:col-span-4">
                        <a
                            class="p-1 lg:py-2 flex flex-col items-center dark:text-green-500 text-green-600 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                            use:link
                            href="/leaderboards"
                        >
                            <i class="fas fa-trophy" />
                            <div class="text-xs font-bold uppercase">Leaderboards</div>
                        </a>
                    </li>

                    <li class="md:col-span-4">
                        <a
                            class="p-1 lg:py-2 flex flex-col items-center dark:text-purple-500 text-purple-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                            use:link
                            href={rAddress !== "" ? "/rewards" : "/rewards/address"}
                        >
                            <i class="fas fa-coins" />
                            <div class="text-xs font-bold uppercase">
                                {#if rAddress !== ""}
                                    Rewards
                                {:else}
                                    Earn rewards
                                {/if}
                            </div>
                        </a>
                    </li>

                    <li class="col-span-3 md:col-span-4">
                        <a
                            class="dark:bg-yellow-600 bg-yellow-400 text-white dark:text-white p-1 lg:py-2 flex flex-col items-center rounded hover:shadow-lg hover:bg-yellow-500 dark:hover:bg-yellow-500 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                            use:link
                            href="/enqueue"
                        >
                            <i class="fas fa-plus" />
                            <div class="text-xs font-bold uppercase">Enqueue video</div>
                        </a>
                    </li>
                {/if}
            </ul>
        </div>
    </div>
</nav>
