<script lang="ts">
    import type { NavigationDestination } from "./navigationStores";
    import { rewardAddress } from "./stores";
    import NavbarLink from "./uielements/NavbarLink.svelte";
    export let destination: NavigationDestination;
</script>

<NavbarLink
    color={destination.color}
    iconClasses={destination.icon}
    label={typeof destination.label === "string"
        ? destination.label
        : $rewardAddress
          ? destination.label[0]
          : destination.label[1]}
    href={typeof destination.href === "string"
        ? destination.href
        : $rewardAddress
          ? destination.href[0]
          : destination.href[1]}
    backgroundClasses={destination.background}
    highlighted={destination.highlighted}
/>
