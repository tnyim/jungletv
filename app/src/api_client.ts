import { grpc } from "@improbable-eng/grpc-web";
import { JungleTV } from "./proto/jungletv_pb_service";
import type { ProtobufMessage } from "@improbable-eng/grpc-web/dist/typings/message";
import { deleteCookie, getCookie } from "./cookie_utils";
import { ConsumeMediaRequest, EnqueueMediaRequest, EnqueueMediaResponse, EnqueueMediaTicket, EnqueueYouTubeVideoData, ForcedTicketEnqueueTypeMap, ForciblyEnqueueTicketRequest, ForciblyEnqueueTicketResponse, MonitorQueueRequest, MonitorTicketRequest, MediaConsumptionCheckpoint, Queue, RemoveQueueEntryRequest, RemoveQueueEntryResponse, RewardInfoRequest, RewardInfoResponse, SignInRequest, SignInResponse, SubmitActivityChallengeRequest, SubmitActivityChallengeResponse, ChatUpdate, ConsumeChatRequest, SendChatMessageResponse, SendChatMessageRequest, RemoveChatMessageResponse, RemoveChatMessageRequest, SetChatSettingsRequest, SetChatSettingsResponse, ChatMessage, SignInProgress, SetVideoEnqueuingEnabledResponse, SetVideoEnqueuingEnabledRequest, AllowedVideoEnqueuingTypeMap, BanUserRequest, BanUserResponse, RemoveBanRequest, RemoveBanResponse, UserPermissionLevelResponse, UserPermissionLevelRequest, UserChatMessagesResponse, UserChatMessagesRequest, DisallowedVideosRequest, DisallowedVideosResponse, PaginationParameters, AddDisallowedVideoResponse, AddDisallowedVideoRequest, RemoveDisallowedVideoRequest, RemoveDisallowedVideoResponse, Document, GetDocumentRequest, UpdateDocumentResponse, SetChatNicknameResponse, SetChatNicknameRequest, SetUserChatNicknameRequest, SetUserChatNicknameResponse, WithdrawResponse, WithdrawRequest, LeaderboardsResponse, LeaderboardsRequest, SetPricesMultiplierResponse, SetPricesMultiplierRequest, WithdrawalHistoryResponse, WithdrawalHistoryRequest, RewardHistoryRequest, RewardHistoryResponse, RemoveOwnQueueEntryResponse, RemoveOwnQueueEntryRequest, MonitorSkipAndTipRequest, SkipAndTipStatus, SetCrowdfundedSkippingEnabledResponse, SetCrowdfundedSkippingEnabledRequest, SetSkipPriceMultiplierRequest, SetSkipPriceMultiplierResponse, ProduceSegchaChallengeResponse, ProduceSegchaChallengeRequest, ConfirmRaffleWinnerResponse, CompleteRaffleResponse, RedrawRaffleResponse, ConfirmRaffleWinnerRequest, CompleteRaffleRequest, RedrawRaffleRequest, OngoingRaffleInfoResponse, OngoingRaffleInfoRequest, UserBansResponse, UserBansRequest, TriggerAnnouncementsNotificationRequest, TriggerAnnouncementsNotificationResponse, Spectator, SpectatorInfoRequest, ResetSpectatorStatusResponse, ResetSpectatorStatusRequest, ModerationSettingsOverview, MonitorModerationSettingsRequest, SetOwnQueueEntryRemovalAllowedResponse, SetOwnQueueEntryRemovalAllowedRequest, SetNewQueueEntriesAlwaysUnskippableResponse, SetNewQueueEntriesAlwaysUnskippableRequest, SetSkippingEnabledResponse, SetSkippingEnabledRequest, ConnectionsResponse, ConnectionsRequest, CreateConnectionResponse, CreateConnectionRequest, ConnectionServiceMap, RemoveConnectionRequest, RemoveConnectionResponse, SetQueueInsertCursorRequest, SetQueueInsertCursorResponse, ClearQueueInsertCursorResponse, ClearQueueInsertCursorRequest, LeaderboardPeriodMap } from "./proto/jungletv_pb";
import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
import type { Duration } from "google-protobuf/google/protobuf/duration_pb";

class APIClient {
    private static instance: APIClient;

