// package: jungletv
// file: jungletv.proto

var jungletv_pb = require("./jungletv_pb");
var application_editor_pb = require("./application_editor_pb");
var application_runtime_pb = require("./application_runtime_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var JungleTV = (function () {
  function JungleTV() {}
  JungleTV.serviceName = "jungletv.JungleTV";
  return JungleTV;
}());

JungleTV.SignIn = {
  methodName: "SignIn",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: jungletv_pb.SignInRequest,
  responseType: jungletv_pb.SignInProgress
};

JungleTV.VerifySignInSignature = {
  methodName: "VerifySignInSignature",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.VerifySignInSignatureRequest,
  responseType: jungletv_pb.SignInResponse
};

JungleTV.EnqueueMedia = {
  methodName: "EnqueueMedia",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.EnqueueMediaRequest,
  responseType: jungletv_pb.EnqueueMediaResponse
};

JungleTV.RemoveOwnQueueEntry = {
  methodName: "RemoveOwnQueueEntry",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RemoveOwnQueueEntryRequest,
  responseType: jungletv_pb.RemoveOwnQueueEntryResponse
};

JungleTV.MoveQueueEntry = {
  methodName: "MoveQueueEntry",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.MoveQueueEntryRequest,
  responseType: jungletv_pb.MoveQueueEntryResponse
};

JungleTV.MonitorTicket = {
  methodName: "MonitorTicket",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: jungletv_pb.MonitorTicketRequest,
  responseType: jungletv_pb.EnqueueMediaTicket
};

JungleTV.ConsumeMedia = {
  methodName: "ConsumeMedia",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: jungletv_pb.ConsumeMediaRequest,
  responseType: jungletv_pb.MediaConsumptionCheckpoint
};

JungleTV.MonitorQueue = {
  methodName: "MonitorQueue",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: jungletv_pb.MonitorQueueRequest,
  responseType: jungletv_pb.Queue
};

JungleTV.MonitorSkipAndTip = {
  methodName: "MonitorSkipAndTip",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: jungletv_pb.MonitorSkipAndTipRequest,
  responseType: jungletv_pb.SkipAndTipStatus
};

JungleTV.RewardInfo = {
  methodName: "RewardInfo",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RewardInfoRequest,
  responseType: jungletv_pb.RewardInfoResponse
};

JungleTV.SubmitActivityChallenge = {
  methodName: "SubmitActivityChallenge",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SubmitActivityChallengeRequest,
  responseType: jungletv_pb.SubmitActivityChallengeResponse
};

JungleTV.ProduceSegchaChallenge = {
  methodName: "ProduceSegchaChallenge",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.ProduceSegchaChallengeRequest,
  responseType: jungletv_pb.ProduceSegchaChallengeResponse
};

JungleTV.ConsumeChat = {
  methodName: "ConsumeChat",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: jungletv_pb.ConsumeChatRequest,
  responseType: jungletv_pb.ChatUpdate
};

JungleTV.SendChatMessage = {
  methodName: "SendChatMessage",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SendChatMessageRequest,
  responseType: jungletv_pb.SendChatMessageResponse
};

JungleTV.UserPermissionLevel = {
  methodName: "UserPermissionLevel",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.UserPermissionLevelRequest,
  responseType: jungletv_pb.UserPermissionLevelResponse
};

JungleTV.GetDocument = {
  methodName: "GetDocument",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.GetDocumentRequest,
  responseType: jungletv_pb.Document
};

JungleTV.SetChatNickname = {
  methodName: "SetChatNickname",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetChatNicknameRequest,
  responseType: jungletv_pb.SetChatNicknameResponse
};

JungleTV.Withdraw = {
  methodName: "Withdraw",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.WithdrawRequest,
  responseType: jungletv_pb.WithdrawResponse
};

JungleTV.Leaderboards = {
  methodName: "Leaderboards",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.LeaderboardsRequest,
  responseType: jungletv_pb.LeaderboardsResponse
};

JungleTV.RewardHistory = {
  methodName: "RewardHistory",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RewardHistoryRequest,
  responseType: jungletv_pb.RewardHistoryResponse
};

JungleTV.WithdrawalHistory = {
  methodName: "WithdrawalHistory",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.WithdrawalHistoryRequest,
  responseType: jungletv_pb.WithdrawalHistoryResponse
};

