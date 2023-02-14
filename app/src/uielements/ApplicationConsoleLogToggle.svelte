<script lang="ts">
    export let id: string;
    export let label: string;
    export let checked: boolean = false;
</script>

<div class="flex flex-row">
    <div class="flex items-center">
        <input
            {id}
            name={id}
            type="checkbox"
            bind:checked
            class="focus:ring-yellow-500 h-3 w-3 text-yellow-600 border-gray-300 dark:border-black rounded"
        />
    </div>
    <label for={id} class="ml-1.5 font-medium text-gray-700 dark:text-gray-300">{label}</label>
</div>
