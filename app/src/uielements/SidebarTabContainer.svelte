<script lang="ts">
    import { closeSidebarTab, openAndSwitchToSidebarTab, setSidebarTabTitle, type SidebarTab } from "../tabStores";

    // this exists solely to scope selectedTab

    export let selectedTab: SidebarTab;
</script>

<svelte:component
    this={selectedTab.component}
    {...selectedTab.props}
    on:openSidebarTab={(e) => openAndSwitchToSidebarTab(e.detail, selectedTab.id)}
    on:closeTab={() => closeSidebarTab(selectedTab.id)}
    on:setTabTitle={(e) => setSidebarTabTitle(selectedTab.id, e.detail)}
/>
