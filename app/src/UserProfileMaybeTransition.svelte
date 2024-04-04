<script lang="ts">
    import { userProfileReceive, userProfileSend } from "./profile_utils";

    export let hasTransitionOut: boolean;

    // this is a dirty hack to let the player expansion animation work properly when leaving the profile page

    // specifying an out: transition, even with a duration of 0, forces the profile page to briefly coexist with the player container,
    // which causes some jarring repaints and causes the animation to give up (due to considering it's a normal resize, not part of the transition to the full-size player)
</script>

{#if hasTransitionOut}
    <div
        in:userProfileReceive={{ key: "userProfile" }}
        out:userProfileSend={{
            key: "userProfile",
            // the crossfade animation doesn't work properly inside the modal and these settings help hide a ugly repaint:
            delay: 250,
            duration: 0,
            // (the modal has it's own animations we can't properly integrate with the crossfade, anyway)
        }}
        class="flex flex-col min-h-full"
    >
        <slot />
    </div>
{:else}
    <div in:userProfileReceive={{ key: "userProfile" }} class="flex flex-col min-h-full">
        <slot />
    </div>
{/if}
