<script lang="ts">
    import { navigate } from "svelte-navigator";
    import { closeModal } from "./modal/modal";
    import ButtonButton from "./uielements/ButtonButton.svelte";

    function accept() {
        closeModal();
        navigate("/points#nice");
    }
</script>

<div class="flex flex-col bg-gray-200 dark:bg-gray-800 text-black dark:text-gray-100 rounded-t-lg p-4">
    <p>
        Subscribe to <span class="font-semibold text-green-600 dark:text-green-400">JungleTV Nice</span> to solve fewer captchas
        and enjoy a number of other exclusive perks!
    </p>
</div>
<div
    class="flex flex-row justify-center px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 text-black dark:text-gray-100 rounded-b-lg"
>
    <ButtonButton color="purple" on:click={closeModal}>Dismiss</ButtonButton>
    <div class="flex-grow" />
    <ButtonButton type="submit" on:click={accept}>More information</ButtonButton>
</div>
