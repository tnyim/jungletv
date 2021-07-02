<script lang="ts">
    import { apiClient } from "./api_client";
    import { createEventDispatcher } from "svelte";
    import ErrorMessage from "./ErrorMessage.svelte";
    import Wizard from "./Wizard.svelte";
    import { rewardAddress } from "./stores";
    import SuccessMessage from "./SuccessMessage.svelte";

    const dispatch = createEventDispatcher();

    export let failureReason: string = "";
    let successful = false;
    let rewardsAddress: string = "";

    let rewardInfoPromise = (async function () {
        try {
            let rewardInfo = await apiClient.rewardInfo();

            rewardsAddress = rewardInfo.getRewardAddress();
            rewardAddress.update((_) => rewardsAddress);
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

        dispatch("addressInput", rewardsAddress);
    }

    function cancel() {
        dispatch("userCanceled");
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            At the end of every video, the amount paid to enqueue the video is distributed evenly among eligible users.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Some videos have e.g. regional restrictions and may not display for you. You will still be rewarded as long
            as you keep the JungleTV page open throughout the duration of the video.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Fraud prevention measures apply.</p>
    </div>
    <div slot="main-content">
        {#await rewardInfoPromise}
            <p>Loading...</p>
        {:then}
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
                    class="dark:bg-gray-950 focus:ring-yellow-500 focus:border-yellow-500 flex-1 block w-full rounded-md sm:text-sm border {failureReason !==
                    ''
                        ? 'border-red-600'
                        : 'border-gray-300'} p-2"
                    placeholder="ban_"
                    bind:value={rewardsAddress}
                />
            </div>
            {#if failureReason !== ""}
                <ErrorMessage>{failureReason}</ErrorMessage>
            {:else if successful}
                {#if rewardsAddress == ""}
                    <SuccessMessage>
                        Successfully removed rewards address. You won't receive rewards anymore.
                    </SuccessMessage>
                {/if}
            {/if}
            <p class="text-sm text-gray-700 dark:text-gray-300 mt-2">Setting an address will also allow you to chat with other users.</p>
        {/await}
    </div>
    <div slot="buttons">
        <button
            type="button"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
            on:click={cancel}
        >
            Cancel
        </button>
        <button
            type="submit"
            class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
            on:click={submit}
        >
            Next
        </button>
    </div>
</Wizard>
