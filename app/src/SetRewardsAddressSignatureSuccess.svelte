<script lang="ts">
    import { onDestroy } from "svelte";

    import { navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import { badRepresentative, rewardAddress, rewardBalance } from "./stores";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import SuccessMessage from "./uielements/SuccessMessage.svelte";
    import Wizard from "./uielements/Wizard.svelte";

    export let rewardsAddress: string;

    function close() {
        navigate("/");
    }

    onDestroy(async () => {
        let rewardInfo = await apiClient.rewardInfo();

        rewardAddress.update((_) => rewardInfo.getRewardsAddress());
        rewardBalance.update((_) => rewardInfo.getRewardBalance());
        badRepresentative.update((_) => rewardInfo.getBadRepresentative());
    });
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            At the end of every video, the amount paid to enqueue the video is distributed evenly among eligible users.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Now that you have set an address for rewards, you can be one of these users too! Fraud prevention measures
            apply.
        </p>
    </div>
    <div slot="main-content">
        <SuccessMessage>
            Successfully updated rewards address.
        </SuccessMessage>
        <span class="font-mono text-sm">{rewardsAddress}</span>
        <p class="mt-8">You can now receive rewards for watching, participate in chat and other JungleTV features.</p>
        <p class="mt-8">
            If you are watching JungleTV in another window or tab, please refresh it to ensure you'll be rewarded.
        </p>
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <div class="grow" />
        <ButtonButton on:click={close}>Begin watching</ButtonButton>
    </div>
</Wizard>
