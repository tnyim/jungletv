<script lang="ts">
    import { navigate } from "svelte-navigator";
    import AddressBox from "./AddressBox.svelte";
    import Wizard from "./Wizard.svelte";

    export let rewardsAddress: string;

    function close() {
        navigate("/");
    }

    let goodReps = [
        "ban_3px37c9f6w361j65yoasrcs6wh3hmmyb6eacpis7dwzp8th4hbb9izgba51j",
        "ban_1wha1enz8k8r65k6nb89cxqh6cq534zpixmuzqwbifpnqrsycuegbmh54au6",
        "ban_3p3sp1ynb5i3qxmqoha3pt79hyk8gxhtr58tk51qctwyyik6hy4dbbqbanan",
        "ban_3batmanuenphd7osrez9c45b3uqw9d9u81ne8xa6m43e1py56y9p48ap69zg",
        "ban_1fomoz167m7o38gw4rzt7hz67oq6itejpt4yocrfywujbpatd711cjew8gjj",
        "ban_1ry7kqi1msam7ay8qreo1mddc6ga6hg4s5tsqgtqhdhbxxwgcuo5mwfno379"
    ]

    function getGoodRepAddress(): string {
        return goodReps[Math.floor(Math.random() * goodReps.length)];
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Receive rewards</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            At the end of every video, the amount paid to enqueue the video is distributed evenly among eligible users.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Now that you have set an address for rewards, you can be one of these users too! Fraud prevention measures apply.</p>
    </div>
    <div slot="main-content">
        <p>Successfully updated rewards address to:</p>
        <p class="font-mono">{rewardsAddress}</p>
        <p class="mt-8">You should now set the representative for your address back to a reputable one, for example:</p>
        <div class="mt-1 mb-4">
            <AddressBox address={getGoodRepAddress()} allowQR={false} showQR={true} />
        </div>
        <p class="mt-8">
            If you are watching JungleTV in another window or tab, please refresh it to ensure you'll be rewarded.
        </p>
    </div>
    <div slot="buttons">
        <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
            on:click={close}
        >
            Begin watching
        </button>
    </div>
</Wizard>
