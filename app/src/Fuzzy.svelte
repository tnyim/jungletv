<script lang="ts">
    import Fuse from "fuse.js";
    /* inspired by https://github.com/metonym/svelte-fuzzy, but using a recent Fuse.js version and wrapping exactly how
    we want */

    export let query: string | Fuse.Expression = "";

    export let data = [];
    export let options: Partial<Fuse.IFuseOptions<any>> = {};
    export let result: Fuse.FuseResult<any>[] = [];

    $: fuse = new Fuse(data, {
        ...options,
        shouldSort: true,
        fieldNormWeight: 1,
    });
    $: if (data) fuse.setCollection(data);
    $: if (query || data) {
        result = fuse.search(query);
    } else {
        result = [];
    }
</script>
