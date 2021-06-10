<script lang="ts">
    export let selected = false;
</script>

<div on:click class="{selected ? "font-semibold" : "text-purple-700"} text-lg px-1.5 py-1 rounded hover:shadow-lg hover:bg-gray-200 outline-none focus:outline-none ease-linear transition-all duration-150 cursor-pointer">
    <slot></slot>
</div>