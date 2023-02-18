<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Moon } from "svelte-loading-spinners";
    import ButtonButton from "./uielements/ButtonButton.svelte";
    import Wizard from "./uielements/Wizard.svelte";

    const dispatch = createEventDispatcher();

    function cancel() {
        dispatch("userCanceled");
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            In Banano, accounts (addresses) must receive a transaction before they are "opened" and their representative
            can be changed.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            After you open the account, JungleTV will ask you to temporarily change its representative to a random
            address it will specify, in order to prove that you own this account.
        </p>
    </div>
    <div slot="main-content">
        <div>
            The account you specified is still unopened. You must receive some Banano in the account in order to open it
            and to change its representative.
        </div>
        <div class="mt-8">
            If this is your first time using Banano and you do not have any to send to your new account, you can get a
            small amount at
            <a href="https://monkeytalks.cc/" target="_blank" rel="noopener">MonkeyTalks</a>
            (click the Faucet button in the top right corner).
        </div>
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <ButtonButton color="purple" on:click={cancel}>Cancel</ButtonButton>
        <div class="flex-grow" />
        <ButtonButton disabled colorClasses="bg-gray-300">
            <span class="mr-1"><Moon size="20" color="#FFFFFF" unit="px" duration="2s" /></span>
            Awaiting account opening
        </ButtonButton>
    </div>
</Wizard>
