<script lang="ts">
    import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
    import type { Duration as ProtoDuration } from "google-protobuf/google/protobuf/duration_pb";
    import { DateTime, Duration } from "luxon";
    import { onDestroy, onMount } from "svelte";
    import { apiClient } from "../api_client";
    import { modalAlert } from "../modal/modal";
    import {
        ApplicationLogEntry,
        ApplicationLogEntryContainer,
        ApplicationLogLevel,
        EvaluateExpressionOnApplicationRequest,
        EvaluateExpressionOnApplicationResponse,
    } from "../proto/application_editor_pb";
    import { JungleTV } from "../proto/jungletv_pb_service";

    export let applicationID: string;
    let logLevels = [];

    type consoleEntry = {
        highlighted?: boolean;
        logEntry?: ApplicationLogEntry;
        userInput?: {
            expression: string;
            sentAt: Date;
            cancel?: () => void;
            canceled: boolean;
            resultEntry?: consoleEntry;
        };
        result?: {
            response: EvaluateExpressionOnApplicationResponse;
            inputEntry: consoleEntry;
        };
    };
    let consoleEntries: consoleEntry[] = [];

    // application log monitoring:
    let consumeApplicationLogRequest: Request;
    let consumeApplicationLogTimeoutHandle: number = null;

    let historicalLogCursor: string;
    let historicalLogHasMore = false;

    async function fetchHistoricalLog(numEntries: number) {
        historicalLogHasMore = false;
        let response = await apiClient.applicationLog(applicationID, logLevels, historicalLogCursor, numEntries);
        let entries = response.getEntriesList().reverse();
        if (entries.length > 0) {
            historicalLogCursor = entries[0].getCursor();
        } else {
            historicalLogCursor = undefined;
        }
        historicalLogHasMore = response.getHasMore();

        consoleEntries = [
            ...entries.map((e) => {
                return {
                    logEntry: e,
                };
            }),
            ...consoleEntries,
        ];
    }

    onMount(async () => {
        consumeApplicationLog();
        try {
            fetchHistoricalLog(15);
        } catch (e) {}
    });
    function consumeApplicationLog() {
        consumeApplicationLogRequest = apiClient.consumeApplicationLog(
            applicationID,
            [],
            handleNewLogMessage,
            (code, msg) => {
                setTimeout(consumeApplicationLog, 5000);
            }
        );
    }
    onDestroy(() => {
        if (consumeApplicationLogRequest !== undefined) {
            consumeApplicationLogRequest.close();
        }
        if (consumeApplicationLogTimeoutHandle != null) {
            clearTimeout(consumeApplicationLogTimeoutHandle);
        }
    });

    function consumeApplicationLogTimeout() {
        if (consumeApplicationLogRequest !== undefined) {
            consumeApplicationLogRequest.close();
        }
        consumeApplicationLog();
    }

    function handleNewLogMessage(entryContainer: ApplicationLogEntryContainer) {
        if (consumeApplicationLogTimeoutHandle != null) {
            clearTimeout(consumeApplicationLogTimeoutHandle);
        }
        consumeApplicationLogTimeoutHandle = setTimeout(consumeApplicationLogTimeout, 20000);
        if (!entryContainer.getIsHeartbeat()) {
            consoleEntries = [
                ...consoleEntries,
                {
                    logEntry: entryContainer.getEntry(),
                },
            ];
        }
    }

    // REPL code:
    let userInput = "";
    async function evaluateExpression(expression: string) {
        let inputEntry: consoleEntry;
        let cleanup = function (canceled: boolean) {
            if (inputEntry?.userInput) {
                inputEntry.userInput.canceled = canceled;
                inputEntry.userInput.cancel = undefined;
                consoleEntries = consoleEntries;
            }
        };
        try {
            let request = new EvaluateExpressionOnApplicationRequest();
            request.setApplicationId(applicationID);
            request.setExpression(expression);
            let p = apiClient.unaryRPCWithCancel(JungleTV.EvaluateExpressionOnApplication, request);
            let promise = p[0];
            let cancel = p[1];
            inputEntry = {
                userInput: {
                    expression: expression,
                    sentAt: new Date(),
                    canceled: false,
                    cancel: cancel,
                },
            };
            consoleEntries = [...consoleEntries, inputEntry];
            let response = await promise.catch(() => cleanup(true));
            if (typeof response !== "undefined") {
                let resultEntry = {
                    result: {
                        response: response,
                        inputEntry: inputEntry,
                    },
                };
                consoleEntries = [...consoleEntries, resultEntry];
                inputEntry.userInput.resultEntry = resultEntry;
                cleanup(false);
            }
        } catch (e) {
            cleanup(true);
            await modalAlert("An error occurred: " + e);
        }
    }
    async function handleEnter(event: KeyboardEvent) {
        if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.altKey) {
            event.preventDefault();
            let expression = userInput;
            userInput = "";
            await evaluateExpression(expression);
            return false;
        }
        return true;
    }

    // UI helpers

    function classesForEntry(entry: consoleEntry): string {
        if (
            (entry.result && !entry.result.response.getSuccessful()) ||
            (entry.logEntry &&
                (entry.logEntry.getLevel() == ApplicationLogLevel.APPLICATION_LOG_LEVEL_JS_ERROR ||
                    entry.logEntry.getLevel() == ApplicationLogLevel.APPLICATION_LOG_LEVEL_RUNTIME_ERROR))
        ) {
            return "bg-red-300 dark:bg-red-900";
        }
        if (entry?.logEntry?.getLevel() == ApplicationLogLevel.APPLICATION_LOG_LEVEL_JS_WARN) {
            return "bg-yellow-300 dark:bg-yellow-900";
        }
        return "";
    }

    function iconForEntry(entry: consoleEntry): string {
        if (
            (entry.result && !entry.result.response.getSuccessful()) ||
            (entry.logEntry && entry.logEntry.getLevel() == ApplicationLogLevel.APPLICATION_LOG_LEVEL_JS_ERROR)
        ) {
            return "fas fa-exclamation-circle";
        }
        if (entry?.logEntry?.getLevel() == ApplicationLogLevel.APPLICATION_LOG_LEVEL_RUNTIME_ERROR) {
            return "fas fa-bomb";
        }
        if (entry?.logEntry?.getLevel() == ApplicationLogLevel.APPLICATION_LOG_LEVEL_RUNTIME_LOG) {
            return "fas fa-running";
        }
        if (entry?.logEntry?.getLevel() == ApplicationLogLevel.APPLICATION_LOG_LEVEL_JS_WARN) {
            return "fas fa-exclamation-triangle";
        }
        if (entry.result) {
            return "fas fa-arrow-left text-green-700 dark:text-green-300";
        }
        if (entry.userInput) {
            return "fas fa-chevron-right";
        }
        return "";
    }

    function formatExecutionTime(pd: ProtoDuration): string {
        let d = Duration.fromMillis(pd.getSeconds() * 1000 + pd.getNanos() / 1000000);
        return d.toFormat("s' s 'S' ms'").replace(/^0 s /, "");
    }

    function formatLogEntryTime(date: Date): string {
        return DateTime.fromJSDate(date)
            .setLocale(DateTime.local().resolvedLocaleOpts().locale)
            .toLocal()
            .toLocaleString({
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                fractionalSecondDigits: 3,
            });
    }

    function onEntryMouseEnter(entry: consoleEntry) {
        if (entry?.userInput?.resultEntry) {
            entry.highlighted = true;
            entry.userInput.resultEntry.highlighted = true;
            consoleEntries = consoleEntries;
        }
        if (entry?.result) {
            entry.highlighted = true;
            entry.result.inputEntry.highlighted = true;
            consoleEntries = consoleEntries;
        }
    }

    function onEntryMouseLeave(entry: consoleEntry) {
        if (entry?.userInput?.resultEntry) {
            entry.highlighted = false;
            entry.userInput.resultEntry.highlighted = false;
            consoleEntries = consoleEntries;
        }
        if (entry?.result) {
            entry.highlighted = false;
            entry.result.inputEntry.highlighted = false;
            consoleEntries = consoleEntries;
        }
    }
