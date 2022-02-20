<script lang="ts">
    import { openUserProfile } from "../profile_utils";

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
    <img
        src="https://monkey.banano.cc/api/v1/monkey/{user.getAddress()}?format=png"
        alt="&nbsp;"
        title=""
        class="inline h-7 -ml-1 -mt-4 -mb-3"
    />
    {#if user.hasNickname()}
        <span class="mr-4 text-sm font-semibold">{user.getNickname()}</span>
    {:else}
        <span class="mr-4 text-xs font-mono">{user.getAddress().substring(0, 14)}</span>
    {/if}
</span>
