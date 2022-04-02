<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import ChatEmojiPicker from "./ChatEmojiPicker.svelte";
    import ChatGifPicker from "./ChatGifPicker.svelte";
    import type { ChatGifSearchResult } from "./proto/jungletv_pb";
    import SidebarTabButton from "./SidebarTabButton.svelte";
    import { chatMediaPickerMode } from "./stores";

    let selectedTab: "emoji" | "gifs" = $chatMediaPickerMode;

    $: {
        $chatMediaPickerMode = selectedTab;
        localStorage.setItem("chatMediaPickerMode", selectedTab);
    }

    const dispatch = createEventDispatcher<{ gifSelected: ChatGifSearchResult }>();
</script>

<div class="flex flex-row flex-wrap px-1 border-l border-r border-gray-300 dark:border-gray-700">
    <SidebarTabButton selected={selectedTab == "emoji"} on:click={() => (selectedTab = "emoji")}>
        Emoji
    </SidebarTabButton>
    <SidebarTabButton selected={selectedTab == "gifs"} on:click={() => (selectedTab = "gifs")}>GIFs</SidebarTabButton>
</div>
<div class="h-72">
    {#if selectedTab == "emoji"}
        <ChatEmojiPicker on:emoji-click on:closePicker />
    {:else if selectedTab == "gifs"}
        <ChatGifPicker on:click={(e) => dispatch("gifSelected", e.detail)} on:closePicker />
    {/if}
</div>