</script>

<div class="flex flex-col h-full relative w-full">
    <div class="flex-grow overflow-y-auto relative flex flex-col">
        {#if historicalLogCursor && historicalLogHasMore}
            <div class="py-1 px-2 border-b border-gray-200 dark:border-gray-800 flex flex-row items-center">
                <span
                    class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    tabindex="0"
                    on:click={() => fetchHistoricalLog(25)}
                >
                    Load more...
                </span>
            </div>
        {/if}
        {#each consoleEntries as entry}
            <div
                class="py-1 px-2 border-b border-gray-200 dark:border-gray-800 flex flex-row items-center {classesForEntry(
                    entry
                )} {entry.highlighted ? 'bg-gray-200 dark:bg-gray-800' : ''}"
                on:mouseenter={() => onEntryMouseEnter(entry)}
                on:mouseleave={() => onEntryMouseLeave(entry)}
            >
                <div class="w-5 text-right mr-2 self-start">
                    <i class={iconForEntry(entry)} />
                </div>
                <div class="flex-grow font-mono">
                    {#if entry.result}
                        <span
                            class="whitespace-pre-wrap {entry.result.response.getSuccessful()
                                ? 'text-green-700 dark:text-green-300'
                                : ''}">{entry.result.response.getResult()}</span
                        >
                    {:else if entry.logEntry}
                        <span class="whitespace-pre-wrap">{entry.logEntry.getMessage()}</span>
                    {:else if entry.userInput}
                        <span class="whitespace-pre-wrap">{entry.userInput.expression}</span>
                    {/if}
                </div>

                <div class="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {#if entry.result}
                        {formatExecutionTime(entry.result.response.getExecutionTime())}
                    {:else if entry.logEntry}
                        {formatLogEntryTime(entry.logEntry.getCreatedAt().toDate())}
                    {:else if entry.userInput}
                        {formatLogEntryTime(entry.userInput.sentAt)}
                        {#if entry.userInput.cancel}
                            <span
                                class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                                tabindex="0"
                                on:click={entry.userInput.cancel}
                            >
                                Abort
                            </span>
                        {/if}
                        {#if entry.userInput.canceled}
                            Canceled
                        {/if}
                    {/if}
                </div>
            </div>
        {/each}
        <div class="py-1 px-2 flex flex-row">
            <div class="w-5 text-right text-blue-500 mr-2 self-start">
                <i class="fas fa-chevron-right" />
            </div>
            <textarea
                class="flex-grow font-mono bg-transparent outline-none resize-none"
                bind:value={userInput}
                on:keydown={handleEnter}
            />
        </div>
    </div>
</div>
