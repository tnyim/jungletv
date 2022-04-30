<script>
    import { onMount } from "svelte";

    let el = null;

    let visible = false;
    let hasBeenVisible = false;

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            visible = entries.some(e => e.isIntersecting);
            hasBeenVisible = hasBeenVisible || visible;
        });
        observer.observe(el);

        return () => observer.unobserve(el);
    });
</script>

<div bind:this={el}>
    <slot {visible} {hasBeenVisible} />
</div>
