<script lang="ts">
    import Moon from "svelte-loading-spinners/dist/ts/Moon.svelte";
    import { navigate, link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import ErrorMessage from "./ErrorMessage.svelte";
    import { rewardAddress } from "./stores";
    import SuccessMessage from "./SuccessMessage.svelte";
    import Wizard from "./Wizard.svelte";

    let failureReason: string = "";
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

    let submitPromise = (async () => {})();

    function submit() {
        failureReason = "";
        successful = false;
        submitPromise = (async () => {
            if (rewardsAddress === "") {
                apiClient.signOut();
                successful = true;
                rewardAddress.update((_) => rewardsAddress);
                return;
            }
            try {
                await apiClient.signIn(rewardsAddress);
                successful = true;
                rewardAddress.update((_) => rewardsAddress);
            } catch (ex) {
                if (ex === "invalid reward address") {
                    failureReason = "Invalid address for rewards. Make sure this is a valid Banano address.";
                } else {
                    failureReason = "Failed to save address due to internal error.";
                }
            }
        })();
    }

    function closeRewards() {
        navigate("/");
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600">
            At the end of every video, the amount paid to enqueue the video is distributed evenly among eligible users.
        </p>
        <p class="mt-1 text-sm text-gray-600">
            Some videos have e.g. regional restrictions and may not display for you. You will still be rewarded as long
            as you keep the JungleTV page open throughout the duration of the video.
        </p>
        <p class="mt-1 text-sm text-gray-600">Fraud prevention measures apply.</p>
    </div>
    <div slot="main-content">
        {#await rewardInfoPromise}
            <p>Loading...</p>
        {:then}
            <label for="rewards_address" class="block text-sm font-medium text-gray-700">
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
                    type="text"
                    name="rewards_address"
                    id="rewards_address"
                    class="focus:ring-yellow-500 focus:border-yellow-500 flex-1 block w-full rounded-md sm:text-sm border {failureReason !==
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
                {:else}
                    <SuccessMessage>
                        Successfully updated rewards address. If you are watching JungleTV in another window or tab,
                        please refresh it to ensure you'll be rewarded.<br />
                        <a use:link href="/" class="text-blue-600 hover:underline">Begin watching</a>
                    </SuccessMessage>
                {/if}
            {/if}
        {/await}
    </div>
    <div slot="buttons">
        <button
            type="button"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
            on:click={closeRewards}
        >
            Close
        </button>
        {#await submitPromise}
            <button
                disabled
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-300 cursor-default"
            >
                <span class="mr-1"><Moon size="20" color="#FFFFFF" unit="px" duration="1s" /></span>
                Saving
            </button>
        {:then}
            <button
                type="submit"
                class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
                on:click={submit}
            >
                Save
            </button>
        {/await}
    </div>
</Wizard>