JungleTV.OngoingRaffleInfo = {
  methodName: "OngoingRaffleInfo",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.OngoingRaffleInfoRequest,
  responseType: jungletv_pb.OngoingRaffleInfoResponse
};

JungleTV.RaffleDrawings = {
  methodName: "RaffleDrawings",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RaffleDrawingsRequest,
  responseType: jungletv_pb.RaffleDrawingsResponse
};

JungleTV.Connections = {
  methodName: "Connections",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.ConnectionsRequest,
  responseType: jungletv_pb.ConnectionsResponse
};

JungleTV.CreateConnection = {
  methodName: "CreateConnection",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.CreateConnectionRequest,
  responseType: jungletv_pb.CreateConnectionResponse
};

JungleTV.RemoveConnection = {
  methodName: "RemoveConnection",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RemoveConnectionRequest,
  responseType: jungletv_pb.RemoveConnectionResponse
};

JungleTV.UserProfile = {
  methodName: "UserProfile",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.UserProfileRequest,
  responseType: jungletv_pb.UserProfileResponse
};

JungleTV.UserStats = {
  methodName: "UserStats",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.UserStatsRequest,
  responseType: jungletv_pb.UserStatsResponse
};

JungleTV.SetProfileBiography = {
  methodName: "SetProfileBiography",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetProfileBiographyRequest,
  responseType: jungletv_pb.SetProfileBiographyResponse
};

JungleTV.SetProfileFeaturedMedia = {
  methodName: "SetProfileFeaturedMedia",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetProfileFeaturedMediaRequest,
  responseType: jungletv_pb.SetProfileFeaturedMediaResponse
};

JungleTV.PlayedMediaHistory = {
  methodName: "PlayedMediaHistory",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.PlayedMediaHistoryRequest,
  responseType: jungletv_pb.PlayedMediaHistoryResponse
};

JungleTV.BlockUser = {
  methodName: "BlockUser",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.BlockUserRequest,
  responseType: jungletv_pb.BlockUserResponse
};

JungleTV.UnblockUser = {
  methodName: "UnblockUser",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.UnblockUserRequest,
  responseType: jungletv_pb.UnblockUserResponse
};

JungleTV.BlockedUsers = {
  methodName: "BlockedUsers",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.BlockedUsersRequest,
  responseType: jungletv_pb.BlockedUsersResponse
};

JungleTV.PointsInfo = {
  methodName: "PointsInfo",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.PointsInfoRequest,
  responseType: jungletv_pb.PointsInfoResponse
};

JungleTV.PointsTransactions = {
  methodName: "PointsTransactions",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.PointsTransactionsRequest,
  responseType: jungletv_pb.PointsTransactionsResponse
};

JungleTV.ChatGifSearch = {
  methodName: "ChatGifSearch",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.ChatGifSearchRequest,
  responseType: jungletv_pb.ChatGifSearchResponse
};

JungleTV.ConvertBananoToPoints = {
  methodName: "ConvertBananoToPoints",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: jungletv_pb.ConvertBananoToPointsRequest,
  responseType: jungletv_pb.ConvertBananoToPointsStatus
};

JungleTV.StartOrExtendSubscription = {
  methodName: "StartOrExtendSubscription",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.StartOrExtendSubscriptionRequest,
  responseType: jungletv_pb.StartOrExtendSubscriptionResponse
};

JungleTV.SoundCloudTrackDetails = {
  methodName: "SoundCloudTrackDetails",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SoundCloudTrackDetailsRequest,
  responseType: jungletv_pb.SoundCloudTrackDetailsResponse
};

JungleTV.IncreaseOrReduceSkipThreshold = {
  methodName: "IncreaseOrReduceSkipThreshold",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.IncreaseOrReduceSkipThresholdRequest,
  responseType: jungletv_pb.IncreaseOrReduceSkipThresholdResponse
};

JungleTV.CheckMediaEnqueuingPassword = {
  methodName: "CheckMediaEnqueuingPassword",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.CheckMediaEnqueuingPasswordRequest,
  responseType: jungletv_pb.CheckMediaEnqueuingPasswordResponse
};

