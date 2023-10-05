<script lang="ts">
    import { openUserProfile } from "../profile_utils";
    import { User, UserRole } from "../proto/common_pb";
    import VisibilityGuard from "../uielements/VisibilityGuard.svelte";
    import { buildMonKeyURL } from "../utils";

    export let user: User;
    export let alwaysShowAddress = false;

    function openProfile() {
        openUserProfile(user.getAddress());
    }
</script>

<button on:click={openProfile}>
    {#if user.getRolesList().includes(UserRole.APPLICATION)}
        <div class="inline-block h-7 w-7 -ml-1 -mt-4 -mb-3">
            <i class="fas fa-robot text-gray-600 dark:text-gray-400" />
        </div>
    {:else}
        <VisibilityGuard divClass="inline" let:visible>
            {#if visible}
                <img
                    src={buildMonKeyURL(user.getAddress())}
                    alt="&nbsp;"
                    title=""
                    class="inline h-7 w-7 -ml-1 -mt-4 -mb-3"
                />
            {:else}
                <div class="inline-block h-7 w-7 -ml-1 -mt-4 -mb-3" />
            {/if}
        </VisibilityGuard>
    {/if}

    {#if user.hasNickname()}
        <span class="text-sm font-semibold">{user.getNickname()}</span>
        {#if alwaysShowAddress}
            <span class="ml-1.5 text-xs font-mono" style="font-size: 10px">{user.getAddress().substring(0, 14)}</span>
        {/if}
    {:else}
        <span class="text-xs font-mono">{user.getAddress().substring(0, 14)}</span>
    {/if}
</button>
