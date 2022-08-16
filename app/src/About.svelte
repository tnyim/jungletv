<script lang="ts">
    import { link, useFocus } from "svelte-navigator";
    import AddressBox from "./AddressBox.svelte";
    import { darkMode } from "./stores";
    const registerFocus = useFocus();

    let donationAddress = "ban_1hchsy8diurojzok64ymaaw5cthgwy4wa18r7dcim9wp4nfrz88pyrgcxbdt";
</script>

<div class="m-6 flex-grow container mx-auto max-w-screen-md p-2">
    <span use:registerFocus class="hidden" />
    <img src="/assets/brand/logo.svg" alt="JungleTV" class="h-24" />
    <p class="mt-3 text-lg">
        <a href="/guidelines" use:link>Community guidelines</a> • <a href="/faq" use:link>FAQ</a> •
        <a href="/leaderboards" use:link>Leaderboards</a>
    </p>
    <p class="mt-3">
        JungleTV is a video sharing website for the <a href="https://banano.cc" target="_blank" rel="noopener">
            Banano
        </a>
        community. Banano is a feeless, instant, environment-friendly cryptocurrency that's ripe for memes.
    </p>
    <p class="mt-3">
        On JungleTV, users can earn Banano by watching YouTube videos that are added by other users to a sort of
        continuously evolving playlist - the <strong>queue</strong>. The videos play in sync for everyone, making the
        experience similar to watching TV or a livestream.
    </p>
    <p class="mt-3">
        Before participating, make sure to read the
        <a href="/guidelines" use:link>guidelines for acceptable content and behavior</a>.
    </p>
    <p class="mt-3">
        You will have to spend some Banano to
        <a href="/enqueue" use:link>enqueue media</a>. How much you must spend is determined by factors like the amount
        of people watching and the length of the queue.
    </p>
    <p class="mt-3">
        The Banano spent to enqueue each piece of content is distributed among the JungleTV spectators who our fraud
        prevention monkeys deem sufficiently ripe. Make sure to
        <a href="/rewards/address" use:link> set your address to earn rewards</a>! If you watch enough media, you'll
        eventually make enough to enqueue your own - or to recover your initial spending!
    </p>
    <hr class="mt-3" />
    <h3 class="mt-3 text-large font-semibold">Get in touch</h3>
    <p>
        JungleTV is a non-profit hobby project operated by
        <a href="https://twitter.com/gbl08ma/" target="_blank" rel="noopener">gbl08ma</a> (Discord tag: gbl08ma#3988),
        who you can find on the
        <a href="https://chat.banano.cc/" target="_blank" rel="noopener"> Banano Discord</a>.
    </p>
    <h3 class="mt-3 text-large font-semibold">Contribute</h3>
    <p>
        If you would like to help support the development and operation of JungleTV, consider donating some potassium to
        the address below:
    </p>
    <div class="mt-1">
        <AddressBox
            address={donationAddress}
            allowQR={true}
            qrCodeBackground={$darkMode ? "#111827" : "#F3F4F6"}
            qrCodeForeground={$darkMode ? "#FFFFFF" : "#000000"}
        />
    </div>
    <p class="mt-3">
        JungleTV is also a
        <a href="https://creators.brave.com/" target="_blank" rel="noopener">Brave Verified Creator</a>, so if you are a
        Brave browser user, you can donate your accumulated Basic Attention Tokens (BAT). To do this, click the
        triangular "Brave Rewards" icon to the right of your address bar, and select "Send a Tip". You can choose to
        send a "One Time Tip", or set up a recurring "Monthly" contribution.
    </p>
    <p class="mt-3">
        JungleTV is source-available software licensed under the Apache License 2.0 with Commons Clause. Head over to
        the <a href="https://github.com/tnyim/jungletv" target="_blank" rel="noopener">JungleTV GitHub</a> to take a look
        at the source code, report issues, or to maybe even make some contributions of your own!
    </p>
    <hr class="mt-3" />
    <div class="my-5 flex justify-center">
        <a
            use:link
            href="/"
            class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md
            text-white dark:text-white bg-yellow-600 hover:bg-yellow-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow-lg
            ease-linear transition-all duration-150"
        >
            Watch JungleTV
        </a>
    </div>
</div>