JungleTV.MonitorMediaEnqueuingPermission = {
  methodName: "MonitorMediaEnqueuingPermission",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: jungletv_pb.MonitorMediaEnqueuingPermissionRequest,
  responseType: jungletv_pb.MediaEnqueuingPermissionStatus
};

JungleTV.InvalidateAuthTokens = {
  methodName: "InvalidateAuthTokens",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.InvalidateAuthTokensRequest,
  responseType: jungletv_pb.InvalidateAuthTokensResponse
};

JungleTV.AuthorizeApplication = {
  methodName: "AuthorizeApplication",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: jungletv_pb.AuthorizeApplicationRequest,
  responseType: jungletv_pb.AuthorizeApplicationEvent
};

JungleTV.AuthorizationProcessData = {
  methodName: "AuthorizationProcessData",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.AuthorizationProcessDataRequest,
  responseType: jungletv_pb.AuthorizationProcessDataResponse
};

JungleTV.ConsentOrDissentToAuthorization = {
  methodName: "ConsentOrDissentToAuthorization",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.ConsentOrDissentToAuthorizationRequest,
  responseType: jungletv_pb.ConsentOrDissentToAuthorizationResponse
};

JungleTV.ForciblyEnqueueTicket = {
  methodName: "ForciblyEnqueueTicket",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.ForciblyEnqueueTicketRequest,
  responseType: jungletv_pb.ForciblyEnqueueTicketResponse
};

JungleTV.RemoveQueueEntry = {
  methodName: "RemoveQueueEntry",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RemoveQueueEntryRequest,
  responseType: jungletv_pb.RemoveQueueEntryResponse
};

JungleTV.RemoveChatMessage = {
  methodName: "RemoveChatMessage",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RemoveChatMessageRequest,
  responseType: jungletv_pb.RemoveChatMessageResponse
};

JungleTV.SetChatSettings = {
  methodName: "SetChatSettings",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetChatSettingsRequest,
  responseType: jungletv_pb.SetChatSettingsResponse
};

JungleTV.SetMediaEnqueuingEnabled = {
  methodName: "SetMediaEnqueuingEnabled",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetMediaEnqueuingEnabledRequest,
  responseType: jungletv_pb.SetMediaEnqueuingEnabledResponse
};

JungleTV.UserBans = {
  methodName: "UserBans",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.UserBansRequest,
  responseType: jungletv_pb.UserBansResponse
};

JungleTV.BanUser = {
  methodName: "BanUser",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.BanUserRequest,
  responseType: jungletv_pb.BanUserResponse
};

JungleTV.RemoveBan = {
  methodName: "RemoveBan",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RemoveBanRequest,
  responseType: jungletv_pb.RemoveBanResponse
};

JungleTV.UserVerifications = {
  methodName: "UserVerifications",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.UserVerificationsRequest,
  responseType: jungletv_pb.UserVerificationsResponse
};

JungleTV.VerifyUser = {
  methodName: "VerifyUser",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.VerifyUserRequest,
  responseType: jungletv_pb.VerifyUserResponse
};

JungleTV.RemoveUserVerification = {
  methodName: "RemoveUserVerification",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RemoveUserVerificationRequest,
  responseType: jungletv_pb.RemoveUserVerificationResponse
};

JungleTV.UserChatMessages = {
  methodName: "UserChatMessages",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.UserChatMessagesRequest,
  responseType: jungletv_pb.UserChatMessagesResponse
};

JungleTV.DisallowedMedia = {
  methodName: "DisallowedMedia",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.DisallowedMediaRequest,
  responseType: jungletv_pb.DisallowedMediaResponse
};

JungleTV.AddDisallowedMedia = {
  methodName: "AddDisallowedMedia",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.AddDisallowedMediaRequest,
  responseType: jungletv_pb.AddDisallowedMediaResponse
};

JungleTV.RemoveDisallowedMedia = {
  methodName: "RemoveDisallowedMedia",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RemoveDisallowedMediaRequest,
  responseType: jungletv_pb.RemoveDisallowedMediaResponse
};

JungleTV.DisallowedMediaCollections = {
  methodName: "DisallowedMediaCollections",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.DisallowedMediaCollectionsRequest,
  responseType: jungletv_pb.DisallowedMediaCollectionsResponse
};

