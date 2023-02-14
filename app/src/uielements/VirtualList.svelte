<script lang="ts">
    import VirtualListItem from "./VirtualListItem.svelte";

    export let items: Array<any>;

    let visible = {};

    const observer = new IntersectionObserver((entries) => {
        for (let entry of entries) {
            let attr = entry.target.getAttribute("data-virtual-list-index");
            if (attr != null) {
                visible[parseInt(attr)] = entry.isIntersecting;
            }
        }
        visible = visible;
    });
</script>

{#each items as item, index}
    <VirtualListItem visible={visible[index] == true} {observer} {index} let:visible>
        <slot {item} {index} {visible} />
    </VirtualListItem>
{:else}
    <slot name="else" />
{/each}
