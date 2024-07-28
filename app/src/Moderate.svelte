<script lang="ts">
    import { Route } from "svelte-navigator";
    import { modalPrompt } from "./modal/modal";
    import ApplicationConsole from "./moderation/ApplicationConsole.svelte";
    import ApplicationDetails from "./moderation/ApplicationDetails.svelte";
    import ApplicationFileEditor from "./moderation/ApplicationFileEditor.svelte";
    import Applications from "./moderation/Applications.svelte";
    import ChatModeration from "./moderation/ChatModeration.svelte";
    import DisallowedMedia from "./moderation/DisallowedMedia.svelte";
    import Documents from "./moderation/Documents.svelte";
    import EditDocument from "./moderation/EditDocument.svelte";
    import Overview from "./moderation/Overview.svelte";
    import QueueModeration from "./moderation/QueueModeration.svelte";
    import Raffles from "./moderation/Raffles.svelte";
    import Technical from "./moderation/Technical.svelte";
    import UserBans from "./moderation/UserBans.svelte";
    import UserChatHistory from "./moderation/UserChatHistory.svelte";
    import UserVerifications from "./moderation/UserVerifications.svelte";
    import VipUsers from "./moderation/VIPUsers.svelte";
    import NotFound from "./NotFound.svelte";
    import { openUserProfile } from "./profile_utils";
    import { mainContentBottomPadding, playerOpen } from "./stores";
    import NavbarButton from "./uielements/NavbarButton.svelte";
    import NavbarLink from "./uielements/NavbarLink.svelte";
</script>

<div class="grow overflow-x-hidden flex flex-col lg:flex-row">
    <div class="lg:w-32 lg:flex-shrink-0 lg:min-w-32">
        <ul
            class="menu list-none grid gap-3 auto-rows-min p-3 lg:w-32
            {$playerOpen ? 'lg:pb-64' : ''}
            lg:fixed lg:top-16 lg:bottom-0 lg:overflow-y-auto lg:overflow-x-hidden"
        >
            <li><NavbarLink iconClasses="fas fa-street-view" label="Overview" href="/moderate" /></li>
            <li><NavbarLink iconClasses="fas fa-robot" label="Applications" href="/moderate/applications" /></li>
            <li><NavbarLink iconClasses="fas fa-comments" label="Chat" href="/moderate/chat" /></li>
            <li class="text-xs font-semibold uppercase text-gray-500 -mb-3 menu-category">Media</li>
            <li><NavbarLink iconClasses="fas fa-list-ol" label="Queue" href="/moderate/media/queue" /></li>
            <li>
                <NavbarLink iconClasses="fas fa-stop-circle" label="Disallowed" href="/moderate/media/disallowed" />
            </li>
            <li><NavbarLink iconClasses="fas fa-file-alt" label="Documents" href="/moderate/documents" /></li>
            <li class="text-xs font-semibold uppercase text-gray-500 -mb-3 menu-category">Users</li>
            <li>
                <NavbarButton
                    iconClasses="fas fa-id-card"
                    label="Profile"
                    on:click={async () => {
                        let address = await modalPrompt(
                            "Enter the address of the user whose profile to view:",
                            "View profile",
                            "",
                            "",
                            "View",
                            "Cancel",
                        );
                        if (address === null) {
                            return;
                        }
                        openUserProfile(address);
                    }}
                />
            </li>
            <li><NavbarLink iconClasses="fas fa-user-slash" label="Banned" href="/moderate/users/banned" /></li>
            <li><NavbarLink iconClasses="fas fa-user-check" label="Verified" href="/moderate/users/verified" /></li>
            <li><NavbarLink iconClasses="fas fa-crown" label="VIP" href="/moderate/users/vip" /></li>
            <li class="text-xs font-semibold uppercase text-gray-500 -mb-3 menu-category">Special</li>
            <li><NavbarLink iconClasses="fas fa-ticket-alt" label="Raffles" href="/moderate/raffles" /></li>
            <li><NavbarLink iconClasses="fas fa-wrench" label="Technical" href="/moderate/technical" /></li>
        </ul>
    </div>
    <div class="grow min-w-0 {$playerOpen && $mainContentBottomPadding == '' ? 'pb-64' : ''}">
        <Route path="/" component={Overview} />
        <Route path="applications/*">
            <Route path="/" component={Applications} />
            <Route path=":applicationID" component={ApplicationDetails} />
            <Route path=":applicationID/files/:fileName" component={ApplicationFileEditor} />
            <Route path=":applicationID/console" component={ApplicationConsole} />
        </Route>
        <Route path="chat" component={ChatModeration} />
        <Route path="users/:address/chathistory" component={UserChatHistory} />
        <Route path="media/queue" component={QueueModeration} />
        <Route path="media/disallowed" component={DisallowedMedia} />
        <Route path="documents/*">
            <Route path="/" component={Documents} />
            <Route path=":documentID" component={EditDocument} />
        </Route>
        <Route path="users/banned" component={UserBans} />
        <Route path="users/verified" component={UserVerifications} />
        <Route path="users/vip" component={VipUsers} />
        <Route path="technical" component={Technical} />
        <Route path="raffles" component={Raffles} />
        <Route path="*">
            <NotFound />
        </Route>
    </div>
</div>

<style>
    .menu {
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        scrollbar-width: none;
    }
    .menu::-webkit-scrollbar {
        display: none;
    }
    .menu-category {
        grid-column-start: 1;
        grid-column-end: -1;
    }
</style>
