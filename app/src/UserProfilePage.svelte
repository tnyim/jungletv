<script lang="ts">
    import UserProfile from "./UserProfile.svelte";

    export let userAddressOrApplicationID: string;
    export let selectedTab: string = undefined;
</script>

<div class="w-full min-h-full">
    <UserProfile {userAddressOrApplicationID} {selectedTab} mode="page" />
</div>
