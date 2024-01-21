import { grpc } from "@improbable-eng/grpc-web";
import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";
import type { ProtobufMessage } from "@improbable-eng/grpc-web/dist/typings/message";
import type { MethodDefinition } from "@improbable-eng/grpc-web/dist/typings/service";
import type { Duration } from "google-protobuf/google/protobuf/duration_pb";
import { DateTime } from "luxon";
import { deleteCookie, getCookie, setCookie } from "./cookie_utils";
import { Application, ApplicationFile, ApplicationFilesRequest, ApplicationFilesResponse, ApplicationLogEntryContainer, ApplicationLogRequest, ApplicationLogResponse, ApplicationsRequest, ApplicationsResponse, CloneApplicationFileRequest, CloneApplicationFileResponse, CloneApplicationRequest, CloneApplicationResponse, ConsumeApplicationLogRequest, CreateApplicationWithWalletPrefixRequest, CreateApplicationWithWalletPrefixResponse, DeleteApplicationFileRequest, DeleteApplicationFileResponse, DeleteApplicationRequest, DeleteApplicationResponse, EvaluateExpressionOnApplicationRequest, EvaluateExpressionOnApplicationResponse, ExportApplicationRequest, ExportApplicationResponse, GetApplicationFileRequest, GetApplicationRequest, ImportApplicationRequest, ImportApplicationResponse, LaunchApplicationRequest, LaunchApplicationResponse, MonitorRunningApplicationsRequest, RunningApplications, StopApplicationRequest, StopApplicationResponse, UpdateApplicationFileResponse, UpdateApplicationResponse, type ApplicationLogLevelMap } from "./proto/application_editor_pb";
import { ApplicationEventUpdate, ApplicationServerMethodRequest, ApplicationServerMethodResponse, ConsumeApplicationEventsRequest, ResolveApplicationPageRequest, ResolveApplicationPageResponse, TriggerApplicationEventRequest, TriggerApplicationEventResponse } from "./proto/application_runtime_pb";
import type { PaginationParameters } from "./proto/common_pb";
import {
    AddDisallowedMediaCollectionRequest, AddDisallowedMediaCollectionResponse, AddDisallowedMediaRequest, AddDisallowedMediaResponse, AddVipUserRequest, AddVipUserResponse, AdjustPointsBalanceRequest, AdjustPointsBalanceResponse,
    AuthorizationProcessDataRequest, AuthorizationProcessDataResponse, BanUserRequest,
    BanUserResponse,
    BlockUserRequest, BlockUserResponse,
    BlockedUsersRequest, BlockedUsersResponse,
    ChatGifSearchRequest,
    ChatGifSearchResponse, ChatMessage, ChatUpdate, CheckMediaEnqueuingPasswordRequest, CheckMediaEnqueuingPasswordResponse, ClearQueueInsertCursorRequest, ClearQueueInsertCursorResponse, ClearUserProfileRequest, ClearUserProfileResponse, CompleteRaffleRequest, CompleteRaffleResponse, ConfirmRaffleWinnerRequest, ConfirmRaffleWinnerResponse,
    ConnectionsRequest, ConnectionsResponse, ConsentOrDissentToAuthorizationRequest, ConsentOrDissentToAuthorizationResponse, ConsumeChatRequest, ConsumeMediaRequest, ConvertBananoToPointsRequest, ConvertBananoToPointsStatus, CreateConnectionRequest, CreateConnectionResponse, DisallowedMediaCollectionsRequest, DisallowedMediaCollectionsResponse, DisallowedMediaRequest, DisallowedMediaResponse, Document, DocumentsRequest, DocumentsResponse, EnqueueDocumentData, EnqueueMediaRequest,
    EnqueueMediaResponse,
    EnqueueMediaTicket, EnqueueSoundCloudTrackData, EnqueueYouTubeVideoData,
    ForciblyEnqueueTicketRequest,
    ForciblyEnqueueTicketResponse, GetDocumentRequest, IncreaseOrReduceSkipThresholdRequest, IncreaseOrReduceSkipThresholdResponse, InvalidateAuthTokensRequest, InvalidateAuthTokensResponse, InvalidateUserAuthTokensRequest, InvalidateUserAuthTokensResponse,
    LabSignInOptions,
    LeaderboardsRequest, LeaderboardsResponse, MarkAsActivelyModeratingRequest,
    MarkAsActivelyModeratingResponse, MediaConsumptionCheckpoint, MediaEnqueuingPermissionStatus, ModerationStatusOverview,
    MonitorMediaEnqueuingPermissionRequest,
    MonitorModerationStatusRequest, MonitorQueueRequest, MonitorSkipAndTipRequest, MonitorTicketRequest, MoveQueueEntryRequest, MoveQueueEntryResponse, OngoingRaffleInfoRequest, OngoingRaffleInfoResponse, PlayedMediaHistoryRequest, PlayedMediaHistoryResponse, PointsInfoRequest, PointsInfoResponse, PointsTransactionsRequest, PointsTransactionsResponse, ProduceSegchaChallengeRequest, ProduceSegchaChallengeResponse, Queue,
    RaffleDrawingsRequest, RaffleDrawingsResponse, RedrawRaffleRequest, RedrawRaffleResponse, RemoveBanRequest,
    RemoveBanResponse, RemoveChatMessageRequest, RemoveChatMessageResponse, RemoveConnectionRequest,
    RemoveConnectionResponse, RemoveDisallowedMediaCollectionRequest,
    RemoveDisallowedMediaCollectionResponse, RemoveDisallowedMediaRequest, RemoveDisallowedMediaResponse, RemoveOwnQueueEntryRequest, RemoveOwnQueueEntryResponse, RemoveQueueEntryRequest,
    RemoveQueueEntryResponse, RemoveUserVerificationRequest, RemoveUserVerificationResponse, RemoveVipUserRequest, RemoveVipUserResponse, ResetSpectatorStatusRequest, ResetSpectatorStatusResponse, RewardHistoryRequest,
    RewardHistoryResponse, RewardInfoRequest,
    RewardInfoResponse, SendChatMessageRequest, SendChatMessageResponse, SetChatNicknameRequest, SetChatNicknameResponse, SetChatSettingsRequest,
    SetChatSettingsResponse, SetCrowdfundedSkippingEnabledRequest, SetCrowdfundedSkippingEnabledResponse, SetMediaEnqueuingEnabledRequest, SetMediaEnqueuingEnabledResponse, SetMinimumPricesMultiplierRequest,
    SetMinimumPricesMultiplierResponse, SetMulticurrencyPaymentsEnabledRequest, SetMulticurrencyPaymentsEnabledResponse, SetNewQueueEntriesAlwaysUnskippableRequest, SetNewQueueEntriesAlwaysUnskippableResponse, SetOwnQueueEntryRemovalAllowedRequest, SetOwnQueueEntryRemovalAllowedResponse, SetPricesMultiplierRequest, SetPricesMultiplierResponse, SetProfileBiographyRequest, SetProfileBiographyResponse, SetProfileFeaturedMediaRequest,
    SetProfileFeaturedMediaResponse, SetQueueEntryReorderingAllowedRequest, SetQueueEntryReorderingAllowedResponse, SetQueueInsertCursorRequest,
    SetQueueInsertCursorResponse,
    SetSkipPriceMultiplierRequest,
    SetSkipPriceMultiplierResponse,
    SetSkippingEnabledRequest, SetSkippingEnabledResponse,
    SetUserChatNicknameRequest,
    SetUserChatNicknameResponse, SignInProgress, SignInRequest,
    SignInResponse,
    SkipAndTipStatus, SoundCloudTrackDetailsRequest, SoundCloudTrackDetailsResponse, Spectator,
    SpectatorInfoRequest, StartOrExtendSubscriptionRequest, StartOrExtendSubscriptionResponse, StopActivelyModeratingRequest,
    StopActivelyModeratingResponse, SubmitActivityChallengeRequest,
    SubmitActivityChallengeResponse, TriggerAnnouncementsNotificationRequest,
    TriggerAnnouncementsNotificationResponse, TriggerClientReloadRequest, TriggerClientReloadResponse, UnblockUserRequest, UpdateDocumentResponse, UserBansRequest, UserBansResponse, UserChatMessagesRequest, UserChatMessagesResponse, UserPermissionLevelRequest, UserPermissionLevelResponse, UserProfileRequest,
    UserProfileResponse, UserStatsRequest, UserStatsResponse, UserVerificationsRequest, UserVerificationsResponse,
    VerifySignInSignatureRequest,
    VerifyUserRequest, VerifyUserResponse,
    WithdrawRequest, WithdrawResponse,
    WithdrawalHistoryRequest, WithdrawalHistoryResponse,
    type AllowedMediaEnqueuingTypeMap,
    type ConnectionServiceMap,
    type ForcedTicketEnqueueTypeMap,
    type LeaderboardPeriodMap,
    type QueueEntryMovementDirectionMap,
    type VipUserAppearanceMap
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
            let apiHost: string;
            if (globalThis.OVERRIDE_API_HOST) {
                apiHost = globalThis.OVERRIDE_API_HOST;
            } else if (globalThis.PRODUCTION_BUILD) {
                if (globalThis.LAB_BUILD) {
                    apiHost = "https://staging.jungletv.live";
                } else {
                    apiHost = "https://jungletv.live";
                }
            } else {
                apiHost = window.location.origin;
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
                    this.versionHash = metas[i].getAttribute("content").split("***")[0];
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

    async unaryRPC<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage>(operation: MethodDefinition<TRequest, TResponse>, request: TRequest): Promise<TResponse> {
        return this.unaryRPCWithCancel(operation, request)[0];
    }

    unaryRPCWithCancel<TRequest extends ProtobufMessage, TResponse extends ProtobufMessage>(operation: MethodDefinition<TRequest, TResponse>, request: TRequest): [Promise<TResponse>, () => void] {
        let r: Request;
        let rej: (reason?: any) => void;
        let cancel = function () {
            if (typeof r !== "undefined") r.close();
            if (typeof rej !== "undefined") rej();
        }
        return [new Promise<TResponse>((resolve, reject) => {
            rej = reject;
            r = grpc.invoke(operation, {
                request: request,
                host: this.host,
                metadata: new grpc.Metadata({ "Authorization": this.getAuthToken() }),
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
        }), cancel];
    }

    serverStreamingRPC<TRequest extends ProtobufMessage, TResponseItem extends ProtobufMessage>(
        operation: MethodDefinition<TRequest, TResponseItem>,
        request: TRequest,
        onMessage: (message: TResponseItem) => void,
        onEnd: (code: grpc.Code, msg: string) => void): Request {
        return grpc.invoke(operation, {
            request: request,
            host: this.host,
            metadata: new grpc.Metadata({ "Authorization": this.getAuthToken() }),
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

    signIn(address: string, viaSignature: boolean, onProgress: (progress: SignInProgress) => void, onEnd: (code: grpc.Code, msg: string) => void, ongoingProcessID?: string, labOptions?: LabSignInOptions): Request {
        const request = new SignInRequest();
        request.setRewardsAddress(address);
        request.setViaSignature(viaSignature);
        if (typeof ongoingProcessID !== "undefined") {
            request.setOngoingProcessId(ongoingProcessID);
        }
        if (typeof labOptions !== "undefined") {
            request.setLabSignInOptions(labOptions);
        }
        return this.serverStreamingRPC(
            JungleTV.SignIn,
            request,
            onProgress,
            onEnd);
    }

    verifySignInSignature(processID: string, signatureHex: string): Promise<SignInResponse> {
        const request = new VerifySignInSignatureRequest();
        request.setProcessId(processID);
        request.setSignatureHex(signatureHex);
        return this.unaryRPC(JungleTV.VerifySignInSignature, request);
    }

    signOut() {
        deleteCookie("auth-token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("authTokenExpiry");
        //this.authNeededCallback();
    }

    saveAuthToken(token: string, expiry: Date) {
        setCookie("auth-token", token, expiry, "Strict", true);
        localStorage.setItem("authToken", token);
        localStorage.setItem("authTokenExpiry", expiry.toUTCString());
    }

    private getAuthToken(): string {
        let c = getCookie("auth-token");
        let token = localStorage.getItem("authToken");
        let tokenExpiryString = localStorage.getItem("authTokenExpiry");
        if (c != "") {
            if (token == null || tokenExpiryString == null) {
                localStorage.setItem("authToken", c);
                localStorage.setItem("authTokenExpiry", DateTime.now().plus({ hours: 30 * 24 }).toJSDate().toUTCString());
            }
            return c;
        }
        // cookie may have been magically cleared (https://github.com/brave/brave-browser/issues/3443), attempt to retrieve backup from local storage
        if (token != null && tokenExpiryString != null) {
            let tokenExpiry = new Date(tokenExpiryString);
            if (tokenExpiry.getTime() > new Date().getTime()) {
                setCookie("auth-token", token, tokenExpiry, "Strict", true);
                return token;
            }
        }
        return "";
    }

    async enqueueYouTubeVideo(id: string, unskippable: boolean, concealed: boolean, anonymous: boolean, password?: string, startOffset?: Duration, endOffset?: Duration): Promise<EnqueueMediaResponse> {
        const request = new EnqueueMediaRequest();
        request.setUnskippable(unskippable);
        request.setConcealed(concealed);
        request.setAnonymous(anonymous);
        if (typeof password !== 'undefined') {
            request.setPassword(password);
        }
        let ytData = new EnqueueYouTubeVideoData();
        ytData.setId(id);
        if (typeof startOffset !== 'undefined') {
            ytData.setStartOffset(startOffset);
        }
        if (typeof endOffset !== 'undefined') {
            ytData.setEndOffset(endOffset);
        }
        request.setYoutubeVideoData(ytData);
        return this.unaryRPC(JungleTV.EnqueueMedia, request);
    }

    async enqueueSoundCloudTrack(url: string, unskippable: boolean, concealed: boolean, anonymous: boolean, password?: string, startOffset?: Duration, endOffset?: Duration): Promise<EnqueueMediaResponse> {
        const request = new EnqueueMediaRequest();
        request.setUnskippable(unskippable);
        request.setConcealed(concealed);
        request.setAnonymous(anonymous);
        if (typeof password !== 'undefined') {
            request.setPassword(password);
        }
        let scData = new EnqueueSoundCloudTrackData();
        scData.setPermalink(url);
        if (typeof startOffset !== 'undefined') {
            scData.setStartOffset(startOffset);
        }
        if (typeof endOffset !== 'undefined') {
            scData.setEndOffset(endOffset);
        }
        request.setSoundcloudTrackData(scData);
        return this.unaryRPC(JungleTV.EnqueueMedia, request);
    }

    async enqueueDocument(id: string, title: string, unskippable: boolean, concealed: boolean, anonymous: boolean, password?: string, duration?: Duration, enqueueType?: ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap]): Promise<EnqueueMediaResponse> {
        const request = new EnqueueMediaRequest();
        request.setUnskippable(unskippable);
        request.setConcealed(concealed);
        request.setAnonymous(anonymous);
        if (typeof password !== 'undefined') {
            request.setPassword(password);
        }
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
        return this.unaryRPC(JungleTV.EnqueueMedia, request);
    }

    async soundCloudTrackDetails(url: string): Promise<SoundCloudTrackDetailsResponse> {
        const request = new SoundCloudTrackDetailsRequest();
        request.setTrackUrl(url);
        return this.unaryRPC(JungleTV.SoundCloudTrackDetails, request);
    }

    async increaseOrReduceSkipThreshold(increase: boolean): Promise<IncreaseOrReduceSkipThresholdResponse> {
        const request = new IncreaseOrReduceSkipThresholdRequest();
        request.setIncrease(increase);
        return this.unaryRPC(JungleTV.IncreaseOrReduceSkipThreshold, request);
    }

    consumeMedia(onCheckpoint: (checkpoint: MediaConsumptionCheckpoint) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        const request = new ConsumeMediaRequest();
        return this.serverStreamingRPC(
            JungleTV.ConsumeMedia,
            request,
            onCheckpoint,
            onEnd);
    }

    monitorQueue(onQueueUpdated: (queue: Queue) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        return this.serverStreamingRPC(
            JungleTV.MonitorQueue,
            new MonitorQueueRequest(),
            onQueueUpdated,
            onEnd);
    }

    monitorSkipAndTip(onSkipAndTipStatus: (skipAndTipStatus: SkipAndTipStatus) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        return this.serverStreamingRPC(
            JungleTV.MonitorSkipAndTip,
            new MonitorSkipAndTipRequest(),
            onSkipAndTipStatus,
            onEnd);
    }

    monitorTicket(ticketID: string, onTicketUpdated: (ticket: EnqueueMediaTicket) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        const request = new MonitorTicketRequest();
        request.setTicketId(ticketID);
        return this.serverStreamingRPC(
            JungleTV.MonitorTicket,
            request,
            onTicketUpdated,
            onEnd);
    }

    async removeOwnQueueEntry(id: string): Promise<RemoveOwnQueueEntryResponse> {
        const request = new RemoveOwnQueueEntryRequest();
        request.setId(id);
        return this.unaryRPC(JungleTV.RemoveOwnQueueEntry, request);
    }

    async moveQueueEntry(id: string, direction: QueueEntryMovementDirectionMap[keyof QueueEntryMovementDirectionMap]): Promise<MoveQueueEntryResponse> {
        const request = new MoveQueueEntryRequest();
        request.setId(id);
        request.setDirection(direction);
        return this.unaryRPC(JungleTV.MoveQueueEntry, request);
    }

    async rewardInfo(): Promise<RewardInfoResponse> {
        return this.unaryRPC(JungleTV.RewardInfo, new RewardInfoRequest());
    }

    async submitActivityChallenge(challenge: string, challengeResponses: string[], trusted: boolean): Promise<SubmitActivityChallengeResponse> {
        const request = new SubmitActivityChallengeRequest();
        request.setChallenge(challenge);
        request.setResponsesList(challengeResponses);
        request.setTrusted(trusted);
        request.setClientVersion(this.getClientVersion());
        return this.unaryRPC(JungleTV.SubmitActivityChallenge, request);
    }

    async produceSegchaChallenge(): Promise<ProduceSegchaChallengeResponse> {
        const request = new ProduceSegchaChallengeRequest();
        return this.unaryRPC(JungleTV.ProduceSegchaChallenge, request);
    }

    consumeChat(initialHistorySize: number, onUpdate: (update: ChatUpdate) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        const request = new ConsumeChatRequest();
        request.setInitialHistorySize(initialHistorySize);
        return this.serverStreamingRPC(
            JungleTV.ConsumeChat,
            request,
            onUpdate,
            onEnd);
    }

    async sendChatMessage(message: string, trusted: boolean, reference?: ChatMessage, tenorGifAttachment?: string): Promise<SendChatMessageResponse> {
        const request = new SendChatMessageRequest();
        request.setContent(message);
        request.setTrusted(trusted);
        if (typeof reference !== 'undefined') {
            request.setReplyReferenceId(reference.getId());
        }
        if (typeof tenorGifAttachment !== 'undefined') {
            request.setTenorGifAttachment(tenorGifAttachment);
        }
        return this.unaryRPC(JungleTV.SendChatMessage, request);
    }

    async setChatNickname(nickname: string): Promise<SetChatNicknameResponse> {
        const request = new SetChatNicknameRequest();
        request.setNickname(nickname);
        return this.unaryRPC(JungleTV.SetChatNickname, request);
    }

    async getDocument(id: string): Promise<Document> {
        const request = new GetDocumentRequest();
        request.setId(id);
        return this.unaryRPC(JungleTV.GetDocument, request);
    }

    async documents(searchQuery: string, pagParams: PaginationParameters): Promise<DocumentsResponse> {
        const request = new DocumentsRequest();
        request.setSearchQuery(searchQuery);
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.Documents, request);
    }

    async updateDocument(document: Document): Promise<UpdateDocumentResponse> {
        return this.unaryRPC(JungleTV.UpdateDocument, document);
    }

    async withdraw(): Promise<WithdrawResponse> {
        return this.unaryRPC(JungleTV.Withdraw, new WithdrawRequest());
    }

    async leaderboards(period: LeaderboardPeriodMap[keyof LeaderboardPeriodMap]): Promise<LeaderboardsResponse> {
        const request = new LeaderboardsRequest();
        request.setPeriod(period);
        return this.unaryRPC(JungleTV.Leaderboards, request);
    }

    async rewardHistory(pagParams: PaginationParameters): Promise<RewardHistoryResponse> {
        const request = new RewardHistoryRequest();
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.RewardHistory, request);
    }

    async withdrawalHistory(pagParams: PaginationParameters): Promise<WithdrawalHistoryResponse> {
        const request = new WithdrawalHistoryRequest();
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.WithdrawalHistory, request);
    }

    async ongoingRaffleInfo(): Promise<OngoingRaffleInfoResponse> {
        const request = new OngoingRaffleInfoRequest();
        return this.unaryRPC(JungleTV.OngoingRaffleInfo, request);
    }

    async raffleDrawings(pagParams: PaginationParameters): Promise<RaffleDrawingsResponse> {
        const request = new RaffleDrawingsRequest();
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.RaffleDrawings, request);
    }

    async connections(): Promise<ConnectionsResponse> {
        const request = new ConnectionsRequest();
        return this.unaryRPC(JungleTV.Connections, request);
    }

    async playedMediaHistory(searchQuery: string, pagParams: PaginationParameters): Promise<PlayedMediaHistoryResponse> {
        const request = new PlayedMediaHistoryRequest();
        request.setSearchQuery(searchQuery);
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.PlayedMediaHistory, request);
    }

    async createConnection(service: ConnectionServiceMap[keyof ConnectionServiceMap]): Promise<CreateConnectionResponse> {
        const request = new CreateConnectionRequest();
        request.setService(service);
        return this.unaryRPC(JungleTV.CreateConnection, request);
    }

    async removeConnection(id: string): Promise<RemoveConnectionResponse> {
        const request = new RemoveConnectionRequest();
        request.setId(id);
        return this.unaryRPC(JungleTV.RemoveConnection, request);
    }

    async forciblyEnqueueTicket(id: string, type: ForcedTicketEnqueueTypeMap[keyof ForcedTicketEnqueueTypeMap]): Promise<ForciblyEnqueueTicketResponse> {
        const request = new ForciblyEnqueueTicketRequest();
        request.setId(id);
        request.setEnqueueType(type);
        return this.unaryRPC(JungleTV.ForciblyEnqueueTicket, request);
    }

    async removeQueueEntry(id: string): Promise<RemoveQueueEntryResponse> {
        const request = new RemoveQueueEntryRequest();
        request.setId(id);
        return this.unaryRPC(JungleTV.RemoveQueueEntry, request);
    }

    async removeChatMessage(id: string): Promise<RemoveChatMessageResponse> {
        const request = new RemoveChatMessageRequest();
        request.setId(id);
        return this.unaryRPC(JungleTV.RemoveChatMessage, request);
    }

    async setChatSettings(enabled: boolean, slowmode: boolean): Promise<SetChatSettingsResponse> {
        const request = new SetChatSettingsRequest();
        request.setEnabled(enabled);
        request.setSlowmode(slowmode);
        return this.unaryRPC(JungleTV.SetChatSettings, request);
    }

    async setMediaEnqueuingEnabled(allowed: AllowedMediaEnqueuingTypeMap[keyof AllowedMediaEnqueuingTypeMap], enqueuingPassword?: string): Promise<SetMediaEnqueuingEnabledResponse> {
        const request = new SetMediaEnqueuingEnabledRequest();
        request.setAllowed(allowed);
        if (typeof enqueuingPassword !== "undefined") {
            request.setEnqueuingPassword(enqueuingPassword);
        }
        return this.unaryRPC(JungleTV.SetMediaEnqueuingEnabled, request);
    }

    async userBans(searchQuery: string, activeOnly: boolean, pagParams: PaginationParameters): Promise<UserBansResponse> {
        const request = new UserBansRequest();
        request.setSearchQuery(searchQuery);
        request.setActiveOnly(activeOnly);
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.UserBans, request);
    }

    async banUser(address: string, remoteAddress: string, chatBanned: boolean, enqueuingBanned: boolean, rewardsBanned: boolean, reason: string, duration?: Duration): Promise<BanUserResponse> {
        const request = new BanUserRequest();
        request.setAddress(address);
        request.setRemoteAddress(remoteAddress);
        request.setChatBanned(chatBanned);
        request.setEnqueuingBanned(enqueuingBanned);
        request.setRewardsBanned(rewardsBanned);
        request.setReason(reason);
        request.setDuration(duration);
        return this.unaryRPC(JungleTV.BanUser, request);
    }

    async removeBan(banID: string, reason: string): Promise<RemoveBanResponse> {
        const request = new RemoveBanRequest();
        request.setBanId(banID);
        request.setReason(reason);
        return this.unaryRPC(JungleTV.RemoveBan, request);
    }

    async userVerifications(searchQuery: string, pagParams: PaginationParameters): Promise<UserVerificationsResponse> {
        const request = new UserVerificationsRequest();
        request.setPaginationParams(pagParams);
        request.setSearchQuery(searchQuery);
        return this.unaryRPC(JungleTV.UserVerifications, request);
    }

    async verifyUser(address: string, skipClientIntegrityChecks: boolean, skipIPAddressReputationChecks: boolean, reduceHardChallengeFrequency: boolean, reason: string): Promise<VerifyUserResponse> {
        const request = new VerifyUserRequest();
        request.setAddress(address);
        request.setSkipClientIntegrityChecks(skipClientIntegrityChecks);
        request.setSkipIpAddressReputationChecks(skipIPAddressReputationChecks);
        request.setReduceHardChallengeFrequency(reduceHardChallengeFrequency);
        request.setReason(reason);
        return this.unaryRPC(JungleTV.VerifyUser, request);
    }

    async removeUserVerification(verificationID: string, reason: string): Promise<RemoveUserVerificationResponse> {
        const request = new RemoveUserVerificationRequest();
        request.setVerificationId(verificationID);
        request.setReason(reason);
        return this.unaryRPC(JungleTV.RemoveUserVerification, request);
    }

    async userChatMessages(address: string, numMessages: number): Promise<UserChatMessagesResponse> {
        const request = new UserChatMessagesRequest();
        request.setAddress(address);
        request.setNumMessages(numMessages);
        return this.unaryRPC(JungleTV.UserChatMessages, request);
    }

    async setUserChatNickname(address: string, nickname: string): Promise<SetUserChatNicknameResponse> {
        const request = new SetUserChatNicknameRequest();
        request.setAddress(address);
        request.setNickname(nickname);
        return this.unaryRPC(JungleTV.SetUserChatNickname, request);
    }

    async setPricesMultiplier(multiplier: number): Promise<SetPricesMultiplierResponse> {
        const request = new SetPricesMultiplierRequest();
        request.setMultiplier(multiplier);
        return this.unaryRPC(JungleTV.SetPricesMultiplier, request);
    }

    async setMinimumPricesMultiplier(multiplier: number): Promise<SetMinimumPricesMultiplierResponse> {
        const request = new SetMinimumPricesMultiplierRequest();
        request.setMultiplier(multiplier);
        return this.unaryRPC(JungleTV.SetMinimumPricesMultiplier, request);
    }

    async disallowedMedia(searchQuery: string, pagParams: PaginationParameters): Promise<DisallowedMediaResponse> {
        const request = new DisallowedMediaRequest();
        request.setSearchQuery(searchQuery);
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.DisallowedMedia, request);
    }

    async addDisallowedYouTubeVideo(ytVideoID: string): Promise<AddDisallowedMediaResponse> {
        const request = new AddDisallowedMediaRequest();
        let data = new EnqueueMediaRequest();
        let ytData = new EnqueueYouTubeVideoData();
        ytData.setId(ytVideoID);
        data.setYoutubeVideoData(ytData);
        request.setDisallowedMediaRequest(data);
        return this.unaryRPC(JungleTV.AddDisallowedMedia, request);
    }

    async addDisallowedSoundCloudTrack(trackURL: string): Promise<AddDisallowedMediaResponse> {
        const request = new AddDisallowedMediaRequest();
        let data = new EnqueueMediaRequest();
        let scData = new EnqueueSoundCloudTrackData();
        scData.setPermalink(trackURL);
        data.setSoundcloudTrackData(scData);
        request.setDisallowedMediaRequest(data);
        return this.unaryRPC(JungleTV.AddDisallowedMedia, request);
    }

    async removeDisallowedMedia(id: string): Promise<RemoveDisallowedMediaResponse> {
        const request = new RemoveDisallowedMediaRequest();
        request.setId(id);
        return this.unaryRPC(JungleTV.RemoveDisallowedMedia, request);
    }

    async disallowedMediaCollections(searchQuery: string, pagParams: PaginationParameters): Promise<DisallowedMediaCollectionsResponse> {
        const request = new DisallowedMediaCollectionsRequest();
        request.setSearchQuery(searchQuery);
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.DisallowedMediaCollections, request);
    }

    async addDisallowedYouTubeChannel(ytVideoID: string): Promise<AddDisallowedMediaCollectionResponse> {
        const request = new AddDisallowedMediaCollectionRequest();
        let data = new EnqueueMediaRequest();
        let ytData = new EnqueueYouTubeVideoData();
        ytData.setId(ytVideoID);
        data.setYoutubeVideoData(ytData);
        request.setDisallowedMediaRequest(data);
        return this.unaryRPC(JungleTV.AddDisallowedMediaCollection, request);
    }

    async addDisallowedSoundCloudUser(trackURL: string): Promise<AddDisallowedMediaCollectionResponse> {
        const request = new AddDisallowedMediaCollectionRequest();
        let data = new EnqueueMediaRequest();
        let scData = new EnqueueSoundCloudTrackData();
        scData.setPermalink(trackURL);
        data.setSoundcloudTrackData(scData);
        request.setDisallowedMediaRequest(data);
        return this.unaryRPC(JungleTV.AddDisallowedMediaCollection, request);
    }

    async removeDisallowedMediaCollection(id: string): Promise<RemoveDisallowedMediaCollectionResponse> {
        const request = new RemoveDisallowedMediaCollectionRequest();
        request.setId(id);
        return this.unaryRPC(JungleTV.RemoveDisallowedMediaCollection, request);
    }

    async setCrowdfundedSkippingEnabled(enabled: boolean): Promise<SetCrowdfundedSkippingEnabledResponse> {
        const request = new SetCrowdfundedSkippingEnabledRequest();
        request.setEnabled(enabled);
        return this.unaryRPC(JungleTV.SetCrowdfundedSkippingEnabled, request);
    }

    async setSkipPriceMultiplier(multiplier: number): Promise<SetSkipPriceMultiplierResponse> {
        const request = new SetSkipPriceMultiplierRequest();
        request.setMultiplier(multiplier);
        return this.unaryRPC(JungleTV.SetSkipPriceMultiplier, request);
    }

    async confirmRaffleWinner(raffleID: string): Promise<ConfirmRaffleWinnerResponse> {
        const request = new ConfirmRaffleWinnerRequest();
        request.setRaffleId(raffleID);
        return this.unaryRPC(JungleTV.ConfirmRaffleWinner, request);
    }

    async completeRaffle(raffleID: string, prizeTxHash: string): Promise<CompleteRaffleResponse> {
        const request = new CompleteRaffleRequest();
        request.setRaffleId(raffleID);
        request.setPrizeTxHash(prizeTxHash);
        return this.unaryRPC(JungleTV.CompleteRaffle, request);
    }

    async redrawRaffle(raffleID: string, reason: string): Promise<RedrawRaffleResponse> {
        const request = new RedrawRaffleRequest();
        request.setRaffleId(raffleID);
        request.setReason(reason);
        return this.unaryRPC(JungleTV.RedrawRaffle, request);
    }

    async triggerAnnouncementsNotification(): Promise<TriggerAnnouncementsNotificationResponse> {
        return this.unaryRPC(
            JungleTV.TriggerAnnouncementsNotification, new TriggerAnnouncementsNotificationRequest());
    }

    async setMulticurrencyPaymentsEnabled(enabled: boolean): Promise<SetMulticurrencyPaymentsEnabledResponse> {
        const request = new SetMulticurrencyPaymentsEnabledRequest();
        request.setEnabled(enabled);
        return this.unaryRPC(JungleTV.SetMulticurrencyPaymentsEnabled, request);
    }

    async spectatorInfo(rewardsAddress: string): Promise<Spectator> {
        const request = new SpectatorInfoRequest();
        request.setRewardsAddress(rewardsAddress);
        return this.unaryRPC(JungleTV.SpectatorInfo, request);
    }

    async resetSpectatorStatus(rewardsAddress: string): Promise<ResetSpectatorStatusResponse> {
        const request = new ResetSpectatorStatusRequest();
        request.setRewardsAddress(rewardsAddress);
        return this.unaryRPC(JungleTV.ResetSpectatorStatus, request);
    }

    monitorModerationStatus(onModerationStatus: (status: ModerationStatusOverview) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        return this.serverStreamingRPC(
            JungleTV.MonitorModerationStatus,
            new MonitorModerationStatusRequest(),
            onModerationStatus,
            onEnd);
    }

    async setOwnQueueEntryRemovalAllowed(allowed: boolean): Promise<SetOwnQueueEntryRemovalAllowedResponse> {
        const request = new SetOwnQueueEntryRemovalAllowedRequest();
        request.setAllowed(allowed);
        return this.unaryRPC(JungleTV.SetOwnQueueEntryRemovalAllowed, request);
    }

    async setQueueEntryReorderingAllowed(allowed: boolean): Promise<SetQueueEntryReorderingAllowedResponse> {
        const request = new SetQueueEntryReorderingAllowedRequest();
        request.setAllowed(allowed);
        return this.unaryRPC(JungleTV.SetQueueEntryReorderingAllowed, request);
    }

    async setNewQueueEntriesAlwaysUnskippable(enabled: boolean): Promise<SetNewQueueEntriesAlwaysUnskippableResponse> {
        const request = new SetNewQueueEntriesAlwaysUnskippableRequest();
        request.setEnabled(enabled);
        return this.unaryRPC(JungleTV.SetNewQueueEntriesAlwaysUnskippable, request);
    }

    async setSkippingEnabled(enabled: boolean): Promise<SetSkippingEnabledResponse> {
        const request = new SetSkippingEnabledRequest();
        request.setEnabled(enabled);
        return this.unaryRPC(JungleTV.SetSkippingEnabled, request);
    }

    async setQueueInsertCursor(id: string): Promise<SetQueueInsertCursorResponse> {
        const request = new SetQueueInsertCursorRequest();
        request.setId(id);
        return this.unaryRPC(JungleTV.SetQueueInsertCursor, request);
    }

    async clearQueueInsertCursor(): Promise<ClearQueueInsertCursorResponse> {
        return this.unaryRPC(JungleTV.ClearQueueInsertCursor, new ClearQueueInsertCursorRequest());
    }

    async userPermissionLevel(): Promise<UserPermissionLevelResponse> {
        return this.unaryRPC(JungleTV.UserPermissionLevel, new UserPermissionLevelRequest());
    }

    async userProfile(address: string): Promise<UserProfileResponse> {
        const request = new UserProfileRequest();
        request.setAddress(address);
        return this.unaryRPC(JungleTV.UserProfile, request);
    }

    async userStats(address: string): Promise<UserStatsResponse> {
        const request = new UserStatsRequest();
        request.setAddress(address);
        return this.unaryRPC(JungleTV.UserStats, request);
    }

    async setProfileBiography(biography: string): Promise<SetProfileBiographyResponse> {
        const request = new SetProfileBiographyRequest();
        request.setBiography(biography);
        return this.unaryRPC(JungleTV.SetProfileBiography, request);
    }

    async setProfileFeaturedMedia(mediaID?: string): Promise<SetProfileFeaturedMediaResponse> {
        const request = new SetProfileFeaturedMediaRequest();
        if (typeof mediaID !== 'undefined') {
            request.setMediaId(mediaID);
        }
        return this.unaryRPC(JungleTV.SetProfileFeaturedMedia, request);
    }

    async clearUserProfile(address: string): Promise<ClearUserProfileResponse> {
        const request = new ClearUserProfileRequest();
        request.setAddress(address);
        return this.unaryRPC(JungleTV.ClearUserProfile, request);
    }

    async blockUser(address: string): Promise<BlockUserResponse> {
        const request = new BlockUserRequest();
        request.setAddress(address);
        return this.unaryRPC(JungleTV.BlockUser, request);
    }

    async unblockUser(blockID?: string, address?: string): Promise<BlockUserResponse> {
        const request = new UnblockUserRequest();
        if (typeof (blockID) !== "undefined") {
            request.setBlockId(blockID);
        } else if (typeof (address) !== "undefined") {
            request.setAddress(address);
        }
        return this.unaryRPC(JungleTV.UnblockUser, request);
    }

    async blockedUsers(pagParams: PaginationParameters): Promise<BlockedUsersResponse> {
        const request = new BlockedUsersRequest();
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.BlockedUsers, request);
    }

    async markAsActivelyModerating(): Promise<MarkAsActivelyModeratingResponse> {
        const request = new MarkAsActivelyModeratingRequest();
        return this.unaryRPC(JungleTV.MarkAsActivelyModerating, request);
    }

    async stopActivelyModerating(): Promise<StopActivelyModeratingResponse> {
        const request = new StopActivelyModeratingRequest();
        return this.unaryRPC(JungleTV.StopActivelyModerating, request);
    }

    async addVipUser(address: string, appearance: VipUserAppearanceMap[keyof VipUserAppearanceMap]): Promise<AddVipUserResponse> {
        const request = new AddVipUserRequest();
        request.setRewardsAddress(address);
        request.setAppearance(appearance);
        return this.unaryRPC(JungleTV.AddVipUser, request);
    }

    async removeVipUser(address: string): Promise<RemoveVipUserResponse> {
        const request = new RemoveVipUserRequest();
        request.setRewardsAddress(address);
        return this.unaryRPC(JungleTV.RemoveVipUser, request);
    }

    async triggerClientReload(): Promise<TriggerClientReloadResponse> {
        const request = new TriggerClientReloadRequest();
        return this.unaryRPC(JungleTV.TriggerClientReload, request);
    }

    async adjustPointsBalance(rewardsAddress: string, value: number, reason: string): Promise<AdjustPointsBalanceResponse> {
        const request = new AdjustPointsBalanceRequest();
        request.setRewardsAddress(rewardsAddress);
        request.setValue(value);
        request.setReason(reason);
        return this.unaryRPC(JungleTV.AdjustPointsBalance, request);
    }

    async pointsInfo(): Promise<PointsInfoResponse> {
        return this.unaryRPC(JungleTV.PointsInfo, new PointsInfoRequest());
    }

    async pointsTransactions(pagParams: PaginationParameters): Promise<PointsTransactionsResponse> {
        const request = new PointsTransactionsRequest();
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.PointsTransactions, request);
    }

    async chatGifSearch(query: string, cursor: string): Promise<ChatGifSearchResponse> {
        const request = new ChatGifSearchRequest();
        request.setQuery(query);
        request.setCursor(cursor);
        return this.unaryRPC(JungleTV.ChatGifSearch, request);
    }

    async applications(searchQuery: string, pagParams: PaginationParameters): Promise<ApplicationsResponse> {
        const request = new ApplicationsRequest();
        request.setSearchQuery(searchQuery);
        request.setPaginationParams(pagParams);
        return this.unaryRPC(JungleTV.Applications, request);
    }

    async getApplication(id: string): Promise<Application> {
        const request = new GetApplicationRequest();
        request.setId(id);
        return this.unaryRPC(JungleTV.GetApplication, request);
    }

    async updateApplication(application: Application): Promise<UpdateApplicationResponse> {
        return this.unaryRPC(JungleTV.UpdateApplication, application);
    }

    async createApplicationWithWalletPrefix(request: CreateApplicationWithWalletPrefixRequest): Promise<CreateApplicationWithWalletPrefixResponse> {
        return this.unaryRPC(JungleTV.CreateApplicationWithWalletPrefix, request);
    }

    async cloneApplication(id: string, destinationID: string): Promise<CloneApplicationResponse> {
        const request = new CloneApplicationRequest();
        request.setId(id);
        request.setDestinationId(destinationID);
        return this.unaryRPC(JungleTV.CloneApplication, request);
    }

    async deleteApplication(id: string): Promise<DeleteApplicationResponse> {
        const request = new DeleteApplicationRequest();
        request.setId(id);
        return this.unaryRPC(JungleTV.DeleteApplication, request);
    }

    async applicationFiles(applicationID: string, searchQuery: string, pagParams: PaginationParameters): Promise<ApplicationFilesResponse> {
        const request = new ApplicationFilesRequest();
        request.setApplicationId(applicationID);
        request.setSearchQuery(searchQuery);
        request.setPaginationParams(pagParams)
        return this.unaryRPC(JungleTV.ApplicationFiles, request);
    }

    async getApplicationFile(applicationID: string, name: string): Promise<ApplicationFile> {
        const request = new GetApplicationFileRequest();
        request.setApplicationId(applicationID);
        request.setName(name);
        return this.unaryRPC(JungleTV.GetApplicationFile, request);
    }

    async updateApplicationFile(file: ApplicationFile): Promise<UpdateApplicationFileResponse> {
        return this.unaryRPC(JungleTV.UpdateApplicationFile, file);
    }

    async cloneApplicationFile(applicationID: string, name: string, destinationApplicationID: string, destinationName: string): Promise<CloneApplicationFileResponse> {
        const request = new CloneApplicationFileRequest();
        request.setApplicationId(applicationID);
        request.setName(name);
        request.setDestinationApplicationId(destinationApplicationID);
        request.setDestinationName(destinationName);
        return this.unaryRPC(JungleTV.CloneApplicationFile, request);
    }

    async deleteApplicationFile(applicationID: string, name: string): Promise<DeleteApplicationFileResponse> {
        const request = new DeleteApplicationFileRequest();
        request.setApplicationId(applicationID);
        request.setName(name);
        return this.unaryRPC(JungleTV.DeleteApplicationFile, request);
    }

    async launchApplication(applicationID: string): Promise<LaunchApplicationResponse> {
        const request = new LaunchApplicationRequest();
        request.setId(applicationID);
        return this.unaryRPC(JungleTV.LaunchApplication, request);
    }

    async stopApplication(applicationID: string): Promise<StopApplicationResponse> {
        const request = new StopApplicationRequest();
        request.setId(applicationID);
        return this.unaryRPC(JungleTV.StopApplication, request);
    }

    async applicationLog(applicationID: string, levels: Array<ApplicationLogLevelMap[keyof ApplicationLogLevelMap]>, offset?: string, limit: number = 50): Promise<ApplicationLogResponse> {
        const request = new ApplicationLogRequest();
        request.setApplicationId(applicationID);
        request.setLevelsList(levels);
        if (typeof (offset) !== "undefined") {
            request.setOffset(offset);
        }
        request.setLimit(limit);
        return this.unaryRPC(JungleTV.ApplicationLog, request);
    }

    async exportApplication(applicationID: string): Promise<ExportApplicationResponse> {
        const request = new ExportApplicationRequest();
        request.setApplicationId(applicationID);
        return this.unaryRPC(JungleTV.ExportApplication, request);
    }

    async importApplication(applicationID: string, appendOnly: boolean, restoreEditMessages: boolean, archiveContent: Uint8Array): Promise<ImportApplicationResponse> {
        const request = new ImportApplicationRequest();
        request.setApplicationId(applicationID);
        request.setAppendOnly(appendOnly);
        request.setRestoreEditMessages(restoreEditMessages);
        request.setArchiveContent(archiveContent);
        return this.unaryRPC(JungleTV.ImportApplication, request);
    }

    consumeApplicationLog(applicationID: string, levels: Array<ApplicationLogLevelMap[keyof ApplicationLogLevelMap]>, stayConnectedOnTermination: boolean, includeLogsSinceOffset: string | undefined, onUpdate: (update: ApplicationLogEntryContainer) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        const request = new ConsumeApplicationLogRequest();
        request.setApplicationId(applicationID);
        request.setLevelsList(levels);
        request.setStayConnectedOnTermination(stayConnectedOnTermination);
        if (typeof includeLogsSinceOffset !== "undefined") {
            request.setIncludeLogsSinceOffset(includeLogsSinceOffset);
        }
        return this.serverStreamingRPC(
            JungleTV.ConsumeApplicationLog,
            request,
            onUpdate,
            onEnd);
    }

    monitorRunningApplications(onUpdate: (update: RunningApplications) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        const request = new MonitorRunningApplicationsRequest();
        return this.serverStreamingRPC(
            JungleTV.MonitorRunningApplications,
            request,
            onUpdate,
            onEnd);
    }

    async evaluateExpressionOnApplication(applicationID: string, expression: string): Promise<EvaluateExpressionOnApplicationResponse> {
        const request = new EvaluateExpressionOnApplicationRequest();
        request.setApplicationId(applicationID);
        request.setExpression(expression);
        return this.unaryRPC(JungleTV.EvaluateExpressionOnApplication, request);
    }

    async resolveApplicationPage(applicationID: string, pageID: string): Promise<ResolveApplicationPageResponse> {
        const request = new ResolveApplicationPageRequest();
        request.setApplicationId(applicationID);
        request.setPageId(pageID);
        return this.unaryRPC(JungleTV.ResolveApplicationPage, request);
    }

    consumeApplicationEvents(applicationID: string, pageID: string, onUpdate: (update: ApplicationEventUpdate) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        const request = new ConsumeApplicationEventsRequest();
        request.setApplicationId(applicationID);
        request.setPageId(pageID);
        return this.serverStreamingRPC(
            JungleTV.ConsumeApplicationEvents,
            request,
            onUpdate,
            onEnd);
    }

    async applicationServerMethod(applicationID: string, pageID: string, method: string, args: string[]): Promise<ApplicationServerMethodResponse> {
        const request = new ApplicationServerMethodRequest();
        request.setApplicationId(applicationID);
        request.setPageId(pageID);
        request.setMethod(method);
        request.setArgumentsList(args);
        return this.unaryRPC(JungleTV.ApplicationServerMethod, request);
    }

    async triggerApplicationEvent(applicationID: string, pageID: string, eventName: string, eventArgs: string[]): Promise<TriggerApplicationEventResponse> {
        const request = new TriggerApplicationEventRequest();
        request.setApplicationId(applicationID);
        request.setPageId(pageID);
        request.setName(eventName);
        request.setArgumentsList(eventArgs);
        return this.unaryRPC(JungleTV.TriggerApplicationEvent, request);
    }

    convertBananoToPoints(onStatusUpdated: (status: ConvertBananoToPointsStatus) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        return this.serverStreamingRPC(
            JungleTV.ConvertBananoToPoints,
            new ConvertBananoToPointsRequest(),
            onStatusUpdated,
            onEnd);
    }

    async startOrExtendSubscription(): Promise<StartOrExtendSubscriptionResponse> {
        return this.unaryRPC(JungleTV.StartOrExtendSubscription, new StartOrExtendSubscriptionRequest());
    }

    async checkMediaEnqueuingPassword(password: string): Promise<CheckMediaEnqueuingPasswordResponse> {
        const request = new CheckMediaEnqueuingPasswordRequest();
        request.setPassword(password);
        return this.unaryRPC(JungleTV.CheckMediaEnqueuingPassword, request);
    }

    async invalidateAuthTokens(): Promise<InvalidateAuthTokensResponse> {
        return this.unaryRPC(JungleTV.InvalidateAuthTokens, new InvalidateAuthTokensRequest());
    }

    async invalidateUserAuthTokens(address: string): Promise<InvalidateUserAuthTokensResponse> {
        const request = new InvalidateUserAuthTokensRequest();
        request.setAddress(address);
        return this.unaryRPC(JungleTV.InvalidateUserAuthTokens, request);
    }

    async authorizationProcessData(processID: string): Promise<AuthorizationProcessDataResponse> {
        const request = new AuthorizationProcessDataRequest();
        request.setProcessId(processID);
        return this.unaryRPC(JungleTV.AuthorizationProcessData, request);
    }

    async consentOrDissentToAuthorization(processID: string, consent: boolean): Promise<ConsentOrDissentToAuthorizationResponse> {
        const request = new ConsentOrDissentToAuthorizationRequest();
        request.setProcessId(processID);
        request.setConsent(consent);
        return this.unaryRPC(JungleTV.ConsentOrDissentToAuthorization, request);
    }

    monitorMediaEnqueuingPermission(onStatusUpdated: (status: MediaEnqueuingPermissionStatus) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        return this.serverStreamingRPC(
            JungleTV.MonitorMediaEnqueuingPermission,
            new MonitorMediaEnqueuingPermissionRequest(),
            onStatusUpdated,
            onEnd);
    }
}

export const apiClient = APIClient.getInstance();
