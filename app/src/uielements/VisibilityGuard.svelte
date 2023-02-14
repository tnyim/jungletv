<script>
    import { onMount } from "svelte";

    export let divClass = "";

    let el = null;

    let visible = false;
    let hasBeenVisible = false;

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            visible = entries.some((e) => e.isIntersecting);
            hasBeenVisible = hasBeenVisible || visible;
        });
        observer.observe(el);

        return () => observer.unobserve(el);
    });
</script>

<div bind:this={el} class={divClass}>
    <slot {visible} {hasBeenVisible} />
</div>
