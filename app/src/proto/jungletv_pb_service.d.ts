// package: jungletv
// file: jungletv.proto

import * as jungletv_pb from "./jungletv_pb";
import {grpc} from "@improbable-eng/grpc-web";

type JungleTVSignIn = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.SignInRequest;
  readonly responseType: typeof jungletv_pb.SignInProgress;
};

type JungleTVEnqueueMedia = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.EnqueueMediaRequest;
  readonly responseType: typeof jungletv_pb.EnqueueMediaResponse;
};

type JungleTVRemoveOwnQueueEntry = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveOwnQueueEntryRequest;
  readonly responseType: typeof jungletv_pb.RemoveOwnQueueEntryResponse;
};

type JungleTVMoveQueueEntry = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.MoveQueueEntryRequest;
  readonly responseType: typeof jungletv_pb.MoveQueueEntryResponse;
};

type JungleTVMonitorTicket = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.MonitorTicketRequest;
  readonly responseType: typeof jungletv_pb.EnqueueMediaTicket;
};

type JungleTVConsumeMedia = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.ConsumeMediaRequest;
  readonly responseType: typeof jungletv_pb.MediaConsumptionCheckpoint;
};

type JungleTVMonitorQueue = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.MonitorQueueRequest;
  readonly responseType: typeof jungletv_pb.Queue;
};

type JungleTVMonitorSkipAndTip = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.MonitorSkipAndTipRequest;
  readonly responseType: typeof jungletv_pb.SkipAndTipStatus;
};

type JungleTVRewardInfo = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RewardInfoRequest;
  readonly responseType: typeof jungletv_pb.RewardInfoResponse;
};

type JungleTVSubmitActivityChallenge = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SubmitActivityChallengeRequest;
  readonly responseType: typeof jungletv_pb.SubmitActivityChallengeResponse;
};

type JungleTVProduceSegchaChallenge = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.ProduceSegchaChallengeRequest;
  readonly responseType: typeof jungletv_pb.ProduceSegchaChallengeResponse;
};

type JungleTVConsumeChat = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.ConsumeChatRequest;
  readonly responseType: typeof jungletv_pb.ChatUpdate;
};

type JungleTVSendChatMessage = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SendChatMessageRequest;
  readonly responseType: typeof jungletv_pb.SendChatMessageResponse;
};

type JungleTVUserPermissionLevel = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.UserPermissionLevelRequest;
  readonly responseType: typeof jungletv_pb.UserPermissionLevelResponse;
};

type JungleTVGetDocument = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.GetDocumentRequest;
  readonly responseType: typeof jungletv_pb.Document;
};

type JungleTVSetChatNickname = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetChatNicknameRequest;
  readonly responseType: typeof jungletv_pb.SetChatNicknameResponse;
};

type JungleTVWithdraw = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.WithdrawRequest;
  readonly responseType: typeof jungletv_pb.WithdrawResponse;
};

type JungleTVLeaderboards = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.LeaderboardsRequest;
  readonly responseType: typeof jungletv_pb.LeaderboardsResponse;
};

type JungleTVRewardHistory = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RewardHistoryRequest;
  readonly responseType: typeof jungletv_pb.RewardHistoryResponse;
};

type JungleTVWithdrawalHistory = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.WithdrawalHistoryRequest;
  readonly responseType: typeof jungletv_pb.WithdrawalHistoryResponse;
};

type JungleTVOngoingRaffleInfo = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.OngoingRaffleInfoRequest;
  readonly responseType: typeof jungletv_pb.OngoingRaffleInfoResponse;
};

type JungleTVRaffleDrawings = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RaffleDrawingsRequest;
  readonly responseType: typeof jungletv_pb.RaffleDrawingsResponse;
};

type JungleTVConnections = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.ConnectionsRequest;
  readonly responseType: typeof jungletv_pb.ConnectionsResponse;
};

type JungleTVCreateConnection = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.CreateConnectionRequest;
  readonly responseType: typeof jungletv_pb.CreateConnectionResponse;
};

type JungleTVRemoveConnection = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveConnectionRequest;
  readonly responseType: typeof jungletv_pb.RemoveConnectionResponse;
};

type JungleTVUserProfile = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.UserProfileRequest;
  readonly responseType: typeof jungletv_pb.UserProfileResponse;
};

type JungleTVUserStats = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.UserStatsRequest;
  readonly responseType: typeof jungletv_pb.UserStatsResponse;
};

type JungleTVSetProfileBiography = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetProfileBiographyRequest;
  readonly responseType: typeof jungletv_pb.SetProfileBiographyResponse;
};

type JungleTVSetProfileFeaturedMedia = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetProfileFeaturedMediaRequest;
  readonly responseType: typeof jungletv_pb.SetProfileFeaturedMediaResponse;
};

type JungleTVPlayedMediaHistory = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.PlayedMediaHistoryRequest;
  readonly responseType: typeof jungletv_pb.PlayedMediaHistoryResponse;
};

type JungleTVBlockUser = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.BlockUserRequest;
  readonly responseType: typeof jungletv_pb.BlockUserResponse;
};

type JungleTVUnblockUser = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.UnblockUserRequest;
  readonly responseType: typeof jungletv_pb.UnblockUserResponse;
};

