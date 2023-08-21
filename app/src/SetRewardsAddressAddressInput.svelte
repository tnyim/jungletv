<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { apiClient } from "./api_client";
    import { badRepresentative, rewardAddress, rewardBalance } from "./stores";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import ErrorMessage from "./uielements/ErrorMessage.svelte";
    import SuccessMessage from "./uielements/SuccessMessage.svelte";
    import WarningMessage from "./uielements/WarningMessage.svelte";
    import Wizard from "./uielements/Wizard.svelte";

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
            await submit();
            return false;
        }
        return true;
    }

    async function submit() {
        if (rewardsAddress === "") {
            apiClient.signOut();
            successful = true;
            rewardAddress.update((_) => rewardsAddress);
            return;
        }

        dispatch("addressInput", [rewardsAddress, privilegedLabUserCredential]);
    }

    function cancel() {
        dispatch("userCanceled");
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            When a queue entry finishes playing, the amount it cost to enqueue is distributed evenly among eligible
            users.
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
                Banano address for rewards
                {#if rewardsAddress != ""}
                    (leave blank to stop receiving rewards)
                {/if}
            </label>
            <div class="mt-1 flex rounded-md shadow-sm">
                <input
                    on:input={() => {
                        failureReason = "";
                        successful = false;
                    }}
                    on:keydown={handleEnter}
                    type="text"
                    name="rewards_address"
                    id="rewards_address"
                    class="dark:bg-gray-950 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500 flex-1 block w-full rounded-md text-sm border {failureReason !==
                    ''
                        ? 'border-red-600'
                        : 'border-gray-300'} p-2"
                    placeholder="ban_"
                    bind:value={rewardsAddress}
                />
            </div>
            {#if failureReason !== ""}
                <div class="mt-3">
                    <ErrorMessage>{failureReason}</ErrorMessage>
                </div>
            {:else if successful}
                {#if rewardsAddress == ""}
                    <SuccessMessage>
                        Successfully removed rewards address. You won't receive rewards anymore.
                    </SuccessMessage>
                {/if}
            {/if}
            <p class="text-sm text-gray-700 dark:text-gray-300 mt-2">
                Setting an address will also allow you to chat with other users.
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
        {/await}
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
    <div slot="buttons" class="flex items-center flex-wrap">
        <ButtonButton color="purple" on:click={cancel}>Cancel</ButtonButton>
        <div class="grow" />
        <ButtonButton type="submit" on:click={submit}>Next</ButtonButton>
    </div>
</Wizard>
