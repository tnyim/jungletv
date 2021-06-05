<script lang="ts">
    import Player from "./Player.svelte";
    import Queue from "./Queue.svelte";
</script>

<div class="flex-grow pr-96 min-h-full">
    <Player />
</div>
<div class="right-0 block fixed top-16 bottom-0 overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-96 z-10">
    <Queue />
</div>
