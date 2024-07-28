<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import RunningApplications from "./RunningApplications.svelte";
    import StatusOverview from "./StatusOverview.svelte";

    const dispatch = createEventDispatcher();

    onMount(() => {
        dispatch("overview");
    });
</script>

<div class="mt-6">
    <StatusOverview />
</div>
<div class="mt-6 px-2">
    <RunningApplications />
</div>
