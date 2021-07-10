import { grpc } from "@improbable-eng/grpc-web";
import { JungleTV } from "./proto/jungletv_pb_service";
import type { ProtobufMessage } from "@improbable-eng/grpc-web/dist/typings/message";
import { deleteCookie, getCookie, setCookie } from "./cookie_utils";
import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import { ConsumeMediaRequest, EnqueueMediaRequest, EnqueueMediaResponse, EnqueueMediaTicket, EnqueueYouTubeVideoData, ForcedTicketEnqueueTypeMap, ForciblyEnqueueTicketRequest, ForciblyEnqueueTicketResponse, MonitorQueueRequest, MonitorTicketRequest, MediaConsumptionCheckpoint, Queue, RemoveQueueEntryRequest, RemoveQueueEntryResponse, RewardInfoRequest, RewardInfoResponse, SignInRequest, SignInResponse, SubmitActivityChallengeRequest, SubmitActivityChallengeResponse, ChatUpdate, ConsumeChatRequest, SendChatMessageResponse, SendChatMessageRequest, RemoveChatMessageResponse, RemoveChatMessageRequest, SetChatSettingsRequest, SetChatSettingsResponse, ChatMessage, SignInProgress, SetVideoEnqueuingEnabledResponse, SetVideoEnqueuingEnabledRequest, AllowedVideoEnqueuingTypeMap, SubmitProofOfWorkResponse, SubmitProofOfWorkRequest, BanUserRequest, BanUserResponse, RemoveBanRequest, RemoveBanResponse, UserPermissionLevelResponse, UserPermissionLevelRequest, UserChatMessagesResponse, UserChatMessagesRequest } from "./proto/jungletv_pb";
import type { Request } from "@improbable-eng/grpc-web/dist/typings/invoke";

class APIClient {
    private static instance: APIClient;

    private host: string;
    private authNeededCallback = () => { };
    private previouslySeenAPIVersion: string;

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
        if (this.previouslySeenAPIVersion === undefined) {
            this.previouslySeenAPIVersion = version;
        } else if (version != this.previouslySeenAPIVersion) {
            console.log("Reloading due to different API version");
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

    /*async signIn(address: string): Promise<SignInResponse> {
        let request = new SignInRequest();
        request.setRewardAddress(address);
        let response = await this.unaryRPC<SignInRequest, SignInResponse>(JungleTV.SignIn, request);
        setCookie("auth-token", response.getAuthToken(), response.getTokenExpiration().toDate());
        return response;
    }*/

    signIn(address: string, onProgress: (progress: SignInProgress) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        let request = new SignInRequest();
        request.setRewardAddress(address);
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

    async enqueueYouTubeVideo(id: string, unskippable: boolean): Promise<EnqueueMediaResponse> {
        let request = new EnqueueMediaRequest();
        request.setUnskippable(unskippable);
        let ytData = new EnqueueYouTubeVideoData()
        ytData.setId(id);
        request.setYoutubeVideoData(ytData)
        return this.unaryRPC<EnqueueMediaRequest, EnqueueMediaResponse>(JungleTV.EnqueueMedia, request);
    }

    consumeMedia(participateInPOW: boolean, onCheckpoint: (checkpoint: MediaConsumptionCheckpoint) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        let request = new ConsumeMediaRequest();
        request.setParticipateInPow(participateInPOW);
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

    monitorTicket(ticketID: string, onTicketUpdated: (ticket: EnqueueMediaTicket) => void, onEnd: (code: grpc.Code, msg: string) => void): Request {
        let request = new MonitorTicketRequest();
        request.setTicketId(ticketID);
        return this.serverStreamingRPC<MonitorTicketRequest, EnqueueMediaTicket>(
            JungleTV.MonitorTicket,
            request,
            onTicketUpdated,
            onEnd);
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

    async banUser(address: string, remoteAddress: string, chatBanned: boolean, enqueuingBanned: boolean, rewardsBanned: boolean, reason: string): Promise<BanUserResponse> {
        let request = new BanUserRequest();
        request.setAddress(address);
        request.setRemoteAddress(remoteAddress);
        request.setChatBanned(chatBanned);
        request.setEnqueuingBanned(enqueuingBanned);
        request.setRewardsBanned(rewardsBanned);
        request.setReason(reason);
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

    async submitProofOfWork(previous: Uint8Array, work: Uint8Array): Promise<SubmitProofOfWorkResponse> {
        let request = new SubmitProofOfWorkRequest();
        request.setPrevious(previous);
        request.setWork(work);
        return this.unaryRPC<SubmitProofOfWorkRequest, SubmitProofOfWorkResponse>(JungleTV.SubmitProofOfWork, request);
    }

    async userPermissionLevel(): Promise<UserPermissionLevelResponse> {
        return this.unaryRPC<UserPermissionLevelRequest, UserPermissionLevelResponse>(JungleTV.UserPermissionLevel, new UserPermissionLevelRequest());
    }

    formatBANPrice(raw: string): string {
        return parseFloat(this.getBananoPartsAsDecimal(this.getAmountPartsFromRaw(raw, "ban_"))) + "";
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
        //    console.log(`bananoRaw:    ${bananoRaw}`);
        const prefixDivisor = prefixDivisors[amountPrefix];
        const majorDivisor = prefixDivisor.majorDivisor;
        const minorDivisor = prefixDivisor.minorDivisor;
        //    console.log(`bananoDivisor:   ${bananoDivisor}`);
        const major = amountRaw / majorDivisor;
        //    console.log(`banano:${banano}`);
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
