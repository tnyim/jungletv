<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { apiClient } from "./api_client";
    import { badRepresentative, rewardAddress, rewardBalance } from "./stores";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    import SuccessMessage from "./uielements/SuccessMessage.svelte";
    import TextInput from "./uielements/TextInput.svelte";
    import WarningMessage from "./uielements/WarningMessage.svelte";
    import Wizard from "./uielements/Wizard.svelte";
    import { TLD_MAPPING } from "./utils";

    const dispatch = createEventDispatcher();

    export let failureReason: string = "";
    let successful = false;
    let rewardsAddress = "";
    let rewardsBalance = "";
    let privilegedLabUserCredential = "";

    let rewardInfoPromise = (async function () {
        try {
            let rewardInfo = await apiClient.rewardInfo();

            rewardsAddress = rewardInfo.getRewardsAddress();
            rewardsBalance = rewardInfo.getRewardBalance();
            rewardAddress.update((_) => rewardsAddress);
            rewardBalance.update((_) => rewardsBalance);
            badRepresentative.update((_) => rewardInfo.getBadRepresentative());
        } catch (ex) {
            console.log(ex);
            rewardsAddress = "";
        }
    })();

    async function handleEnter(event: KeyboardEvent) {
        if (event.key === "Enter") {
            await submit(false);
            return false;
        }
        return true;
    }

    async function submit(viaSignature: boolean) {
        const parts = rewardsAddress.split(".");
        if (rewardsAddress === "") {
            failureReason = "A Banano address or BNS domain must be provided";
            if ($rewardAddress != "") {
                failureReason +=
                    ". If you wish to sign out, you can do so using the button at the bottom of the Rewards page.";
            }
            successful = false;
            return;
        } else if (parts.length === 2 && Object.keys(TLD_MAPPING).includes(parts[1])) {
            //is probably a BNS domain
            //it seems like the combination of Svelte 3 and rollup does not care
            //about window being here. Normally would need to do if (browser) or the like
            const rpc = new window.bns.banani.RPC("https://kaliumapi.appditto.com/api");
            const resolver = new window.bns.Resolver(rpc, TLD_MAPPING);
            try {
                rewardsAddress = (await resolver.resolve(parts[0], parts[1])).resolved_address;
            } catch (e) {
                failureReason = "That BNS domain does not exist or does not resolve to an address."
            }
        }

        dispatch("addressInput", [rewardsAddress, privilegedLabUserCredential, viaSignature]);
    }

    function cancel() {
        dispatch("userCanceled");
    }
</script>

<svelte:head>
  <script src="/bns.js"></script>
