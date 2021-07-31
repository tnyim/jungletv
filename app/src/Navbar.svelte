<script lang="ts">
    import { link, navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import { darkMode, rewardAddress, rewardBalance, rewardReceived } from "./stores";
    import { fade, fly } from "svelte/transition";
    import { globalHistory } from "svelte-navigator";
    import Toggle from "svelte-toggle";
    const historyStore = { subscribe: globalHistory.listen };

    let navbarOpen = false;

    historyStore.subscribe(() => {
        navbarOpen = false;
    });

    function setNavbarOpen() {
        navbarOpen = !navbarOpen;
    }

    let rAddress = "";
    let lastReward = "";
    let hideRewardTimeout: number;

    rewardAddress.subscribe((address) => {
        rAddress = address;
    });

    rewardReceived.subscribe((reward) => {
        clearTimeout(hideRewardTimeout);
        lastReward = reward;
        hideRewardTimeout = setTimeout(() => (lastReward = ""), 7000);
    });

    async function copyAddress(address: string) {
        try {
            await navigator.clipboard.writeText(address);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    }
</script>

<nav
    class="top-0 fixed z-50 {navbarOpen
        ? 'h-auto'
        : 'h-16'} w-full flex flex-wrap items-center justify-between px-2 navbar-expand-lg bg-white shadow dark:bg-gray-950 dark:text-gray-300"
>
    <div class="container max-w-none w-full px-4 mx-auto flex flex-wrap items-center justify-between">
        <div class="lg:py-3 w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
                use:link
                class="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 whitespace-nowrap uppercase"
                href="/"
            >
                <img src="/assets/brand/logo.svg" alt="JungleTV" class="h-11 -mb-2" />
            </a>
            <button
                class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                type="button"
                on:click={setNavbarOpen}
            >
                <i class="fas fa-bars" />
            </button>
        </div>
        <div class="lg:flex flex-grow items-center {navbarOpen ? 'block mt-4' : 'hidden'}">
            <ul class="lg:py-3 flex flex-col lg:flex-row list-none mr-auto">
                <li class="flex items-center">
                    {#if rAddress !== ""}
                        <div
                            class="text-xs text-gray-500 mt-2 mb-4 lg:mt-0 lg:mb-0 flex flex-row cursor-pointer"
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
                                    Rewarding <span class="font-mono">{rAddress.substr(0, 16)}</span>
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
                    {#if lastReward !== ""}
                        <span
                            class="text-sm text-gray-700 bg-yellow-200 ml-5 p-1 rounded"
                            in:fly={{ x: 200, duration: 1000 }}
                            out:fade
                        >
                            Received <span class="font-bold">{apiClient.formatBANPrice(lastReward)} BAN</span>!
                        </span>
                    {/if}
                </li>
            </ul>
            <div class="lg:py-3 flex items-center lg:ml-auto">
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
            </div>
            <ul class="grid grid-cols-3 md:grid-cols-4 lg:flex lg:flex-row gap-3 content-center list-none lg:ml-4 mb-3 lg:mb-0 lg:-mt-0.5">
                <li>
                    <a
                        class="p-1 lg:py-2 flex flex-col items-center dark:text-gray-300 text-gray-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                        use:link
                        href="/about"
                    >
                        <i class="fas fa-info" />
                        <div class="text-xs font-bold uppercase">
                            About
                        </div>
                    </a>
                </li>

                <li>
                    <a
                        class="p-1 lg:py-2 flex flex-col items-center dark:text-gray-300 text-gray-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                        use:link
                        href="/faq"
                    >
                        <i class="fas fa-question" />
                        <div class="text-xs font-bold uppercase">
                            FAQ
                        </div>
                    </a>
                </li>

                <li>
                    <a
                        class="p-1 lg:py-2 flex flex-col items-center dark:text-gray-300 text-gray-700 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                        use:link
                        href="/guidelines"
                    >
                        <i class="fas fa-scroll" />
                        <div class="text-xs font-bold uppercase">
                            Rules
                        </div>
                    </a>
                </li>

                <li>
                    <a
                        class="p-1 lg:py-2 flex flex-col items-center dark:text-green-500 text-green-600 rounded hover:shadow-lg hover:bg-gray-200 dark:hover:bg-gray-800 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                        use:link
                        href="/leaderboards"
                    >
                        <i class="fas fa-trophy" />
                        <div class="text-xs font-bold uppercase">
                            Leaderboards
                        </div>
                    </a>
                </li>

                <li class="md:col-span-2">
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

                <li class="md:col-span-2">
                    <a
                        class="dark:bg-yellow-600 bg-yellow-400 text-white p-1 lg:py-2 flex flex-col items-center rounded hover:shadow-lg hover:bg-yellow-500 dark:hover:bg-yellow-500 outline-none focus:outline-none hover:no-underline ease-linear transition-all duration-150"
                        use:link
                        href="/enqueue"
                    >
                        <i class="fas fa-plus" />
                        <div class="text-xs font-bold uppercase">Enqueue video</div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</nav>