JungleTV.AddDisallowedMediaCollection = {
  methodName: "AddDisallowedMediaCollection",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.AddDisallowedMediaCollectionRequest,
  responseType: jungletv_pb.AddDisallowedMediaCollectionResponse
};

JungleTV.RemoveDisallowedMediaCollection = {
  methodName: "RemoveDisallowedMediaCollection",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RemoveDisallowedMediaCollectionRequest,
  responseType: jungletv_pb.RemoveDisallowedMediaCollectionResponse
};

JungleTV.UpdateDocument = {
  methodName: "UpdateDocument",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.Document,
  responseType: jungletv_pb.UpdateDocumentResponse
};

JungleTV.Documents = {
  methodName: "Documents",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.DocumentsRequest,
  responseType: jungletv_pb.DocumentsResponse
};

JungleTV.SetUserChatNickname = {
  methodName: "SetUserChatNickname",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetUserChatNicknameRequest,
  responseType: jungletv_pb.SetUserChatNicknameResponse
};

JungleTV.SetPricesMultiplier = {
  methodName: "SetPricesMultiplier",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetPricesMultiplierRequest,
  responseType: jungletv_pb.SetPricesMultiplierResponse
};

JungleTV.SetMinimumPricesMultiplier = {
  methodName: "SetMinimumPricesMultiplier",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetMinimumPricesMultiplierRequest,
  responseType: jungletv_pb.SetMinimumPricesMultiplierResponse
};

JungleTV.SetCrowdfundedSkippingEnabled = {
  methodName: "SetCrowdfundedSkippingEnabled",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetCrowdfundedSkippingEnabledRequest,
  responseType: jungletv_pb.SetCrowdfundedSkippingEnabledResponse
};

JungleTV.SetSkipPriceMultiplier = {
  methodName: "SetSkipPriceMultiplier",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetSkipPriceMultiplierRequest,
  responseType: jungletv_pb.SetSkipPriceMultiplierResponse
};

JungleTV.ConfirmRaffleWinner = {
  methodName: "ConfirmRaffleWinner",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.ConfirmRaffleWinnerRequest,
  responseType: jungletv_pb.ConfirmRaffleWinnerResponse
};

JungleTV.CompleteRaffle = {
  methodName: "CompleteRaffle",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.CompleteRaffleRequest,
  responseType: jungletv_pb.CompleteRaffleResponse
};

JungleTV.RedrawRaffle = {
  methodName: "RedrawRaffle",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RedrawRaffleRequest,
  responseType: jungletv_pb.RedrawRaffleResponse
};

JungleTV.TriggerAnnouncementsNotification = {
  methodName: "TriggerAnnouncementsNotification",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.TriggerAnnouncementsNotificationRequest,
  responseType: jungletv_pb.TriggerAnnouncementsNotificationResponse
};

JungleTV.SpectatorInfo = {
  methodName: "SpectatorInfo",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SpectatorInfoRequest,
  responseType: jungletv_pb.Spectator
};

JungleTV.ResetSpectatorStatus = {
  methodName: "ResetSpectatorStatus",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.ResetSpectatorStatusRequest,
  responseType: jungletv_pb.ResetSpectatorStatusResponse
};

JungleTV.MonitorModerationStatus = {
  methodName: "MonitorModerationStatus",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: jungletv_pb.MonitorModerationStatusRequest,
  responseType: jungletv_pb.ModerationStatusOverview
};

JungleTV.SetOwnQueueEntryRemovalAllowed = {
  methodName: "SetOwnQueueEntryRemovalAllowed",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetOwnQueueEntryRemovalAllowedRequest,
  responseType: jungletv_pb.SetOwnQueueEntryRemovalAllowedResponse
};

JungleTV.SetQueueEntryReorderingAllowed = {
  methodName: "SetQueueEntryReorderingAllowed",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetQueueEntryReorderingAllowedRequest,
  responseType: jungletv_pb.SetQueueEntryReorderingAllowedResponse
};

JungleTV.SetNewQueueEntriesAlwaysUnskippable = {
  methodName: "SetNewQueueEntriesAlwaysUnskippable",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetNewQueueEntriesAlwaysUnskippableRequest,
  responseType: jungletv_pb.SetNewQueueEntriesAlwaysUnskippableResponse
};

