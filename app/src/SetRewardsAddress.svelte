<script lang="ts">
    import { navigate } from "svelte-navigator";
    import { apiClient } from "./api_client";

    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import { onDestroy } from "svelte";
    import SetRewardsAddressAddressInput from "./SetRewardsAddressAddressInput.svelte";
    import SetRewardsAddressFailure from "./SetRewardsAddressFailure.svelte";
    import SetRewardsAddressSignMessage from "./SetRewardsAddressSignMessage.svelte";
    import SetRewardsAddressSignatureSuccess from "./SetRewardsAddressSignatureSuccess.svelte";
    import SetRewardsAddressSuccess from "./SetRewardsAddressSuccess.svelte";
    import SetRewardsAddressUnopenedAccount from "./SetRewardsAddressUnopenedAccount.svelte";
    import SetRewardsAddressVerification from "./SetRewardsAddressVerification.svelte";
    import {
        LabSignInOptions,
        PermissionLevel,
        type SignInMessageToSign,
        type SignInProgress,
        type SignInVerification,
    } from "./proto/jungletv_pb";
    import { rewardAddress } from "./stores";

    let step = 0;
    let processID: string;
    let rewardsAddress = "";
    let viaSignature = false;
    let privilegedLabUserCredential = "";
    let failureReason = "";
    let verification: SignInVerification;
    let messageToSign: SignInMessageToSign;
    function onAddressInput(event: CustomEvent<[string, string, boolean]>) {
        rewardsAddress = event.detail[0];
        privilegedLabUserCredential = event.detail[1];
        viaSignature = event.detail[2];
        monitorProcess();
    }
    function onUserCanceled() {
        step = 0;
        processID = undefined;
        if (monitorProcessRequest !== undefined) {
            monitorProcessRequest.close();
        }
    }

    onDestroy(() => {
        if (monitorProcessRequest !== undefined) {
            try {
                monitorProcessRequest.close();
            } catch {}
        }
    });
    let monitorProcessRequest: Request;

    function monitorProcess() {
        monitorProcessRequest = apiClient.signIn(
            rewardsAddress,
            viaSignature,
            handleUpdate,
            (code, msg) => {
                if (code == 0 || step == 3 || step == 2) {
                    return;
                }
                if (code == 2 && msg.includes("Response closed")) {
                    setTimeout(monitorProcess, 1000);
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
            },
            processID,
            buildLabSignInOptions()
        );
    }

    function buildLabSignInOptions(): LabSignInOptions {
        if (!globalThis.LAB_BUILD) {
            return undefined;
        }

        const options = new LabSignInOptions();
        options.setDesiredPermissionLevel(PermissionLevel.USER);
        if (privilegedLabUserCredential) {
            options.setDesiredPermissionLevel(PermissionLevel.ADMIN);
            options.setCredential(privilegedLabUserCredential);
        }
        return options;
    }

    function handleUpdate(p: SignInProgress) {
        if (p.hasVerification()) {
            verification = p.getVerification();
            processID = verification.getProcessId();
            step = 1;
        } else if (p.hasMessageToSign()) {
            messageToSign = p.getMessageToSign();
            processID = messageToSign.getProcessId();
            step = 5;
        } else if (p.hasExpired()) {
            step = 3;
            if (monitorProcessRequest !== undefined) {
                monitorProcessRequest.close();
            }
        } else if (p.hasResponse()) {
            apiClient.saveAuthToken(p.getResponse().getAuthToken(), p.getResponse().getTokenExpiration().toDate());
            rewardAddress.update((_) => rewardsAddress);
            step = viaSignature ? 6 : 2;
            if (monitorProcessRequest !== undefined) {
                monitorProcessRequest.close();
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
    <SetRewardsAddressVerification on:userCanceled={onUserCanceled} {verification} />
{:else if step == 2}
    <SetRewardsAddressSuccess {rewardsAddress} />
{:else if step == 3}
    <SetRewardsAddressFailure on:tryAgain={onUserCanceled} />
{:else if step == 4}
    <SetRewardsAddressUnopenedAccount on:userCanceled={onUserCanceled} />
{:else if step == 5}
    <SetRewardsAddressSignMessage on:userCanceled={onUserCanceled} {messageToSign} {rewardsAddress} />
{:else if step == 6}
    <SetRewardsAddressSignatureSuccess {rewardsAddress} />
{/if}
