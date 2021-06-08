<script lang="ts">
    import { apiClient } from "./api_client";
    import { EnqueueMediaResponse } from "./proto/jungletv_pb";
    import { createEventDispatcher } from "svelte";
    import ErrorMessage from "./ErrorMessage.svelte";
    import Wizard from "./Wizard.svelte";

    const dispatch = createEventDispatcher();

    let videoURL: string = "";
    let unskippable: boolean = false;
    let failureReason: string = "";

    async function submit() {
        if (videoURL == "") {
            failureReason = "A video URL must be provided";
            return;
        }
        let videoID = videoURL.replace("https://", "").replace("http://", "");
        videoID = videoID.replace("www.youtube.com/watch?v=", "");
        videoID = videoID.replace("youtu.be/", "");

        let response = await apiClient.enqueueYouTubeVideo(videoID, unskippable);
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
</script>

<Wizard>
    <div slot="step-info">
        <h3 class="text-lg font-semibold leading-6 text-gray-900">Enqueue a video</h3>
        <p class="mt-1 text-sm text-gray-600">
            You can add most YouTube videos to the JungleTV programming. There is a minimum price to enqueue each video,
            which depends on its length, the number of videos in queue, and the current JungleTV viewership.
        </p>
        <p class="mt-1 text-sm text-gray-600">Longer videos suffer an increasing price penalty.</p>
        <p class="mt-1 text-sm text-gray-600">
            The amount you pay will be distributed among eligible spectators by the time your video ends. If none are
            around by then, you will be reimbursed.
        </p>
    </div>
    <div slot="main-content">
        <label for="youtube_video_link" class="block text-sm font-medium text-gray-700"> YouTube video URL </label>
        <div class="mt-1 flex rounded-md shadow-sm">
            <input
                on:input={() => (failureReason = "")}
                type="text"
                name="youtube_video_link"
                id="youtube_video_link"
                class="focus:ring-yellow-500 focus:border-yellow-500 flex-1 block w-full rounded-md sm:text-sm border {failureReason !==
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
            Playlists are not supported. Videos must not be age-restricted and must not be longer than 30 minutes.
        </p>
        <div class="mt-4 space-y-4">
            <div class="flex items-start">
                <div class="flex items-center h-5">
                    <input
                        id="unskippable"
                        name="unskippable"
                        type="checkbox"
                        bind:checked={unskippable}
                        class="focus:ring-yellow-500 h-4 w-4 text-yellow-600 border-gray-300 rounded"
                    />
                </div>
                <div class="ml-3 text-sm">
                    <label for="unskippable" class="font-medium text-gray-700"> Make video unskippable </label>
                    <p class="text-gray-500">
                        Prevent this video from being skipped even if users pay enough to do so.<br />
                        <span class="font-semibold">
                            This will increase the price to enqueue this video by 19 times.
                        </span>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div slot="buttons">
        <button
            type="button"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 hover:shadow ease-linear transition-all duration-150"
            on:click={cancel}
        >
            Cancel
        </button>
        <button
            type="submit"
            class="inline-flex float-right justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 hover:shadow ease-linear transition-all duration-150"
            on:click={submit}
        >
            Next
        </button>
    </div>
</Wizard>
