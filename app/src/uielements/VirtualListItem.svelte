<script lang="ts">
    import { onMount } from "svelte";

    export let observer: IntersectionObserver;
    export let visible: boolean;
    export let index: number;
    let el = null;

    onMount(() => {
        observer.observe(el);

        return () => observer.unobserve(el);
    });
</script>

<div bind:this={el} data-virtual-list-index={index}>
    <slot {visible} />
</div>
