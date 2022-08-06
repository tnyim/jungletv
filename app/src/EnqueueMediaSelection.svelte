<script lang="ts">
    import { Duration as PBDuration } from "google-protobuf/google/protobuf/duration_pb";
    import { Duration } from "luxon";
    import { createEventDispatcher, onDestroy, tick } from "svelte";
    import Moon from "svelte-loading-spinners/dist/ts/Moon.svelte";
    import { link } from "svelte-navigator";
    import type { YouTubePlayer } from "youtube-player/dist/types";
    import { apiClient } from "./api_client";
    import ErrorMessage from "./ErrorMessage.svelte";
    import { EnqueueMediaResponse } from "./proto/jungletv_pb";
    import RangeSlider from "./slider/RangeSlider.svelte";
    import VideoRangeFloat from "./VideoRangeFloat.svelte";
    import Wizard from "./Wizard.svelte";
    import YouTube, { PlayerState } from "./YouTube.svelte";

    const dispatch = createEventDispatcher();

    let mediaURL: string = "";
    let videoID: string = "";
    let hasValidURL = false;
    let mediaType: "video" | "track" = "video";
    let extractedTimestamp: number = 0;
    let videoIsBroadcast = false;
    $: {
        parseURL(mediaURL);
    }
    $: {
        if (videoID.length == 11) {
            instantiateTempPlayer = true;
        }
        mediaRangeValuesFilled = false;
    }
    let unskippable: boolean = false;
    let failureReason: string = "";

    async function handleEnter(event: KeyboardEvent) {
        if (event.key === "Enter") {
            await handleSubmit();
            return false;
        }
        return true;
    }

    async function parseURL(urlString: string) {
        // this ensures that our reactive statements trigger, and the player always reloads the video,
        // even if only the timestamp changes
        videoID = "";
        hasValidURL = false;
        await tick();

        let idRegExp = /^[A-Za-z0-9\-_]{11}$/;
        if (idRegExp.test(urlString)) {
            // we were provided just a video ID
            videoID = urlString;
            return;
        }

        if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
            urlString = "https://" + urlString;
        }

        try {
            let url = new URL(urlString);
            let t = url.searchParams.get("t");
            if (t != null && !isNaN(Number(t))) {
                extractedTimestamp = Number(t);
            } else {
                extractedTimestamp = 0;
            }
            if (/^(.*\.){0,1}youtube.com$/.test(url.host)) {
                if (url.pathname == "/watch") {
                    let v = url.searchParams.get("v");
                    if (idRegExp.test(v)) {
                        videoID = v;
                        hasValidURL = videoID.length == 11;
                        mediaType = "video";
                        return;
                    }
                } else if (url.pathname.startsWith("/shorts/")) {
                    let parts = url.pathname.split("/");
                    if (idRegExp.test(parts[parts.length - 1])) {
                        videoID = parts[parts.length - 1];
                        hasValidURL = videoID.length == 11;
                        mediaType = "video";
                        return;
                    }
                }
            } else if (url.host == "youtu.be") {
                let parts = url.pathname.split("/");
                if (idRegExp.test(parts[parts.length - 1])) {
                    videoID = parts[parts.length - 1];
                    hasValidURL = videoID.length == 11;
                    mediaType = "video";
                    return;
                }
            } else if (url.host == "soundcloud.com") {
                // TODO do some more sanity checking
                hasValidURL = true;
                videoID = "";
                mediaType = "track";
            }
        } catch {}
    }

    async function submit() {
        if (errorTimeout !== undefined) {
            clearTimeout(errorTimeout);
            errorTimeout = undefined;
        }
        if (!hasValidURL) {
            failureReason = "A supported media URL must be provided";
            return;
        }

        let reqPromise: Promise<EnqueueMediaResponse>;

        if (enqueueRange && mediaRangeValuesFilled) {
            let startOffset = new PBDuration();
            let endOffset = new PBDuration();
            if (mediaRange.length == 1) {
                startOffset.setSeconds(0);
                endOffset.setSeconds(mediaRange[0]);
            } else if (mediaRange.length == 2) {
                startOffset.setSeconds(mediaRange[0]);
                endOffset.setSeconds(mediaRange[1]);
            }

            if (mediaType == "video") {
                reqPromise = apiClient.enqueueYouTubeVideo(videoID, unskippable, startOffset, endOffset);
            } else if (mediaType == "track") {
                reqPromise = apiClient.enqueueSoundCloudTrack(mediaURL, unskippable, startOffset, endOffset);
            }
        } else {
            if (mediaType == "video") {
                reqPromise = apiClient.enqueueYouTubeVideo(videoID, unskippable);
            } else if (mediaType == "track") {
                reqPromise = apiClient.enqueueSoundCloudTrack(mediaURL, unskippable);
            }
        }

        let response = await reqPromise;
        switch (response.getEnqueueResponseCase()) {
            case EnqueueMediaResponse.EnqueueResponseCase.TICKET:
                failureReason = "";
                dispatch("mediaSelected", response);
                break;
            case EnqueueMediaResponse.EnqueueResponseCase.FAILURE:
                failureReason = response.getFailure().getFailureReason();
                break;
        }
    }

    let submitting = false;
    async function handleSubmit() {
        if (submitting) {
            return;
        }
        submitting = true;
        try {
            await submit();
        } catch {
            failureReason = "An error occurred. If the problem persists, refresh the page and try again";
        }
        submitting = false;
    }

    function cancel() {
        dispatch("userCanceled");
    }

    let enqueueRange = false;
    let mediaRangeValuesFilled = false;
    let sliderRangeType: any = true;
    let sliderMin = 0;
    const defaultMinRangeLength = 30;
    let minRangeLength = defaultMinRangeLength;
    const maxRangeLength = 35 * 60;
    let mediaRange = [0, defaultMinRangeLength];
    let mediaLengthInSeconds = 500;
    let pipStep = 60;
    let tempPlayer: YouTubePlayer;
    let instantiateTempPlayer = false;

    let rangeSliderContainer: HTMLDivElement;

    $: {
        if (minRangeLength > mediaLengthInSeconds) {
            minRangeLength = mediaLengthInSeconds;
        } else {
            minRangeLength = defaultMinRangeLength;
        }
    }

    $: {
        let activeSlider = rangeSliderContainer?.querySelector("#mediaRangeSlider .rangeHandle.active");
        let activeSliderIdx = activeSlider == null || activeSlider.getAttribute("data-handle") == "0" ? 0 : 1;
        if (mediaRange.length == 2 && mediaRange[1] - mediaRange[0] < minRangeLength) {
            // we need to adjust the start when the end is being changed, and adjust the end when the start is being changed
            if (activeSliderIdx == 0) {
                // user is adjusting the start slider, we adjust the end
                mediaRange[1] = Math.min(mediaRange[0] + minRangeLength, mediaLengthInSeconds);
                if (mediaRange[1] - mediaRange[0] < minRangeLength) {
                    // ...while making sure the range isn't too small
                    mediaRange[0] = mediaLengthInSeconds - minRangeLength;
                }
            } else {
                // user is adjusting the end slider, we adjust the start
                mediaRange[0] = Math.max(mediaRange[1] - minRangeLength, 0);
                if (mediaRange[1] - mediaRange[0] < minRangeLength) {
                    // ...while making sure the range isn't too small
                    mediaRange[1] = minRangeLength;
                }
            }
        }
        if (mediaRange.length == 2 && mediaRange[1] - mediaRange[0] > maxRangeLength) {
            // we need to adjust the start when the end is being changed, and adjust the end when the start is being changed
            if (activeSliderIdx == 0) {
                // user is adjusting the start slider, we adjust the end
                mediaRange[1] = Math.min(mediaRange[0] + maxRangeLength, mediaLengthInSeconds);
            } else {
                // user is adjusting the end slider, we adjust the start
                mediaRange[0] = Math.min(mediaRange[1] - maxRangeLength, mediaLengthInSeconds);
            }
        }
    }

    function sliderFormatter(v: number): string {
        return Duration.fromMillis(v * 1000).toFormat(mediaLengthInSeconds > 60 * 60 ? "hh:mm:ss" : "mm:ss");
    }

    let errorTimeout: number;

    onDestroy(() => {
        if (errorTimeout !== undefined) {
            clearTimeout(errorTimeout);
            errorTimeout = undefined;
        }
    });
    async function tempPlayerStateChange(event: CustomEvent) {
        if (event.detail.data == PlayerState.CUED) {
            if (errorTimeout !== undefined) {
                clearTimeout(errorTimeout);
                errorTimeout = undefined;
            }
            mediaLengthInSeconds = await tempPlayer.getDuration();
            if (mediaLengthInSeconds == 0) {
                // this is either a broadcast or a video that does not exist
                // we can only find out if we attempt to play it
                tempPlayer.mute();
                tempPlayer.playVideo();
                // this should trigger a change to the playing state, so this callback will be called again and
                // enter the conditional below for PlayerState.PLAYING
                errorTimeout = setTimeout(() => {
                    failureReason = "Video not found or not playable on JungleTV";
                }, 10000);
                return;
            }
            videoIsBroadcast = false;
            sliderRangeType = true;
            sliderMin = 0;
            let rangeStart = 0;
            let extractedValidTimestamp = extractedTimestamp > 0 && extractedTimestamp < mediaLengthInSeconds;
            if (extractedValidTimestamp) {
                rangeStart = extractedTimestamp;
            }
            mediaRange = [rangeStart, Math.min(mediaLengthInSeconds, rangeStart + maxRangeLength)];

            // convenience function: when pasting the URL for a video that is over 35 minutes long,
            // immediately offer the option to adjust the length
            // same when the pasted link contains a timestamp
            enqueueRange = enqueueRange || mediaLengthInSeconds > maxRangeLength || extractedValidTimestamp;
            pipStep = (Math.floor(mediaLengthInSeconds / (10 * 60)) + 1) * 60;
            mediaRangeValuesFilled = true;
        } else if (event.detail.data == PlayerState.PLAYING) {
            // turns out it is a broadcast
            if (errorTimeout !== undefined) {
                clearTimeout(errorTimeout);
            }
            tempPlayer.pauseVideo();
            // remove the player so it stops downloading data (apparently broadcasts keep buffering even if paused)
            instantiateTempPlayer = false;
            videoIsBroadcast = true;
            mediaLengthInSeconds = maxRangeLength;
            sliderRangeType = "min";
            sliderMin = defaultMinRangeLength;
            mediaRange = [10 * 60];

            // convenience function: when pasting a broadcast URL, immediately offer the option to adjust the length
            enqueueRange = true;

            pipStep = (Math.floor(mediaLengthInSeconds / (10 * 60)) + 1) * 60;
            mediaRangeValuesFilled = true;
        }
    }

    async function updateSoundCloudTrackRanges() {
        try {
            let response = await apiClient.soundCloudTrackDetails(mediaURL);
            mediaLengthInSeconds = response.getLength().getSeconds();
            videoIsBroadcast = false;
            sliderRangeType = true;
            sliderMin = 0;
            let rangeStart = 0;
            mediaRange = [rangeStart, Math.min(mediaLengthInSeconds, rangeStart + maxRangeLength)];

            // convenience function: when pasting the URL for a track that is over 35 minutes long,
            // immediately offer the option to adjust the length
            enqueueRange = enqueueRange || mediaLengthInSeconds > maxRangeLength;
            pipStep = (Math.floor(mediaLengthInSeconds / (10 * 60)) + 1) * 60;
            mediaRangeValuesFilled = true;
        } catch (e) {
            console.log(e);
            mediaRangeValuesFilled = false;
            failureReason = "Track not found or not playable on JungleTV";
        }
    }
    $: if (hasValidURL && mediaType === "track") {
        updateSoundCloudTrackRanges();
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Enqueue media</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            You can add most YouTube videos and SoundCloud tracks to the JungleTV programming. Make sure to check the
            <a href="/guidelines" use:link>JungleTV guidelines for content</a> before enqueuing media.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            There is a minimum price to enqueue content, which depends on its length, the number of entries in queue,
            and the current JungleTV viewership.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Longer {mediaType}s suffer an increasing price penalty.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            The amount you pay will be distributed among eligible spectators by the time your {mediaType} ends. If none are
            around by then, you will be reimbursed.
        </p>
    </div>
    <div slot="main-content">
        <label for="media_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            YouTube video URL or SoundCloud track URL
        </label>
        <div class="mt-1 flex rounded-md shadow-sm">
            <input
                on:input={() => (failureReason = "")}
                on:keydown={handleEnter}
                type="text"
                name="media_url"
                id="media_url"
                class="dark:bg-gray-950 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 flex-1 block w-full rounded-md text-sm border {failureReason !==
                ''
                    ? 'border-red-600'
                    : 'border-gray-300'} p-2"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                bind:value={mediaURL}
            />
        </div>
        {#if failureReason !== ""}
            <div class="mt-3">
                <ErrorMessage>{failureReason}</ErrorMessage>
            </div>
        {/if}
        <p class="mt-2 text-sm text-gray-500">
            Playlists are not supported. Videos must not be age-restricted.<br />
            YouTube live broadcasts with more than 10 viewers are supported.
        </p>
        <div class="mt-4 space-y-4">
            <div class="flex items-start">
                <div class="flex items-center h-5">
                    <input
                        id="unskippable"
                        name="unskippable"
                        type="checkbox"
                        bind:checked={unskippable}
                        class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                    />
                </div>
                <div class="ml-3 text-sm">
                    <label for="unskippable" class="font-medium text-gray-700 dark:text-gray-300">
                        Make {mediaType} unskippable</label
                    >
                    <p class="text-gray-500">
                        Prevent this {mediaType} from being skipped even if users pay enough to do so.<br />
                        <span class="font-semibold">
                            This will increase the price to enqueue this {mediaType} by 6.9 times.
                        </span>
                    </p>
                </div>
            </div>
        </div>
        <div class="mt-4 space-y-4">
            <div class="flex items-start">
                <div class="flex items-center h-5">
                    <input
                        id="videorange"
                        name="videorange"
                        type="checkbox"
                        bind:checked={enqueueRange}
                        class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 dark:border-black rounded"
                    />
                </div>
                <div class="ml-3 text-sm w-full">
                    {#if videoIsBroadcast}
                        <label for="videorange" class="font-medium text-gray-700 dark:text-gray-300">
                            Select for how long the live broadcast should play</label
                        >
                        <p class="text-gray-500">
                            Broadcasts can play for up to {maxRangeLength / 60} minutes at a time and up to a total of 2
                            hours in the last 4 hours. Prices will be relative to the length that plays.
                        </p>
                    {:else}
                        <label for="videorange" class="font-medium text-gray-700 dark:text-gray-300">
                            Select a time range to play</label
                        >
                        <p class="text-gray-500">
                            Enqueue just part of a longer {mediaType}. Prices will be relative to the length that plays.
                            {#if mediaLengthInSeconds > maxRangeLength}
                                <br />
                                {mediaType == "video" ? "Videos" : "Tracks"} longer than {maxRangeLength / 60} minutes must
                                be enqueued in shorter non-overlapping segments, each up to {maxRangeLength / 60} minutes
                                long.
                            {/if}
                        </p>
                    {/if}
                    {#if videoID.length == 11 && instantiateTempPlayer}
                        <div class="hidden">
                            <YouTube
                                videoId={videoID}
                                id="tmpplayer"
                                bind:player={tempPlayer}
                                on:stateChange={tempPlayerStateChange}
                            />
                        </div>
                    {/if}
                    {#if enqueueRange && hasValidURL}
                        {#if mediaRangeValuesFilled}
                            <div class="mb-11 mx-3" bind:this={rangeSliderContainer}>
                                <RangeSlider
                                    id="mediaRangeSlider"
                                    bind:values={mediaRange}
                                    max={mediaLengthInSeconds}
                                    min={sliderMin}
                                    range={sliderRangeType}
                                    pips
                                    pipstep={pipStep}
                                    all="label"
                                    float={true}
                                    formatter={sliderFormatter}
                                    pushy
                                >
                                    <div slot="float" let:formattedValue let:value let:index>
                                        <VideoRangeFloat
                                            {formattedValue}
                                            {value}
                                            {index}
                                            min={sliderMin}
                                            max={mediaLengthInSeconds}
                                            bind:values={mediaRange}
                                        />
                                    </div>
                                </RangeSlider>
                            </div>
                            {#if mediaLengthInSeconds <= defaultMinRangeLength}
                                <p class="text-red-500">
                                    This {mediaType} is shorter than {defaultMinRangeLength} seconds and can only be enqueued
                                    in its entirety.
                                </p>
                            {/if}
                        {:else if failureReason == ""}
                            <div class="mt-2 mb-9">Loading {mediaType} information...</div>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
        <p class="mt-4">
            Make sure to check the
            <a href="/guidelines" use:link>JungleTV guidelines for content</a> before enqueuing media.
        </p>
    </div>
    <div slot="buttons" class="flex items-center flex-wrap">
        <button
            type="button"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
            on:click={cancel}
        >
            Cancel
        </button>
        <div class="flex-grow" />
        {#if submitting}
            <button
                disabled
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-300 cursor-default"
            >
                <span class="mr-1"><Moon size="20" color="#FFFFFF" unit="px" duration="2s" /></span>
                Loading
            </button>
        {:else}
            <button
                type="submit"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
                on:click={handleSubmit}
            >
                Next
            </button>
        {/if}
    </div>
    <div slot="extra_1">
        <slot name="raffle-info" />
    </div>
</Wizard>