JungleTV.SetSkippingEnabled = {
  methodName: "SetSkippingEnabled",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetSkippingEnabledRequest,
  responseType: jungletv_pb.SetSkippingEnabledResponse
};

JungleTV.SetQueueInsertCursor = {
  methodName: "SetQueueInsertCursor",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetQueueInsertCursorRequest,
  responseType: jungletv_pb.SetQueueInsertCursorResponse
};

JungleTV.ClearQueueInsertCursor = {
  methodName: "ClearQueueInsertCursor",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.ClearQueueInsertCursorRequest,
  responseType: jungletv_pb.ClearQueueInsertCursorResponse
};

JungleTV.ClearUserProfile = {
  methodName: "ClearUserProfile",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.ClearUserProfileRequest,
  responseType: jungletv_pb.ClearUserProfileResponse
};

JungleTV.MarkAsActivelyModerating = {
  methodName: "MarkAsActivelyModerating",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.MarkAsActivelyModeratingRequest,
  responseType: jungletv_pb.MarkAsActivelyModeratingResponse
};

JungleTV.StopActivelyModerating = {
  methodName: "StopActivelyModerating",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.StopActivelyModeratingRequest,
  responseType: jungletv_pb.StopActivelyModeratingResponse
};

JungleTV.AdjustPointsBalance = {
  methodName: "AdjustPointsBalance",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.AdjustPointsBalanceRequest,
  responseType: jungletv_pb.AdjustPointsBalanceResponse
};

JungleTV.AddVipUser = {
  methodName: "AddVipUser",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.AddVipUserRequest,
  responseType: jungletv_pb.AddVipUserResponse
};

JungleTV.RemoveVipUser = {
  methodName: "RemoveVipUser",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RemoveVipUserRequest,
  responseType: jungletv_pb.RemoveVipUserResponse
};

JungleTV.TriggerClientReload = {
  methodName: "TriggerClientReload",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.TriggerClientReloadRequest,
  responseType: jungletv_pb.TriggerClientReloadResponse
};

JungleTV.SetMulticurrencyPaymentsEnabled = {
  methodName: "SetMulticurrencyPaymentsEnabled",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetMulticurrencyPaymentsEnabledRequest,
  responseType: jungletv_pb.SetMulticurrencyPaymentsEnabledResponse
};

JungleTV.InvalidateUserAuthTokens = {
  methodName: "InvalidateUserAuthTokens",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.InvalidateUserAuthTokensRequest,
  responseType: jungletv_pb.InvalidateUserAuthTokensResponse
};

JungleTV.Applications = {
  methodName: "Applications",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.ApplicationsRequest,
  responseType: application_editor_pb.ApplicationsResponse
};

JungleTV.GetApplication = {
  methodName: "GetApplication",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.GetApplicationRequest,
  responseType: application_editor_pb.Application
};

JungleTV.UpdateApplication = {
  methodName: "UpdateApplication",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.Application,
  responseType: application_editor_pb.UpdateApplicationResponse
};

JungleTV.CloneApplication = {
  methodName: "CloneApplication",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.CloneApplicationRequest,
  responseType: application_editor_pb.CloneApplicationResponse
};

JungleTV.DeleteApplication = {
  methodName: "DeleteApplication",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.DeleteApplicationRequest,
  responseType: application_editor_pb.DeleteApplicationResponse
};

JungleTV.ApplicationFiles = {
  methodName: "ApplicationFiles",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.ApplicationFilesRequest,
  responseType: application_editor_pb.ApplicationFilesResponse
};

JungleTV.GetApplicationFile = {
  methodName: "GetApplicationFile",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.GetApplicationFileRequest,
  responseType: application_editor_pb.ApplicationFile
};

JungleTV.UpdateApplicationFile = {
  methodName: "UpdateApplicationFile",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.ApplicationFile,
  responseType: application_editor_pb.UpdateApplicationFileResponse
};

JungleTV.CloneApplicationFile = {
  methodName: "CloneApplicationFile",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.CloneApplicationFileRequest,
  responseType: application_editor_pb.CloneApplicationFileResponse
};

JungleTV.DeleteApplicationFile = {
  methodName: "DeleteApplicationFile",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.DeleteApplicationFileRequest,
  responseType: application_editor_pb.DeleteApplicationFileResponse
};

