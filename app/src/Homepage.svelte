<script lang="ts">
    import Player from "./Player.svelte";
    import Queue from "./Queue.svelte";
    import { fly, scale } from "svelte/transition";
    import { activityChallengeReceived } from "./stores";
    import { apiClient } from "./api_client";

    let latestActivityChallenge = "";
    activityChallengeReceived.subscribe((challenge) => (latestActivityChallenge = challenge));

    async function stillWatching() {
        await apiClient.submitActivityChallenge(latestActivityChallenge);
        latestActivityChallenge = "";
    }

    let queueExpanded = true;
</script>

<div class="flex-grow {queueExpanded ? 'pr-96' : ''} min-h-full relative">
    {#if latestActivityChallenge != ""}
        <div
            class="absolute left-0 top-3/4 w-72 bg-white flex flex-row p-2 rounded-r space-x-2"
            transition:fly|local={{ x: -384, duration: 400 }}
        >
            <div>
                <h3>Are you still watching?</h3>
                <p class="text-xs text-gray-600">To receive rewards, confirm you're still watching.</p>
            </div>
            <button
                type="submit"
                class="inline-flex float-right items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
                on:click={stillWatching}
            >
                Still watching
            </button>
        </div>
    {/if}
    <Player />
</div>
{#if queueExpanded}
    <div
        class="right-0 block fixed top-16 bottom-0 overflow-y-auto flex-row flex-nowrap overflow-hidden shadow-xl bg-white w-96 z-10"
        transition:fly|local={{ x: 384, duration: 400 }}
    >
        <Queue on:collapseQueue={() => (queueExpanded = false)} />
    </div>
{:else}
    <div
        transition:scale|local={{ duration: 400, start: 8, opacity: 1 }}
        class="right-0 fixed top-16 shadow-xl opacity-50 hover:bg-gray-700 hover:opacity-75 text-white w-10 h-10 z-10 cursor-pointer text-xl text-center flex flex-row place-content-center items-center ease-linear transition-all duration-150"
        on:click={() => (queueExpanded = true)}
    >
        <i class="fas fa-th-list" />
    </div>
{/if}
