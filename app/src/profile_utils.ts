import UserProfile from "./UserProfile.svelte";
import { modal } from "./stores";

export const openUserProfile = function (userAddress: string) {
    modal.set({
        component: UserProfile,
        props: { userAddress: userAddress },
        options: {
            closeButton: true,
            closeOnEsc: true,
            closeOnOuterClick: true,
            styleContent: {
                padding: '0'
            }
        },
    });
}