type JungleTVBlockedUsers = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.BlockedUsersRequest;
  readonly responseType: typeof jungletv_pb.BlockedUsersResponse;
};

type JungleTVPointsInfo = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.PointsInfoRequest;
  readonly responseType: typeof jungletv_pb.PointsInfoResponse;
};

type JungleTVPointsTransactions = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.PointsTransactionsRequest;
  readonly responseType: typeof jungletv_pb.PointsTransactionsResponse;
};

type JungleTVChatGifSearch = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.ChatGifSearchRequest;
  readonly responseType: typeof jungletv_pb.ChatGifSearchResponse;
};

type JungleTVConvertBananoToPoints = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.ConvertBananoToPointsRequest;
  readonly responseType: typeof jungletv_pb.ConvertBananoToPointsStatus;
};

type JungleTVForciblyEnqueueTicket = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.ForciblyEnqueueTicketRequest;
  readonly responseType: typeof jungletv_pb.ForciblyEnqueueTicketResponse;
};

type JungleTVRemoveQueueEntry = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveQueueEntryRequest;
  readonly responseType: typeof jungletv_pb.RemoveQueueEntryResponse;
};

type JungleTVRemoveChatMessage = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveChatMessageRequest;
  readonly responseType: typeof jungletv_pb.RemoveChatMessageResponse;
};

type JungleTVSetChatSettings = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetChatSettingsRequest;
  readonly responseType: typeof jungletv_pb.SetChatSettingsResponse;
};

type JungleTVSetVideoEnqueuingEnabled = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetVideoEnqueuingEnabledRequest;
  readonly responseType: typeof jungletv_pb.SetVideoEnqueuingEnabledResponse;
};

type JungleTVUserBans = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.UserBansRequest;
  readonly responseType: typeof jungletv_pb.UserBansResponse;
};

type JungleTVBanUser = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.BanUserRequest;
  readonly responseType: typeof jungletv_pb.BanUserResponse;
};

type JungleTVRemoveBan = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveBanRequest;
  readonly responseType: typeof jungletv_pb.RemoveBanResponse;
};

type JungleTVUserVerifications = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.UserVerificationsRequest;
  readonly responseType: typeof jungletv_pb.UserVerificationsResponse;
};

type JungleTVVerifyUser = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.VerifyUserRequest;
  readonly responseType: typeof jungletv_pb.VerifyUserResponse;
};

type JungleTVRemoveUserVerification = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveUserVerificationRequest;
  readonly responseType: typeof jungletv_pb.RemoveUserVerificationResponse;
};

type JungleTVUserChatMessages = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.UserChatMessagesRequest;
  readonly responseType: typeof jungletv_pb.UserChatMessagesResponse;
};

type JungleTVDisallowedVideos = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.DisallowedVideosRequest;
  readonly responseType: typeof jungletv_pb.DisallowedVideosResponse;
};

type JungleTVAddDisallowedVideo = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.AddDisallowedVideoRequest;
  readonly responseType: typeof jungletv_pb.AddDisallowedVideoResponse;
};

type JungleTVRemoveDisallowedVideo = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RemoveDisallowedVideoRequest;
  readonly responseType: typeof jungletv_pb.RemoveDisallowedVideoResponse;
};

type JungleTVUpdateDocument = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.Document;
  readonly responseType: typeof jungletv_pb.UpdateDocumentResponse;
};

type JungleTVSetUserChatNickname = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetUserChatNicknameRequest;
  readonly responseType: typeof jungletv_pb.SetUserChatNicknameResponse;
};

type JungleTVSetPricesMultiplier = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetPricesMultiplierRequest;
  readonly responseType: typeof jungletv_pb.SetPricesMultiplierResponse;
};

type JungleTVSetMinimumPricesMultiplier = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetMinimumPricesMultiplierRequest;
  readonly responseType: typeof jungletv_pb.SetMinimumPricesMultiplierResponse;
};

type JungleTVSetCrowdfundedSkippingEnabled = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetCrowdfundedSkippingEnabledRequest;
  readonly responseType: typeof jungletv_pb.SetCrowdfundedSkippingEnabledResponse;
};

type JungleTVSetSkipPriceMultiplier = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetSkipPriceMultiplierRequest;
  readonly responseType: typeof jungletv_pb.SetSkipPriceMultiplierResponse;
};

type JungleTVConfirmRaffleWinner = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.ConfirmRaffleWinnerRequest;
  readonly responseType: typeof jungletv_pb.ConfirmRaffleWinnerResponse;
};

type JungleTVCompleteRaffle = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.CompleteRaffleRequest;
  readonly responseType: typeof jungletv_pb.CompleteRaffleResponse;
};

type JungleTVRedrawRaffle = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.RedrawRaffleRequest;
  readonly responseType: typeof jungletv_pb.RedrawRaffleResponse;
};

type JungleTVTriggerAnnouncementsNotification = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.TriggerAnnouncementsNotificationRequest;
  readonly responseType: typeof jungletv_pb.TriggerAnnouncementsNotificationResponse;
};

type JungleTVSpectatorInfo = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SpectatorInfoRequest;
  readonly responseType: typeof jungletv_pb.Spectator;
};

type JungleTVResetSpectatorStatus = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.ResetSpectatorStatusRequest;
  readonly responseType: typeof jungletv_pb.ResetSpectatorStatusResponse;
};