JungleTV.LaunchApplication = {
  methodName: "LaunchApplication",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.LaunchApplicationRequest,
  responseType: application_editor_pb.LaunchApplicationResponse
};

JungleTV.StopApplication = {
  methodName: "StopApplication",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.StopApplicationRequest,
  responseType: application_editor_pb.StopApplicationResponse
};

JungleTV.ApplicationLog = {
  methodName: "ApplicationLog",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.ApplicationLogRequest,
  responseType: application_editor_pb.ApplicationLogResponse
};

JungleTV.ConsumeApplicationLog = {
  methodName: "ConsumeApplicationLog",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: application_editor_pb.ConsumeApplicationLogRequest,
  responseType: application_editor_pb.ApplicationLogEntryContainer
};

JungleTV.MonitorRunningApplications = {
  methodName: "MonitorRunningApplications",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: application_editor_pb.MonitorRunningApplicationsRequest,
  responseType: application_editor_pb.RunningApplications
};

JungleTV.EvaluateExpressionOnApplication = {
  methodName: "EvaluateExpressionOnApplication",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.EvaluateExpressionOnApplicationRequest,
  responseType: application_editor_pb.EvaluateExpressionOnApplicationResponse
};

JungleTV.ExportApplication = {
  methodName: "ExportApplication",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.ExportApplicationRequest,
  responseType: application_editor_pb.ExportApplicationResponse
};

JungleTV.ImportApplication = {
  methodName: "ImportApplication",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.ImportApplicationRequest,
  responseType: application_editor_pb.ImportApplicationResponse
};

JungleTV.TypeScriptTypeDefinitions = {
  methodName: "TypeScriptTypeDefinitions",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_editor_pb.TypeScriptTypeDefinitionsRequest,
  responseType: application_editor_pb.TypeScriptTypeDefinitionsResponse
};

JungleTV.ResolveApplicationPage = {
  methodName: "ResolveApplicationPage",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_runtime_pb.ResolveApplicationPageRequest,
  responseType: application_runtime_pb.ResolveApplicationPageResponse
};

JungleTV.ConsumeApplicationEvents = {
  methodName: "ConsumeApplicationEvents",
  service: JungleTV,
  requestStream: false,
  responseStream: true,
  requestType: application_runtime_pb.ConsumeApplicationEventsRequest,
  responseType: application_runtime_pb.ApplicationEventUpdate
};

JungleTV.ApplicationServerMethod = {
  methodName: "ApplicationServerMethod",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_runtime_pb.ApplicationServerMethodRequest,
  responseType: application_runtime_pb.ApplicationServerMethodResponse
};

JungleTV.TriggerApplicationEvent = {
  methodName: "TriggerApplicationEvent",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: application_runtime_pb.TriggerApplicationEventRequest,
  responseType: application_runtime_pb.TriggerApplicationEventResponse
};

exports.JungleTV = JungleTV;

function JungleTVClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

