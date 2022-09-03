<script lang="ts">
    import { openUserProfile } from "../profile_utils";
    import { buildMonKeyURL } from "../utils";
    import VisibilityGuard from "../VisibilityGuard.svelte";

    interface UserRepresentation {
        getAddress(): string;
        hasNickname(): boolean;
        getNickname(): string;
    }

    export let user: UserRepresentation;

    function openProfile() {
        openUserProfile(user.getAddress());
    }
</script>

<span on:click={openProfile} class="cursor-pointer">
    <VisibilityGuard divClass="inline" let:visible>
        {#if visible}
            <img src={buildMonKeyURL(user.getAddress())} alt="&nbsp;" title="" class="inline h-7 -ml-1 -mt-4 -mb-3" />
        {:else}
            <div class="inline-block h-7 w-7 -ml-1 -mt-4 -mb-3" />
        {/if}
    </VisibilityGuard>

    {#if user.hasNickname()}
        <span class="mr-4 text-sm font-semibold">{user.getNickname()}</span>
    {:else}
        <span class="mr-4 text-xs font-mono">{user.getAddress().substring(0, 14)}</span>
    {/if}
</span>
