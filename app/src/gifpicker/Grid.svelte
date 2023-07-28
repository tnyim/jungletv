<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ChatGifSearchResult } from "../proto/jungletv_pb";
    import GifComponent from "./Gif.svelte";

    /**
     * Minimum size for each column, in pixels. The maximum size is `columnSize * 2 + gap`.
     *
     * @default 160px
     */
    export let columnSize = 160;

    /** Default size of each row. */
    export const defaultRowSize = 8;
    let rowSize = defaultRowSize;

    /**
     * Gap between GIFs, in pixels.
     *
     * @default 8px
     */
    export let gap = 8;

    /**
     * In-line, horizontal scrolling grid.
     *
     * @default false
     */
    export let inline = false;

    /** Set `resetPosition` to true to scroll to the top-left corner. */
    export let resetPosition = false;

    /** Array of GIFs to display. */
    export let gifs: ChatGifSearchResult[] = [];

    const dispatch = createEventDispatcher<{ click: ChatGifSearchResult }>();

    /** Preserves the aspect ratio of the GIFs. */
    const watch = (el: HTMLElement) => {
        // To avoid a bug, we keep the last two widths
        let widths = [-1, -1];
        const observer = new ResizeObserver(() => {
            // If we are oscillating between two widths, abort
            if (el.offsetWidth === widths[0]) return;
            widths = [widths[1], el.offsetWidth];
            const columns = window.getComputedStyle(el).getPropertyValue("grid-template-columns").split(" ").length;
            const available = el.offsetWidth - (columns - 1) * gap;
            // Compute the row size to keep the aspect ratio
            rowSize = ((available / columns) * (defaultRowSize + gap)) / columnSize - gap;
        });
        observer.observe(el);

        return {
            destroy() {
                observer.unobserve(el);
            },
        };
    };

    let grid: HTMLElement;
    $: if (resetPosition) {
        grid?.scrollTo({ top: 0, left: 0 });
        resetPosition = false;
    }
</script>

<div
    class="grid"
    class:inline
    style:--column="{columnSize}px"
    style:--row="{rowSize}px"
    style:--gap="{gap}px"
    use:watch
    bind:this={grid}
>
    {#each gifs as gif (gif.getId())}
        <button
            style:grid-row-end="span {Math.ceil(
                (columnSize * gif.getHeight()) / gif.getWidth() / (defaultRowSize + gap)
            )}"
            type="button"
            on:click={() => dispatch("click", gif)}
        >
            <GifComponent {gif} />
        </button>
    {/each}
</div>

<style lang="css">
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(var(--column, 160px), 1fr));
        grid-auto-rows: var(--row, 8px);
        gap: var(--gap, 8px);
        align-items: stretch;
        border-radius: 4px;
    }
    .grid.inline {
        display: flex;
        height: var(--column, 160px);
        overflow: auto;
    }

    button {
        position: relative;
        shrink: 0;
        padding: 0;
        margin: 0;
        overflow: hidden;
        background: none;
        border: 0;
        border-radius: 4px;
    }

    button::before {
        position: absolute;
        inset: 0;
        content: "";
        transition: 0.2s box-shadow;
    }

    button:focus,
    button:active {
        outline: 0;
    }

    button:focus::before,
    button:active::before {
        box-shadow: 0 0 1em rgb(245, 158, 11) inset, 0 0 1em white inset;
    }

    button > :global(.gif) {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
