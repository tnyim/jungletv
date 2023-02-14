<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    import ChatEmojiPicker from "./ChatEmojiPicker.svelte";
    import ChatGifPicker from "./ChatGifPicker.svelte";
    import ChatSettings from "./ChatSettings.svelte";
    import { chatMediaPickerMode } from "./stores";
    import TabButton from "./uielements/TabButton.svelte";

    let selectedTab: "emoji" | "gifs" | "settings" = $chatMediaPickerMode;

    $: {
        $chatMediaPickerMode = selectedTab;
        localStorage.setItem("chatMediaPickerMode", selectedTab);
    }

    let searchQuery: string;

    const dispatch = createEventDispatcher();

    function onKeyDown(ev: KeyboardEvent) {
        if (ev.key == "Escape") {
            dispatch("closePicker");
        }
    }
</script>

<div on:keydown={onKeyDown} transition:slide|local={{ duration: 200 }}>
    <div class="flex flex-row flex-wrap px-1 border-l border-r border-gray-300 dark:border-gray-700">
        <TabButton selected={selectedTab == "emoji"} on:click={() => (selectedTab = "emoji")}>Emoji</TabButton>
        <TabButton selected={selectedTab == "gifs"} on:click={() => (selectedTab = "gifs")}>GIFs</TabButton>
        <div class="flex-grow" />
        <TabButton selected={selectedTab == "settings"} on:click={() => (selectedTab = "settings")}>Settings</TabButton>
        <TabButton selected={false} on:click={() => dispatch("closePicker")} extraClasses="w-8 text-center">
            <i class="fas fa-times" />
        </TabButton>
    </div>
    <div class="h-72">
        {#if selectedTab == "emoji"}
            <ChatEmojiPicker on:emoji-click bind:searchQuery />
        {:else if selectedTab == "gifs"}
            <ChatGifPicker
                on:click={(e) => dispatch("gifSelected", e.detail)}
                bind:mediaPickerSearchValue={searchQuery}
            />
        {:else if selectedTab == "settings"}
            <ChatSettings />
        {/if}
    </div>
</div>
