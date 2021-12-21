<script lang="ts">
    import { link } from "svelte-navigator";
    import { apiClient } from "./api_client";
    import { EnqueueMediaResponse } from "./proto/jungletv_pb";
    import { createEventDispatcher, onDestroy, tick } from "svelte";
    import ErrorMessage from "./ErrorMessage.svelte";
    import Wizard from "./Wizard.svelte";
    import RangeSlider from "./slider/RangeSlider.svelte";
    import YouTube, { PlayerState } from "./YouTube.svelte";
    import type { YouTubePlayer } from "youtube-player/dist/types";
    import { Duration as PBDuration } from "google-protobuf/google/protobuf/duration_pb";
    import { Duration } from "luxon";
    import VideoRangeFloat from "./VideoRangeFloat.svelte";

    const dispatch = createEventDispatcher();

    let videoURL: string = "";
    let videoID: string = "";
    let extractedTimestamp: number = 0;
    let videoIsBroadcast = false;
    $: {
        getVideoIDFromURL(videoURL);
    }
    $: {
        if (videoID.length == 11) {
            instantiateTempPlayer = true;
        }
        videoRangeValuesFilled = false;
    }
    let unskippable: boolean = false;
    let failureReason: string = "";

    async function handleEnter(event: KeyboardEvent) {
        if (event.key === "Enter") {
            await submit();
            return false;
        }
        return true;
    }

    async function getVideoIDFromURL(videoURL: string) {
        let idRegExp = /^[A-Za-z0-9\-_]{11}$/;
        if (idRegExp.test(videoURL)) {
            // we were provided just a video ID
            videoID = videoURL;
        }

        // this ensures that our reactive statements trigger, and the player always reloads the video,
        // even if only the timestamp changes
        videoID = "";
        await tick();

        try {
            let url = new URL(videoURL);
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
                        return;
                    }
                } else if (url.pathname.startsWith("/shorts/")) {
                    let parts = url.pathname.split("/");
                    if (idRegExp.test(parts[parts.length - 1])) {
                        videoID = parts[parts.length - 1];
                        return;
                    }
                }
            } else if (url.host == "youtu.be") {
                let parts = url.pathname.split("/");
                if (idRegExp.test(parts[parts.length - 1])) {
                    videoID = parts[parts.length - 1];
                    return;
                }
            }
        } catch {}
    }

    async function submit() {
        if (errorTimeout !== undefined) {
            clearTimeout(errorTimeout);
            errorTimeout = undefined;
        }
        if (videoID == "") {
            failureReason = "A video URL must be provided";
            return;
        }

        let reqPromise: Promise<EnqueueMediaResponse>;

        if (enqueueRange && videoRangeValuesFilled) {
            let startOffset = new PBDuration();
            let endOffset = new PBDuration();
            if (videoRange.length == 1) {
                startOffset.setSeconds(0);
                endOffset.setSeconds(videoRange[0]);
            } else if (videoRange.length == 2) {
                startOffset.setSeconds(videoRange[0]);
                endOffset.setSeconds(videoRange[1]);
            }

            reqPromise = apiClient.enqueueYouTubeVideo(videoID, unskippable, startOffset, endOffset);
        } else {
            reqPromise = apiClient.enqueueYouTubeVideo(videoID, unskippable);
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

    function cancel() {
        dispatch("userCanceled");
    }

    let enqueueRange = false;
    let videoRangeValuesFilled = false;
    let sliderRangeType: any = true;
    let sliderMin = 0;
    const defaultMinRangeLength = 30;
    let minRangeLength = defaultMinRangeLength;
    const maxRangeLength = 35 * 60;
    let videoRange = [0, defaultMinRangeLength];
    let videoLengthInSeconds = 500;
    let pipStep = 60;
    let tempPlayer: YouTubePlayer;
    let instantiateTempPlayer = false;

    $: {
        if (minRangeLength > videoLengthInSeconds) {
            minRangeLength = videoLengthInSeconds;
        } else {
            minRangeLength = defaultMinRangeLength;
        }
    }

    $: {
        let activeSlider = document.querySelector("#videoRangeSlider .rangeHandle.active");
        let activeSliderIdx = activeSlider == null || activeSlider.getAttribute("data-handle") == "0" ? 0 : 1;
        if (videoRange.length == 2 && videoRange[1] - videoRange[0] < minRangeLength) {
            // we need to adjust the start when the end is being changed, and adjust the end when the start is being changed
            if (activeSliderIdx == 0) {
                // user is adjusting the start slider, we adjust the end
                videoRange[1] = Math.min(videoRange[0] + minRangeLength, videoLengthInSeconds);
                if (videoRange[1] - videoRange[0] < minRangeLength) {
                    // ...while making sure the range isn't too small
                    videoRange[0] = videoLengthInSeconds - minRangeLength;
                }
            } else {
                // user is adjusting the end slider, we adjust the start
                videoRange[0] = Math.max(videoRange[1] - minRangeLength, 0);
                if (videoRange[1] - videoRange[0] < minRangeLength) {
                    // ...while making sure the range isn't too small
                    videoRange[1] = minRangeLength;
                }
            }
        }
        if (videoRange.length == 2 && videoRange[1] - videoRange[0] > maxRangeLength) {
            // we need to adjust the start when the end is being changed, and adjust the end when the start is being changed
            if (activeSliderIdx == 0) {
                // user is adjusting the start slider, we adjust the end
                videoRange[1] = Math.min(videoRange[0] + maxRangeLength, videoLengthInSeconds);
            } else {
                // user is adjusting the end slider, we adjust the start
                videoRange[0] = Math.min(videoRange[1] - maxRangeLength, videoLengthInSeconds);
            }
        }
    }

    function sliderFormatter(v: number): string {
        return Duration.fromMillis(v * 1000).toFormat(videoLengthInSeconds > 60 * 60 ? "hh:mm:ss" : "mm:ss");
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
            videoLengthInSeconds = await tempPlayer.getDuration();
            if (videoLengthInSeconds == 0) {
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
            let extractedValidTimestamp = extractedTimestamp > 0 && extractedTimestamp < videoLengthInSeconds;
            if (extractedValidTimestamp) {
                rangeStart = extractedTimestamp;
            }
            videoRange = [rangeStart, Math.min(videoLengthInSeconds, rangeStart + maxRangeLength)];

            // convenience function: when pasting the URL for a video that is over 35 minutes long,
            // immediately offer the option to adjust the length
            // same when the pasted link contains a timestamp
            enqueueRange = enqueueRange || videoLengthInSeconds > maxRangeLength || extractedValidTimestamp;
            pipStep = (Math.floor(videoLengthInSeconds / (10 * 60)) + 1) * 60;
            videoRangeValuesFilled = true;
        } else if (event.detail.data == PlayerState.PLAYING) {
            // turns out it is a broadcast
            if (errorTimeout !== undefined) {
                clearTimeout(errorTimeout);
            }
            tempPlayer.pauseVideo();
            // remove the player so it stops downloading data (apparently broadcasts keep buffering even if paused)
            instantiateTempPlayer = false;
            videoIsBroadcast = true;
            videoLengthInSeconds = maxRangeLength;
            sliderRangeType = "min";
            sliderMin = defaultMinRangeLength;
            videoRange = [10 * 60];

            // convenience function: when pasting a broadcast URL, immediately offer the option to adjust the length
            enqueueRange = true;

            pipStep = (Math.floor(videoLengthInSeconds / (10 * 60)) + 1) * 60;
            videoRangeValuesFilled = true;
        }
    }
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200">Enqueue a video</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            You can add most YouTube videos to the JungleTV programming. Make sure to check the
            <a href="/guidelines" use:link>JungleTV guidelines for content</a> before enqueuing videos.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            There is a minimum price to enqueue each video, which depends on its length, the number of videos in queue,
            and the current JungleTV viewership.
        </p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Longer videos suffer an increasing price penalty.</p>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            The amount you pay will be distributed among eligible spectators by the time your video ends. If none are
            around by then, you will be reimbursed.
        </p>
    </div>
    <div slot="main-content">
        <label for="youtube_video_link" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            YouTube video URL
        </label>
        <div class="mt-1 flex rounded-md shadow-sm">
            <input
                on:input={() => (failureReason = "")}
                on:keydown={handleEnter}
                type="text"
                name="youtube_video_link"
                id="youtube_video_link"
                class="dark:bg-gray-950 focus:ring-yellow-500 focus:border-yellow-500 flex-1 block w-full rounded-md sm:text-sm border {failureReason !==
                ''
                    ? 'border-red-600'
                    : 'border-gray-300'} p-2"
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                bind:value={videoURL}
            />
        </div>
        {#if failureReason !== ""}
            <ErrorMessage>{failureReason}</ErrorMessage>
        {/if}
        <p class="mt-2 text-sm text-gray-500">
            Playlists are not supported. Videos must not be age-restricted.<br />
            Live broadcasts with more than 20 viewers are supported.
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
                        Make video unskippable</label
                    >
                    <p class="text-gray-500">
                        Prevent this video from being skipped even if users pay enough to do so.<br />
                        <span class="font-semibold">
                            This will increase the price to enqueue this video by 6.9 times.
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
                            Enqueue just part of a longer video. Prices will be relative to the length that plays.
                            {#if videoLengthInSeconds > maxRangeLength}
                                <br />
                                Videos longer than {maxRangeLength / 60} minutes must be enqueued in shorter non-overlapping
                                segments, each up to {maxRangeLength / 60} minutes long.
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
                    {#if enqueueRange && videoID.length == 11}
                        {#if videoRangeValuesFilled}
                            <div class="mb-11 mx-3">
                                <RangeSlider
                                    id="videoRangeSlider"
                                    bind:values={videoRange}
                                    max={videoLengthInSeconds}
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
                                            max={videoLengthInSeconds}
                                            bind:values={videoRange}
                                        />
                                    </div>
                                </RangeSlider>
                            </div>
                            {#if videoLengthInSeconds <= defaultMinRangeLength}
                                <p class="text-red-500">
                                    This video is shorter than {defaultMinRangeLength} seconds and can only be enqueued in
                                    its entirety.
                                </p>
                            {/if}
                        {:else if failureReason == ""}
                            <div class="mt-2 mb-9">Loading video information...</div>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
        <p class="mt-4">
            Make sure to check the
            <a href="/guidelines" use:link>JungleTV guidelines for content</a> before enqueuing videos.
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
        <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
            on:click={submit}
        >
            Next
        </button>
    </div>
    <div slot="extra_1">
        <slot name="raffle-info" />
    </div>
</Wizard>
