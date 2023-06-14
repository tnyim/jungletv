import UserProfile from "./UserProfile.svelte";
import { openModal } from "./modal/modal";

export const openUserProfile = function (userAddress: string) {
    openModal({
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