JungleTVClient.prototype.signIn = function signIn(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.SignIn, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.verifySignInSignature = function verifySignInSignature(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.VerifySignInSignature, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.enqueueMedia = function enqueueMedia(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.EnqueueMedia, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.removeOwnQueueEntry = function removeOwnQueueEntry(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RemoveOwnQueueEntry, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.moveQueueEntry = function moveQueueEntry(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.MoveQueueEntry, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.monitorTicket = function monitorTicket(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.MonitorTicket, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.consumeMedia = function consumeMedia(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.ConsumeMedia, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.monitorQueue = function monitorQueue(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.MonitorQueue, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.monitorSkipAndTip = function monitorSkipAndTip(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.MonitorSkipAndTip, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.rewardInfo = function rewardInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RewardInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.submitActivityChallenge = function submitActivityChallenge(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SubmitActivityChallenge, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.produceSegchaChallenge = function produceSegchaChallenge(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ProduceSegchaChallenge, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.consumeChat = function consumeChat(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.ConsumeChat, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.sendChatMessage = function sendChatMessage(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SendChatMessage, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.userPermissionLevel = function userPermissionLevel(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.UserPermissionLevel, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.getDocument = function getDocument(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.GetDocument, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setChatNickname = function setChatNickname(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetChatNickname, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.withdraw = function withdraw(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.Withdraw, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.leaderboards = function leaderboards(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.Leaderboards, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.rewardHistory = function rewardHistory(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RewardHistory, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.withdrawalHistory = function withdrawalHistory(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.WithdrawalHistory, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.ongoingRaffleInfo = function ongoingRaffleInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.OngoingRaffleInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.raffleDrawings = function raffleDrawings(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RaffleDrawings, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.connections = function connections(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.Connections, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.createConnection = function createConnection(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.CreateConnection, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.removeConnection = function removeConnection(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RemoveConnection, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.userProfile = function userProfile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.UserProfile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.userStats = function userStats(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.UserStats, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setProfileBiography = function setProfileBiography(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetProfileBiography, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setProfileFeaturedMedia = function setProfileFeaturedMedia(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetProfileFeaturedMedia, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.playedMediaHistory = function playedMediaHistory(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.PlayedMediaHistory, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.blockUser = function blockUser(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.BlockUser, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.unblockUser = function unblockUser(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.UnblockUser, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.blockedUsers = function blockedUsers(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.BlockedUsers, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.pointsInfo = function pointsInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.PointsInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.pointsTransactions = function pointsTransactions(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.PointsTransactions, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.chatGifSearch = function chatGifSearch(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ChatGifSearch, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.convertBananoToPoints = function convertBananoToPoints(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.ConvertBananoToPoints, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.startOrExtendSubscription = function startOrExtendSubscription(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.StartOrExtendSubscription, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.soundCloudTrackDetails = function soundCloudTrackDetails(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SoundCloudTrackDetails, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.increaseOrReduceSkipThreshold = function increaseOrReduceSkipThreshold(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.IncreaseOrReduceSkipThreshold, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.checkMediaEnqueuingPassword = function checkMediaEnqueuingPassword(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.CheckMediaEnqueuingPassword, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.monitorMediaEnqueuingPermission = function monitorMediaEnqueuingPermission(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.MonitorMediaEnqueuingPermission, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.invalidateAuthTokens = function invalidateAuthTokens(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.InvalidateAuthTokens, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.authorizeApplication = function authorizeApplication(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.AuthorizeApplication, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.authorizationProcessData = function authorizationProcessData(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.AuthorizationProcessData, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.consentOrDissentToAuthorization = function consentOrDissentToAuthorization(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ConsentOrDissentToAuthorization, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.forciblyEnqueueTicket = function forciblyEnqueueTicket(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ForciblyEnqueueTicket, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.removeQueueEntry = function removeQueueEntry(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RemoveQueueEntry, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.removeChatMessage = function removeChatMessage(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RemoveChatMessage, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setChatSettings = function setChatSettings(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetChatSettings, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setMediaEnqueuingEnabled = function setMediaEnqueuingEnabled(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetMediaEnqueuingEnabled, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.userBans = function userBans(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.UserBans, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.banUser = function banUser(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.BanUser, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.removeBan = function removeBan(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RemoveBan, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.userVerifications = function userVerifications(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.UserVerifications, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.verifyUser = function verifyUser(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.VerifyUser, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.removeUserVerification = function removeUserVerification(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RemoveUserVerification, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.userChatMessages = function userChatMessages(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.UserChatMessages, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.disallowedMedia = function disallowedMedia(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.DisallowedMedia, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.addDisallowedMedia = function addDisallowedMedia(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.AddDisallowedMedia, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.removeDisallowedMedia = function removeDisallowedMedia(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RemoveDisallowedMedia, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.disallowedMediaCollections = function disallowedMediaCollections(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.DisallowedMediaCollections, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.addDisallowedMediaCollection = function addDisallowedMediaCollection(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.AddDisallowedMediaCollection, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.removeDisallowedMediaCollection = function removeDisallowedMediaCollection(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RemoveDisallowedMediaCollection, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.updateDocument = function updateDocument(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.UpdateDocument, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.documents = function documents(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.Documents, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setUserChatNickname = function setUserChatNickname(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetUserChatNickname, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setPricesMultiplier = function setPricesMultiplier(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetPricesMultiplier, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setMinimumPricesMultiplier = function setMinimumPricesMultiplier(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetMinimumPricesMultiplier, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setCrowdfundedSkippingEnabled = function setCrowdfundedSkippingEnabled(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetCrowdfundedSkippingEnabled, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setSkipPriceMultiplier = function setSkipPriceMultiplier(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetSkipPriceMultiplier, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.confirmRaffleWinner = function confirmRaffleWinner(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ConfirmRaffleWinner, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.completeRaffle = function completeRaffle(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.CompleteRaffle, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.redrawRaffle = function redrawRaffle(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RedrawRaffle, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.triggerAnnouncementsNotification = function triggerAnnouncementsNotification(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.TriggerAnnouncementsNotification, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.spectatorInfo = function spectatorInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SpectatorInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.resetSpectatorStatus = function resetSpectatorStatus(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ResetSpectatorStatus, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.monitorModerationStatus = function monitorModerationStatus(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.MonitorModerationStatus, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setOwnQueueEntryRemovalAllowed = function setOwnQueueEntryRemovalAllowed(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetOwnQueueEntryRemovalAllowed, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setQueueEntryReorderingAllowed = function setQueueEntryReorderingAllowed(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetQueueEntryReorderingAllowed, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setNewQueueEntriesAlwaysUnskippable = function setNewQueueEntriesAlwaysUnskippable(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetNewQueueEntriesAlwaysUnskippable, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setSkippingEnabled = function setSkippingEnabled(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetSkippingEnabled, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setQueueInsertCursor = function setQueueInsertCursor(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetQueueInsertCursor, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.clearQueueInsertCursor = function clearQueueInsertCursor(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ClearQueueInsertCursor, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.clearUserProfile = function clearUserProfile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ClearUserProfile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.markAsActivelyModerating = function markAsActivelyModerating(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.MarkAsActivelyModerating, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.stopActivelyModerating = function stopActivelyModerating(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.StopActivelyModerating, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.adjustPointsBalance = function adjustPointsBalance(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.AdjustPointsBalance, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.addVipUser = function addVipUser(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.AddVipUser, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.removeVipUser = function removeVipUser(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RemoveVipUser, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.triggerClientReload = function triggerClientReload(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.TriggerClientReload, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.setMulticurrencyPaymentsEnabled = function setMulticurrencyPaymentsEnabled(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetMulticurrencyPaymentsEnabled, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.invalidateUserAuthTokens = function invalidateUserAuthTokens(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.InvalidateUserAuthTokens, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.applications = function applications(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.Applications, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.getApplication = function getApplication(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.GetApplication, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.updateApplication = function updateApplication(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.UpdateApplication, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.cloneApplication = function cloneApplication(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.CloneApplication, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.deleteApplication = function deleteApplication(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.DeleteApplication, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.applicationFiles = function applicationFiles(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ApplicationFiles, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.getApplicationFile = function getApplicationFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.GetApplicationFile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.updateApplicationFile = function updateApplicationFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.UpdateApplicationFile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.cloneApplicationFile = function cloneApplicationFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.CloneApplicationFile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.deleteApplicationFile = function deleteApplicationFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.DeleteApplicationFile, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.launchApplication = function launchApplication(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.LaunchApplication, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.stopApplication = function stopApplication(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.StopApplication, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.applicationLog = function applicationLog(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ApplicationLog, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.consumeApplicationLog = function consumeApplicationLog(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.ConsumeApplicationLog, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.monitorRunningApplications = function monitorRunningApplications(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.MonitorRunningApplications, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.evaluateExpressionOnApplication = function evaluateExpressionOnApplication(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.EvaluateExpressionOnApplication, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.exportApplication = function exportApplication(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ExportApplication, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.importApplication = function importApplication(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ImportApplication, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.typeScriptTypeDefinitions = function typeScriptTypeDefinitions(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.TypeScriptTypeDefinitions, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.resolveApplicationPage = function resolveApplicationPage(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ResolveApplicationPage, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.consumeApplicationEvents = function consumeApplicationEvents(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(JungleTV.ConsumeApplicationEvents, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.applicationServerMethod = function applicationServerMethod(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.ApplicationServerMethod, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

JungleTVClient.prototype.triggerApplicationEvent = function triggerApplicationEvent(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.TriggerApplicationEvent, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.JungleTVClient = JungleTVClient;

