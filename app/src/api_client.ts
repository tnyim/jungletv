import { grpc } from "@improbable-eng/grpc-web";
import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
import type { ProtobufMessage } from "@improbable-eng/grpc-web/dist/typings/message";
import type { Duration } from "google-protobuf/google/protobuf/duration_pb";
import { deleteCookie, getCookie, setCookie } from "./cookie_utils";
import {
    AddDisallowedMediaCollectionRequest, AddDisallowedMediaCollectionResponse, AddDisallowedMediaRequest, AddDisallowedMediaResponse, AddVipUserRequest, AddVipUserResponse, AdjustPointsBalanceRequest, AdjustPointsBalanceResponse, AllowedMediaEnqueuingTypeMap, BanUserRequest,
    BanUserResponse, BlockedUsersRequest, BlockedUsersResponse, BlockUserRequest, BlockUserResponse, ChatGifSearchRequest,
    ChatGifSearchResponse, ChatMessage, ChatUpdate, ClearQueueInsertCursorRequest, ClearQueueInsertCursorResponse, ClearUserProfileRequest, ClearUserProfileResponse, CompleteRaffleRequest, CompleteRaffleResponse, ConfirmRaffleWinnerRequest, ConfirmRaffleWinnerResponse, ConnectionServiceMap, ConnectionsRequest, ConnectionsResponse, ConsumeChatRequest, ConsumeMediaRequest, ConvertBananoToPointsRequest, ConvertBananoToPointsStatus, CreateConnectionRequest, CreateConnectionResponse, DisallowedMediaCollectionsRequest, DisallowedMediaCollectionsResponse, DisallowedMediaRequest, DisallowedMediaResponse, Document, EnqueueDocumentData, EnqueueMediaRequest,
    EnqueueMediaResponse,
    EnqueueMediaTicket, EnqueueSoundCloudTrackData, EnqueueYouTubeVideoData,
    ForcedTicketEnqueueTypeMap,
    ForciblyEnqueueTicketRequest,
    ForciblyEnqueueTicketResponse, GetDocumentRequest, LeaderboardPeriodMap, LeaderboardsRequest, LeaderboardsResponse, MarkAsActivelyModeratingRequest,
    MarkAsActivelyModeratingResponse, MediaConsumptionCheckpoint, ModerationStatusOverview,
    MonitorModerationStatusRequest, MonitorQueueRequest, MonitorSkipAndTipRequest, MonitorTicketRequest, MoveQueueEntryRequest, MoveQueueEntryResponse, OngoingRaffleInfoRequest, OngoingRaffleInfoResponse, PaginationParameters, PlayedMediaHistoryRequest, PlayedMediaHistoryResponse, PointsInfoRequest, PointsInfoResponse, PointsTransactionsRequest, PointsTransactionsResponse, ProduceSegchaChallengeRequest, ProduceSegchaChallengeResponse, Queue, QueueEntryMovementDirectionMap, RaffleDrawingsRequest, RaffleDrawingsResponse, RedrawRaffleRequest, RedrawRaffleResponse, RemoveBanRequest,
    RemoveBanResponse, RemoveChatMessageRequest, RemoveChatMessageResponse, RemoveConnectionRequest,
    RemoveConnectionResponse, RemoveDisallowedMediaCollectionRequest,
    RemoveDisallowedMediaCollectionResponse, RemoveDisallowedMediaRequest, RemoveDisallowedMediaResponse, RemoveOwnQueueEntryRequest, RemoveOwnQueueEntryResponse, RemoveQueueEntryRequest,
    RemoveQueueEntryResponse, RemoveUserVerificationRequest, RemoveUserVerificationResponse, RemoveVipUserRequest, RemoveVipUserResponse, ResetSpectatorStatusRequest, ResetSpectatorStatusResponse, RewardHistoryRequest,
    RewardHistoryResponse, RewardInfoRequest,
    RewardInfoResponse, SendChatMessageRequest, SendChatMessageResponse, SetChatNicknameRequest, SetChatNicknameResponse, SetChatSettingsRequest,
    SetChatSettingsResponse, SetCrowdfundedSkippingEnabledRequest, SetCrowdfundedSkippingEnabledResponse, SetMediaEnqueuingEnabledRequest, SetMediaEnqueuingEnabledResponse, SetMinimumPricesMultiplierRequest,
    SetMinimumPricesMultiplierResponse, SetNewQueueEntriesAlwaysUnskippableRequest, SetNewQueueEntriesAlwaysUnskippableResponse, SetOwnQueueEntryRemovalAllowedRequest, SetOwnQueueEntryRemovalAllowedResponse, SetPricesMultiplierRequest, SetPricesMultiplierResponse, SetProfileBiographyRequest, SetProfileBiographyResponse, SetProfileFeaturedMediaRequest,
    SetProfileFeaturedMediaResponse, SetQueueEntryReorderingAllowedRequest, SetQueueEntryReorderingAllowedResponse, SetQueueInsertCursorRequest,
    SetQueueInsertCursorResponse, SetSkippingEnabledRequest, SetSkippingEnabledResponse, SetSkipPriceMultiplierRequest,
    SetSkipPriceMultiplierResponse, SetUserChatNicknameRequest,
    SetUserChatNicknameResponse, SignInProgress, SignInRequest, SkipAndTipStatus, SoundCloudTrackDetailsRequest, SoundCloudTrackDetailsResponse, Spectator,
    SpectatorInfoRequest, StartOrExtendSubscriptionRequest, StartOrExtendSubscriptionResponse, StopActivelyModeratingRequest,
    StopActivelyModeratingResponse, SubmitActivityChallengeRequest,
    SubmitActivityChallengeResponse, TriggerAnnouncementsNotificationRequest,
    TriggerAnnouncementsNotificationResponse, TriggerClientReloadRequest, TriggerClientReloadResponse, UnblockUserRequest, UpdateDocumentResponse, UserBansRequest, UserBansResponse, UserChatMessagesRequest, UserChatMessagesResponse, UserPermissionLevelRequest, UserPermissionLevelResponse, UserProfileRequest,
    UserProfileResponse, UserStatsRequest, UserStatsResponse, UserVerificationsRequest, UserVerificationsResponse, VerifyUserRequest, VerifyUserResponse, VipUserAppearanceMap, WithdrawalHistoryRequest, WithdrawalHistoryResponse, WithdrawRequest, WithdrawResponse
} from "./proto/jungletv_pb";
import { JungleTV } from "./proto/jungletv_pb_service";

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

    public getClientVersion(): string {
        if (typeof (this.versionHash) === 'undefined') {
            const metas = document.getElementsByTagName("meta");
            for (let i = 0; i < metas.length; i++) {
                if (metas[i].getAttribute("name") === "jungletv-version-hash") {
                    this.versionHash = metas[i].getAttribute("content").split("###")[0];
                    break;
                }
            }
        }
        return this.versionHash;
    }

    private handleVersionHeader(version: string): void {
        if (version != this.getClientVersion()) {
            console.log("Reloading due to different version hash in API response");
            location.reload();
        }
    }

    private processHeaders(headers: grpc.Metadata): void {
        if (headers.has("X-API-Version")) {
            this.handleVersionHeader(headers.get("X-API-Version")[0])
        }
        if (headers.has("X-Replacement-Authorization-Token") && headers.has("X-Replacement-Authorization-Expiration")) {
            this.saveAuthToken(
                headers.get("X-Replacement-Authorization-Token")[0],
                new Date(headers.get("X-Replacement-Authorization-Expiration")[0]));
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
                onHeaders: (headers: grpc.Metadata): void => { this.processHeaders(headers); },
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
            onHeaders: (headers: grpc.Metadata): void => { this.processHeaders(headers); },
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

    saveAuthToken(token: string, expiry: Date) {
        setCookie("auth-token", token, expiry, "Strict");
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

    async enqueueSoundCloudTrack(url: string, unskippable: boolean, startOffset?: Duration, endOffset?: Duration): Promise<EnqueueMediaResponse> {
        let request = new EnqueueMediaRequest();
        request.setUnskippable(unskippable);
        let scData = new EnqueueSoundCloudTrackData();
        scData.setPermalink(url);
        if (typeof startOffset !== 'undefined') {
            scData.setStartOffset(startOffset);
        }
        if (typeof endOffset !== 'undefined') {
            scData.setEndOffset(endOffset);
        }
        request.setSoundcloudTrackData(scData);
        return this.unaryRPC<EnqueueMediaRequest, EnqueueMediaResponse>(JungleTV.EnqueueMedia, request);
    }

    async enqueueDocument(id: string, title: string, unskippable: boolean, duration?: Duration, enqueueType?: ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap]): Promise<EnqueueMediaResponse> {
        let request = new EnqueueMediaRequest();
        request.setUnskippable(unskippable);
        let docData = new EnqueueDocumentData();
        docData.setDocumentId(id);
        docData.setTitle(title);
        if (typeof duration !== 'undefined') {
            docData.setDuration(duration);
        }
        if (typeof enqueueType !== 'undefined') {
            docData.setEnqueueType(enqueueType);
        }
        request.setDocumentData(docData);
        return this.unaryRPC<EnqueueMediaRequest, EnqueueMediaResponse>(JungleTV.EnqueueMedia, request);
    }

    async soundCloudTrackDetails(url: string): Promise<SoundCloudTrackDetailsResponse> {
        let request = new SoundCloudTrackDetailsRequest();
        request.setTrackUrl(url);
        return this.unaryRPC<SoundCloudTrackDetailsRequest, SoundCloudTrackDetailsResponse>(JungleTV.SoundCloudTrackDetails, request);
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

    async moveQueueEntry(id: string, direction: QueueEntryMovementDirectionMap[keyof QueueEntryMovementDirectionMap]): Promise<MoveQueueEntryResponse> {
        let request = new MoveQueueEntryRequest();
        request.setId(id);
        request.setDirection(direction);
        return this.unaryRPC<MoveQueueEntryRequest, MoveQueueEntryResponse>(JungleTV.MoveQueueEntry, request);
    }

    async rewardInfo(): Promise<RewardInfoResponse> {
        return this.unaryRPC<RewardInfoRequest, RewardInfoResponse>(JungleTV.RewardInfo, new RewardInfoRequest());
    }

    async submitActivityChallenge(challenge: string, captchaResponse: string, trusted: boolean): Promise<SubmitActivityChallengeResponse> {
        let request = new SubmitActivityChallengeRequest();
        request.setChallenge(challenge);
        request.setCaptchaResponse(captchaResponse);
        request.setTrusted(trusted);
        request.setClientVersion(this.getClientVersion());
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

    async sendChatMessage(message: string, trusted: boolean, reference?: ChatMessage, tenorGifAttachment?: string): Promise<SendChatMessageResponse> {
        let request = new SendChatMessageRequest();
        request.setContent(message);
        request.setTrusted(trusted);
        if (typeof reference !== 'undefined') {
            request.setReplyReferenceId(reference.getId());
        }
        if (typeof tenorGifAttachment !== 'undefined') {
            request.setTenorGifAttachment(tenorGifAttachment);
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

    async raffleDrawings(pagParams: PaginationParameters): Promise<RaffleDrawingsResponse> {
        let request = new RaffleDrawingsRequest();
        request.setPaginationParams(pagParams);
        return this.unaryRPC<RaffleDrawingsRequest, RaffleDrawingsResponse>(JungleTV.RaffleDrawings, request);
    }

    async connections(): Promise<ConnectionsResponse> {
        let request = new ConnectionsRequest();
        return this.unaryRPC<ConnectionsRequest, ConnectionsResponse>(JungleTV.Connections, request);
    }

    async playedMediaHistory(searchQuery: string, pagParams: PaginationParameters): Promise<PlayedMediaHistoryResponse> {
        let request = new PlayedMediaHistoryRequest();
        request.setSearchQuery(searchQuery);
        request.setPaginationParams(pagParams);
        return this.unaryRPC<PlayedMediaHistoryRequest, PlayedMediaHistoryResponse>(JungleTV.PlayedMediaHistory, request);
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

    async setMediaEnqueuingEnabled(allowed: AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap]): Promise<SetMediaEnqueuingEnabledResponse> {
        let request = new SetMediaEnqueuingEnabledRequest();
        request.setAllowed(allowed);
        return this.unaryRPC<SetMediaEnqueuingEnabledRequest, SetMediaEnqueuingEnabledResponse>(JungleTV.SetMediaEnqueuingEnabled, request);
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

    async userVerifications(searchQuery: string, pagParams: PaginationParameters): Promise<UserVerificationsResponse> {
        let request = new UserVerificationsRequest();
        request.setPaginationParams(pagParams);
        request.setSearchQuery(searchQuery);
        return this.unaryRPC<UserVerificationsRequest, UserVerificationsResponse>(JungleTV.UserVerifications, request);
    }

    async verifyUser(address: string, skipClientIntegrityChecks: boolean, skipIPAddressReputationChecks: boolean, reduceHardChallengeFrequency: boolean, reason: string): Promise<VerifyUserResponse> {
        let request = new VerifyUserRequest();
        request.setAddress(address);
        request.setSkipClientIntegrityChecks(skipClientIntegrityChecks);
        request.setSkipIpAddressReputationChecks(skipIPAddressReputationChecks);
        request.setReduceHardChallengeFrequency(reduceHardChallengeFrequency);
        request.setReason(reason);
        return this.unaryRPC<VerifyUserRequest, VerifyUserResponse>(JungleTV.VerifyUser, request);
    }

    async removeUserVerification(verificationID: string, reason: string): Promise<RemoveUserVerificationResponse> {
        let request = new RemoveUserVerificationRequest();
        request.setVerificationId(verificationID);
        request.setReason(reason);
        return this.unaryRPC<RemoveUserVerificationRequest, RemoveUserVerificationResponse>(JungleTV.RemoveUserVerification, request);
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

    async setMinimumPricesMultiplier(multiplier: number): Promise<SetMinimumPricesMultiplierResponse> {
        let request = new SetMinimumPricesMultiplierRequest();
        request.setMultiplier(multiplier);
        return this.unaryRPC<SetMinimumPricesMultiplierRequest, SetMinimumPricesMultiplierResponse>(JungleTV.SetMinimumPricesMultiplier, request);
    }

    async disallowedMedia(searchQuery: string, pagParams: PaginationParameters): Promise<DisallowedMediaResponse> {
        let request = new DisallowedMediaRequest();
        request.setSearchQuery(searchQuery);
        request.setPaginationParams(pagParams);
        return this.unaryRPC<DisallowedMediaRequest, DisallowedMediaResponse>(JungleTV.DisallowedMedia, request);
    }

    async addDisallowedYouTubeVideo(ytVideoID: string): Promise<AddDisallowedMediaResponse> {
        let request = new AddDisallowedMediaRequest();
        let data = new EnqueueMediaRequest();
        let ytData = new EnqueueYouTubeVideoData();
        ytData.setId(ytVideoID);
        data.setYoutubeVideoData(ytData);
        request.setDisallowedMediaRequest(data);
        return this.unaryRPC<AddDisallowedMediaRequest, AddDisallowedMediaResponse>(JungleTV.AddDisallowedMedia, request);
    }

    async addDisallowedSoundCloudTrack(trackURL: string): Promise<AddDisallowedMediaResponse> {
        let request = new AddDisallowedMediaRequest();
        let data = new EnqueueMediaRequest();
        let scData = new EnqueueSoundCloudTrackData();
        scData.setPermalink(trackURL);
        data.setSoundcloudTrackData(scData);
        request.setDisallowedMediaRequest(data);
        return this.unaryRPC<AddDisallowedMediaRequest, AddDisallowedMediaResponse>(JungleTV.AddDisallowedMedia, request);
    }

    async removeDisallowedMedia(id: string): Promise<RemoveDisallowedMediaResponse> {
        let request = new RemoveDisallowedMediaRequest();
        request.setId(id);
        return this.unaryRPC<RemoveDisallowedMediaRequest, RemoveDisallowedMediaResponse>(JungleTV.RemoveDisallowedMedia, request);
    }

    async disallowedMediaCollections(searchQuery: string, pagParams: PaginationParameters): Promise<DisallowedMediaCollectionsResponse> {
        let request = new DisallowedMediaCollectionsRequest();
        request.setSearchQuery(searchQuery);
        request.setPaginationParams(pagParams);
        return this.unaryRPC<DisallowedMediaCollectionsRequest, DisallowedMediaCollectionsResponse>(JungleTV.DisallowedMediaCollections, request);
    }

    async addDisallowedYouTubeChannel(ytVideoID: string): Promise<AddDisallowedMediaCollectionResponse> {
        let request = new AddDisallowedMediaCollectionRequest();
        let data = new EnqueueMediaRequest();
        let ytData = new EnqueueYouTubeVideoData();
        ytData.setId(ytVideoID);
        data.setYoutubeVideoData(ytData);
        request.setDisallowedMediaRequest(data);
        return this.unaryRPC<AddDisallowedMediaCollectionRequest, AddDisallowedMediaCollectionResponse>(JungleTV.AddDisallowedMediaCollection, request);
    }

    async addDisallowedSoundCloudUser(trackURL: string): Promise<AddDisallowedMediaCollectionResponse> {
        let request = new AddDisallowedMediaCollectionRequest();
        let data = new EnqueueMediaRequest();
        let scData = new EnqueueSoundCloudTrackData();
        scData.setPermalink(trackURL);
        data.setSoundcloudTrackData(scData);
        request.setDisallowedMediaRequest(data);
        return this.unaryRPC<AddDisallowedMediaCollectionRequest, AddDisallowedMediaCollectionResponse>(JungleTV.AddDisallowedMediaCollection, request);
    }

    async removeDisallowedMediaCollection(id: string): Promise<RemoveDisallowedMediaCollectionResponse> {
        let request = new RemoveDisallowedMediaCollectionRequest();
        request.setId(id);
        return this.unaryRPC<RemoveDisallowedMediaCollectionRequest, RemoveDisallowedMediaCollectionResponse>(JungleTV.RemoveDisallowedMediaCollection, request);
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

    monitorModerationStatus(onModerationStatus: (status: ModerationStatusOverview) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        return this.serverStreamingRPC<MonitorModerationStatusRequest, ModerationStatusOverview>(
            JungleTV.MonitorModerationStatus,
            new MonitorModerationStatusRequest(),
            onModerationStatus,
            onEnd);
    }

    async setOwnQueueEntryRemovalAllowed(allowed: boolean): Promise<SetOwnQueueEntryRemovalAllowedResponse> {
        let request = new SetOwnQueueEntryRemovalAllowedRequest();
        request.setAllowed(allowed);
        return this.unaryRPC<SetOwnQueueEntryRemovalAllowedRequest, SetOwnQueueEntryRemovalAllowedResponse>(JungleTV.SetOwnQueueEntryRemovalAllowed, request);
    }

    async setQueueEntryReorderingAllowed(allowed: boolean): Promise<SetQueueEntryReorderingAllowedResponse> {
        let request = new SetQueueEntryReorderingAllowedRequest();
        request.setAllowed(allowed);
        return this.unaryRPC<SetQueueEntryReorderingAllowedRequest, SetQueueEntryReorderingAllowedResponse>(JungleTV.SetQueueEntryReorderingAllowed, request);
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

    async userProfile(address: string): Promise<UserProfileResponse> {
        let request = new UserProfileRequest();
        request.setAddress(address);
        return this.unaryRPC<UserProfileRequest, UserProfileResponse>(JungleTV.UserProfile, request);
    }

    async userStats(address: string): Promise<UserStatsResponse> {
        let request = new UserStatsRequest();
        request.setAddress(address);
        return this.unaryRPC<UserStatsRequest, UserStatsResponse>(JungleTV.UserStats, request);
    }

    async setProfileBiography(biography: string): Promise<SetProfileBiographyResponse> {
        let request = new SetProfileBiographyRequest();
        request.setBiography(biography);
        return this.unaryRPC<SetProfileBiographyRequest, SetProfileBiographyResponse>(JungleTV.SetProfileBiography, request);
    }

    async setProfileFeaturedMedia(mediaID?: string): Promise<SetProfileFeaturedMediaResponse> {
        let request = new SetProfileFeaturedMediaRequest();
        if (typeof mediaID !== 'undefined') {
            request.setMediaId(mediaID);
        }
        return this.unaryRPC<SetProfileFeaturedMediaRequest, SetProfileFeaturedMediaResponse>(JungleTV.SetProfileFeaturedMedia, request);
    }

    async clearUserProfile(address: string): Promise<ClearUserProfileResponse> {
        let request = new ClearUserProfileRequest();
        request.setAddress(address);
        return this.unaryRPC<ClearUserProfileRequest, ClearUserProfileResponse>(JungleTV.ClearUserProfile, request);
    }

    async blockUser(address: string): Promise<BlockUserResponse> {
        let request = new BlockUserRequest();
        request.setAddress(address);
        return this.unaryRPC<BlockUserRequest, BlockUserResponse>(JungleTV.BlockUser, request);
    }

    async unblockUser(blockID?: string, address?: string): Promise<BlockUserResponse> {
        let request = new UnblockUserRequest();
        if (typeof (blockID) !== "undefined") {
            request.setBlockId(blockID);
        } else if (typeof (address) !== "undefined") {
            request.setAddress(address);
        }
        return this.unaryRPC<BlockUserRequest, BlockUserResponse>(JungleTV.UnblockUser, request);
    }

    async blockedUsers(pagParams: PaginationParameters): Promise<BlockedUsersResponse> {
        let request = new BlockedUsersRequest();
        request.setPaginationParams(pagParams);
        return this.unaryRPC<BlockedUsersRequest, BlockedUsersResponse>(JungleTV.BlockedUsers, request);
    }

    async markAsActivelyModerating(): Promise<MarkAsActivelyModeratingResponse> {
        let request = new MarkAsActivelyModeratingRequest();
        return this.unaryRPC<MarkAsActivelyModeratingRequest, MarkAsActivelyModeratingResponse>(JungleTV.MarkAsActivelyModerating, request);
    }

    async stopActivelyModerating(): Promise<StopActivelyModeratingResponse> {
        let request = new StopActivelyModeratingRequest();
        return this.unaryRPC<StopActivelyModeratingRequest, StopActivelyModeratingResponse>(JungleTV.StopActivelyModerating, request);
    }

    async addVipUser(address: string, appearance: VipUserAppearanceMap[keyof VipUserAppearanceMap]): Promise<AddVipUserResponse> {
        let request = new AddVipUserRequest();
        request.setRewardsAddress(address);
        request.setAppearance(appearance);
        return this.unaryRPC<AddVipUserRequest, AddVipUserResponse>(JungleTV.AddVipUser, request);
    }

    async removeVipUser(address: string): Promise<RemoveVipUserResponse> {
        let request = new RemoveVipUserRequest();
        request.setRewardsAddress(address);
        return this.unaryRPC<RemoveVipUserRequest, RemoveVipUserResponse>(JungleTV.RemoveVipUser, request);
    }

    async triggerClientReload(): Promise<TriggerClientReloadResponse> {
        let request = new TriggerClientReloadRequest();
        return this.unaryRPC<TriggerClientReloadRequest, TriggerClientReloadResponse>(JungleTV.TriggerClientReload, request);
    }

    async adjustPointsBalance(rewardsAddress: string, value: number, reason: string): Promise<AdjustPointsBalanceResponse> {
        let request = new AdjustPointsBalanceRequest();
        request.setRewardsAddress(rewardsAddress);
        request.setValue(value);
        request.setReason(reason);
        return this.unaryRPC<AdjustPointsBalanceRequest, AdjustPointsBalanceResponse>(JungleTV.AdjustPointsBalance, request);
    }

    async pointsInfo(): Promise<PointsInfoResponse> {
        return this.unaryRPC<PointsInfoRequest, PointsInfoResponse>(JungleTV.PointsInfo, new PointsInfoRequest());
    }

    async pointsTransactions(pagParams: PaginationParameters): Promise<PointsTransactionsResponse> {
        let request = new PointsTransactionsRequest();
        request.setPaginationParams(pagParams);
        return this.unaryRPC<PointsTransactionsRequest, PointsTransactionsResponse>(JungleTV.PointsTransactions, request);
    }

    async chatGifSearch(query: string, cursor: string): Promise<ChatGifSearchResponse> {
        let request = new ChatGifSearchRequest();
        request.setQuery(query);
        request.setCursor(cursor);
        return this.unaryRPC<ChatGifSearchRequest, ChatGifSearchResponse>(JungleTV.ChatGifSearch, request);
    }

    convertBananoToPoints(onStatusUpdated: (status: ConvertBananoToPointsStatus) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        return this.serverStreamingRPC<ConvertBananoToPointsRequest, ConvertBananoToPointsStatus>(
            JungleTV.ConvertBananoToPoints,
            new ConvertBananoToPointsRequest(),
            onStatusUpdated,
            onEnd);
    }

    async startOrExtendSubscription(): Promise<StartOrExtendSubscriptionResponse> {
        return this.unaryRPC<StartOrExtendSubscriptionRequest, StartOrExtendSubscriptionResponse>(JungleTV.StartOrExtendSubscription, new StartOrExtendSubscriptionRequest());
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
