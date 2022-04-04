// package: jungletv
// file: jungletv.proto

var jungletv_pb = require("./jungletv_pb");
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

JungleTV.SetVideoEnqueuingEnabled = {
  methodName: "SetVideoEnqueuingEnabled",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SetVideoEnqueuingEnabledRequest,
  responseType: jungletv_pb.SetVideoEnqueuingEnabledResponse
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

JungleTV.DisallowedVideos = {
  methodName: "DisallowedVideos",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.DisallowedVideosRequest,
  responseType: jungletv_pb.DisallowedVideosResponse
};

JungleTV.AddDisallowedVideo = {
  methodName: "AddDisallowedVideo",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.AddDisallowedVideoRequest,
  responseType: jungletv_pb.AddDisallowedVideoResponse
};

JungleTV.RemoveDisallowedVideo = {
  methodName: "RemoveDisallowedVideo",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.RemoveDisallowedVideoRequest,
  responseType: jungletv_pb.RemoveDisallowedVideoResponse
};

JungleTV.UpdateDocument = {
  methodName: "UpdateDocument",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.Document,
  responseType: jungletv_pb.UpdateDocumentResponse
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

JungleTVClient.prototype.setVideoEnqueuingEnabled = function setVideoEnqueuingEnabled(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SetVideoEnqueuingEnabled, {
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

JungleTVClient.prototype.disallowedVideos = function disallowedVideos(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.DisallowedVideos, {
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

JungleTVClient.prototype.addDisallowedVideo = function addDisallowedVideo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.AddDisallowedVideo, {
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

JungleTVClient.prototype.removeDisallowedVideo = function removeDisallowedVideo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.RemoveDisallowedVideo, {
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

exports.JungleTVClient = JungleTVClient;