</svelte:head>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            When a queue entry finishes playing, the amount someone paid to enqueue it, is distributed evenly among
            eligible users.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Some content has e.g. regional restrictions and may not display for you. You will still be rewarded as long
            as you keep the JungleTV page open throughout the duration of the queue entry.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Fraud prevention measures apply.</p>
    </div>
    <div slot="main-content">
        {#await rewardInfoPromise}
            <p>Loading...</p>
        {:then}
            {#if globalThis.LAB_BUILD}
                <WarningMessage>
                    This is a lab environment where users cannot withdraw rewards. The rewards system otherwise works as
                    in the production version of the website, but users will never be able to withdraw their balance.
                    Banano received goes towards the upkeeping of this lab environment.
                    <br />
                    <strong>Please ignore any UI text mentioning the ability to receive rewards.</strong>
                </WarningMessage>
            {/if}
            <label for="rewards_address" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Banano address or BNS Domain for rewards
            </label>
            <div class="mt-1 flex rounded-md shadow-sm">
                <TextInput
                    id="rewards_address"
                    placeholder="ban_"
                    hasError={failureReason !== ""}
                    extraClasses="flex-1 font-mono"
                    on:input={() => {
                        failureReason = "";
                        successful = false;
                    }}
                    on:keydown={handleEnter}
                    bind:value={rewardsAddress}
                />
            </div>
            {#if failureReason !== ""}
                <div class="mt-3">
                    <ErrorMessage>{failureReason}</ErrorMessage>
                </div>
            {:else if successful}
                {#if rewardsAddress == ""}
                    <div class="mt-3">
                        <SuccessMessage>
                            Successfully removed rewards address. You won't receive rewards anymore.
                        </SuccessMessage>
                    </div>
                {/if}
            {/if}
            <p class="mt-2 text-sm text-gray-500">
                Setting an address will also allow you to chat with other users. This address will be used to publicly
                identify you on JungleTV. This must be an address you control - one of the addresses of your wallet(s).
            </p>

            {#if globalThis.LAB_BUILD}
                <label for="lab_credential" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-6">
                    Credential for lab environment (leave blank to sign in with regular permissions)
                </label>
                <div class="mt-1 flex rounded-md shadow-sm">
                    <input
                        on:input={() => {
                            failureReason = "";
                            successful = false;
                        }}
                        on:keydown={handleEnter}
                        type="password"
                        name="lab_credential"
                        id="lab_credential"
                        class="dark:bg-gray-950 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500 flex-1 block w-full rounded-md text-sm border {failureReason !==
                        ''
                            ? 'border-red-600'
                            : 'border-gray-300'} p-2"
                        bind:value={privilegedLabUserCredential}
                    />
                </div>
            {/if}

            <p class="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-6">
                Select the wallet software you use
            </p>
            <div class="grid grid-cols-1 gap-2 mt-1">
                <ButtonButton
                    baseClasses="text-left p-1 px-2 border shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-lg"
                    colorClasses="border-yellow-600 hover:border-yellow-700 focus:ring-yellow-500 hover:bg-yellow-200 focus:bg-yellow-200 dark:hover:bg-yellow-900 dark:focus:bg-yellow-900"
                    textColorClasses="text-black dark:text-white"
                    on:click={() => submit(true)}
                >
                    <p class="text-sm">
                        <span class="text-base font-semibold">The Banano Stand</span>, the wallet that runs in your
                        browser
                    </p>
                    <p class="text-xs text-gray-500">or other wallet that supports message signing</p>
                </ButtonButton>
                <ButtonButton
                    baseClasses="text-left p-1 px-2 border shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 hover:shadow-lg"
                    colorClasses="border-yellow-600 hover:border-yellow-700 focus:ring-yellow-500 hover:bg-yellow-200 focus:bg-yellow-200 dark:hover:bg-yellow-900 dark:focus:bg-yellow-900"
                    textColorClasses="text-black dark:text-white"
                    on:click={() => submit(false)}
                >
                    <p class="text-sm">
                        <span class="text-base font-semibold">Kalium</span>, the mobile wallet for Android and iOS
                    </p>
                    <p class="text-xs">
                        <span class="text-gray-500">or other Banano wallet.</span> Select this option if unsure
                    </p>
                </ButtonButton>
            </div>
            <p class="mt-2 text-sm text-gray-500">
                Support for certain operations varies depending on wallet software. By choosing the correct option,
                we'll use the best authentication mechanism that is compatible with your wallet.
            </p>
        {/await}
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <ButtonButton color="purple" on:click={cancel}>Cancel</ButtonButton>
    </div>
    <div slot="extra_1">
        <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white dark:bg-gray-800 space-y-6 sm:p-6">
                <div class="grid grid-cols-3 gap-6">
                    <div class="col-span-3">
                        <p class="text-lg">
                            New to <img
                                src="/assets/3rdparty/banano-icon.svg"
                                alt="Banano"
                                class="h-4 inline align-baseline"
                            /> Banano?
                        </p>
                        <p class="text-sm">
                            <a href="https://banano.cc" target="_blank" rel="noopener">Banano</a> is a feeless, near-instant,
                            environment-friendly digital currency that's ripe for memes; it is not meant to be a financial
                            investment.
                        </p>
                        <p class="text-sm">
                            It is the perfect match for a playful community like what we have on JungleTV! We can
                            introduce you to Banano with no need to spend any money.
                        </p>
                        <p class="text-sm mt-4">
                            To start, you should get a Banano address. Use, for example,
                            <a href="https://kalium.banano.cc/" target="_blank" rel="noopener">Kalium</a> (for Android
                            and iOS) or
                            <a href="https://thebananostand.com/" target="_blank" rel="noopener">The Banano Stand</a>, a
                            wallet you can use on your browser without installing anything.
                        </p>
                        <p class="text-sm">
                            Then, you should prepare your account by claiming some free Banano from
                            <a href="https://nanswap.com/banano-faucet?r=83940629260" target="_blank" rel="noopener"
                                >NanSwap</a
                            >
                            or
                            <a href="https://monkeytalks.cc/" target="_blank" rel="noopener">MonkeyTalks</a>. Finally,
                            just paste your address here and follow the instructions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</Wizard>