type JungleTVMonitorModerationStatus = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof jungletv_pb.MonitorModerationStatusRequest;
  readonly responseType: typeof jungletv_pb.ModerationStatusOverview;
};

type JungleTVSetOwnQueueEntryRemovalAllowed = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetOwnQueueEntryRemovalAllowedRequest;
  readonly responseType: typeof jungletv_pb.SetOwnQueueEntryRemovalAllowedResponse;
};

type JungleTVSetQueueEntryReorderingAllowed = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetQueueEntryReorderingAllowedRequest;
  readonly responseType: typeof jungletv_pb.SetQueueEntryReorderingAllowedResponse;
};

type JungleTVSetNewQueueEntriesAlwaysUnskippable = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetNewQueueEntriesAlwaysUnskippableRequest;
  readonly responseType: typeof jungletv_pb.SetNewQueueEntriesAlwaysUnskippableResponse;
};

type JungleTVSetSkippingEnabled = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetSkippingEnabledRequest;
  readonly responseType: typeof jungletv_pb.SetSkippingEnabledResponse;
};

type JungleTVSetQueueInsertCursor = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.SetQueueInsertCursorRequest;
  readonly responseType: typeof jungletv_pb.SetQueueInsertCursorResponse;
};

type JungleTVClearQueueInsertCursor = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.ClearQueueInsertCursorRequest;
  readonly responseType: typeof jungletv_pb.ClearQueueInsertCursorResponse;
};

type JungleTVClearUserProfile = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.ClearUserProfileRequest;
  readonly responseType: typeof jungletv_pb.ClearUserProfileResponse;
};

type JungleTVMarkAsActivelyModerating = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.MarkAsActivelyModeratingRequest;
  readonly responseType: typeof jungletv_pb.MarkAsActivelyModeratingResponse;
};

type JungleTVStopActivelyModerating = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.StopActivelyModeratingRequest;
  readonly responseType: typeof jungletv_pb.StopActivelyModeratingResponse;
};

type JungleTVAdjustPointsBalance = {
  readonly methodName: string;
  readonly service: typeof JungleTV;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof jungletv_pb.AdjustPointsBalanceRequest;
  readonly responseType: typeof jungletv_pb.AdjustPointsBalanceResponse;
};

