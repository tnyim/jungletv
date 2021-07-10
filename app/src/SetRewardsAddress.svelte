<script lang="ts">
    import { navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";

    import SetRewardsAddressFailure from "./SetRewardsAddressFailure.svelte";
    import SetRewardsAddressAddressInput from "./SetRewardsAddressAddressInput.svelte";
    import SetRewardsAddressVerification from "./SetRewardsAddressVerification.svelte";
    import SetRewardsAddressSuccess from "./SetRewardsAddressSuccess.svelte";
    import SetRewardsAddressUnopenedAccount from "./SetRewardsAddressUnopenedAccount.svelte";
    import { rewardAddress } from "./stores";
    import { setCookie } from "./cookie_utils";
    import type { SignInProgress, SignInVerification } from "./proto/jungletv_pb";
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { onDestroy } from "svelte";

    let step = 0;
    let rewardsAddress = "";
    let failureReason = "";
    export let verification: SignInVerification;
    function onAddressInput(event: CustomEvent<string>) {
        rewardsAddress = event.detail;
        monitorVerification();
    }
    function onUserCanceled() {
        step = 0;
        if (monitorTicketRequest !== undefined) {
            monitorTicketRequest.close();
        }
    }

    onDestroy(() => {
        if (monitorTicketRequest !== undefined) {
            try {
                monitorTicketRequest.close();
            } catch {}
        }
    });
    let monitorTicketRequest: Request;

    function monitorVerification() {
        monitorTicketRequest = apiClient.signIn(rewardsAddress, handleUpdate, (code, msg) => {
            if (code == 0 || step == 3 || step == 2) {
                return;
            }
            if (code == 2 && msg.includes("Response closed")) {
                setTimeout(monitorVerification, 1000);
                return;
            }
            step = 0;
            if (msg === "invalid reward address") {
                failureReason = "Invalid address for rewards. Make sure this is a valid Banano address.";
            } else if (msg === "rate limit reached") {
                failureReason = "Rate limited due to too many attempts to set an address for rewards.";
            } else {
                failureReason = "Failed to save address due to internal error. Code: " + code + " Message: " + msg;
            }
        });
    }

    function handleUpdate(p: SignInProgress) {
        if (p.hasVerification()) {
            verification = p.getVerification();
            step = 1;
        } else if (p.hasExpired()) {
            step = 3;
            if (monitorTicketRequest !== undefined) {
                monitorTicketRequest.close();
            }
        } else if (p.hasResponse()) {
            setCookie("auth-token", p.getResponse().getAuthToken(), p.getResponse().getTokenExpiration().toDate());
            rewardAddress.update((_) => rewardsAddress);
            step = 2;
            if (monitorTicketRequest !== undefined) {
                monitorTicketRequest.close();
            }
        } else if (p.hasAccountUnopened()) {
            step = 4;
        }
    }
</script>

{#if step == 0}
    <SetRewardsAddressAddressInput
        on:addressInput={onAddressInput}
        on:userCanceled={() => navigate("/")}
        bind:failureReason
    />
{:else if step == 1}
    <SetRewardsAddressVerification on:userCanceled={onUserCanceled} bind:verification />
{:else if step == 2}
    <SetRewardsAddressSuccess bind:rewardsAddress />
{:else if step == 3}
    <SetRewardsAddressFailure on:tryAgain={onUserCanceled} />
{:else if step == 4}
    <SetRewardsAddressUnopenedAccount on:userCanceled={onUserCanceled} />
{/if}
