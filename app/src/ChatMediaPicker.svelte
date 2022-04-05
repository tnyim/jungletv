<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    import ChatEmojiPicker from "./ChatEmojiPicker.svelte";
    import ChatGifPicker from "./ChatGifPicker.svelte";
    import ChatSettings from "./ChatSettings.svelte";
    import SidebarTabButton from "./SidebarTabButton.svelte";
    import { chatMediaPickerMode } from "./stores";

    let selectedTab: "emoji" | "gifs" | "settings" = $chatMediaPickerMode;

    $: {
        $chatMediaPickerMode = selectedTab;
        localStorage.setItem("chatMediaPickerMode", selectedTab);
    }

    const dispatch = createEventDispatcher();

    function onKeyDown(ev: KeyboardEvent) {
        if (ev.key == "Escape") {
            dispatch("closePicker");
        }
    }
</script>

<div on:keydown={onKeyDown} transition:slide|local={{ duration: 200 }}>
    <div class="flex flex-row flex-wrap px-1 border-l border-r border-gray-300 dark:border-gray-700">
        <SidebarTabButton selected={selectedTab == "emoji"} on:click={() => (selectedTab = "emoji")}>
            Emoji
        </SidebarTabButton>
        <SidebarTabButton selected={selectedTab == "gifs"} on:click={() => (selectedTab = "gifs")}
            >GIFs
        </SidebarTabButton>
        <div class="flex-grow" />
        <SidebarTabButton selected={selectedTab == "settings"} on:click={() => (selectedTab = "settings")}
            >Settings</SidebarTabButton
        >
        <SidebarTabButton selected={false} on:click={() => dispatch("closePicker")} extraClasses="w-8 text-center">
            <i class="fas fa-times" />
        </SidebarTabButton>
    </div>
    <div class="h-72">
        {#if selectedTab == "emoji"}
            <ChatEmojiPicker on:emoji-click />
        {:else if selectedTab == "gifs"}
            <ChatGifPicker on:click={(e) => dispatch("gifSelected", e.detail)} />
        {:else if selectedTab == "settings"}
            <ChatSettings />
        {/if}
    </div>
</div>