    private host: string;
    private authNeededCallback = () => { };
    private versionHash: string;

    private constructor(host: string) {
        this.host = host;
    }

    public static getInstance(): APIClient {
        if (!APIClient.instance) {
            let apiHost = window.location.origin;
            if (globalThis.API_HOST !== "use-origin") {
                apiHost = globalThis.API_HOST;
            }
            APIClient.instance = new APIClient(apiHost);
        }

        return APIClient.instance;
    }

    private handleVersionHeader(version: string) {
        if (this.versionHash === undefined) {
            const metas = document.getElementsByTagName("meta");
            for (let i = 0; i < metas.length; i++) {
                if (metas[i].getAttribute("name") === "jungletv-version-hash") {
                    this.versionHash = metas[i].getAttribute("content");
                    break;
                }
            }
        }

        if (version != this.versionHash) {
            console.log("Reloading due to different version hash in API response");
            location.reload();
        }
    }

    public setAuthNeededCallback(cb: () => void) {
        this.authNeededCallback = cb;
    }

    async unaryRPC<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage>(operation: any, request: TRequest): Promise<TResponse> {
        return new Promise((resolve, reject) => {
            grpc.invoke(operation, {
                request: request,
                host: this.host,
                metadata: new grpc.Metadata({ "Authorization": getCookie("auth-token") }),
                onHeaders: (headers: grpc.Metadata): void => {
                    if (headers.has("X-API-Version")) {
                        this.handleVersionHeader(headers.get("X-API-Version")[0])
                    }
                },
                onMessage: (message: TResponse) => resolve(message),
                onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
                    if (code == grpc.Code.Unauthenticated) {
                        this.authNeededCallback();
                    }
                    if (code != grpc.Code.OK) {
                        reject(msg);
                    }
                }
            });
        });
    }


    serverStreamingRPC<TRequest extends ProtobufMessage, TResponseItem extends ProtobufMessage>(
        operation: any,
        request: TRequest,
        onMessage: (message: TResponseItem) => void,
        onEnd: (code: grpc.Code, msg: string) => void): Request {
        return grpc.invoke(operation, {
            request: request,
            host: this.host,
            metadata: new grpc.Metadata({ "Authorization": getCookie("auth-token") }),
            onHeaders: (headers: grpc.Metadata): void => {
                if (headers.has("X-API-Version")) {
                    this.handleVersionHeader(headers.get("X-API-Version")[0])
                }
            },
            onMessage: onMessage,
            onEnd: (code: grpc.Code, msg: string | undefined, trailers: grpc.Metadata) => {
                if (code == grpc.Code.Unauthenticated) {
                    this.authNeededCallback();
                }
                onEnd(code, msg);
            }
        });
    }

    signIn(address: string, onProgress: (progress: SignInProgress) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        let request = new SignInRequest();
        request.setRewardsAddress(address);
        return this.serverStreamingRPC<SignInRequest, SignInProgress>(
            JungleTV.SignIn,
            request,
            onProgress,
            onEnd);
    }

    signOut() {
        deleteCookie("auth-token");
        //this.authNeededCallback();
    }

    async enqueueYouTubeVideo(id: string, unskippable: boolean, startOffset?: Duration, endOffset?: Duration): Promise<EnqueueMediaResponse> {
        let request = new EnqueueMediaRequest();
        request.setUnskippable(unskippable);
        let ytData = new EnqueueYouTubeVideoData();
        ytData.setId(id);
        if (typeof startOffset !== 'undefined') {
            ytData.setStartOffset(startOffset);
        }
        if (typeof endOffset !== 'undefined') {
            ytData.setEndOffset(endOffset);
        }
        request.setYoutubeVideoData(ytData);
        return this.unaryRPC<EnqueueMediaRequest, EnqueueMediaResponse>(JungleTV.EnqueueMedia, request);
    }

    consumeMedia(onCheckpoint: (checkpoint: MediaConsumptionCheckpoint) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        let request = new ConsumeMediaRequest();
        return this.serverStreamingRPC<ConsumeMediaRequest, MediaConsumptionCheckpoint>(
            JungleTV.ConsumeMedia,
            request,
            onCheckpoint,
            onEnd);
    }

    monitorQueue(onQueueUpdated: (queue: Queue) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        return this.serverStreamingRPC<MonitorQueueRequest, Queue>(
            JungleTV.MonitorQueue,
            new MonitorQueueRequest(),
            onQueueUpdated,
            onEnd);
    }

    monitorSkipAndTip(onSkipAndTipStatus: (skipAndTipStatus: SkipAndTipStatus) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        return this.serverStreamingRPC<MonitorSkipAndTipRequest, SkipAndTipStatus>(
            JungleTV.MonitorSkipAndTip,
            new MonitorSkipAndTipRequest(),
            onSkipAndTipStatus,
            onEnd);
    }

    monitorTicket(ticketID: string, onTicketUpdated: (ticket: EnqueueMediaTicket) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        let request = new MonitorTicketRequest();
        request.setTicketId(ticketID);
        return this.serverStreamingRPC<MonitorTicketRequest, EnqueueMediaTicket>(
            JungleTV.MonitorTicket,
            request,
            onTicketUpdated,
            onEnd);
    }

    async removeOwnQueueEntry(id: string): Promise<RemoveOwnQueueEntryResponse> {
        let request = new RemoveOwnQueueEntryRequest();
        request.setId(id);
        return this.unaryRPC<RemoveOwnQueueEntryRequest, RemoveOwnQueueEntryResponse>(JungleTV.RemoveOwnQueueEntry, request);
    }

    async rewardInfo(): Promise<RewardInfoResponse> {
        return this.unaryRPC<RewardInfoRequest, RewardInfoResponse>(JungleTV.RewardInfo, new RewardInfoRequest());
    }

    async submitActivityChallenge(challenge: string, captchaResponse: string, trusted: boolean): Promise<SubmitActivityChallengeResponse> {
        let request = new SubmitActivityChallengeRequest();
        request.setChallenge(challenge);
        request.setCaptchaResponse(captchaResponse);
        request.setTrusted(trusted);
        return this.unaryRPC<SubmitActivityChallengeRequest, SubmitActivityChallengeResponse>(JungleTV.SubmitActivityChallenge, request);
    }

    async produceSegchaChallenge(): Promise<ProduceSegchaChallengeResponse> {
        let request = new ProduceSegchaChallengeRequest();
        return this.unaryRPC<ProduceSegchaChallengeRequest, ProduceSegchaChallengeResponse>(JungleTV.ProduceSegchaChallenge, request);
    }

    consumeChat(initialHistorySize: number, onUpdate: (update: ChatUpdate) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        let request = new ConsumeChatRequest();
        request.setInitialHistorySize(initialHistorySize);
        return this.serverStreamingRPC<ConsumeChatRequest, ChatUpdate>(
            JungleTV.ConsumeChat,
            request,
            onUpdate,
            onEnd);
    }

    async sendChatMessage(message: string, trusted: boolean, reference?: ChatMessage): Promise<SendChatMessageResponse> {
        let request = new SendChatMessageRequest();
        request.setContent(message);
        request.setTrusted(trusted);
        if (typeof reference !== 'undefined') {
            request.setReplyReferenceId(reference.getId());
        }
        return this.unaryRPC<SendChatMessageRequest, SendChatMessageResponse>(JungleTV.SendChatMessage, request);
    }

    async setChatNickname(nickname: string): Promise<SetChatNicknameResponse> {
        let request = new SetChatNicknameRequest();
        request.setNickname(nickname);
        return this.unaryRPC<SetChatNicknameRequest, SetChatNicknameResponse>(JungleTV.SetChatNickname, request);
    }

    async getDocument(id: string): Promise<Document> {
        let request = new GetDocumentRequest();
        request.setId(id);
        return this.unaryRPC<GetDocumentRequest, Document>(JungleTV.GetDocument, request);
    }

    async updateDocument(document: Document): Promise<UpdateDocumentResponse> {
        return this.unaryRPC<Document, UpdateDocumentResponse>(JungleTV.UpdateDocument, document);
    }

    async withdraw(): Promise<WithdrawResponse> {
        return this.unaryRPC<WithdrawRequest, WithdrawResponse>(JungleTV.Withdraw, new WithdrawRequest());
    }

    async leaderboards(period: LeaderboardPeriodMap[keyof LeaderboardPeriodMap]): Promise<LeaderboardsResponse> {
        let request = new LeaderboardsRequest();
        request.setPeriod(period);
        return this.unaryRPC<LeaderboardsRequest, LeaderboardsResponse>(JungleTV.Leaderboards, request);
    }

    async rewardHistory(pagParams: PaginationParameters): Promise<RewardHistoryResponse> {
        let request = new RewardHistoryRequest();
        request.setPaginationParams(pagParams);
        return this.unaryRPC<RewardHistoryRequest, RewardHistoryResponse>(JungleTV.RewardHistory, request);
    }

    async withdrawalHistory(pagParams: PaginationParameters): Promise<WithdrawalHistoryResponse> {
        let request = new WithdrawalHistoryRequest();
        request.setPaginationParams(pagParams);
        return this.unaryRPC<WithdrawalHistoryRequest, WithdrawalHistoryResponse>(JungleTV.WithdrawalHistory, request);
    }

    async ongoingRaffleInfo(): Promise<OngoingRaffleInfoResponse> {
        let request = new OngoingRaffleInfoRequest();
        return this.unaryRPC<OngoingRaffleInfoRequest, OngoingRaffleInfoResponse>(JungleTV.OngoingRaffleInfo, request);
    }

    async connections(): Promise<ConnectionsResponse> {
        let request = new ConnectionsRequest();
        return this.unaryRPC<ConnectionsRequest, ConnectionsResponse>(JungleTV.Connections, request);
    }

    async createConnection(service: ConnectionServiceMap[keyof ConnectionServiceMap]): Promise<CreateConnectionResponse> {
        let request = new CreateConnectionRequest();
        request.setService(service);
        return this.unaryRPC<CreateConnectionRequest, CreateConnectionResponse>(JungleTV.CreateConnection, request);
    }

    async removeConnection(id: string): Promise<RemoveConnectionResponse> {
        let request = new RemoveConnectionRequest();
        request.setId(id);
        return this.unaryRPC<RemoveConnectionRequest, RemoveConnectionResponse>(JungleTV.RemoveConnection, request);
    }

    async forciblyEnqueueTicket(id: string, type: ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap]): Promise<ForciblyEnqueueTicketResponse> {
        let request = new ForciblyEnqueueTicketRequest();
        request.setId(id);
        request.setEnqueueType(type);
        return this.unaryRPC<ForciblyEnqueueTicketRequest, ForciblyEnqueueTicketResponse>(JungleTV.ForciblyEnqueueTicket, request);
    }

    async removeQueueEntry(id: string): Promise<RemoveQueueEntryResponse> {
        let request = new RemoveQueueEntryRequest();
        request.setId(id);
        return this.unaryRPC<RemoveQueueEntryRequest, RemoveQueueEntryResponse>(JungleTV.RemoveQueueEntry, request);
    }

    async removeChatMessage(id: string): Promise<RemoveChatMessageResponse> {
        let request = new RemoveChatMessageRequest();
        request.setId(id);
        return this.unaryRPC<RemoveChatMessageRequest, RemoveChatMessageResponse>(JungleTV.RemoveChatMessage, request);
    }

    async setChatSettings(enabled: boolean, slowmode: boolean): Promise<SetChatSettingsResponse> {
        let request = new SetChatSettingsRequest();
        request.setEnabled(enabled);
        request.setSlowmode(slowmode);
        return this.unaryRPC<SetChatSettingsRequest, SetChatSettingsResponse>(JungleTV.SetChatSettings, request);
    }

    async setVideoEnqueuingEnabled(allowed: AllowedVideoEnqueuingTypeMap[keyof AllowedVideoEnqueuingTypeMap]): Promise<SetVideoEnqueuingEnabledResponse> {
        let request = new SetVideoEnqueuingEnabledRequest();
        request.setAllowed(allowed);
        return this.unaryRPC<SetVideoEnqueuingEnabledRequest, SetVideoEnqueuingEnabledResponse>(JungleTV.SetVideoEnqueuingEnabled, request);
    }

    async userBans(searchQuery: string, activeOnly: boolean, pagParams: PaginationParameters): Promise<UserBansResponse> {
        let request = new UserBansRequest();
        request.setSearchQuery(searchQuery);
        request.setActiveOnly(activeOnly);
        request.setPaginationParams(pagParams);
        return this.unaryRPC<UserBansRequest, UserBansResponse>(JungleTV.UserBans, request);
    }

    async banUser(address: string, remoteAddress: string, chatBanned: boolean, enqueuingBanned: boolean, rewardsBanned: boolean, reason: string, duration?: Duration): Promise<BanUserResponse> {
        let request = new BanUserRequest();
        request.setAddress(address);
        request.setRemoteAddress(remoteAddress);
        request.setChatBanned(chatBanned);
        request.setEnqueuingBanned(enqueuingBanned);
        request.setRewardsBanned(rewardsBanned);
        request.setReason(reason);
        request.setDuration(duration);
        return this.unaryRPC<BanUserRequest, BanUserResponse>(JungleTV.BanUser, request);
    }

    async removeBan(banID: string, reason: string): Promise<RemoveBanResponse> {
        let request = new RemoveBanRequest();
        request.setBanId(banID);
        request.setReason(reason);
        return this.unaryRPC<RemoveBanRequest, RemoveBanResponse>(JungleTV.RemoveBan, request);
    }

    async userChatMessages(address: string, numMessages: number): Promise<UserChatMessagesResponse> {
        let request = new UserChatMessagesRequest();
        request.setAddress(address);
        request.setNumMessages(numMessages);
        return this.unaryRPC<UserChatMessagesRequest, UserChatMessagesResponse>(JungleTV.UserChatMessages, request);
    }

    async setUserChatNickname(address: string, nickname: string): Promise<SetUserChatNicknameResponse> {
        let request = new SetUserChatNicknameRequest();
        request.setAddress(address);
        request.setNickname(nickname);
        return this.unaryRPC<SetUserChatNicknameRequest, SetUserChatNicknameResponse>(JungleTV.SetUserChatNickname, request);
    }

    async setPricesMultiplier(multiplier: number): Promise<SetPricesMultiplierResponse> {
        let request = new SetPricesMultiplierRequest();
        request.setMultiplier(multiplier);
        return this.unaryRPC<SetPricesMultiplierRequest, SetPricesMultiplierResponse>(JungleTV.SetPricesMultiplier, request);
    }

    async disallowedVideos(searchQuery: string, pagParams: PaginationParameters): Promise<DisallowedVideosResponse> {
        let request = new DisallowedVideosRequest();
        request.setSearchQuery(searchQuery);
        request.setPaginationParams(pagParams);
        return this.unaryRPC<DisallowedVideosRequest, DisallowedVideosResponse>(JungleTV.DisallowedVideos, request);
    }

    async addDisallowedVideo(ytVideoID: string): Promise<AddDisallowedVideoResponse> {
        let request = new AddDisallowedVideoRequest();
        request.setYtVideoId(ytVideoID);
        return this.unaryRPC<AddDisallowedVideoRequest, AddDisallowedVideoResponse>(JungleTV.AddDisallowedVideo, request);
    }

    async removeDisallowedVideo(id: string): Promise<RemoveDisallowedVideoResponse> {
        let request = new RemoveDisallowedVideoRequest();
        request.setId(id);
        return this.unaryRPC<RemoveDisallowedVideoRequest, RemoveDisallowedVideoResponse>(JungleTV.RemoveDisallowedVideo, request);
    }

    async setCrowdfundedSkippingEnabled(enabled: boolean): Promise<SetCrowdfundedSkippingEnabledResponse> {
        let request = new SetCrowdfundedSkippingEnabledRequest();
        request.setEnabled(enabled);
        return this.unaryRPC<SetCrowdfundedSkippingEnabledRequest, SetCrowdfundedSkippingEnabledResponse>(JungleTV.SetCrowdfundedSkippingEnabled, request);
    }

    async setSkipPriceMultiplier(multiplier: number): Promise<SetSkipPriceMultiplierResponse> {
        let request = new SetSkipPriceMultiplierRequest();
        request.setMultiplier(multiplier);
        return this.unaryRPC<SetSkipPriceMultiplierRequest, SetSkipPriceMultiplierResponse>(JungleTV.SetSkipPriceMultiplier, request);
    }

    async confirmRaffleWinner(raffleID: string): Promise<ConfirmRaffleWinnerResponse> {
        let request = new ConfirmRaffleWinnerRequest();
        request.setRaffleId(raffleID);
        return this.unaryRPC<ConfirmRaffleWinnerRequest, ConfirmRaffleWinnerResponse>(JungleTV.ConfirmRaffleWinner, request);
    }

    async completeRaffle(raffleID: string, prizeTxHash: string): Promise<CompleteRaffleResponse> {
        let request = new CompleteRaffleRequest();
        request.setRaffleId(raffleID);
        request.setPrizeTxHash(prizeTxHash);
        return this.unaryRPC<CompleteRaffleRequest, CompleteRaffleResponse>(JungleTV.CompleteRaffle, request);
    }

    async redrawRaffle(raffleID: string, reason: string): Promise<RedrawRaffleResponse> {
        let request = new RedrawRaffleRequest();
        request.setRaffleId(raffleID);
        request.setReason(reason);
        return this.unaryRPC<RedrawRaffleRequest, RedrawRaffleResponse>(JungleTV.RedrawRaffle, request);
    }

    async triggerAnnouncementsNotification(): Promise<TriggerAnnouncementsNotificationRequest> {
        return this.unaryRPC<TriggerAnnouncementsNotificationRequest, TriggerAnnouncementsNotificationResponse>(
            JungleTV.TriggerAnnouncementsNotification, new TriggerAnnouncementsNotificationRequest());
    }

    async spectatorInfo(rewardsAddress: string): Promise<Spectator> {
        let request = new SpectatorInfoRequest();
        request.setRewardsAddress(rewardsAddress);
        return this.unaryRPC<SpectatorInfoRequest, Spectator>(JungleTV.SpectatorInfo, request);
    }

    async resetSpectatorStatus(rewardsAddress: string): Promise<ResetSpectatorStatusResponse> {
        let request = new ResetSpectatorStatusRequest();
        request.setRewardsAddress(rewardsAddress);
        return this.unaryRPC<ResetSpectatorStatusRequest, ResetSpectatorStatusResponse>(JungleTV.ResetSpectatorStatus, request);
    }

    monitorModerationSettings(onModerationSettings: (settings: ModerationSettingsOverview) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        return this.serverStreamingRPC<MonitorModerationSettingsRequest, ModerationSettingsOverview>(
            JungleTV.MonitorModerationSettings,
            new MonitorModerationSettingsRequest(),
            onModerationSettings,
            onEnd);
    }

    async setOwnQueueEntryRemovalAllowed(allowed: boolean): Promise<SetOwnQueueEntryRemovalAllowedResponse> {
        let request = new SetOwnQueueEntryRemovalAllowedRequest();
        request.setAllowed(allowed);
        return this.unaryRPC<SetOwnQueueEntryRemovalAllowedRequest, SetOwnQueueEntryRemovalAllowedResponse>(JungleTV.SetOwnQueueEntryRemovalAllowed, request);
    }

    async setNewQueueEntriesAlwaysUnskippable(enabled: boolean): Promise<SetNewQueueEntriesAlwaysUnskippableResponse> {
        let request = new SetNewQueueEntriesAlwaysUnskippableRequest();
        request.setEnabled(enabled);
        return this.unaryRPC<SetNewQueueEntriesAlwaysUnskippableRequest, SetNewQueueEntriesAlwaysUnskippableResponse>(JungleTV.SetNewQueueEntriesAlwaysUnskippable, request);
    }

    async setSkippingEnabled(enabled: boolean): Promise<SetSkippingEnabledResponse> {
        let request = new SetSkippingEnabledRequest();
        request.setEnabled(enabled);
        return this.unaryRPC<SetSkippingEnabledRequest, SetSkippingEnabledResponse>(JungleTV.SetSkippingEnabled, request);
    }

    async setQueueInsertCursor(id: string): Promise<SetQueueInsertCursorResponse> {
        let request = new SetQueueInsertCursorRequest();
        request.setId(id);
        return this.unaryRPC<SetQueueInsertCursorRequest, SetQueueInsertCursorResponse>(JungleTV.SetQueueInsertCursor, request);
    }

    async clearQueueInsertCursor(): Promise<ClearQueueInsertCursorResponse> {
        return this.unaryRPC<ClearQueueInsertCursorRequest, ClearQueueInsertCursorResponse>(JungleTV.ClearQueueInsertCursor, new ClearQueueInsertCursorRequest());
    }

    async userPermissionLevel(): Promise<UserPermissionLevelResponse> {
        return this.unaryRPC<UserPermissionLevelRequest, UserPermissionLevelResponse>(JungleTV.UserPermissionLevel, new UserPermissionLevelRequest());
    }

    formatBANPrice(raw: string): string {
        return parseFloat(this.getBananoPartsAsDecimal(this.getAmountPartsFromRaw(raw, "ban_"))) + "";
    }

    formatBANPriceFixed(raw: string): string {
        return parseFloat(this.getBananoPartsAsDecimal(this.getAmountPartsFromRaw(raw, "ban_"))).toFixed(2) + "";
    }

    /**
   * converts amount from bananoParts to decimal.
   * @param {BananoParts} bananoParts the banano parts to describe.
   * @return {string} returns the decimal amount of bananos.
   */
    private getBananoPartsAsDecimal = (bananoParts) => {
        let bananoDecimal = '';
        const banano = bananoParts[bananoParts.majorName];
        if (banano !== undefined) {
            bananoDecimal += banano;
        } else {
            bananoDecimal += '0';
        }

        const banoshi = bananoParts[bananoParts.minorName];
        if ((banoshi !== undefined) || (bananoParts.raw !== undefined)) {
            bananoDecimal += '.';
        }

        if (banoshi !== undefined) {
            if (banoshi.length == 1) {
                bananoDecimal += '0';
            }
            bananoDecimal += banoshi;
        }

        if (bananoParts.raw !== undefined) {
            if (banoshi === undefined) {
                bananoDecimal += '00';
            }
            const count = 27 - bananoParts.raw.length;
            if (count < 0) {
                throw Error(`too many numbers in bananoParts.raw '${bananoParts.raw}', remove ${-count} of them.`);
            }
            bananoDecimal += '0'.repeat(count);
            bananoDecimal += bananoParts.raw;
        }

        return bananoDecimal;
    };


    /**
   * Get the banano parts (banano, banoshi, raw) for a given raw value.
   *
   * @param {string} amountRawStr the raw amount, as a string.
   * @param {string} amountPrefix the amount prefix, as a string.
   * @return {BananoParts} the banano parts.
   */
    private getAmountPartsFromRaw = (amountRawStr, amountPrefix) => {
        /* istanbul ignore if */
        if (amountPrefix == undefined) {
            throw Error('amountPrefix is a required parameter.');
        }

        const amountRaw = BigInt(amountRawStr);
        const prefixDivisor = prefixDivisors[amountPrefix];
        const majorDivisor = prefixDivisor.majorDivisor;
        const minorDivisor = prefixDivisor.minorDivisor;
        const major = amountRaw / majorDivisor;
        const majorRawRemainder = amountRaw - (major * majorDivisor);
        const minor = majorRawRemainder / minorDivisor;
        const amountRawRemainder = majorRawRemainder - (minor * minorDivisor);

        const bananoParts = {
            majorName: prefixDivisor.majorName,
            minorName: prefixDivisor.minorName,
            raw: amountRawRemainder.toString()
        };
        bananoParts[prefixDivisor.majorName] = major.toString();
        bananoParts[prefixDivisor.minorName] = minor.toString();
        return bananoParts;
    };

}

export const apiClient = APIClient.getInstance();

const prefixDivisors = {
    'ban_': {
        minorDivisor: BigInt('1000000000000000000000000000'),
        majorDivisor: BigInt('100000000000000000000000000000'),
        majorName: 'banano',
        minorName: 'banoshi',
    },
    'nano_': {
        minorDivisor: BigInt('1000000000000000000000000'),
        majorDivisor: BigInt('1000000000000000000000000000000'),
        majorName: 'nano',
        minorName: 'nanoshi',
    },
};