export class JungleTV {
  static readonly serviceName: string;
  static readonly SignIn: JungleTVSignIn;
  static readonly EnqueueMedia: JungleTVEnqueueMedia;
  static readonly RemoveOwnQueueEntry: JungleTVRemoveOwnQueueEntry;
  static readonly MoveQueueEntry: JungleTVMoveQueueEntry;
  static readonly MonitorTicket: JungleTVMonitorTicket;
  static readonly ConsumeMedia: JungleTVConsumeMedia;
  static readonly MonitorQueue: JungleTVMonitorQueue;
  static readonly MonitorSkipAndTip: JungleTVMonitorSkipAndTip;
  static readonly RewardInfo: JungleTVRewardInfo;
  static readonly SubmitActivityChallenge: JungleTVSubmitActivityChallenge;
  static readonly ProduceSegchaChallenge: JungleTVProduceSegchaChallenge;
  static readonly ConsumeChat: JungleTVConsumeChat;
  static readonly SendChatMessage: JungleTVSendChatMessage;
  static readonly UserPermissionLevel: JungleTVUserPermissionLevel;
  static readonly GetDocument: JungleTVGetDocument;
  static readonly SetChatNickname: JungleTVSetChatNickname;
  static readonly Withdraw: JungleTVWithdraw;
  static readonly Leaderboards: JungleTVLeaderboards;
  static readonly RewardHistory: JungleTVRewardHistory;
  static readonly WithdrawalHistory: JungleTVWithdrawalHistory;
  static readonly OngoingRaffleInfo: JungleTVOngoingRaffleInfo;
  static readonly RaffleDrawings: JungleTVRaffleDrawings;
  static readonly Connections: JungleTVConnections;
  static readonly CreateConnection: JungleTVCreateConnection;
  static readonly RemoveConnection: JungleTVRemoveConnection;
  static readonly UserProfile: JungleTVUserProfile;
  static readonly UserStats: JungleTVUserStats;
  static readonly SetProfileBiography: JungleTVSetProfileBiography;
  static readonly SetProfileFeaturedMedia: JungleTVSetProfileFeaturedMedia;
  static readonly PlayedMediaHistory: JungleTVPlayedMediaHistory;
  static readonly BlockUser: JungleTVBlockUser;
  static readonly UnblockUser: JungleTVUnblockUser;
  static readonly BlockedUsers: JungleTVBlockedUsers;
  static readonly PointsInfo: JungleTVPointsInfo;
  static readonly PointsTransactions: JungleTVPointsTransactions;
  static readonly ChatGifSearch: JungleTVChatGifSearch;
  static readonly ConvertBananoToPoints: JungleTVConvertBananoToPoints;
  static readonly ForciblyEnqueueTicket: JungleTVForciblyEnqueueTicket;
  static readonly RemoveQueueEntry: JungleTVRemoveQueueEntry;
  static readonly RemoveChatMessage: JungleTVRemoveChatMessage;
  static readonly SetChatSettings: JungleTVSetChatSettings;
  static readonly SetVideoEnqueuingEnabled: JungleTVSetVideoEnqueuingEnabled;
  static readonly UserBans: JungleTVUserBans;
  static readonly BanUser: JungleTVBanUser;
  static readonly RemoveBan: JungleTVRemoveBan;
  static readonly UserVerifications: JungleTVUserVerifications;
  static readonly VerifyUser: JungleTVVerifyUser;
  static readonly RemoveUserVerification: JungleTVRemoveUserVerification;
  static readonly UserChatMessages: JungleTVUserChatMessages;
  static readonly DisallowedVideos: JungleTVDisallowedVideos;
  static readonly AddDisallowedVideo: JungleTVAddDisallowedVideo;
  static readonly RemoveDisallowedVideo: JungleTVRemoveDisallowedVideo;
  static readonly UpdateDocument: JungleTVUpdateDocument;
  static readonly SetUserChatNickname: JungleTVSetUserChatNickname;
  static readonly SetPricesMultiplier: JungleTVSetPricesMultiplier;
  static readonly SetMinimumPricesMultiplier: JungleTVSetMinimumPricesMultiplier;
  static readonly SetCrowdfundedSkippingEnabled: JungleTVSetCrowdfundedSkippingEnabled;
  static readonly SetSkipPriceMultiplier: JungleTVSetSkipPriceMultiplier;
  static readonly ConfirmRaffleWinner: JungleTVConfirmRaffleWinner;
  static readonly CompleteRaffle: JungleTVCompleteRaffle;
  static readonly RedrawRaffle: JungleTVRedrawRaffle;
  static readonly TriggerAnnouncementsNotification: JungleTVTriggerAnnouncementsNotification;
  static readonly SpectatorInfo: JungleTVSpectatorInfo;
  static readonly ResetSpectatorStatus: JungleTVResetSpectatorStatus;
  static readonly MonitorModerationStatus: JungleTVMonitorModerationStatus;
  static readonly SetOwnQueueEntryRemovalAllowed: JungleTVSetOwnQueueEntryRemovalAllowed;
  static readonly SetQueueEntryReorderingAllowed: JungleTVSetQueueEntryReorderingAllowed;
  static readonly SetNewQueueEntriesAlwaysUnskippable: JungleTVSetNewQueueEntriesAlwaysUnskippable;
  static readonly SetSkippingEnabled: JungleTVSetSkippingEnabled;
  static readonly SetQueueInsertCursor: JungleTVSetQueueInsertCursor;
  static readonly ClearQueueInsertCursor: JungleTVClearQueueInsertCursor;
  static readonly ClearUserProfile: JungleTVClearUserProfile;
  static readonly MarkAsActivelyModerating: JungleTVMarkAsActivelyModerating;
  static readonly StopActivelyModerating: JungleTVStopActivelyModerating;
  static readonly AdjustPointsBalance: JungleTVAdjustPointsBalance;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class JungleTVClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  signIn(requestMessage: jungletv_pb.SignInRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.SignInProgress>;
  enqueueMedia(
    requestMessage: jungletv_pb.EnqueueMediaRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.EnqueueMediaResponse|null) => void
  ): UnaryResponse;
  enqueueMedia(
    requestMessage: jungletv_pb.EnqueueMediaRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.EnqueueMediaResponse|null) => void
  ): UnaryResponse;
  removeOwnQueueEntry(
    requestMessage: jungletv_pb.RemoveOwnQueueEntryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveOwnQueueEntryResponse|null) => void
  ): UnaryResponse;
  removeOwnQueueEntry(
    requestMessage: jungletv_pb.RemoveOwnQueueEntryRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveOwnQueueEntryResponse|null) => void
  ): UnaryResponse;
  moveQueueEntry(
    requestMessage: jungletv_pb.MoveQueueEntryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.MoveQueueEntryResponse|null) => void
  ): UnaryResponse;
  moveQueueEntry(
    requestMessage: jungletv_pb.MoveQueueEntryRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.MoveQueueEntryResponse|null) => void
  ): UnaryResponse;
  monitorTicket(requestMessage: jungletv_pb.MonitorTicketRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.EnqueueMediaTicket>;
  consumeMedia(requestMessage: jungletv_pb.ConsumeMediaRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.MediaConsumptionCheckpoint>;
  monitorQueue(requestMessage: jungletv_pb.MonitorQueueRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.Queue>;
  monitorSkipAndTip(requestMessage: jungletv_pb.MonitorSkipAndTipRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.SkipAndTipStatus>;
  rewardInfo(
    requestMessage: jungletv_pb.RewardInfoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RewardInfoResponse|null) => void
  ): UnaryResponse;
  rewardInfo(
    requestMessage: jungletv_pb.RewardInfoRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RewardInfoResponse|null) => void
  ): UnaryResponse;
  submitActivityChallenge(
    requestMessage: jungletv_pb.SubmitActivityChallengeRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SubmitActivityChallengeResponse|null) => void
  ): UnaryResponse;
  submitActivityChallenge(
    requestMessage: jungletv_pb.SubmitActivityChallengeRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SubmitActivityChallengeResponse|null) => void
  ): UnaryResponse;
  produceSegchaChallenge(
    requestMessage: jungletv_pb.ProduceSegchaChallengeRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ProduceSegchaChallengeResponse|null) => void
  ): UnaryResponse;
  produceSegchaChallenge(
    requestMessage: jungletv_pb.ProduceSegchaChallengeRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ProduceSegchaChallengeResponse|null) => void
  ): UnaryResponse;
  consumeChat(requestMessage: jungletv_pb.ConsumeChatRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.ChatUpdate>;
  sendChatMessage(
    requestMessage: jungletv_pb.SendChatMessageRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SendChatMessageResponse|null) => void
  ): UnaryResponse;
  sendChatMessage(
    requestMessage: jungletv_pb.SendChatMessageRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SendChatMessageResponse|null) => void
  ): UnaryResponse;
  userPermissionLevel(
    requestMessage: jungletv_pb.UserPermissionLevelRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserPermissionLevelResponse|null) => void
  ): UnaryResponse;
  userPermissionLevel(
    requestMessage: jungletv_pb.UserPermissionLevelRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserPermissionLevelResponse|null) => void
  ): UnaryResponse;
  getDocument(
    requestMessage: jungletv_pb.GetDocumentRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.Document|null) => void
  ): UnaryResponse;
  getDocument(
    requestMessage: jungletv_pb.GetDocumentRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.Document|null) => void
  ): UnaryResponse;
  setChatNickname(
    requestMessage: jungletv_pb.SetChatNicknameRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetChatNicknameResponse|null) => void
  ): UnaryResponse;
  setChatNickname(
    requestMessage: jungletv_pb.SetChatNicknameRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetChatNicknameResponse|null) => void
  ): UnaryResponse;
  withdraw(
    requestMessage: jungletv_pb.WithdrawRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.WithdrawResponse|null) => void
  ): UnaryResponse;
  withdraw(
    requestMessage: jungletv_pb.WithdrawRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.WithdrawResponse|null) => void
  ): UnaryResponse;
  leaderboards(
    requestMessage: jungletv_pb.LeaderboardsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.LeaderboardsResponse|null) => void
  ): UnaryResponse;
  leaderboards(
    requestMessage: jungletv_pb.LeaderboardsRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.LeaderboardsResponse|null) => void
  ): UnaryResponse;
  rewardHistory(
    requestMessage: jungletv_pb.RewardHistoryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RewardHistoryResponse|null) => void
  ): UnaryResponse;
  rewardHistory(
    requestMessage: jungletv_pb.RewardHistoryRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RewardHistoryResponse|null) => void
  ): UnaryResponse;
  withdrawalHistory(
    requestMessage: jungletv_pb.WithdrawalHistoryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.WithdrawalHistoryResponse|null) => void
  ): UnaryResponse;
  withdrawalHistory(
    requestMessage: jungletv_pb.WithdrawalHistoryRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.WithdrawalHistoryResponse|null) => void
  ): UnaryResponse;
  ongoingRaffleInfo(
    requestMessage: jungletv_pb.OngoingRaffleInfoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.OngoingRaffleInfoResponse|null) => void
  ): UnaryResponse;
  ongoingRaffleInfo(
    requestMessage: jungletv_pb.OngoingRaffleInfoRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.OngoingRaffleInfoResponse|null) => void
  ): UnaryResponse;
  raffleDrawings(
    requestMessage: jungletv_pb.RaffleDrawingsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RaffleDrawingsResponse|null) => void
  ): UnaryResponse;
  raffleDrawings(
    requestMessage: jungletv_pb.RaffleDrawingsRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RaffleDrawingsResponse|null) => void
  ): UnaryResponse;
  connections(
    requestMessage: jungletv_pb.ConnectionsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ConnectionsResponse|null) => void
  ): UnaryResponse;
  connections(
    requestMessage: jungletv_pb.ConnectionsRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ConnectionsResponse|null) => void
  ): UnaryResponse;
  createConnection(
    requestMessage: jungletv_pb.CreateConnectionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.CreateConnectionResponse|null) => void
  ): UnaryResponse;
  createConnection(
    requestMessage: jungletv_pb.CreateConnectionRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.CreateConnectionResponse|null) => void
  ): UnaryResponse;
  removeConnection(
    requestMessage: jungletv_pb.RemoveConnectionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveConnectionResponse|null) => void
  ): UnaryResponse;
  removeConnection(
    requestMessage: jungletv_pb.RemoveConnectionRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveConnectionResponse|null) => void
  ): UnaryResponse;
  userProfile(
    requestMessage: jungletv_pb.UserProfileRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserProfileResponse|null) => void
  ): UnaryResponse;
  userProfile(
    requestMessage: jungletv_pb.UserProfileRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserProfileResponse|null) => void
  ): UnaryResponse;
  userStats(
    requestMessage: jungletv_pb.UserStatsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserStatsResponse|null) => void
  ): UnaryResponse;
  userStats(
    requestMessage: jungletv_pb.UserStatsRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserStatsResponse|null) => void
  ): UnaryResponse;
  setProfileBiography(
    requestMessage: jungletv_pb.SetProfileBiographyRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetProfileBiographyResponse|null) => void
  ): UnaryResponse;
  setProfileBiography(
    requestMessage: jungletv_pb.SetProfileBiographyRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetProfileBiographyResponse|null) => void
  ): UnaryResponse;
  setProfileFeaturedMedia(
    requestMessage: jungletv_pb.SetProfileFeaturedMediaRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetProfileFeaturedMediaResponse|null) => void
  ): UnaryResponse;
  setProfileFeaturedMedia(
    requestMessage: jungletv_pb.SetProfileFeaturedMediaRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetProfileFeaturedMediaResponse|null) => void
  ): UnaryResponse;
  playedMediaHistory(
    requestMessage: jungletv_pb.PlayedMediaHistoryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.PlayedMediaHistoryResponse|null) => void
  ): UnaryResponse;
  playedMediaHistory(
    requestMessage: jungletv_pb.PlayedMediaHistoryRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.PlayedMediaHistoryResponse|null) => void
  ): UnaryResponse;
  blockUser(
    requestMessage: jungletv_pb.BlockUserRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.BlockUserResponse|null) => void
  ): UnaryResponse;
  blockUser(
    requestMessage: jungletv_pb.BlockUserRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.BlockUserResponse|null) => void
  ): UnaryResponse;
  unblockUser(
    requestMessage: jungletv_pb.UnblockUserRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UnblockUserResponse|null) => void
  ): UnaryResponse;
  unblockUser(
    requestMessage: jungletv_pb.UnblockUserRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UnblockUserResponse|null) => void
  ): UnaryResponse;
  blockedUsers(
    requestMessage: jungletv_pb.BlockedUsersRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.BlockedUsersResponse|null) => void
  ): UnaryResponse;
  blockedUsers(
    requestMessage: jungletv_pb.BlockedUsersRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.BlockedUsersResponse|null) => void
  ): UnaryResponse;
  pointsInfo(
    requestMessage: jungletv_pb.PointsInfoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.PointsInfoResponse|null) => void
  ): UnaryResponse;
  pointsInfo(
    requestMessage: jungletv_pb.PointsInfoRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.PointsInfoResponse|null) => void
  ): UnaryResponse;
  pointsTransactions(
    requestMessage: jungletv_pb.PointsTransactionsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.PointsTransactionsResponse|null) => void
  ): UnaryResponse;
  pointsTransactions(
    requestMessage: jungletv_pb.PointsTransactionsRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.PointsTransactionsResponse|null) => void
  ): UnaryResponse;
  chatGifSearch(
    requestMessage: jungletv_pb.ChatGifSearchRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ChatGifSearchResponse|null) => void
  ): UnaryResponse;
  chatGifSearch(
    requestMessage: jungletv_pb.ChatGifSearchRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ChatGifSearchResponse|null) => void
  ): UnaryResponse;
  convertBananoToPoints(requestMessage: jungletv_pb.ConvertBananoToPointsRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.ConvertBananoToPointsStatus>;
  forciblyEnqueueTicket(
    requestMessage: jungletv_pb.ForciblyEnqueueTicketRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ForciblyEnqueueTicketResponse|null) => void
  ): UnaryResponse;
  forciblyEnqueueTicket(
    requestMessage: jungletv_pb.ForciblyEnqueueTicketRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ForciblyEnqueueTicketResponse|null) => void
  ): UnaryResponse;
  removeQueueEntry(
    requestMessage: jungletv_pb.RemoveQueueEntryRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveQueueEntryResponse|null) => void
  ): UnaryResponse;
  removeQueueEntry(
    requestMessage: jungletv_pb.RemoveQueueEntryRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveQueueEntryResponse|null) => void
  ): UnaryResponse;
  removeChatMessage(
    requestMessage: jungletv_pb.RemoveChatMessageRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveChatMessageResponse|null) => void
  ): UnaryResponse;
  removeChatMessage(
    requestMessage: jungletv_pb.RemoveChatMessageRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveChatMessageResponse|null) => void
  ): UnaryResponse;
  setChatSettings(
    requestMessage: jungletv_pb.SetChatSettingsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetChatSettingsResponse|null) => void
  ): UnaryResponse;
  setChatSettings(
    requestMessage: jungletv_pb.SetChatSettingsRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetChatSettingsResponse|null) => void
  ): UnaryResponse;
  setVideoEnqueuingEnabled(
    requestMessage: jungletv_pb.SetVideoEnqueuingEnabledRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetVideoEnqueuingEnabledResponse|null) => void
  ): UnaryResponse;
  setVideoEnqueuingEnabled(
    requestMessage: jungletv_pb.SetVideoEnqueuingEnabledRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetVideoEnqueuingEnabledResponse|null) => void
  ): UnaryResponse;
  userBans(
    requestMessage: jungletv_pb.UserBansRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserBansResponse|null) => void
  ): UnaryResponse;
  userBans(
    requestMessage: jungletv_pb.UserBansRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserBansResponse|null) => void
  ): UnaryResponse;
  banUser(
    requestMessage: jungletv_pb.BanUserRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.BanUserResponse|null) => void
  ): UnaryResponse;
  banUser(
    requestMessage: jungletv_pb.BanUserRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.BanUserResponse|null) => void
  ): UnaryResponse;
  removeBan(
    requestMessage: jungletv_pb.RemoveBanRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveBanResponse|null) => void
  ): UnaryResponse;
  removeBan(
    requestMessage: jungletv_pb.RemoveBanRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveBanResponse|null) => void
  ): UnaryResponse;
  userVerifications(
    requestMessage: jungletv_pb.UserVerificationsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserVerificationsResponse|null) => void
  ): UnaryResponse;
  userVerifications(
    requestMessage: jungletv_pb.UserVerificationsRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserVerificationsResponse|null) => void
  ): UnaryResponse;
  verifyUser(
    requestMessage: jungletv_pb.VerifyUserRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.VerifyUserResponse|null) => void
  ): UnaryResponse;
  verifyUser(
    requestMessage: jungletv_pb.VerifyUserRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.VerifyUserResponse|null) => void
  ): UnaryResponse;
  removeUserVerification(
    requestMessage: jungletv_pb.RemoveUserVerificationRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveUserVerificationResponse|null) => void
  ): UnaryResponse;
  removeUserVerification(
    requestMessage: jungletv_pb.RemoveUserVerificationRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveUserVerificationResponse|null) => void
  ): UnaryResponse;
  userChatMessages(
    requestMessage: jungletv_pb.UserChatMessagesRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserChatMessagesResponse|null) => void
  ): UnaryResponse;
  userChatMessages(
    requestMessage: jungletv_pb.UserChatMessagesRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UserChatMessagesResponse|null) => void
  ): UnaryResponse;
  disallowedVideos(
    requestMessage: jungletv_pb.DisallowedVideosRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.DisallowedVideosResponse|null) => void
  ): UnaryResponse;
  disallowedVideos(
    requestMessage: jungletv_pb.DisallowedVideosRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.DisallowedVideosResponse|null) => void
  ): UnaryResponse;
  addDisallowedVideo(
    requestMessage: jungletv_pb.AddDisallowedVideoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.AddDisallowedVideoResponse|null) => void
  ): UnaryResponse;
  addDisallowedVideo(
    requestMessage: jungletv_pb.AddDisallowedVideoRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.AddDisallowedVideoResponse|null) => void
  ): UnaryResponse;
  removeDisallowedVideo(
    requestMessage: jungletv_pb.RemoveDisallowedVideoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveDisallowedVideoResponse|null) => void
  ): UnaryResponse;
  removeDisallowedVideo(
    requestMessage: jungletv_pb.RemoveDisallowedVideoRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RemoveDisallowedVideoResponse|null) => void
  ): UnaryResponse;
  updateDocument(
    requestMessage: jungletv_pb.Document,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UpdateDocumentResponse|null) => void
  ): UnaryResponse;
  updateDocument(
    requestMessage: jungletv_pb.Document,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.UpdateDocumentResponse|null) => void
  ): UnaryResponse;
  setUserChatNickname(
    requestMessage: jungletv_pb.SetUserChatNicknameRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetUserChatNicknameResponse|null) => void
  ): UnaryResponse;
  setUserChatNickname(
    requestMessage: jungletv_pb.SetUserChatNicknameRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetUserChatNicknameResponse|null) => void
  ): UnaryResponse;
  setPricesMultiplier(
    requestMessage: jungletv_pb.SetPricesMultiplierRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetPricesMultiplierResponse|null) => void
  ): UnaryResponse;
  setPricesMultiplier(
    requestMessage: jungletv_pb.SetPricesMultiplierRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetPricesMultiplierResponse|null) => void
  ): UnaryResponse;
  setMinimumPricesMultiplier(
    requestMessage: jungletv_pb.SetMinimumPricesMultiplierRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetMinimumPricesMultiplierResponse|null) => void
  ): UnaryResponse;
  setMinimumPricesMultiplier(
    requestMessage: jungletv_pb.SetMinimumPricesMultiplierRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetMinimumPricesMultiplierResponse|null) => void
  ): UnaryResponse;
  setCrowdfundedSkippingEnabled(
    requestMessage: jungletv_pb.SetCrowdfundedSkippingEnabledRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetCrowdfundedSkippingEnabledResponse|null) => void
  ): UnaryResponse;
  setCrowdfundedSkippingEnabled(
    requestMessage: jungletv_pb.SetCrowdfundedSkippingEnabledRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetCrowdfundedSkippingEnabledResponse|null) => void
  ): UnaryResponse;
  setSkipPriceMultiplier(
    requestMessage: jungletv_pb.SetSkipPriceMultiplierRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetSkipPriceMultiplierResponse|null) => void
  ): UnaryResponse;
  setSkipPriceMultiplier(
    requestMessage: jungletv_pb.SetSkipPriceMultiplierRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetSkipPriceMultiplierResponse|null) => void
  ): UnaryResponse;
  confirmRaffleWinner(
    requestMessage: jungletv_pb.ConfirmRaffleWinnerRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ConfirmRaffleWinnerResponse|null) => void
  ): UnaryResponse;
  confirmRaffleWinner(
    requestMessage: jungletv_pb.ConfirmRaffleWinnerRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ConfirmRaffleWinnerResponse|null) => void
  ): UnaryResponse;
  completeRaffle(
    requestMessage: jungletv_pb.CompleteRaffleRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.CompleteRaffleResponse|null) => void
  ): UnaryResponse;
  completeRaffle(
    requestMessage: jungletv_pb.CompleteRaffleRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.CompleteRaffleResponse|null) => void
  ): UnaryResponse;
  redrawRaffle(
    requestMessage: jungletv_pb.RedrawRaffleRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RedrawRaffleResponse|null) => void
  ): UnaryResponse;
  redrawRaffle(
    requestMessage: jungletv_pb.RedrawRaffleRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.RedrawRaffleResponse|null) => void
  ): UnaryResponse;
  triggerAnnouncementsNotification(
    requestMessage: jungletv_pb.TriggerAnnouncementsNotificationRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.TriggerAnnouncementsNotificationResponse|null) => void
  ): UnaryResponse;
  triggerAnnouncementsNotification(
    requestMessage: jungletv_pb.TriggerAnnouncementsNotificationRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.TriggerAnnouncementsNotificationResponse|null) => void
  ): UnaryResponse;
  spectatorInfo(
    requestMessage: jungletv_pb.SpectatorInfoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.Spectator|null) => void
  ): UnaryResponse;
  spectatorInfo(
    requestMessage: jungletv_pb.SpectatorInfoRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.Spectator|null) => void
  ): UnaryResponse;
  resetSpectatorStatus(
    requestMessage: jungletv_pb.ResetSpectatorStatusRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ResetSpectatorStatusResponse|null) => void
  ): UnaryResponse;
  resetSpectatorStatus(
    requestMessage: jungletv_pb.ResetSpectatorStatusRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ResetSpectatorStatusResponse|null) => void
  ): UnaryResponse;
  monitorModerationStatus(requestMessage: jungletv_pb.MonitorModerationStatusRequest, metadata?: grpc.Metadata): ResponseStream<jungletv_pb.ModerationStatusOverview>;
  setOwnQueueEntryRemovalAllowed(
    requestMessage: jungletv_pb.SetOwnQueueEntryRemovalAllowedRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetOwnQueueEntryRemovalAllowedResponse|null) => void
  ): UnaryResponse;
  setOwnQueueEntryRemovalAllowed(
    requestMessage: jungletv_pb.SetOwnQueueEntryRemovalAllowedRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetOwnQueueEntryRemovalAllowedResponse|null) => void
  ): UnaryResponse;
  setQueueEntryReorderingAllowed(
    requestMessage: jungletv_pb.SetQueueEntryReorderingAllowedRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetQueueEntryReorderingAllowedResponse|null) => void
  ): UnaryResponse;
  setQueueEntryReorderingAllowed(
    requestMessage: jungletv_pb.SetQueueEntryReorderingAllowedRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetQueueEntryReorderingAllowedResponse|null) => void
  ): UnaryResponse;
  setNewQueueEntriesAlwaysUnskippable(
    requestMessage: jungletv_pb.SetNewQueueEntriesAlwaysUnskippableRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetNewQueueEntriesAlwaysUnskippableResponse|null) => void
  ): UnaryResponse;
  setNewQueueEntriesAlwaysUnskippable(
    requestMessage: jungletv_pb.SetNewQueueEntriesAlwaysUnskippableRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetNewQueueEntriesAlwaysUnskippableResponse|null) => void
  ): UnaryResponse;
  setSkippingEnabled(
    requestMessage: jungletv_pb.SetSkippingEnabledRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetSkippingEnabledResponse|null) => void
  ): UnaryResponse;
  setSkippingEnabled(
    requestMessage: jungletv_pb.SetSkippingEnabledRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetSkippingEnabledResponse|null) => void
  ): UnaryResponse;
  setQueueInsertCursor(
    requestMessage: jungletv_pb.SetQueueInsertCursorRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetQueueInsertCursorResponse|null) => void
  ): UnaryResponse;
  setQueueInsertCursor(
    requestMessage: jungletv_pb.SetQueueInsertCursorRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.SetQueueInsertCursorResponse|null) => void
  ): UnaryResponse;
  clearQueueInsertCursor(
    requestMessage: jungletv_pb.ClearQueueInsertCursorRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ClearQueueInsertCursorResponse|null) => void
  ): UnaryResponse;
  clearQueueInsertCursor(
    requestMessage: jungletv_pb.ClearQueueInsertCursorRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ClearQueueInsertCursorResponse|null) => void
  ): UnaryResponse;
  clearUserProfile(
    requestMessage: jungletv_pb.ClearUserProfileRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ClearUserProfileResponse|null) => void
  ): UnaryResponse;
  clearUserProfile(
    requestMessage: jungletv_pb.ClearUserProfileRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.ClearUserProfileResponse|null) => void
  ): UnaryResponse;
  markAsActivelyModerating(
    requestMessage: jungletv_pb.MarkAsActivelyModeratingRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.MarkAsActivelyModeratingResponse|null) => void
  ): UnaryResponse;
  markAsActivelyModerating(
    requestMessage: jungletv_pb.MarkAsActivelyModeratingRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.MarkAsActivelyModeratingResponse|null) => void
  ): UnaryResponse;
  stopActivelyModerating(
    requestMessage: jungletv_pb.StopActivelyModeratingRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.StopActivelyModeratingResponse|null) => void
  ): UnaryResponse;
  stopActivelyModerating(
    requestMessage: jungletv_pb.StopActivelyModeratingRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.StopActivelyModeratingResponse|null) => void
  ): UnaryResponse;
  adjustPointsBalance(
    requestMessage: jungletv_pb.AdjustPointsBalanceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.AdjustPointsBalanceResponse|null) => void
  ): UnaryResponse;
  adjustPointsBalance(
    requestMessage: jungletv_pb.AdjustPointsBalanceRequest,
    callback: (error: ServiceError|null, responseMessage: jungletv_pb.AdjustPointsBalanceResponse|null) => void
  ): UnaryResponse;
}

