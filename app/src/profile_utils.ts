import { crossfade } from "svelte/transition";
import { openModal } from "./modal/modal";

let userProfileComponent: any;

export const setUserProfileComponent = function (component: any) {
    userProfileComponent = component;
}

export const openUserProfile = function (userAddress: string) {
    openModal({
        component: userProfileComponent,
        props: { userAddressOrApplicationID: userAddress },
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

export const [userProfileSend, userProfileReceive] = crossfade({
    duration: 400,
});

export type ProfileTab = {
    id: string;
    tabTitle: string;
    isApplicationTab: boolean;
    applicationID?: string;
    pageID?: string;
};
