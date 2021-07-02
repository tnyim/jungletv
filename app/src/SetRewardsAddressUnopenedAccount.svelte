<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { Moon } from "svelte-loading-spinners";
    import Wizard from "./Wizard.svelte";

    const dispatch = createEventDispatcher();

    function cancel() {
        dispatch("userCanceled");
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            In Banano, accounts (addresses) must receive a transaction before they are "opened" and their representative can be changed.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            After you open the account, JungleTV will ask you to temporarily change its representative to a random address it will specify, in order to prove that you own this account.
        </p>
    </div>
    <div slot="main-content">
        <div>
            The account you specified is still unopened. You must receive some Banano in the account in order to open it and to change its representative.
        </div>
        <div class="mt-8">
            If this is your first time using Banano and you do not have any to send to your new account, you can get a small amount at
            <a href="https://monkeytalks.cc/"  target="_blank" rel="noopener" class="text-blue-600 hover:underline">MonkeyTalks</a>
            (click the Faucet button in the top right corner).
        </div>
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
            disabled
            class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-300 cursor-default"
        >
            <span class="mr-1"><Moon size="20" color="#FFFFFF" unit="px" duration="2s" /></span>
            Awaiting account opening
        </button>
    </div>
</Wizard>
