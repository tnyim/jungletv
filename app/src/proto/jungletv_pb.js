// source: jungletv.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
goog.object.extend(proto, google_protobuf_timestamp_pb);
var google_protobuf_duration_pb = require('google-protobuf/google/protobuf/duration_pb.js');
goog.object.extend(proto, google_protobuf_duration_pb);
goog.exportSymbol('proto.jungletv.ActivityChallenge', null, global);
goog.exportSymbol('proto.jungletv.AddDisallowedVideoRequest', null, global);
goog.exportSymbol('proto.jungletv.AddDisallowedVideoResponse', null, global);
goog.exportSymbol('proto.jungletv.AllowedVideoEnqueuingType', null, global);
goog.exportSymbol('proto.jungletv.BanUserRequest', null, global);
goog.exportSymbol('proto.jungletv.BanUserResponse', null, global);
goog.exportSymbol('proto.jungletv.ChatDisabledEvent', null, global);
goog.exportSymbol('proto.jungletv.ChatDisabledReason', null, global);
goog.exportSymbol('proto.jungletv.ChatEnabledEvent', null, global);
goog.exportSymbol('proto.jungletv.ChatHeartbeatEvent', null, global);
goog.exportSymbol('proto.jungletv.ChatMessage', null, global);
goog.exportSymbol('proto.jungletv.ChatMessage.MessageCase', null, global);
goog.exportSymbol('proto.jungletv.ChatMessageCreatedEvent', null, global);
goog.exportSymbol('proto.jungletv.ChatMessageDeletedEvent', null, global);
goog.exportSymbol('proto.jungletv.ChatUpdate', null, global);
goog.exportSymbol('proto.jungletv.ChatUpdate.EventCase', null, global);
goog.exportSymbol('proto.jungletv.CompleteRaffleRequest', null, global);
goog.exportSymbol('proto.jungletv.CompleteRaffleResponse', null, global);
goog.exportSymbol('proto.jungletv.ConfirmRaffleWinnerRequest', null, global);
goog.exportSymbol('proto.jungletv.ConfirmRaffleWinnerResponse', null, global);
goog.exportSymbol('proto.jungletv.ConsumeChatRequest', null, global);
goog.exportSymbol('proto.jungletv.ConsumeMediaRequest', null, global);
goog.exportSymbol('proto.jungletv.DisallowedVideo', null, global);
goog.exportSymbol('proto.jungletv.DisallowedVideosRequest', null, global);
goog.exportSymbol('proto.jungletv.DisallowedVideosResponse', null, global);
goog.exportSymbol('proto.jungletv.Document', null, global);
goog.exportSymbol('proto.jungletv.EnqueueMediaFailure', null, global);
goog.exportSymbol('proto.jungletv.EnqueueMediaRequest', null, global);
goog.exportSymbol('proto.jungletv.EnqueueMediaRequest.MediaInfoCase', null, global);
goog.exportSymbol('proto.jungletv.EnqueueMediaResponse', null, global);
goog.exportSymbol('proto.jungletv.EnqueueMediaResponse.EnqueueResponseCase', null, global);
goog.exportSymbol('proto.jungletv.EnqueueMediaTicket', null, global);
goog.exportSymbol('proto.jungletv.EnqueueMediaTicket.MediaInfoCase', null, global);
goog.exportSymbol('proto.jungletv.EnqueueMediaTicketStatus', null, global);
goog.exportSymbol('proto.jungletv.EnqueueStubData', null, global);
goog.exportSymbol('proto.jungletv.EnqueueYouTubeVideoData', null, global);
goog.exportSymbol('proto.jungletv.ForcedTicketEnqueueType', null, global);
goog.exportSymbol('proto.jungletv.ForciblyEnqueueTicketRequest', null, global);
goog.exportSymbol('proto.jungletv.ForciblyEnqueueTicketResponse', null, global);
goog.exportSymbol('proto.jungletv.GetDocumentRequest', null, global);
goog.exportSymbol('proto.jungletv.Leaderboard', null, global);
goog.exportSymbol('proto.jungletv.LeaderboardRow', null, global);
goog.exportSymbol('proto.jungletv.LeaderboardValue', null, global);
goog.exportSymbol('proto.jungletv.LeaderboardValue.ValueCase', null, global);
goog.exportSymbol('proto.jungletv.LeaderboardsRequest', null, global);
goog.exportSymbol('proto.jungletv.LeaderboardsResponse', null, global);
goog.exportSymbol('proto.jungletv.MediaConsumptionCheckpoint', null, global);
goog.exportSymbol('proto.jungletv.MediaConsumptionCheckpoint.MediaInfoCase', null, global);
goog.exportSymbol('proto.jungletv.MonitorQueueRequest', null, global);
goog.exportSymbol('proto.jungletv.MonitorSkipAndTipRequest', null, global);
goog.exportSymbol('proto.jungletv.MonitorTicketRequest', null, global);
goog.exportSymbol('proto.jungletv.NowPlayingStubData', null, global);
goog.exportSymbol('proto.jungletv.NowPlayingYouTubeVideoData', null, global);
goog.exportSymbol('proto.jungletv.OngoingRaffleInfo', null, global);
goog.exportSymbol('proto.jungletv.OngoingRaffleInfoRequest', null, global);
goog.exportSymbol('proto.jungletv.OngoingRaffleInfoResponse', null, global);
goog.exportSymbol('proto.jungletv.PaginationParameters', null, global);
goog.exportSymbol('proto.jungletv.PermissionLevel', null, global);
goog.exportSymbol('proto.jungletv.ProduceSegchaChallengeRequest', null, global);
goog.exportSymbol('proto.jungletv.ProduceSegchaChallengeResponse', null, global);
goog.exportSymbol('proto.jungletv.Queue', null, global);
goog.exportSymbol('proto.jungletv.QueueEntry', null, global);
goog.exportSymbol('proto.jungletv.QueueEntry.MediaInfoCase', null, global);
goog.exportSymbol('proto.jungletv.QueueYouTubeVideoData', null, global);
goog.exportSymbol('proto.jungletv.ReceivedReward', null, global);
goog.exportSymbol('proto.jungletv.ReceivedReward.MediaInfoCase', null, global);
goog.exportSymbol('proto.jungletv.RedrawRaffleRequest', null, global);
goog.exportSymbol('proto.jungletv.RedrawRaffleResponse', null, global);
goog.exportSymbol('proto.jungletv.RemoveBanRequest', null, global);
goog.exportSymbol('proto.jungletv.RemoveBanResponse', null, global);
goog.exportSymbol('proto.jungletv.RemoveChatMessageRequest', null, global);
goog.exportSymbol('proto.jungletv.RemoveChatMessageResponse', null, global);
goog.exportSymbol('proto.jungletv.RemoveDisallowedVideoRequest', null, global);
goog.exportSymbol('proto.jungletv.RemoveDisallowedVideoResponse', null, global);
goog.exportSymbol('proto.jungletv.RemoveOwnQueueEntryRequest', null, global);
goog.exportSymbol('proto.jungletv.RemoveOwnQueueEntryResponse', null, global);
goog.exportSymbol('proto.jungletv.RemoveQueueEntryRequest', null, global);
goog.exportSymbol('proto.jungletv.RemoveQueueEntryResponse', null, global);
goog.exportSymbol('proto.jungletv.RewardHistoryRequest', null, global);
goog.exportSymbol('proto.jungletv.RewardHistoryResponse', null, global);
goog.exportSymbol('proto.jungletv.RewardInfoRequest', null, global);
goog.exportSymbol('proto.jungletv.RewardInfoResponse', null, global);
goog.exportSymbol('proto.jungletv.SegchaChallengeStep', null, global);
goog.exportSymbol('proto.jungletv.SendChatMessageRequest', null, global);
goog.exportSymbol('proto.jungletv.SendChatMessageResponse', null, global);
goog.exportSymbol('proto.jungletv.SetChatNicknameRequest', null, global);
goog.exportSymbol('proto.jungletv.SetChatNicknameResponse', null, global);
goog.exportSymbol('proto.jungletv.SetChatSettingsRequest', null, global);
goog.exportSymbol('proto.jungletv.SetChatSettingsResponse', null, global);
goog.exportSymbol('proto.jungletv.SetCrowdfundedSkippingEnabledRequest', null, global);
goog.exportSymbol('proto.jungletv.SetCrowdfundedSkippingEnabledResponse', null, global);
goog.exportSymbol('proto.jungletv.SetPricesMultiplierRequest', null, global);
goog.exportSymbol('proto.jungletv.SetPricesMultiplierResponse', null, global);
goog.exportSymbol('proto.jungletv.SetSkipPriceMultiplierRequest', null, global);
goog.exportSymbol('proto.jungletv.SetSkipPriceMultiplierResponse', null, global);
goog.exportSymbol('proto.jungletv.SetUserChatNicknameRequest', null, global);
goog.exportSymbol('proto.jungletv.SetUserChatNicknameResponse', null, global);
goog.exportSymbol('proto.jungletv.SetVideoEnqueuingEnabledRequest', null, global);
goog.exportSymbol('proto.jungletv.SetVideoEnqueuingEnabledResponse', null, global);
goog.exportSymbol('proto.jungletv.SignInAccountUnopened', null, global);
goog.exportSymbol('proto.jungletv.SignInProgress', null, global);
goog.exportSymbol('proto.jungletv.SignInProgress.StepCase', null, global);
goog.exportSymbol('proto.jungletv.SignInRequest', null, global);
goog.exportSymbol('proto.jungletv.SignInResponse', null, global);
goog.exportSymbol('proto.jungletv.SignInVerification', null, global);
goog.exportSymbol('proto.jungletv.SignInVerificationExpired', null, global);
goog.exportSymbol('proto.jungletv.SkipAndTipStatus', null, global);
goog.exportSymbol('proto.jungletv.SkipStatus', null, global);
goog.exportSymbol('proto.jungletv.SubmitActivityChallengeRequest', null, global);
goog.exportSymbol('proto.jungletv.SubmitActivityChallengeResponse', null, global);
goog.exportSymbol('proto.jungletv.SystemChatMessage', null, global);
goog.exportSymbol('proto.jungletv.UpdateDocumentResponse', null, global);
goog.exportSymbol('proto.jungletv.User', null, global);
goog.exportSymbol('proto.jungletv.UserChatMessage', null, global);
goog.exportSymbol('proto.jungletv.UserChatMessagesRequest', null, global);
goog.exportSymbol('proto.jungletv.UserChatMessagesResponse', null, global);
goog.exportSymbol('proto.jungletv.UserPermissionLevelRequest', null, global);
goog.exportSymbol('proto.jungletv.UserPermissionLevelResponse', null, global);
goog.exportSymbol('proto.jungletv.UserRole', null, global);
goog.exportSymbol('proto.jungletv.WithdrawRequest', null, global);
goog.exportSymbol('proto.jungletv.WithdrawResponse', null, global);
goog.exportSymbol('proto.jungletv.Withdrawal', null, global);
goog.exportSymbol('proto.jungletv.WithdrawalHistoryRequest', null, global);
goog.exportSymbol('proto.jungletv.WithdrawalHistoryResponse', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.PaginationParameters = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.PaginationParameters, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.PaginationParameters.displayName = 'proto.jungletv.PaginationParameters';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SignInRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SignInRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SignInRequest.displayName = 'proto.jungletv.SignInRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SignInProgress = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jungletv.SignInProgress.oneofGroups_);
};
goog.inherits(proto.jungletv.SignInProgress, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SignInProgress.displayName = 'proto.jungletv.SignInProgress';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SignInVerification = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SignInVerification, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SignInVerification.displayName = 'proto.jungletv.SignInVerification';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SignInAccountUnopened = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SignInAccountUnopened, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SignInAccountUnopened.displayName = 'proto.jungletv.SignInAccountUnopened';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SignInResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SignInResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SignInResponse.displayName = 'proto.jungletv.SignInResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SignInVerificationExpired = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SignInVerificationExpired, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SignInVerificationExpired.displayName = 'proto.jungletv.SignInVerificationExpired';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.EnqueueYouTubeVideoData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.EnqueueYouTubeVideoData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.EnqueueYouTubeVideoData.displayName = 'proto.jungletv.EnqueueYouTubeVideoData';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.EnqueueStubData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.EnqueueStubData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.EnqueueStubData.displayName = 'proto.jungletv.EnqueueStubData';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.EnqueueMediaRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jungletv.EnqueueMediaRequest.oneofGroups_);
};
goog.inherits(proto.jungletv.EnqueueMediaRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.EnqueueMediaRequest.displayName = 'proto.jungletv.EnqueueMediaRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.EnqueueMediaResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jungletv.EnqueueMediaResponse.oneofGroups_);
};
goog.inherits(proto.jungletv.EnqueueMediaResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.EnqueueMediaResponse.displayName = 'proto.jungletv.EnqueueMediaResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.EnqueueMediaFailure = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.EnqueueMediaFailure, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.EnqueueMediaFailure.displayName = 'proto.jungletv.EnqueueMediaFailure';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.EnqueueMediaTicket = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jungletv.EnqueueMediaTicket.oneofGroups_);
};
goog.inherits(proto.jungletv.EnqueueMediaTicket, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.EnqueueMediaTicket.displayName = 'proto.jungletv.EnqueueMediaTicket';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.MonitorTicketRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.MonitorTicketRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.MonitorTicketRequest.displayName = 'proto.jungletv.MonitorTicketRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RemoveOwnQueueEntryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RemoveOwnQueueEntryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RemoveOwnQueueEntryRequest.displayName = 'proto.jungletv.RemoveOwnQueueEntryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RemoveOwnQueueEntryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RemoveOwnQueueEntryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RemoveOwnQueueEntryResponse.displayName = 'proto.jungletv.RemoveOwnQueueEntryResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ConsumeMediaRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ConsumeMediaRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ConsumeMediaRequest.displayName = 'proto.jungletv.ConsumeMediaRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.NowPlayingStubData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.NowPlayingStubData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.NowPlayingStubData.displayName = 'proto.jungletv.NowPlayingStubData';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.NowPlayingYouTubeVideoData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.NowPlayingYouTubeVideoData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.NowPlayingYouTubeVideoData.displayName = 'proto.jungletv.NowPlayingYouTubeVideoData';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.MediaConsumptionCheckpoint = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jungletv.MediaConsumptionCheckpoint.oneofGroups_);
};
goog.inherits(proto.jungletv.MediaConsumptionCheckpoint, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.MediaConsumptionCheckpoint.displayName = 'proto.jungletv.MediaConsumptionCheckpoint';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ActivityChallenge = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ActivityChallenge, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ActivityChallenge.displayName = 'proto.jungletv.ActivityChallenge';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.MonitorQueueRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.MonitorQueueRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.MonitorQueueRequest.displayName = 'proto.jungletv.MonitorQueueRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.Queue = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.Queue.repeatedFields_, null);
};
goog.inherits(proto.jungletv.Queue, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.Queue.displayName = 'proto.jungletv.Queue';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.QueueYouTubeVideoData = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.QueueYouTubeVideoData, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.QueueYouTubeVideoData.displayName = 'proto.jungletv.QueueYouTubeVideoData';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.QueueEntry = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jungletv.QueueEntry.oneofGroups_);
};
goog.inherits(proto.jungletv.QueueEntry, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.QueueEntry.displayName = 'proto.jungletv.QueueEntry';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.MonitorSkipAndTipRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.MonitorSkipAndTipRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.MonitorSkipAndTipRequest.displayName = 'proto.jungletv.MonitorSkipAndTipRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SkipAndTipStatus = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SkipAndTipStatus, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SkipAndTipStatus.displayName = 'proto.jungletv.SkipAndTipStatus';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.User = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.User.repeatedFields_, null);
};
goog.inherits(proto.jungletv.User, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.User.displayName = 'proto.jungletv.User';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RewardInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RewardInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RewardInfoRequest.displayName = 'proto.jungletv.RewardInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RewardInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RewardInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RewardInfoResponse.displayName = 'proto.jungletv.RewardInfoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RemoveQueueEntryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RemoveQueueEntryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RemoveQueueEntryRequest.displayName = 'proto.jungletv.RemoveQueueEntryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RemoveQueueEntryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RemoveQueueEntryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RemoveQueueEntryResponse.displayName = 'proto.jungletv.RemoveQueueEntryResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ForciblyEnqueueTicketRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ForciblyEnqueueTicketRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ForciblyEnqueueTicketRequest.displayName = 'proto.jungletv.ForciblyEnqueueTicketRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ForciblyEnqueueTicketResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ForciblyEnqueueTicketResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ForciblyEnqueueTicketResponse.displayName = 'proto.jungletv.ForciblyEnqueueTicketResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SubmitActivityChallengeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SubmitActivityChallengeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SubmitActivityChallengeRequest.displayName = 'proto.jungletv.SubmitActivityChallengeRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SubmitActivityChallengeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SubmitActivityChallengeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SubmitActivityChallengeResponse.displayName = 'proto.jungletv.SubmitActivityChallengeResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ConsumeChatRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ConsumeChatRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ConsumeChatRequest.displayName = 'proto.jungletv.ConsumeChatRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ChatUpdate = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jungletv.ChatUpdate.oneofGroups_);
};
goog.inherits(proto.jungletv.ChatUpdate, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ChatUpdate.displayName = 'proto.jungletv.ChatUpdate';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ChatMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jungletv.ChatMessage.oneofGroups_);
};
goog.inherits(proto.jungletv.ChatMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ChatMessage.displayName = 'proto.jungletv.ChatMessage';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.UserChatMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.UserChatMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.UserChatMessage.displayName = 'proto.jungletv.UserChatMessage';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SystemChatMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SystemChatMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SystemChatMessage.displayName = 'proto.jungletv.SystemChatMessage';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ChatDisabledEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ChatDisabledEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ChatDisabledEvent.displayName = 'proto.jungletv.ChatDisabledEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ChatEnabledEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ChatEnabledEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ChatEnabledEvent.displayName = 'proto.jungletv.ChatEnabledEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ChatMessageCreatedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ChatMessageCreatedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ChatMessageCreatedEvent.displayName = 'proto.jungletv.ChatMessageCreatedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ChatMessageDeletedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ChatMessageDeletedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ChatMessageDeletedEvent.displayName = 'proto.jungletv.ChatMessageDeletedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ChatHeartbeatEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ChatHeartbeatEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ChatHeartbeatEvent.displayName = 'proto.jungletv.ChatHeartbeatEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SendChatMessageRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SendChatMessageRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SendChatMessageRequest.displayName = 'proto.jungletv.SendChatMessageRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SendChatMessageResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SendChatMessageResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SendChatMessageResponse.displayName = 'proto.jungletv.SendChatMessageResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RemoveChatMessageRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RemoveChatMessageRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RemoveChatMessageRequest.displayName = 'proto.jungletv.RemoveChatMessageRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RemoveChatMessageResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RemoveChatMessageResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RemoveChatMessageResponse.displayName = 'proto.jungletv.RemoveChatMessageResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetChatSettingsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetChatSettingsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetChatSettingsRequest.displayName = 'proto.jungletv.SetChatSettingsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetChatSettingsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetChatSettingsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetChatSettingsResponse.displayName = 'proto.jungletv.SetChatSettingsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.BanUserRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.BanUserRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.BanUserRequest.displayName = 'proto.jungletv.BanUserRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.BanUserResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.BanUserResponse.repeatedFields_, null);
};
goog.inherits(proto.jungletv.BanUserResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.BanUserResponse.displayName = 'proto.jungletv.BanUserResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RemoveBanRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RemoveBanRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RemoveBanRequest.displayName = 'proto.jungletv.RemoveBanRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RemoveBanResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RemoveBanResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RemoveBanResponse.displayName = 'proto.jungletv.RemoveBanResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetVideoEnqueuingEnabledRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetVideoEnqueuingEnabledRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetVideoEnqueuingEnabledRequest.displayName = 'proto.jungletv.SetVideoEnqueuingEnabledRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetVideoEnqueuingEnabledResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetVideoEnqueuingEnabledResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetVideoEnqueuingEnabledResponse.displayName = 'proto.jungletv.SetVideoEnqueuingEnabledResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.UserChatMessagesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.UserChatMessagesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.UserChatMessagesRequest.displayName = 'proto.jungletv.UserChatMessagesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.UserChatMessagesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.UserChatMessagesResponse.repeatedFields_, null);
};
goog.inherits(proto.jungletv.UserChatMessagesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.UserChatMessagesResponse.displayName = 'proto.jungletv.UserChatMessagesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.UserPermissionLevelRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.UserPermissionLevelRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.UserPermissionLevelRequest.displayName = 'proto.jungletv.UserPermissionLevelRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.UserPermissionLevelResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.UserPermissionLevelResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.UserPermissionLevelResponse.displayName = 'proto.jungletv.UserPermissionLevelResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.DisallowedVideosRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.DisallowedVideosRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.DisallowedVideosRequest.displayName = 'proto.jungletv.DisallowedVideosRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.DisallowedVideo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.DisallowedVideo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.DisallowedVideo.displayName = 'proto.jungletv.DisallowedVideo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.DisallowedVideosResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.DisallowedVideosResponse.repeatedFields_, null);
};
goog.inherits(proto.jungletv.DisallowedVideosResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.DisallowedVideosResponse.displayName = 'proto.jungletv.DisallowedVideosResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.AddDisallowedVideoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.AddDisallowedVideoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.AddDisallowedVideoRequest.displayName = 'proto.jungletv.AddDisallowedVideoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.AddDisallowedVideoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.AddDisallowedVideoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.AddDisallowedVideoResponse.displayName = 'proto.jungletv.AddDisallowedVideoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RemoveDisallowedVideoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RemoveDisallowedVideoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RemoveDisallowedVideoRequest.displayName = 'proto.jungletv.RemoveDisallowedVideoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RemoveDisallowedVideoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RemoveDisallowedVideoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RemoveDisallowedVideoResponse.displayName = 'proto.jungletv.RemoveDisallowedVideoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.GetDocumentRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.GetDocumentRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.GetDocumentRequest.displayName = 'proto.jungletv.GetDocumentRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.Document = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.Document, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.Document.displayName = 'proto.jungletv.Document';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.UpdateDocumentResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.UpdateDocumentResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.UpdateDocumentResponse.displayName = 'proto.jungletv.UpdateDocumentResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetChatNicknameRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetChatNicknameRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetChatNicknameRequest.displayName = 'proto.jungletv.SetChatNicknameRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetChatNicknameResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetChatNicknameResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetChatNicknameResponse.displayName = 'proto.jungletv.SetChatNicknameResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetUserChatNicknameRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetUserChatNicknameRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetUserChatNicknameRequest.displayName = 'proto.jungletv.SetUserChatNicknameRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetUserChatNicknameResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetUserChatNicknameResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetUserChatNicknameResponse.displayName = 'proto.jungletv.SetUserChatNicknameResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetPricesMultiplierRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetPricesMultiplierRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetPricesMultiplierRequest.displayName = 'proto.jungletv.SetPricesMultiplierRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetPricesMultiplierResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetPricesMultiplierResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetPricesMultiplierResponse.displayName = 'proto.jungletv.SetPricesMultiplierResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.WithdrawRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.WithdrawRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.WithdrawRequest.displayName = 'proto.jungletv.WithdrawRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.WithdrawResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.WithdrawResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.WithdrawResponse.displayName = 'proto.jungletv.WithdrawResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.LeaderboardsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.LeaderboardsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.LeaderboardsRequest.displayName = 'proto.jungletv.LeaderboardsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.LeaderboardsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.LeaderboardsResponse.repeatedFields_, null);
};
goog.inherits(proto.jungletv.LeaderboardsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.LeaderboardsResponse.displayName = 'proto.jungletv.LeaderboardsResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.Leaderboard = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.Leaderboard.repeatedFields_, null);
};
goog.inherits(proto.jungletv.Leaderboard, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.Leaderboard.displayName = 'proto.jungletv.Leaderboard';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.LeaderboardRow = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.LeaderboardRow.repeatedFields_, null);
};
goog.inherits(proto.jungletv.LeaderboardRow, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.LeaderboardRow.displayName = 'proto.jungletv.LeaderboardRow';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.LeaderboardValue = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jungletv.LeaderboardValue.oneofGroups_);
};
goog.inherits(proto.jungletv.LeaderboardValue, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.LeaderboardValue.displayName = 'proto.jungletv.LeaderboardValue';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RewardHistoryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RewardHistoryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RewardHistoryRequest.displayName = 'proto.jungletv.RewardHistoryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ReceivedReward = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.jungletv.ReceivedReward.oneofGroups_);
};
goog.inherits(proto.jungletv.ReceivedReward, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ReceivedReward.displayName = 'proto.jungletv.ReceivedReward';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RewardHistoryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.RewardHistoryResponse.repeatedFields_, null);
};
goog.inherits(proto.jungletv.RewardHistoryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RewardHistoryResponse.displayName = 'proto.jungletv.RewardHistoryResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.WithdrawalHistoryRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.WithdrawalHistoryRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.WithdrawalHistoryRequest.displayName = 'proto.jungletv.WithdrawalHistoryRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.Withdrawal = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.Withdrawal, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.Withdrawal.displayName = 'proto.jungletv.Withdrawal';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.WithdrawalHistoryResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.WithdrawalHistoryResponse.repeatedFields_, null);
};
goog.inherits(proto.jungletv.WithdrawalHistoryResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.WithdrawalHistoryResponse.displayName = 'proto.jungletv.WithdrawalHistoryResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetCrowdfundedSkippingEnabledRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetCrowdfundedSkippingEnabledRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetCrowdfundedSkippingEnabledRequest.displayName = 'proto.jungletv.SetCrowdfundedSkippingEnabledRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetCrowdfundedSkippingEnabledResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetCrowdfundedSkippingEnabledResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetCrowdfundedSkippingEnabledResponse.displayName = 'proto.jungletv.SetCrowdfundedSkippingEnabledResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetSkipPriceMultiplierRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetSkipPriceMultiplierRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetSkipPriceMultiplierRequest.displayName = 'proto.jungletv.SetSkipPriceMultiplierRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SetSkipPriceMultiplierResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SetSkipPriceMultiplierResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SetSkipPriceMultiplierResponse.displayName = 'proto.jungletv.SetSkipPriceMultiplierResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ProduceSegchaChallengeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ProduceSegchaChallengeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ProduceSegchaChallengeRequest.displayName = 'proto.jungletv.ProduceSegchaChallengeRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ProduceSegchaChallengeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.jungletv.ProduceSegchaChallengeResponse.repeatedFields_, null);
};
goog.inherits(proto.jungletv.ProduceSegchaChallengeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ProduceSegchaChallengeResponse.displayName = 'proto.jungletv.ProduceSegchaChallengeResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.SegchaChallengeStep = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SegchaChallengeStep, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SegchaChallengeStep.displayName = 'proto.jungletv.SegchaChallengeStep';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ConfirmRaffleWinnerRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ConfirmRaffleWinnerRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ConfirmRaffleWinnerRequest.displayName = 'proto.jungletv.ConfirmRaffleWinnerRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.ConfirmRaffleWinnerResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ConfirmRaffleWinnerResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ConfirmRaffleWinnerResponse.displayName = 'proto.jungletv.ConfirmRaffleWinnerResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.CompleteRaffleRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.CompleteRaffleRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.CompleteRaffleRequest.displayName = 'proto.jungletv.CompleteRaffleRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.CompleteRaffleResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.CompleteRaffleResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.CompleteRaffleResponse.displayName = 'proto.jungletv.CompleteRaffleResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RedrawRaffleRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RedrawRaffleRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RedrawRaffleRequest.displayName = 'proto.jungletv.RedrawRaffleRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.RedrawRaffleResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.RedrawRaffleResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.RedrawRaffleResponse.displayName = 'proto.jungletv.RedrawRaffleResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.OngoingRaffleInfoRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.OngoingRaffleInfoRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.OngoingRaffleInfoRequest.displayName = 'proto.jungletv.OngoingRaffleInfoRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.OngoingRaffleInfoResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.OngoingRaffleInfoResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.OngoingRaffleInfoResponse.displayName = 'proto.jungletv.OngoingRaffleInfoResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.jungletv.OngoingRaffleInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.OngoingRaffleInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.OngoingRaffleInfo.displayName = 'proto.jungletv.OngoingRaffleInfo';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.PaginationParameters.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.PaginationParameters.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.PaginationParameters} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.PaginationParameters.toObject = function(includeInstance, msg) {
  var f, obj = {
    offset: jspb.Message.getFieldWithDefault(msg, 1, 0),
    limit: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.PaginationParameters}
 */
proto.jungletv.PaginationParameters.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.PaginationParameters;
  return proto.jungletv.PaginationParameters.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.PaginationParameters} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.PaginationParameters}
 */
proto.jungletv.PaginationParameters.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setOffset(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setLimit(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.PaginationParameters.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.PaginationParameters.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.PaginationParameters} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.PaginationParameters.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOffset();
  if (f !== 0) {
    writer.writeUint64(
      1,
      f
    );
  }
  f = message.getLimit();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
};


/**
 * optional uint64 offset = 1;
 * @return {number}
 */
proto.jungletv.PaginationParameters.prototype.getOffset = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.PaginationParameters} returns this
 */
proto.jungletv.PaginationParameters.prototype.setOffset = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint64 limit = 2;
 * @return {number}
 */
proto.jungletv.PaginationParameters.prototype.getLimit = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.PaginationParameters} returns this
 */
proto.jungletv.PaginationParameters.prototype.setLimit = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SignInRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SignInRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SignInRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    rewardAddress: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SignInRequest}
 */
proto.jungletv.SignInRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SignInRequest;
  return proto.jungletv.SignInRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SignInRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SignInRequest}
 */
proto.jungletv.SignInRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setRewardAddress(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SignInRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SignInRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SignInRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRewardAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string reward_address = 1;
 * @return {string}
 */
proto.jungletv.SignInRequest.prototype.getRewardAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SignInRequest} returns this
 */
proto.jungletv.SignInRequest.prototype.setRewardAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.SignInProgress.oneofGroups_ = [[1,2,3,4]];

/**
 * @enum {number}
 */
proto.jungletv.SignInProgress.StepCase = {
  STEP_NOT_SET: 0,
  VERIFICATION: 1,
  RESPONSE: 2,
  EXPIRED: 3,
  ACCOUNT_UNOPENED: 4
};

/**
 * @return {proto.jungletv.SignInProgress.StepCase}
 */
proto.jungletv.SignInProgress.prototype.getStepCase = function() {
  return /** @type {proto.jungletv.SignInProgress.StepCase} */(jspb.Message.computeOneofCase(this, proto.jungletv.SignInProgress.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SignInProgress.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SignInProgress.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SignInProgress} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInProgress.toObject = function(includeInstance, msg) {
  var f, obj = {
    verification: (f = msg.getVerification()) && proto.jungletv.SignInVerification.toObject(includeInstance, f),
    response: (f = msg.getResponse()) && proto.jungletv.SignInResponse.toObject(includeInstance, f),
    expired: (f = msg.getExpired()) && proto.jungletv.SignInVerificationExpired.toObject(includeInstance, f),
    accountUnopened: (f = msg.getAccountUnopened()) && proto.jungletv.SignInAccountUnopened.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SignInProgress}
 */
proto.jungletv.SignInProgress.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SignInProgress;
  return proto.jungletv.SignInProgress.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SignInProgress} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SignInProgress}
 */
proto.jungletv.SignInProgress.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.SignInVerification;
      reader.readMessage(value,proto.jungletv.SignInVerification.deserializeBinaryFromReader);
      msg.setVerification(value);
      break;
    case 2:
      var value = new proto.jungletv.SignInResponse;
      reader.readMessage(value,proto.jungletv.SignInResponse.deserializeBinaryFromReader);
      msg.setResponse(value);
      break;
    case 3:
      var value = new proto.jungletv.SignInVerificationExpired;
      reader.readMessage(value,proto.jungletv.SignInVerificationExpired.deserializeBinaryFromReader);
      msg.setExpired(value);
      break;
    case 4:
      var value = new proto.jungletv.SignInAccountUnopened;
      reader.readMessage(value,proto.jungletv.SignInAccountUnopened.deserializeBinaryFromReader);
      msg.setAccountUnopened(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SignInProgress.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SignInProgress.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SignInProgress} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInProgress.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getVerification();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.jungletv.SignInVerification.serializeBinaryToWriter
    );
  }
  f = message.getResponse();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.jungletv.SignInResponse.serializeBinaryToWriter
    );
  }
  f = message.getExpired();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.jungletv.SignInVerificationExpired.serializeBinaryToWriter
    );
  }
  f = message.getAccountUnopened();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.jungletv.SignInAccountUnopened.serializeBinaryToWriter
    );
  }
};


/**
 * optional SignInVerification verification = 1;
 * @return {?proto.jungletv.SignInVerification}
 */
proto.jungletv.SignInProgress.prototype.getVerification = function() {
  return /** @type{?proto.jungletv.SignInVerification} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.SignInVerification, 1));
};


/**
 * @param {?proto.jungletv.SignInVerification|undefined} value
 * @return {!proto.jungletv.SignInProgress} returns this
*/
proto.jungletv.SignInProgress.prototype.setVerification = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.jungletv.SignInProgress.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.SignInProgress} returns this
 */
proto.jungletv.SignInProgress.prototype.clearVerification = function() {
  return this.setVerification(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.SignInProgress.prototype.hasVerification = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional SignInResponse response = 2;
 * @return {?proto.jungletv.SignInResponse}
 */
proto.jungletv.SignInProgress.prototype.getResponse = function() {
  return /** @type{?proto.jungletv.SignInResponse} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.SignInResponse, 2));
};


/**
 * @param {?proto.jungletv.SignInResponse|undefined} value
 * @return {!proto.jungletv.SignInProgress} returns this
*/
proto.jungletv.SignInProgress.prototype.setResponse = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.jungletv.SignInProgress.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.SignInProgress} returns this
 */
proto.jungletv.SignInProgress.prototype.clearResponse = function() {
  return this.setResponse(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.SignInProgress.prototype.hasResponse = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional SignInVerificationExpired expired = 3;
 * @return {?proto.jungletv.SignInVerificationExpired}
 */
proto.jungletv.SignInProgress.prototype.getExpired = function() {
  return /** @type{?proto.jungletv.SignInVerificationExpired} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.SignInVerificationExpired, 3));
};


/**
 * @param {?proto.jungletv.SignInVerificationExpired|undefined} value
 * @return {!proto.jungletv.SignInProgress} returns this
*/
proto.jungletv.SignInProgress.prototype.setExpired = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.jungletv.SignInProgress.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.SignInProgress} returns this
 */
proto.jungletv.SignInProgress.prototype.clearExpired = function() {
  return this.setExpired(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.SignInProgress.prototype.hasExpired = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional SignInAccountUnopened account_unopened = 4;
 * @return {?proto.jungletv.SignInAccountUnopened}
 */
proto.jungletv.SignInProgress.prototype.getAccountUnopened = function() {
  return /** @type{?proto.jungletv.SignInAccountUnopened} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.SignInAccountUnopened, 4));
};


/**
 * @param {?proto.jungletv.SignInAccountUnopened|undefined} value
 * @return {!proto.jungletv.SignInProgress} returns this
*/
proto.jungletv.SignInProgress.prototype.setAccountUnopened = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.jungletv.SignInProgress.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.SignInProgress} returns this
 */
proto.jungletv.SignInProgress.prototype.clearAccountUnopened = function() {
  return this.setAccountUnopened(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.SignInProgress.prototype.hasAccountUnopened = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SignInVerification.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SignInVerification.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SignInVerification} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInVerification.toObject = function(includeInstance, msg) {
  var f, obj = {
    verificationRepresentativeAddress: jspb.Message.getFieldWithDefault(msg, 1, ""),
    expiration: (f = msg.getExpiration()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SignInVerification}
 */
proto.jungletv.SignInVerification.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SignInVerification;
  return proto.jungletv.SignInVerification.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SignInVerification} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SignInVerification}
 */
proto.jungletv.SignInVerification.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setVerificationRepresentativeAddress(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setExpiration(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SignInVerification.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SignInVerification.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SignInVerification} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInVerification.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getVerificationRepresentativeAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getExpiration();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional string verification_representative_address = 1;
 * @return {string}
 */
proto.jungletv.SignInVerification.prototype.getVerificationRepresentativeAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SignInVerification} returns this
 */
proto.jungletv.SignInVerification.prototype.setVerificationRepresentativeAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp expiration = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.SignInVerification.prototype.getExpiration = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.SignInVerification} returns this
*/
proto.jungletv.SignInVerification.prototype.setExpiration = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.SignInVerification} returns this
 */
proto.jungletv.SignInVerification.prototype.clearExpiration = function() {
  return this.setExpiration(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.SignInVerification.prototype.hasExpiration = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SignInAccountUnopened.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SignInAccountUnopened.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SignInAccountUnopened} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInAccountUnopened.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SignInAccountUnopened}
 */
proto.jungletv.SignInAccountUnopened.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SignInAccountUnopened;
  return proto.jungletv.SignInAccountUnopened.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SignInAccountUnopened} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SignInAccountUnopened}
 */
proto.jungletv.SignInAccountUnopened.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SignInAccountUnopened.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SignInAccountUnopened.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SignInAccountUnopened} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInAccountUnopened.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SignInResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SignInResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SignInResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    authToken: jspb.Message.getFieldWithDefault(msg, 1, ""),
    tokenExpiration: (f = msg.getTokenExpiration()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SignInResponse}
 */
proto.jungletv.SignInResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SignInResponse;
  return proto.jungletv.SignInResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SignInResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SignInResponse}
 */
proto.jungletv.SignInResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAuthToken(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setTokenExpiration(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SignInResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SignInResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SignInResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthToken();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTokenExpiration();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional string auth_token = 1;
 * @return {string}
 */
proto.jungletv.SignInResponse.prototype.getAuthToken = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SignInResponse} returns this
 */
proto.jungletv.SignInResponse.prototype.setAuthToken = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp token_expiration = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.SignInResponse.prototype.getTokenExpiration = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.SignInResponse} returns this
*/
proto.jungletv.SignInResponse.prototype.setTokenExpiration = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.SignInResponse} returns this
 */
proto.jungletv.SignInResponse.prototype.clearTokenExpiration = function() {
  return this.setTokenExpiration(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.SignInResponse.prototype.hasTokenExpiration = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SignInVerificationExpired.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SignInVerificationExpired.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SignInVerificationExpired} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInVerificationExpired.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SignInVerificationExpired}
 */
proto.jungletv.SignInVerificationExpired.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SignInVerificationExpired;
  return proto.jungletv.SignInVerificationExpired.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SignInVerificationExpired} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SignInVerificationExpired}
 */
proto.jungletv.SignInVerificationExpired.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SignInVerificationExpired.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SignInVerificationExpired.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SignInVerificationExpired} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SignInVerificationExpired.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.EnqueueYouTubeVideoData.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.EnqueueYouTubeVideoData.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.EnqueueYouTubeVideoData} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueYouTubeVideoData.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.EnqueueYouTubeVideoData}
 */
proto.jungletv.EnqueueYouTubeVideoData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.EnqueueYouTubeVideoData;
  return proto.jungletv.EnqueueYouTubeVideoData.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.EnqueueYouTubeVideoData} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.EnqueueYouTubeVideoData}
 */
proto.jungletv.EnqueueYouTubeVideoData.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.EnqueueYouTubeVideoData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.EnqueueYouTubeVideoData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.EnqueueYouTubeVideoData} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueYouTubeVideoData.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.EnqueueYouTubeVideoData.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.EnqueueYouTubeVideoData} returns this
 */
proto.jungletv.EnqueueYouTubeVideoData.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.EnqueueStubData.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.EnqueueStubData.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.EnqueueStubData} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueStubData.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.EnqueueStubData}
 */
proto.jungletv.EnqueueStubData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.EnqueueStubData;
  return proto.jungletv.EnqueueStubData.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.EnqueueStubData} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.EnqueueStubData}
 */
proto.jungletv.EnqueueStubData.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.EnqueueStubData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.EnqueueStubData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.EnqueueStubData} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueStubData.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.EnqueueMediaRequest.oneofGroups_ = [[2,3]];

/**
 * @enum {number}
 */
proto.jungletv.EnqueueMediaRequest.MediaInfoCase = {
  MEDIA_INFO_NOT_SET: 0,
  STUB_DATA: 2,
  YOUTUBE_VIDEO_DATA: 3
};

/**
 * @return {proto.jungletv.EnqueueMediaRequest.MediaInfoCase}
 */
proto.jungletv.EnqueueMediaRequest.prototype.getMediaInfoCase = function() {
  return /** @type {proto.jungletv.EnqueueMediaRequest.MediaInfoCase} */(jspb.Message.computeOneofCase(this, proto.jungletv.EnqueueMediaRequest.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.EnqueueMediaRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.EnqueueMediaRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.EnqueueMediaRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueMediaRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    unskippable: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    stubData: (f = msg.getStubData()) && proto.jungletv.EnqueueStubData.toObject(includeInstance, f),
    youtubeVideoData: (f = msg.getYoutubeVideoData()) && proto.jungletv.EnqueueYouTubeVideoData.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.EnqueueMediaRequest}
 */
proto.jungletv.EnqueueMediaRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.EnqueueMediaRequest;
  return proto.jungletv.EnqueueMediaRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.EnqueueMediaRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.EnqueueMediaRequest}
 */
proto.jungletv.EnqueueMediaRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setUnskippable(value);
      break;
    case 2:
      var value = new proto.jungletv.EnqueueStubData;
      reader.readMessage(value,proto.jungletv.EnqueueStubData.deserializeBinaryFromReader);
      msg.setStubData(value);
      break;
    case 3:
      var value = new proto.jungletv.EnqueueYouTubeVideoData;
      reader.readMessage(value,proto.jungletv.EnqueueYouTubeVideoData.deserializeBinaryFromReader);
      msg.setYoutubeVideoData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.EnqueueMediaRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.EnqueueMediaRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.EnqueueMediaRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueMediaRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getUnskippable();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getStubData();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.jungletv.EnqueueStubData.serializeBinaryToWriter
    );
  }
  f = message.getYoutubeVideoData();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.jungletv.EnqueueYouTubeVideoData.serializeBinaryToWriter
    );
  }
};


/**
 * optional bool unskippable = 1;
 * @return {boolean}
 */
proto.jungletv.EnqueueMediaRequest.prototype.getUnskippable = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.EnqueueMediaRequest} returns this
 */
proto.jungletv.EnqueueMediaRequest.prototype.setUnskippable = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional EnqueueStubData stub_data = 2;
 * @return {?proto.jungletv.EnqueueStubData}
 */
proto.jungletv.EnqueueMediaRequest.prototype.getStubData = function() {
  return /** @type{?proto.jungletv.EnqueueStubData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.EnqueueStubData, 2));
};


/**
 * @param {?proto.jungletv.EnqueueStubData|undefined} value
 * @return {!proto.jungletv.EnqueueMediaRequest} returns this
*/
proto.jungletv.EnqueueMediaRequest.prototype.setStubData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.jungletv.EnqueueMediaRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.EnqueueMediaRequest} returns this
 */
proto.jungletv.EnqueueMediaRequest.prototype.clearStubData = function() {
  return this.setStubData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.EnqueueMediaRequest.prototype.hasStubData = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional EnqueueYouTubeVideoData youtube_video_data = 3;
 * @return {?proto.jungletv.EnqueueYouTubeVideoData}
 */
proto.jungletv.EnqueueMediaRequest.prototype.getYoutubeVideoData = function() {
  return /** @type{?proto.jungletv.EnqueueYouTubeVideoData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.EnqueueYouTubeVideoData, 3));
};


/**
 * @param {?proto.jungletv.EnqueueYouTubeVideoData|undefined} value
 * @return {!proto.jungletv.EnqueueMediaRequest} returns this
*/
proto.jungletv.EnqueueMediaRequest.prototype.setYoutubeVideoData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.jungletv.EnqueueMediaRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.EnqueueMediaRequest} returns this
 */
proto.jungletv.EnqueueMediaRequest.prototype.clearYoutubeVideoData = function() {
  return this.setYoutubeVideoData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.EnqueueMediaRequest.prototype.hasYoutubeVideoData = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.EnqueueMediaResponse.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.jungletv.EnqueueMediaResponse.EnqueueResponseCase = {
  ENQUEUE_RESPONSE_NOT_SET: 0,
  TICKET: 1,
  FAILURE: 2
};

/**
 * @return {proto.jungletv.EnqueueMediaResponse.EnqueueResponseCase}
 */
proto.jungletv.EnqueueMediaResponse.prototype.getEnqueueResponseCase = function() {
  return /** @type {proto.jungletv.EnqueueMediaResponse.EnqueueResponseCase} */(jspb.Message.computeOneofCase(this, proto.jungletv.EnqueueMediaResponse.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.EnqueueMediaResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.EnqueueMediaResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.EnqueueMediaResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueMediaResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    ticket: (f = msg.getTicket()) && proto.jungletv.EnqueueMediaTicket.toObject(includeInstance, f),
    failure: (f = msg.getFailure()) && proto.jungletv.EnqueueMediaFailure.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.EnqueueMediaResponse}
 */
proto.jungletv.EnqueueMediaResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.EnqueueMediaResponse;
  return proto.jungletv.EnqueueMediaResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.EnqueueMediaResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.EnqueueMediaResponse}
 */
proto.jungletv.EnqueueMediaResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.EnqueueMediaTicket;
      reader.readMessage(value,proto.jungletv.EnqueueMediaTicket.deserializeBinaryFromReader);
      msg.setTicket(value);
      break;
    case 2:
      var value = new proto.jungletv.EnqueueMediaFailure;
      reader.readMessage(value,proto.jungletv.EnqueueMediaFailure.deserializeBinaryFromReader);
      msg.setFailure(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.EnqueueMediaResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.EnqueueMediaResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.EnqueueMediaResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueMediaResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTicket();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.jungletv.EnqueueMediaTicket.serializeBinaryToWriter
    );
  }
  f = message.getFailure();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.jungletv.EnqueueMediaFailure.serializeBinaryToWriter
    );
  }
};


/**
 * optional EnqueueMediaTicket ticket = 1;
 * @return {?proto.jungletv.EnqueueMediaTicket}
 */
proto.jungletv.EnqueueMediaResponse.prototype.getTicket = function() {
  return /** @type{?proto.jungletv.EnqueueMediaTicket} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.EnqueueMediaTicket, 1));
};


/**
 * @param {?proto.jungletv.EnqueueMediaTicket|undefined} value
 * @return {!proto.jungletv.EnqueueMediaResponse} returns this
*/
proto.jungletv.EnqueueMediaResponse.prototype.setTicket = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.jungletv.EnqueueMediaResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.EnqueueMediaResponse} returns this
 */
proto.jungletv.EnqueueMediaResponse.prototype.clearTicket = function() {
  return this.setTicket(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.EnqueueMediaResponse.prototype.hasTicket = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional EnqueueMediaFailure failure = 2;
 * @return {?proto.jungletv.EnqueueMediaFailure}
 */
proto.jungletv.EnqueueMediaResponse.prototype.getFailure = function() {
  return /** @type{?proto.jungletv.EnqueueMediaFailure} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.EnqueueMediaFailure, 2));
};


/**
 * @param {?proto.jungletv.EnqueueMediaFailure|undefined} value
 * @return {!proto.jungletv.EnqueueMediaResponse} returns this
*/
proto.jungletv.EnqueueMediaResponse.prototype.setFailure = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.jungletv.EnqueueMediaResponse.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.EnqueueMediaResponse} returns this
 */
proto.jungletv.EnqueueMediaResponse.prototype.clearFailure = function() {
  return this.setFailure(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.EnqueueMediaResponse.prototype.hasFailure = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.EnqueueMediaFailure.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.EnqueueMediaFailure.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.EnqueueMediaFailure} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueMediaFailure.toObject = function(includeInstance, msg) {
  var f, obj = {
    failureReason: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.EnqueueMediaFailure}
 */
proto.jungletv.EnqueueMediaFailure.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.EnqueueMediaFailure;
  return proto.jungletv.EnqueueMediaFailure.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.EnqueueMediaFailure} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.EnqueueMediaFailure}
 */
proto.jungletv.EnqueueMediaFailure.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setFailureReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.EnqueueMediaFailure.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.EnqueueMediaFailure.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.EnqueueMediaFailure} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueMediaFailure.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFailureReason();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string failure_reason = 1;
 * @return {string}
 */
proto.jungletv.EnqueueMediaFailure.prototype.getFailureReason = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.EnqueueMediaFailure} returns this
 */
proto.jungletv.EnqueueMediaFailure.prototype.setFailureReason = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.EnqueueMediaTicket.oneofGroups_ = [[11]];

/**
 * @enum {number}
 */
proto.jungletv.EnqueueMediaTicket.MediaInfoCase = {
  MEDIA_INFO_NOT_SET: 0,
  YOUTUBE_VIDEO_DATA: 11
};

/**
 * @return {proto.jungletv.EnqueueMediaTicket.MediaInfoCase}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getMediaInfoCase = function() {
  return /** @type {proto.jungletv.EnqueueMediaTicket.MediaInfoCase} */(jspb.Message.computeOneofCase(this, proto.jungletv.EnqueueMediaTicket.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.EnqueueMediaTicket.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.EnqueueMediaTicket.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.EnqueueMediaTicket} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueMediaTicket.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    status: jspb.Message.getFieldWithDefault(msg, 2, 0),
    paymentAddress: jspb.Message.getFieldWithDefault(msg, 3, ""),
    enqueuePrice: jspb.Message.getFieldWithDefault(msg, 4, ""),
    playNextPrice: jspb.Message.getFieldWithDefault(msg, 5, ""),
    playNowPrice: jspb.Message.getFieldWithDefault(msg, 6, ""),
    expiration: (f = msg.getExpiration()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    unskippable: jspb.Message.getBooleanFieldWithDefault(msg, 8, false),
    currentlyPlayingIsUnskippable: jspb.Message.getBooleanFieldWithDefault(msg, 9, false),
    mediaLength: (f = msg.getMediaLength()) && google_protobuf_duration_pb.Duration.toObject(includeInstance, f),
    youtubeVideoData: (f = msg.getYoutubeVideoData()) && proto.jungletv.QueueYouTubeVideoData.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.EnqueueMediaTicket}
 */
proto.jungletv.EnqueueMediaTicket.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.EnqueueMediaTicket;
  return proto.jungletv.EnqueueMediaTicket.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.EnqueueMediaTicket} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.EnqueueMediaTicket}
 */
proto.jungletv.EnqueueMediaTicket.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {!proto.jungletv.EnqueueMediaTicketStatus} */ (reader.readEnum());
      msg.setStatus(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setPaymentAddress(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setEnqueuePrice(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setPlayNextPrice(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setPlayNowPrice(value);
      break;
    case 7:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setExpiration(value);
      break;
    case 8:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setUnskippable(value);
      break;
    case 9:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setCurrentlyPlayingIsUnskippable(value);
      break;
    case 10:
      var value = new google_protobuf_duration_pb.Duration;
      reader.readMessage(value,google_protobuf_duration_pb.Duration.deserializeBinaryFromReader);
      msg.setMediaLength(value);
      break;
    case 11:
      var value = new proto.jungletv.QueueYouTubeVideoData;
      reader.readMessage(value,proto.jungletv.QueueYouTubeVideoData.deserializeBinaryFromReader);
      msg.setYoutubeVideoData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.EnqueueMediaTicket.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.EnqueueMediaTicket.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.EnqueueMediaTicket} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.EnqueueMediaTicket.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
  f = message.getPaymentAddress();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getEnqueuePrice();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getPlayNextPrice();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getPlayNowPrice();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getExpiration();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getUnskippable();
  if (f) {
    writer.writeBool(
      8,
      f
    );
  }
  f = message.getCurrentlyPlayingIsUnskippable();
  if (f) {
    writer.writeBool(
      9,
      f
    );
  }
  f = message.getMediaLength();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      google_protobuf_duration_pb.Duration.serializeBinaryToWriter
    );
  }
  f = message.getYoutubeVideoData();
  if (f != null) {
    writer.writeMessage(
      11,
      f,
      proto.jungletv.QueueYouTubeVideoData.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional EnqueueMediaTicketStatus status = 2;
 * @return {!proto.jungletv.EnqueueMediaTicketStatus}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getStatus = function() {
  return /** @type {!proto.jungletv.EnqueueMediaTicketStatus} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.jungletv.EnqueueMediaTicketStatus} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.setStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};


/**
 * optional string payment_address = 3;
 * @return {string}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getPaymentAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.setPaymentAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string enqueue_price = 4;
 * @return {string}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getEnqueuePrice = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.setEnqueuePrice = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string play_next_price = 5;
 * @return {string}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getPlayNextPrice = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.setPlayNextPrice = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string play_now_price = 6;
 * @return {string}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getPlayNowPrice = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.setPlayNowPrice = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional google.protobuf.Timestamp expiration = 7;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getExpiration = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 7));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
*/
proto.jungletv.EnqueueMediaTicket.prototype.setExpiration = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.clearExpiration = function() {
  return this.setExpiration(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.EnqueueMediaTicket.prototype.hasExpiration = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional bool unskippable = 8;
 * @return {boolean}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getUnskippable = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 8, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.setUnskippable = function(value) {
  return jspb.Message.setProto3BooleanField(this, 8, value);
};


/**
 * optional bool currently_playing_is_unskippable = 9;
 * @return {boolean}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getCurrentlyPlayingIsUnskippable = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 9, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.setCurrentlyPlayingIsUnskippable = function(value) {
  return jspb.Message.setProto3BooleanField(this, 9, value);
};


/**
 * optional google.protobuf.Duration media_length = 10;
 * @return {?proto.google.protobuf.Duration}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getMediaLength = function() {
  return /** @type{?proto.google.protobuf.Duration} */ (
    jspb.Message.getWrapperField(this, google_protobuf_duration_pb.Duration, 10));
};


/**
 * @param {?proto.google.protobuf.Duration|undefined} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
*/
proto.jungletv.EnqueueMediaTicket.prototype.setMediaLength = function(value) {
  return jspb.Message.setWrapperField(this, 10, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.clearMediaLength = function() {
  return this.setMediaLength(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.EnqueueMediaTicket.prototype.hasMediaLength = function() {
  return jspb.Message.getField(this, 10) != null;
};


/**
 * optional QueueYouTubeVideoData youtube_video_data = 11;
 * @return {?proto.jungletv.QueueYouTubeVideoData}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getYoutubeVideoData = function() {
  return /** @type{?proto.jungletv.QueueYouTubeVideoData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.QueueYouTubeVideoData, 11));
};


/**
 * @param {?proto.jungletv.QueueYouTubeVideoData|undefined} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
*/
proto.jungletv.EnqueueMediaTicket.prototype.setYoutubeVideoData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 11, proto.jungletv.EnqueueMediaTicket.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
 */
proto.jungletv.EnqueueMediaTicket.prototype.clearYoutubeVideoData = function() {
  return this.setYoutubeVideoData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.EnqueueMediaTicket.prototype.hasYoutubeVideoData = function() {
  return jspb.Message.getField(this, 11) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.MonitorTicketRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.MonitorTicketRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.MonitorTicketRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.MonitorTicketRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    ticketId: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.MonitorTicketRequest}
 */
proto.jungletv.MonitorTicketRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.MonitorTicketRequest;
  return proto.jungletv.MonitorTicketRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.MonitorTicketRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.MonitorTicketRequest}
 */
proto.jungletv.MonitorTicketRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTicketId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.MonitorTicketRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.MonitorTicketRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.MonitorTicketRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.MonitorTicketRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTicketId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string ticket_id = 1;
 * @return {string}
 */
proto.jungletv.MonitorTicketRequest.prototype.getTicketId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.MonitorTicketRequest} returns this
 */
proto.jungletv.MonitorTicketRequest.prototype.setTicketId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RemoveOwnQueueEntryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RemoveOwnQueueEntryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RemoveOwnQueueEntryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveOwnQueueEntryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RemoveOwnQueueEntryRequest}
 */
proto.jungletv.RemoveOwnQueueEntryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RemoveOwnQueueEntryRequest;
  return proto.jungletv.RemoveOwnQueueEntryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RemoveOwnQueueEntryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RemoveOwnQueueEntryRequest}
 */
proto.jungletv.RemoveOwnQueueEntryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RemoveOwnQueueEntryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RemoveOwnQueueEntryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RemoveOwnQueueEntryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveOwnQueueEntryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.RemoveOwnQueueEntryRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.RemoveOwnQueueEntryRequest} returns this
 */
proto.jungletv.RemoveOwnQueueEntryRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RemoveOwnQueueEntryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RemoveOwnQueueEntryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RemoveOwnQueueEntryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveOwnQueueEntryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RemoveOwnQueueEntryResponse}
 */
proto.jungletv.RemoveOwnQueueEntryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RemoveOwnQueueEntryResponse;
  return proto.jungletv.RemoveOwnQueueEntryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RemoveOwnQueueEntryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RemoveOwnQueueEntryResponse}
 */
proto.jungletv.RemoveOwnQueueEntryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RemoveOwnQueueEntryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RemoveOwnQueueEntryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RemoveOwnQueueEntryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveOwnQueueEntryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ConsumeMediaRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ConsumeMediaRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ConsumeMediaRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ConsumeMediaRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ConsumeMediaRequest}
 */
proto.jungletv.ConsumeMediaRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ConsumeMediaRequest;
  return proto.jungletv.ConsumeMediaRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ConsumeMediaRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ConsumeMediaRequest}
 */
proto.jungletv.ConsumeMediaRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ConsumeMediaRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ConsumeMediaRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ConsumeMediaRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ConsumeMediaRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.NowPlayingStubData.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.NowPlayingStubData.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.NowPlayingStubData} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.NowPlayingStubData.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.NowPlayingStubData}
 */
proto.jungletv.NowPlayingStubData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.NowPlayingStubData;
  return proto.jungletv.NowPlayingStubData.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.NowPlayingStubData} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.NowPlayingStubData}
 */
proto.jungletv.NowPlayingStubData.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.NowPlayingStubData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.NowPlayingStubData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.NowPlayingStubData} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.NowPlayingStubData.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.NowPlayingYouTubeVideoData.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.NowPlayingYouTubeVideoData.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.NowPlayingYouTubeVideoData} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.NowPlayingYouTubeVideoData.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.NowPlayingYouTubeVideoData}
 */
proto.jungletv.NowPlayingYouTubeVideoData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.NowPlayingYouTubeVideoData;
  return proto.jungletv.NowPlayingYouTubeVideoData.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.NowPlayingYouTubeVideoData} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.NowPlayingYouTubeVideoData}
 */
proto.jungletv.NowPlayingYouTubeVideoData.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.NowPlayingYouTubeVideoData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.NowPlayingYouTubeVideoData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.NowPlayingYouTubeVideoData} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.NowPlayingYouTubeVideoData.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.NowPlayingYouTubeVideoData.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.NowPlayingYouTubeVideoData} returns this
 */
proto.jungletv.NowPlayingYouTubeVideoData.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.MediaConsumptionCheckpoint.oneofGroups_ = [[10,11]];

/**
 * @enum {number}
 */
proto.jungletv.MediaConsumptionCheckpoint.MediaInfoCase = {
  MEDIA_INFO_NOT_SET: 0,
  STUB_DATA: 10,
  YOUTUBE_VIDEO_DATA: 11
};

/**
 * @return {proto.jungletv.MediaConsumptionCheckpoint.MediaInfoCase}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getMediaInfoCase = function() {
  return /** @type {proto.jungletv.MediaConsumptionCheckpoint.MediaInfoCase} */(jspb.Message.computeOneofCase(this, proto.jungletv.MediaConsumptionCheckpoint.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.MediaConsumptionCheckpoint.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.MediaConsumptionCheckpoint} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.MediaConsumptionCheckpoint.toObject = function(includeInstance, msg) {
  var f, obj = {
    mediaPresent: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    currentPosition: (f = msg.getCurrentPosition()) && google_protobuf_duration_pb.Duration.toObject(includeInstance, f),
    liveBroadcast: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
    requestedBy: (f = msg.getRequestedBy()) && proto.jungletv.User.toObject(includeInstance, f),
    requestCost: jspb.Message.getFieldWithDefault(msg, 5, ""),
    currentlyWatching: jspb.Message.getFieldWithDefault(msg, 6, 0),
    reward: jspb.Message.getFieldWithDefault(msg, 7, ""),
    rewardBalance: jspb.Message.getFieldWithDefault(msg, 8, ""),
    activityChallenge: (f = msg.getActivityChallenge()) && proto.jungletv.ActivityChallenge.toObject(includeInstance, f),
    stubData: (f = msg.getStubData()) && proto.jungletv.NowPlayingStubData.toObject(includeInstance, f),
    youtubeVideoData: (f = msg.getYoutubeVideoData()) && proto.jungletv.NowPlayingYouTubeVideoData.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint}
 */
proto.jungletv.MediaConsumptionCheckpoint.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.MediaConsumptionCheckpoint;
  return proto.jungletv.MediaConsumptionCheckpoint.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.MediaConsumptionCheckpoint} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint}
 */
proto.jungletv.MediaConsumptionCheckpoint.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setMediaPresent(value);
      break;
    case 2:
      var value = new google_protobuf_duration_pb.Duration;
      reader.readMessage(value,google_protobuf_duration_pb.Duration.deserializeBinaryFromReader);
      msg.setCurrentPosition(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setLiveBroadcast(value);
      break;
    case 4:
      var value = new proto.jungletv.User;
      reader.readMessage(value,proto.jungletv.User.deserializeBinaryFromReader);
      msg.setRequestedBy(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setRequestCost(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setCurrentlyWatching(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setReward(value);
      break;
    case 8:
      var value = /** @type {string} */ (reader.readString());
      msg.setRewardBalance(value);
      break;
    case 9:
      var value = new proto.jungletv.ActivityChallenge;
      reader.readMessage(value,proto.jungletv.ActivityChallenge.deserializeBinaryFromReader);
      msg.setActivityChallenge(value);
      break;
    case 10:
      var value = new proto.jungletv.NowPlayingStubData;
      reader.readMessage(value,proto.jungletv.NowPlayingStubData.deserializeBinaryFromReader);
      msg.setStubData(value);
      break;
    case 11:
      var value = new proto.jungletv.NowPlayingYouTubeVideoData;
      reader.readMessage(value,proto.jungletv.NowPlayingYouTubeVideoData.deserializeBinaryFromReader);
      msg.setYoutubeVideoData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.MediaConsumptionCheckpoint.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.MediaConsumptionCheckpoint} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.MediaConsumptionCheckpoint.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMediaPresent();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getCurrentPosition();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_duration_pb.Duration.serializeBinaryToWriter
    );
  }
  f = message.getLiveBroadcast();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getRequestedBy();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.jungletv.User.serializeBinaryToWriter
    );
  }
  f = message.getRequestCost();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getCurrentlyWatching();
  if (f !== 0) {
    writer.writeUint32(
      6,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 7));
  if (f != null) {
    writer.writeString(
      7,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 8));
  if (f != null) {
    writer.writeString(
      8,
      f
    );
  }
  f = message.getActivityChallenge();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      proto.jungletv.ActivityChallenge.serializeBinaryToWriter
    );
  }
  f = message.getStubData();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      proto.jungletv.NowPlayingStubData.serializeBinaryToWriter
    );
  }
  f = message.getYoutubeVideoData();
  if (f != null) {
    writer.writeMessage(
      11,
      f,
      proto.jungletv.NowPlayingYouTubeVideoData.serializeBinaryToWriter
    );
  }
};


/**
 * optional bool media_present = 1;
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getMediaPresent = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.setMediaPresent = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional google.protobuf.Duration current_position = 2;
 * @return {?proto.google.protobuf.Duration}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getCurrentPosition = function() {
  return /** @type{?proto.google.protobuf.Duration} */ (
    jspb.Message.getWrapperField(this, google_protobuf_duration_pb.Duration, 2));
};


/**
 * @param {?proto.google.protobuf.Duration|undefined} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
*/
proto.jungletv.MediaConsumptionCheckpoint.prototype.setCurrentPosition = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.clearCurrentPosition = function() {
  return this.setCurrentPosition(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.hasCurrentPosition = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional bool live_broadcast = 3;
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getLiveBroadcast = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.setLiveBroadcast = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};


/**
 * optional User requested_by = 4;
 * @return {?proto.jungletv.User}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getRequestedBy = function() {
  return /** @type{?proto.jungletv.User} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.User, 4));
};


/**
 * @param {?proto.jungletv.User|undefined} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
*/
proto.jungletv.MediaConsumptionCheckpoint.prototype.setRequestedBy = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.clearRequestedBy = function() {
  return this.setRequestedBy(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.hasRequestedBy = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string request_cost = 5;
 * @return {string}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getRequestCost = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.setRequestCost = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional uint32 currently_watching = 6;
 * @return {number}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getCurrentlyWatching = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.setCurrentlyWatching = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional string reward = 7;
 * @return {string}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.setReward = function(value) {
  return jspb.Message.setField(this, 7, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.clearReward = function() {
  return jspb.Message.setField(this, 7, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.hasReward = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional string reward_balance = 8;
 * @return {string}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getRewardBalance = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 8, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.setRewardBalance = function(value) {
  return jspb.Message.setField(this, 8, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.clearRewardBalance = function() {
  return jspb.Message.setField(this, 8, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.hasRewardBalance = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional ActivityChallenge activity_challenge = 9;
 * @return {?proto.jungletv.ActivityChallenge}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getActivityChallenge = function() {
  return /** @type{?proto.jungletv.ActivityChallenge} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.ActivityChallenge, 9));
};


/**
 * @param {?proto.jungletv.ActivityChallenge|undefined} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
*/
proto.jungletv.MediaConsumptionCheckpoint.prototype.setActivityChallenge = function(value) {
  return jspb.Message.setWrapperField(this, 9, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.clearActivityChallenge = function() {
  return this.setActivityChallenge(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.hasActivityChallenge = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional NowPlayingStubData stub_data = 10;
 * @return {?proto.jungletv.NowPlayingStubData}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getStubData = function() {
  return /** @type{?proto.jungletv.NowPlayingStubData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.NowPlayingStubData, 10));
};


/**
 * @param {?proto.jungletv.NowPlayingStubData|undefined} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
*/
proto.jungletv.MediaConsumptionCheckpoint.prototype.setStubData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 10, proto.jungletv.MediaConsumptionCheckpoint.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.clearStubData = function() {
  return this.setStubData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.hasStubData = function() {
  return jspb.Message.getField(this, 10) != null;
};


/**
 * optional NowPlayingYouTubeVideoData youtube_video_data = 11;
 * @return {?proto.jungletv.NowPlayingYouTubeVideoData}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getYoutubeVideoData = function() {
  return /** @type{?proto.jungletv.NowPlayingYouTubeVideoData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.NowPlayingYouTubeVideoData, 11));
};


/**
 * @param {?proto.jungletv.NowPlayingYouTubeVideoData|undefined} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
*/
proto.jungletv.MediaConsumptionCheckpoint.prototype.setYoutubeVideoData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 11, proto.jungletv.MediaConsumptionCheckpoint.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.clearYoutubeVideoData = function() {
  return this.setYoutubeVideoData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.hasYoutubeVideoData = function() {
  return jspb.Message.getField(this, 11) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ActivityChallenge.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ActivityChallenge.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ActivityChallenge} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ActivityChallenge.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    type: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ActivityChallenge}
 */
proto.jungletv.ActivityChallenge.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ActivityChallenge;
  return proto.jungletv.ActivityChallenge.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ActivityChallenge} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ActivityChallenge}
 */
proto.jungletv.ActivityChallenge.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ActivityChallenge.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ActivityChallenge.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ActivityChallenge} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ActivityChallenge.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.ActivityChallenge.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ActivityChallenge} returns this
 */
proto.jungletv.ActivityChallenge.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string type = 2;
 * @return {string}
 */
proto.jungletv.ActivityChallenge.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ActivityChallenge} returns this
 */
proto.jungletv.ActivityChallenge.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.MonitorQueueRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.MonitorQueueRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.MonitorQueueRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.MonitorQueueRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.MonitorQueueRequest}
 */
proto.jungletv.MonitorQueueRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.MonitorQueueRequest;
  return proto.jungletv.MonitorQueueRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.MonitorQueueRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.MonitorQueueRequest}
 */
proto.jungletv.MonitorQueueRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.MonitorQueueRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.MonitorQueueRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.MonitorQueueRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.MonitorQueueRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.Queue.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.Queue.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.Queue.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.Queue} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.Queue.toObject = function(includeInstance, msg) {
  var f, obj = {
    entriesList: jspb.Message.toObjectList(msg.getEntriesList(),
    proto.jungletv.QueueEntry.toObject, includeInstance),
    isHeartbeat: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.Queue}
 */
proto.jungletv.Queue.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.Queue;
  return proto.jungletv.Queue.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.Queue} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.Queue}
 */
proto.jungletv.Queue.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.QueueEntry;
      reader.readMessage(value,proto.jungletv.QueueEntry.deserializeBinaryFromReader);
      msg.addEntries(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsHeartbeat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.Queue.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.Queue.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.Queue} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.Queue.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEntriesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.jungletv.QueueEntry.serializeBinaryToWriter
    );
  }
  f = message.getIsHeartbeat();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * repeated QueueEntry entries = 1;
 * @return {!Array<!proto.jungletv.QueueEntry>}
 */
proto.jungletv.Queue.prototype.getEntriesList = function() {
  return /** @type{!Array<!proto.jungletv.QueueEntry>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jungletv.QueueEntry, 1));
};


/**
 * @param {!Array<!proto.jungletv.QueueEntry>} value
 * @return {!proto.jungletv.Queue} returns this
*/
proto.jungletv.Queue.prototype.setEntriesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.jungletv.QueueEntry=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jungletv.QueueEntry}
 */
proto.jungletv.Queue.prototype.addEntries = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.jungletv.QueueEntry, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.Queue} returns this
 */
proto.jungletv.Queue.prototype.clearEntriesList = function() {
  return this.setEntriesList([]);
};


/**
 * optional bool is_heartbeat = 2;
 * @return {boolean}
 */
proto.jungletv.Queue.prototype.getIsHeartbeat = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.Queue} returns this
 */
proto.jungletv.Queue.prototype.setIsHeartbeat = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.QueueYouTubeVideoData.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.QueueYouTubeVideoData.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.QueueYouTubeVideoData} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.QueueYouTubeVideoData.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    title: jspb.Message.getFieldWithDefault(msg, 2, ""),
    thumbnailUrl: jspb.Message.getFieldWithDefault(msg, 3, ""),
    channelTitle: jspb.Message.getFieldWithDefault(msg, 4, ""),
    liveBroadcast: jspb.Message.getBooleanFieldWithDefault(msg, 5, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.QueueYouTubeVideoData}
 */
proto.jungletv.QueueYouTubeVideoData.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.QueueYouTubeVideoData;
  return proto.jungletv.QueueYouTubeVideoData.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.QueueYouTubeVideoData} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.QueueYouTubeVideoData}
 */
proto.jungletv.QueueYouTubeVideoData.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setThumbnailUrl(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setChannelTitle(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setLiveBroadcast(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.QueueYouTubeVideoData.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.QueueYouTubeVideoData.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.QueueYouTubeVideoData} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.QueueYouTubeVideoData.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getThumbnailUrl();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getChannelTitle();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getLiveBroadcast();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.QueueYouTubeVideoData.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.QueueYouTubeVideoData} returns this
 */
proto.jungletv.QueueYouTubeVideoData.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string title = 2;
 * @return {string}
 */
proto.jungletv.QueueYouTubeVideoData.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.QueueYouTubeVideoData} returns this
 */
proto.jungletv.QueueYouTubeVideoData.prototype.setTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string thumbnail_url = 3;
 * @return {string}
 */
proto.jungletv.QueueYouTubeVideoData.prototype.getThumbnailUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.QueueYouTubeVideoData} returns this
 */
proto.jungletv.QueueYouTubeVideoData.prototype.setThumbnailUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string channel_title = 4;
 * @return {string}
 */
proto.jungletv.QueueYouTubeVideoData.prototype.getChannelTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.QueueYouTubeVideoData} returns this
 */
proto.jungletv.QueueYouTubeVideoData.prototype.setChannelTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional bool live_broadcast = 5;
 * @return {boolean}
 */
proto.jungletv.QueueYouTubeVideoData.prototype.getLiveBroadcast = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.QueueYouTubeVideoData} returns this
 */
proto.jungletv.QueueYouTubeVideoData.prototype.setLiveBroadcast = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.QueueEntry.oneofGroups_ = [[7]];

/**
 * @enum {number}
 */
proto.jungletv.QueueEntry.MediaInfoCase = {
  MEDIA_INFO_NOT_SET: 0,
  YOUTUBE_VIDEO_DATA: 7
};

/**
 * @return {proto.jungletv.QueueEntry.MediaInfoCase}
 */
proto.jungletv.QueueEntry.prototype.getMediaInfoCase = function() {
  return /** @type {proto.jungletv.QueueEntry.MediaInfoCase} */(jspb.Message.computeOneofCase(this, proto.jungletv.QueueEntry.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.QueueEntry.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.QueueEntry.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.QueueEntry} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.QueueEntry.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    requestedBy: (f = msg.getRequestedBy()) && proto.jungletv.User.toObject(includeInstance, f),
    requestCost: jspb.Message.getFieldWithDefault(msg, 3, ""),
    requestedAt: (f = msg.getRequestedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    length: (f = msg.getLength()) && google_protobuf_duration_pb.Duration.toObject(includeInstance, f),
    unskippable: jspb.Message.getBooleanFieldWithDefault(msg, 6, false),
    youtubeVideoData: (f = msg.getYoutubeVideoData()) && proto.jungletv.QueueYouTubeVideoData.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.QueueEntry}
 */
proto.jungletv.QueueEntry.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.QueueEntry;
  return proto.jungletv.QueueEntry.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.QueueEntry} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.QueueEntry}
 */
proto.jungletv.QueueEntry.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = new proto.jungletv.User;
      reader.readMessage(value,proto.jungletv.User.deserializeBinaryFromReader);
      msg.setRequestedBy(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setRequestCost(value);
      break;
    case 4:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setRequestedAt(value);
      break;
    case 5:
      var value = new google_protobuf_duration_pb.Duration;
      reader.readMessage(value,google_protobuf_duration_pb.Duration.deserializeBinaryFromReader);
      msg.setLength(value);
      break;
    case 6:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setUnskippable(value);
      break;
    case 7:
      var value = new proto.jungletv.QueueYouTubeVideoData;
      reader.readMessage(value,proto.jungletv.QueueYouTubeVideoData.deserializeBinaryFromReader);
      msg.setYoutubeVideoData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.QueueEntry.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.QueueEntry.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.QueueEntry} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.QueueEntry.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRequestedBy();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.jungletv.User.serializeBinaryToWriter
    );
  }
  f = message.getRequestCost();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getRequestedAt();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getLength();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      google_protobuf_duration_pb.Duration.serializeBinaryToWriter
    );
  }
  f = message.getUnskippable();
  if (f) {
    writer.writeBool(
      6,
      f
    );
  }
  f = message.getYoutubeVideoData();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.jungletv.QueueYouTubeVideoData.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.QueueEntry.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.QueueEntry} returns this
 */
proto.jungletv.QueueEntry.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional User requested_by = 2;
 * @return {?proto.jungletv.User}
 */
proto.jungletv.QueueEntry.prototype.getRequestedBy = function() {
  return /** @type{?proto.jungletv.User} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.User, 2));
};


/**
 * @param {?proto.jungletv.User|undefined} value
 * @return {!proto.jungletv.QueueEntry} returns this
*/
proto.jungletv.QueueEntry.prototype.setRequestedBy = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.QueueEntry} returns this
 */
proto.jungletv.QueueEntry.prototype.clearRequestedBy = function() {
  return this.setRequestedBy(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.QueueEntry.prototype.hasRequestedBy = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional string request_cost = 3;
 * @return {string}
 */
proto.jungletv.QueueEntry.prototype.getRequestCost = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.QueueEntry} returns this
 */
proto.jungletv.QueueEntry.prototype.setRequestCost = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional google.protobuf.Timestamp requested_at = 4;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.QueueEntry.prototype.getRequestedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 4));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.QueueEntry} returns this
*/
proto.jungletv.QueueEntry.prototype.setRequestedAt = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.QueueEntry} returns this
 */
proto.jungletv.QueueEntry.prototype.clearRequestedAt = function() {
  return this.setRequestedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.QueueEntry.prototype.hasRequestedAt = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional google.protobuf.Duration length = 5;
 * @return {?proto.google.protobuf.Duration}
 */
proto.jungletv.QueueEntry.prototype.getLength = function() {
  return /** @type{?proto.google.protobuf.Duration} */ (
    jspb.Message.getWrapperField(this, google_protobuf_duration_pb.Duration, 5));
};


/**
 * @param {?proto.google.protobuf.Duration|undefined} value
 * @return {!proto.jungletv.QueueEntry} returns this
*/
proto.jungletv.QueueEntry.prototype.setLength = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.QueueEntry} returns this
 */
proto.jungletv.QueueEntry.prototype.clearLength = function() {
  return this.setLength(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.QueueEntry.prototype.hasLength = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional bool unskippable = 6;
 * @return {boolean}
 */
proto.jungletv.QueueEntry.prototype.getUnskippable = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 6, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.QueueEntry} returns this
 */
proto.jungletv.QueueEntry.prototype.setUnskippable = function(value) {
  return jspb.Message.setProto3BooleanField(this, 6, value);
};


/**
 * optional QueueYouTubeVideoData youtube_video_data = 7;
 * @return {?proto.jungletv.QueueYouTubeVideoData}
 */
proto.jungletv.QueueEntry.prototype.getYoutubeVideoData = function() {
  return /** @type{?proto.jungletv.QueueYouTubeVideoData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.QueueYouTubeVideoData, 7));
};


/**
 * @param {?proto.jungletv.QueueYouTubeVideoData|undefined} value
 * @return {!proto.jungletv.QueueEntry} returns this
*/
proto.jungletv.QueueEntry.prototype.setYoutubeVideoData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 7, proto.jungletv.QueueEntry.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.QueueEntry} returns this
 */
proto.jungletv.QueueEntry.prototype.clearYoutubeVideoData = function() {
  return this.setYoutubeVideoData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.QueueEntry.prototype.hasYoutubeVideoData = function() {
  return jspb.Message.getField(this, 7) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.MonitorSkipAndTipRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.MonitorSkipAndTipRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.MonitorSkipAndTipRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.MonitorSkipAndTipRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.MonitorSkipAndTipRequest}
 */
proto.jungletv.MonitorSkipAndTipRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.MonitorSkipAndTipRequest;
  return proto.jungletv.MonitorSkipAndTipRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.MonitorSkipAndTipRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.MonitorSkipAndTipRequest}
 */
proto.jungletv.MonitorSkipAndTipRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.MonitorSkipAndTipRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.MonitorSkipAndTipRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.MonitorSkipAndTipRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.MonitorSkipAndTipRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SkipAndTipStatus.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SkipAndTipStatus.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SkipAndTipStatus} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SkipAndTipStatus.toObject = function(includeInstance, msg) {
  var f, obj = {
    skipStatus: jspb.Message.getFieldWithDefault(msg, 1, 0),
    skipAddress: jspb.Message.getFieldWithDefault(msg, 2, ""),
    skipBalance: jspb.Message.getFieldWithDefault(msg, 3, ""),
    skipThreshold: jspb.Message.getFieldWithDefault(msg, 4, ""),
    rainAddress: jspb.Message.getFieldWithDefault(msg, 5, ""),
    rainBalance: jspb.Message.getFieldWithDefault(msg, 6, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SkipAndTipStatus}
 */
proto.jungletv.SkipAndTipStatus.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SkipAndTipStatus;
  return proto.jungletv.SkipAndTipStatus.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SkipAndTipStatus} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SkipAndTipStatus}
 */
proto.jungletv.SkipAndTipStatus.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.jungletv.SkipStatus} */ (reader.readEnum());
      msg.setSkipStatus(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSkipAddress(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setSkipBalance(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setSkipThreshold(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setRainAddress(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setRainBalance(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SkipAndTipStatus.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SkipAndTipStatus.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SkipAndTipStatus} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SkipAndTipStatus.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSkipStatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getSkipAddress();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getSkipBalance();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getSkipThreshold();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getRainAddress();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getRainBalance();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
};


/**
 * optional SkipStatus skip_status = 1;
 * @return {!proto.jungletv.SkipStatus}
 */
proto.jungletv.SkipAndTipStatus.prototype.getSkipStatus = function() {
  return /** @type {!proto.jungletv.SkipStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.jungletv.SkipStatus} value
 * @return {!proto.jungletv.SkipAndTipStatus} returns this
 */
proto.jungletv.SkipAndTipStatus.prototype.setSkipStatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional string skip_address = 2;
 * @return {string}
 */
proto.jungletv.SkipAndTipStatus.prototype.getSkipAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SkipAndTipStatus} returns this
 */
proto.jungletv.SkipAndTipStatus.prototype.setSkipAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string skip_balance = 3;
 * @return {string}
 */
proto.jungletv.SkipAndTipStatus.prototype.getSkipBalance = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SkipAndTipStatus} returns this
 */
proto.jungletv.SkipAndTipStatus.prototype.setSkipBalance = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string skip_threshold = 4;
 * @return {string}
 */
proto.jungletv.SkipAndTipStatus.prototype.getSkipThreshold = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SkipAndTipStatus} returns this
 */
proto.jungletv.SkipAndTipStatus.prototype.setSkipThreshold = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string rain_address = 5;
 * @return {string}
 */
proto.jungletv.SkipAndTipStatus.prototype.getRainAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SkipAndTipStatus} returns this
 */
proto.jungletv.SkipAndTipStatus.prototype.setRainAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string rain_balance = 6;
 * @return {string}
 */
proto.jungletv.SkipAndTipStatus.prototype.getRainBalance = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SkipAndTipStatus} returns this
 */
proto.jungletv.SkipAndTipStatus.prototype.setRainBalance = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.User.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.User.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.User.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.User} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.User.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: jspb.Message.getFieldWithDefault(msg, 1, ""),
    rolesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
    nickname: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.User}
 */
proto.jungletv.User.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.User;
  return proto.jungletv.User.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.User} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.User}
 */
proto.jungletv.User.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 2:
      var values = /** @type {!Array<!proto.jungletv.UserRole>} */ (reader.isDelimited() ? reader.readPackedEnum() : [reader.readEnum()]);
      for (var i = 0; i < values.length; i++) {
        msg.addRoles(values[i]);
      }
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setNickname(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.User.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.User.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.User} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.User.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRolesList();
  if (f.length > 0) {
    writer.writePackedEnum(
      2,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string address = 1;
 * @return {string}
 */
proto.jungletv.User.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.User} returns this
 */
proto.jungletv.User.prototype.setAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated UserRole roles = 2;
 * @return {!Array<!proto.jungletv.UserRole>}
 */
proto.jungletv.User.prototype.getRolesList = function() {
  return /** @type {!Array<!proto.jungletv.UserRole>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<!proto.jungletv.UserRole>} value
 * @return {!proto.jungletv.User} returns this
 */
proto.jungletv.User.prototype.setRolesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {!proto.jungletv.UserRole} value
 * @param {number=} opt_index
 * @return {!proto.jungletv.User} returns this
 */
proto.jungletv.User.prototype.addRoles = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.User} returns this
 */
proto.jungletv.User.prototype.clearRolesList = function() {
  return this.setRolesList([]);
};


/**
 * optional string nickname = 3;
 * @return {string}
 */
proto.jungletv.User.prototype.getNickname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.User} returns this
 */
proto.jungletv.User.prototype.setNickname = function(value) {
  return jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.jungletv.User} returns this
 */
proto.jungletv.User.prototype.clearNickname = function() {
  return jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.User.prototype.hasNickname = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RewardInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RewardInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RewardInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RewardInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RewardInfoRequest}
 */
proto.jungletv.RewardInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RewardInfoRequest;
  return proto.jungletv.RewardInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RewardInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RewardInfoRequest}
 */
proto.jungletv.RewardInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RewardInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RewardInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RewardInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RewardInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RewardInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RewardInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RewardInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RewardInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    rewardAddress: jspb.Message.getFieldWithDefault(msg, 1, ""),
    rewardBalance: jspb.Message.getFieldWithDefault(msg, 2, ""),
    withdrawalPending: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
    badRepresentative: jspb.Message.getBooleanFieldWithDefault(msg, 4, false),
    withdrawalPositionInQueue: jspb.Message.getFieldWithDefault(msg, 5, 0),
    withdrawalsInQueue: jspb.Message.getFieldWithDefault(msg, 6, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RewardInfoResponse}
 */
proto.jungletv.RewardInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RewardInfoResponse;
  return proto.jungletv.RewardInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RewardInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RewardInfoResponse}
 */
proto.jungletv.RewardInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setRewardAddress(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setRewardBalance(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setWithdrawalPending(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setBadRepresentative(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setWithdrawalPositionInQueue(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setWithdrawalsInQueue(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RewardInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RewardInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RewardInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RewardInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRewardAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRewardBalance();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getWithdrawalPending();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getBadRepresentative();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 5));
  if (f != null) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 6));
  if (f != null) {
    writer.writeInt32(
      6,
      f
    );
  }
};


/**
 * optional string reward_address = 1;
 * @return {string}
 */
proto.jungletv.RewardInfoResponse.prototype.getRewardAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.RewardInfoResponse} returns this
 */
proto.jungletv.RewardInfoResponse.prototype.setRewardAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string reward_balance = 2;
 * @return {string}
 */
proto.jungletv.RewardInfoResponse.prototype.getRewardBalance = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.RewardInfoResponse} returns this
 */
proto.jungletv.RewardInfoResponse.prototype.setRewardBalance = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool withdrawal_pending = 3;
 * @return {boolean}
 */
proto.jungletv.RewardInfoResponse.prototype.getWithdrawalPending = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.RewardInfoResponse} returns this
 */
proto.jungletv.RewardInfoResponse.prototype.setWithdrawalPending = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};


/**
 * optional bool bad_representative = 4;
 * @return {boolean}
 */
proto.jungletv.RewardInfoResponse.prototype.getBadRepresentative = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 4, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.RewardInfoResponse} returns this
 */
proto.jungletv.RewardInfoResponse.prototype.setBadRepresentative = function(value) {
  return jspb.Message.setProto3BooleanField(this, 4, value);
};


/**
 * optional int32 withdrawal_position_in_queue = 5;
 * @return {number}
 */
proto.jungletv.RewardInfoResponse.prototype.getWithdrawalPositionInQueue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.RewardInfoResponse} returns this
 */
proto.jungletv.RewardInfoResponse.prototype.setWithdrawalPositionInQueue = function(value) {
  return jspb.Message.setField(this, 5, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.jungletv.RewardInfoResponse} returns this
 */
proto.jungletv.RewardInfoResponse.prototype.clearWithdrawalPositionInQueue = function() {
  return jspb.Message.setField(this, 5, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.RewardInfoResponse.prototype.hasWithdrawalPositionInQueue = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional int32 withdrawals_in_queue = 6;
 * @return {number}
 */
proto.jungletv.RewardInfoResponse.prototype.getWithdrawalsInQueue = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.RewardInfoResponse} returns this
 */
proto.jungletv.RewardInfoResponse.prototype.setWithdrawalsInQueue = function(value) {
  return jspb.Message.setField(this, 6, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.jungletv.RewardInfoResponse} returns this
 */
proto.jungletv.RewardInfoResponse.prototype.clearWithdrawalsInQueue = function() {
  return jspb.Message.setField(this, 6, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.RewardInfoResponse.prototype.hasWithdrawalsInQueue = function() {
  return jspb.Message.getField(this, 6) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RemoveQueueEntryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RemoveQueueEntryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RemoveQueueEntryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveQueueEntryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RemoveQueueEntryRequest}
 */
proto.jungletv.RemoveQueueEntryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RemoveQueueEntryRequest;
  return proto.jungletv.RemoveQueueEntryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RemoveQueueEntryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RemoveQueueEntryRequest}
 */
proto.jungletv.RemoveQueueEntryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RemoveQueueEntryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RemoveQueueEntryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RemoveQueueEntryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveQueueEntryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.RemoveQueueEntryRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.RemoveQueueEntryRequest} returns this
 */
proto.jungletv.RemoveQueueEntryRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RemoveQueueEntryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RemoveQueueEntryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RemoveQueueEntryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveQueueEntryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RemoveQueueEntryResponse}
 */
proto.jungletv.RemoveQueueEntryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RemoveQueueEntryResponse;
  return proto.jungletv.RemoveQueueEntryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RemoveQueueEntryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RemoveQueueEntryResponse}
 */
proto.jungletv.RemoveQueueEntryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RemoveQueueEntryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RemoveQueueEntryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RemoveQueueEntryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveQueueEntryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ForciblyEnqueueTicketRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ForciblyEnqueueTicketRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ForciblyEnqueueTicketRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ForciblyEnqueueTicketRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    enqueueType: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ForciblyEnqueueTicketRequest}
 */
proto.jungletv.ForciblyEnqueueTicketRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ForciblyEnqueueTicketRequest;
  return proto.jungletv.ForciblyEnqueueTicketRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ForciblyEnqueueTicketRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ForciblyEnqueueTicketRequest}
 */
proto.jungletv.ForciblyEnqueueTicketRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {!proto.jungletv.ForcedTicketEnqueueType} */ (reader.readEnum());
      msg.setEnqueueType(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ForciblyEnqueueTicketRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ForciblyEnqueueTicketRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ForciblyEnqueueTicketRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ForciblyEnqueueTicketRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getEnqueueType();
  if (f !== 0.0) {
    writer.writeEnum(
      2,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.ForciblyEnqueueTicketRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ForciblyEnqueueTicketRequest} returns this
 */
proto.jungletv.ForciblyEnqueueTicketRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional ForcedTicketEnqueueType enqueue_type = 2;
 * @return {!proto.jungletv.ForcedTicketEnqueueType}
 */
proto.jungletv.ForciblyEnqueueTicketRequest.prototype.getEnqueueType = function() {
  return /** @type {!proto.jungletv.ForcedTicketEnqueueType} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {!proto.jungletv.ForcedTicketEnqueueType} value
 * @return {!proto.jungletv.ForciblyEnqueueTicketRequest} returns this
 */
proto.jungletv.ForciblyEnqueueTicketRequest.prototype.setEnqueueType = function(value) {
  return jspb.Message.setProto3EnumField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ForciblyEnqueueTicketResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ForciblyEnqueueTicketResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ForciblyEnqueueTicketResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ForciblyEnqueueTicketResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ForciblyEnqueueTicketResponse}
 */
proto.jungletv.ForciblyEnqueueTicketResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ForciblyEnqueueTicketResponse;
  return proto.jungletv.ForciblyEnqueueTicketResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ForciblyEnqueueTicketResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ForciblyEnqueueTicketResponse}
 */
proto.jungletv.ForciblyEnqueueTicketResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ForciblyEnqueueTicketResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ForciblyEnqueueTicketResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ForciblyEnqueueTicketResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ForciblyEnqueueTicketResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SubmitActivityChallengeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SubmitActivityChallengeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SubmitActivityChallengeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SubmitActivityChallengeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    challenge: jspb.Message.getFieldWithDefault(msg, 1, ""),
    captchaResponse: jspb.Message.getFieldWithDefault(msg, 2, ""),
    trusted: jspb.Message.getBooleanFieldWithDefault(msg, 3, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SubmitActivityChallengeRequest}
 */
proto.jungletv.SubmitActivityChallengeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SubmitActivityChallengeRequest;
  return proto.jungletv.SubmitActivityChallengeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SubmitActivityChallengeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SubmitActivityChallengeRequest}
 */
proto.jungletv.SubmitActivityChallengeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setChallenge(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setCaptchaResponse(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setTrusted(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SubmitActivityChallengeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SubmitActivityChallengeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SubmitActivityChallengeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SubmitActivityChallengeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChallenge();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getCaptchaResponse();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getTrusted();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
};


/**
 * optional string challenge = 1;
 * @return {string}
 */
proto.jungletv.SubmitActivityChallengeRequest.prototype.getChallenge = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SubmitActivityChallengeRequest} returns this
 */
proto.jungletv.SubmitActivityChallengeRequest.prototype.setChallenge = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string captcha_response = 2;
 * @return {string}
 */
proto.jungletv.SubmitActivityChallengeRequest.prototype.getCaptchaResponse = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SubmitActivityChallengeRequest} returns this
 */
proto.jungletv.SubmitActivityChallengeRequest.prototype.setCaptchaResponse = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool trusted = 3;
 * @return {boolean}
 */
proto.jungletv.SubmitActivityChallengeRequest.prototype.getTrusted = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.SubmitActivityChallengeRequest} returns this
 */
proto.jungletv.SubmitActivityChallengeRequest.prototype.setTrusted = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SubmitActivityChallengeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SubmitActivityChallengeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SubmitActivityChallengeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SubmitActivityChallengeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SubmitActivityChallengeResponse}
 */
proto.jungletv.SubmitActivityChallengeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SubmitActivityChallengeResponse;
  return proto.jungletv.SubmitActivityChallengeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SubmitActivityChallengeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SubmitActivityChallengeResponse}
 */
proto.jungletv.SubmitActivityChallengeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SubmitActivityChallengeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SubmitActivityChallengeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SubmitActivityChallengeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SubmitActivityChallengeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ConsumeChatRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ConsumeChatRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ConsumeChatRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ConsumeChatRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    initialHistorySize: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ConsumeChatRequest}
 */
proto.jungletv.ConsumeChatRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ConsumeChatRequest;
  return proto.jungletv.ConsumeChatRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ConsumeChatRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ConsumeChatRequest}
 */
proto.jungletv.ConsumeChatRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setInitialHistorySize(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ConsumeChatRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ConsumeChatRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ConsumeChatRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ConsumeChatRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInitialHistorySize();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
};


/**
 * optional uint32 initial_history_size = 1;
 * @return {number}
 */
proto.jungletv.ConsumeChatRequest.prototype.getInitialHistorySize = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.ConsumeChatRequest} returns this
 */
proto.jungletv.ConsumeChatRequest.prototype.setInitialHistorySize = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.ChatUpdate.oneofGroups_ = [[1,2,3,4,5]];

/**
 * @enum {number}
 */
proto.jungletv.ChatUpdate.EventCase = {
  EVENT_NOT_SET: 0,
  DISABLED: 1,
  ENABLED: 2,
  MESSAGE_CREATED: 3,
  MESSAGE_DELETED: 4,
  HEARTBEAT: 5
};

/**
 * @return {proto.jungletv.ChatUpdate.EventCase}
 */
proto.jungletv.ChatUpdate.prototype.getEventCase = function() {
  return /** @type {proto.jungletv.ChatUpdate.EventCase} */(jspb.Message.computeOneofCase(this, proto.jungletv.ChatUpdate.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ChatUpdate.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ChatUpdate.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ChatUpdate} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatUpdate.toObject = function(includeInstance, msg) {
  var f, obj = {
    disabled: (f = msg.getDisabled()) && proto.jungletv.ChatDisabledEvent.toObject(includeInstance, f),
    enabled: (f = msg.getEnabled()) && proto.jungletv.ChatEnabledEvent.toObject(includeInstance, f),
    messageCreated: (f = msg.getMessageCreated()) && proto.jungletv.ChatMessageCreatedEvent.toObject(includeInstance, f),
    messageDeleted: (f = msg.getMessageDeleted()) && proto.jungletv.ChatMessageDeletedEvent.toObject(includeInstance, f),
    heartbeat: (f = msg.getHeartbeat()) && proto.jungletv.ChatHeartbeatEvent.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ChatUpdate}
 */
proto.jungletv.ChatUpdate.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ChatUpdate;
  return proto.jungletv.ChatUpdate.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ChatUpdate} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ChatUpdate}
 */
proto.jungletv.ChatUpdate.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.ChatDisabledEvent;
      reader.readMessage(value,proto.jungletv.ChatDisabledEvent.deserializeBinaryFromReader);
      msg.setDisabled(value);
      break;
    case 2:
      var value = new proto.jungletv.ChatEnabledEvent;
      reader.readMessage(value,proto.jungletv.ChatEnabledEvent.deserializeBinaryFromReader);
      msg.setEnabled(value);
      break;
    case 3:
      var value = new proto.jungletv.ChatMessageCreatedEvent;
      reader.readMessage(value,proto.jungletv.ChatMessageCreatedEvent.deserializeBinaryFromReader);
      msg.setMessageCreated(value);
      break;
    case 4:
      var value = new proto.jungletv.ChatMessageDeletedEvent;
      reader.readMessage(value,proto.jungletv.ChatMessageDeletedEvent.deserializeBinaryFromReader);
      msg.setMessageDeleted(value);
      break;
    case 5:
      var value = new proto.jungletv.ChatHeartbeatEvent;
      reader.readMessage(value,proto.jungletv.ChatHeartbeatEvent.deserializeBinaryFromReader);
      msg.setHeartbeat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ChatUpdate.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ChatUpdate.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ChatUpdate} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatUpdate.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDisabled();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.jungletv.ChatDisabledEvent.serializeBinaryToWriter
    );
  }
  f = message.getEnabled();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.jungletv.ChatEnabledEvent.serializeBinaryToWriter
    );
  }
  f = message.getMessageCreated();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.jungletv.ChatMessageCreatedEvent.serializeBinaryToWriter
    );
  }
  f = message.getMessageDeleted();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.jungletv.ChatMessageDeletedEvent.serializeBinaryToWriter
    );
  }
  f = message.getHeartbeat();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.jungletv.ChatHeartbeatEvent.serializeBinaryToWriter
    );
  }
};


/**
 * optional ChatDisabledEvent disabled = 1;
 * @return {?proto.jungletv.ChatDisabledEvent}
 */
proto.jungletv.ChatUpdate.prototype.getDisabled = function() {
  return /** @type{?proto.jungletv.ChatDisabledEvent} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.ChatDisabledEvent, 1));
};


/**
 * @param {?proto.jungletv.ChatDisabledEvent|undefined} value
 * @return {!proto.jungletv.ChatUpdate} returns this
*/
proto.jungletv.ChatUpdate.prototype.setDisabled = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.jungletv.ChatUpdate.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ChatUpdate} returns this
 */
proto.jungletv.ChatUpdate.prototype.clearDisabled = function() {
  return this.setDisabled(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ChatUpdate.prototype.hasDisabled = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ChatEnabledEvent enabled = 2;
 * @return {?proto.jungletv.ChatEnabledEvent}
 */
proto.jungletv.ChatUpdate.prototype.getEnabled = function() {
  return /** @type{?proto.jungletv.ChatEnabledEvent} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.ChatEnabledEvent, 2));
};


/**
 * @param {?proto.jungletv.ChatEnabledEvent|undefined} value
 * @return {!proto.jungletv.ChatUpdate} returns this
*/
proto.jungletv.ChatUpdate.prototype.setEnabled = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.jungletv.ChatUpdate.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ChatUpdate} returns this
 */
proto.jungletv.ChatUpdate.prototype.clearEnabled = function() {
  return this.setEnabled(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ChatUpdate.prototype.hasEnabled = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional ChatMessageCreatedEvent message_created = 3;
 * @return {?proto.jungletv.ChatMessageCreatedEvent}
 */
proto.jungletv.ChatUpdate.prototype.getMessageCreated = function() {
  return /** @type{?proto.jungletv.ChatMessageCreatedEvent} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.ChatMessageCreatedEvent, 3));
};


/**
 * @param {?proto.jungletv.ChatMessageCreatedEvent|undefined} value
 * @return {!proto.jungletv.ChatUpdate} returns this
*/
proto.jungletv.ChatUpdate.prototype.setMessageCreated = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.jungletv.ChatUpdate.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ChatUpdate} returns this
 */
proto.jungletv.ChatUpdate.prototype.clearMessageCreated = function() {
  return this.setMessageCreated(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ChatUpdate.prototype.hasMessageCreated = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional ChatMessageDeletedEvent message_deleted = 4;
 * @return {?proto.jungletv.ChatMessageDeletedEvent}
 */
proto.jungletv.ChatUpdate.prototype.getMessageDeleted = function() {
  return /** @type{?proto.jungletv.ChatMessageDeletedEvent} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.ChatMessageDeletedEvent, 4));
};


/**
 * @param {?proto.jungletv.ChatMessageDeletedEvent|undefined} value
 * @return {!proto.jungletv.ChatUpdate} returns this
*/
proto.jungletv.ChatUpdate.prototype.setMessageDeleted = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.jungletv.ChatUpdate.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ChatUpdate} returns this
 */
proto.jungletv.ChatUpdate.prototype.clearMessageDeleted = function() {
  return this.setMessageDeleted(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ChatUpdate.prototype.hasMessageDeleted = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional ChatHeartbeatEvent heartbeat = 5;
 * @return {?proto.jungletv.ChatHeartbeatEvent}
 */
proto.jungletv.ChatUpdate.prototype.getHeartbeat = function() {
  return /** @type{?proto.jungletv.ChatHeartbeatEvent} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.ChatHeartbeatEvent, 5));
};


/**
 * @param {?proto.jungletv.ChatHeartbeatEvent|undefined} value
 * @return {!proto.jungletv.ChatUpdate} returns this
*/
proto.jungletv.ChatUpdate.prototype.setHeartbeat = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.jungletv.ChatUpdate.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ChatUpdate} returns this
 */
proto.jungletv.ChatUpdate.prototype.clearHeartbeat = function() {
  return this.setHeartbeat(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ChatUpdate.prototype.hasHeartbeat = function() {
  return jspb.Message.getField(this, 5) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.ChatMessage.oneofGroups_ = [[3,4]];

/**
 * @enum {number}
 */
proto.jungletv.ChatMessage.MessageCase = {
  MESSAGE_NOT_SET: 0,
  USER_MESSAGE: 3,
  SYSTEM_MESSAGE: 4
};

/**
 * @return {proto.jungletv.ChatMessage.MessageCase}
 */
proto.jungletv.ChatMessage.prototype.getMessageCase = function() {
  return /** @type {proto.jungletv.ChatMessage.MessageCase} */(jspb.Message.computeOneofCase(this, proto.jungletv.ChatMessage.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ChatMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ChatMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ChatMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "0"),
    createdAt: (f = msg.getCreatedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    userMessage: (f = msg.getUserMessage()) && proto.jungletv.UserChatMessage.toObject(includeInstance, f),
    systemMessage: (f = msg.getSystemMessage()) && proto.jungletv.SystemChatMessage.toObject(includeInstance, f),
    reference: (f = msg.getReference()) && proto.jungletv.ChatMessage.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ChatMessage}
 */
proto.jungletv.ChatMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ChatMessage;
  return proto.jungletv.ChatMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ChatMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ChatMessage}
 */
proto.jungletv.ChatMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readInt64String());
      msg.setId(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedAt(value);
      break;
    case 3:
      var value = new proto.jungletv.UserChatMessage;
      reader.readMessage(value,proto.jungletv.UserChatMessage.deserializeBinaryFromReader);
      msg.setUserMessage(value);
      break;
    case 4:
      var value = new proto.jungletv.SystemChatMessage;
      reader.readMessage(value,proto.jungletv.SystemChatMessage.deserializeBinaryFromReader);
      msg.setSystemMessage(value);
      break;
    case 5:
      var value = new proto.jungletv.ChatMessage;
      reader.readMessage(value,proto.jungletv.ChatMessage.deserializeBinaryFromReader);
      msg.setReference(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ChatMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ChatMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ChatMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (parseInt(f, 10) !== 0) {
    writer.writeInt64String(
      1,
      f
    );
  }
  f = message.getCreatedAt();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getUserMessage();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.jungletv.UserChatMessage.serializeBinaryToWriter
    );
  }
  f = message.getSystemMessage();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.jungletv.SystemChatMessage.serializeBinaryToWriter
    );
  }
  f = message.getReference();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.jungletv.ChatMessage.serializeBinaryToWriter
    );
  }
};


/**
 * optional int64 id = 1;
 * @return {string}
 */
proto.jungletv.ChatMessage.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, "0"));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ChatMessage} returns this
 */
proto.jungletv.ChatMessage.prototype.setId = function(value) {
  return jspb.Message.setProto3StringIntField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp created_at = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.ChatMessage.prototype.getCreatedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.ChatMessage} returns this
*/
proto.jungletv.ChatMessage.prototype.setCreatedAt = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ChatMessage} returns this
 */
proto.jungletv.ChatMessage.prototype.clearCreatedAt = function() {
  return this.setCreatedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ChatMessage.prototype.hasCreatedAt = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional UserChatMessage user_message = 3;
 * @return {?proto.jungletv.UserChatMessage}
 */
proto.jungletv.ChatMessage.prototype.getUserMessage = function() {
  return /** @type{?proto.jungletv.UserChatMessage} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.UserChatMessage, 3));
};


/**
 * @param {?proto.jungletv.UserChatMessage|undefined} value
 * @return {!proto.jungletv.ChatMessage} returns this
*/
proto.jungletv.ChatMessage.prototype.setUserMessage = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.jungletv.ChatMessage.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ChatMessage} returns this
 */
proto.jungletv.ChatMessage.prototype.clearUserMessage = function() {
  return this.setUserMessage(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ChatMessage.prototype.hasUserMessage = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional SystemChatMessage system_message = 4;
 * @return {?proto.jungletv.SystemChatMessage}
 */
proto.jungletv.ChatMessage.prototype.getSystemMessage = function() {
  return /** @type{?proto.jungletv.SystemChatMessage} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.SystemChatMessage, 4));
};


/**
 * @param {?proto.jungletv.SystemChatMessage|undefined} value
 * @return {!proto.jungletv.ChatMessage} returns this
*/
proto.jungletv.ChatMessage.prototype.setSystemMessage = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.jungletv.ChatMessage.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ChatMessage} returns this
 */
proto.jungletv.ChatMessage.prototype.clearSystemMessage = function() {
  return this.setSystemMessage(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ChatMessage.prototype.hasSystemMessage = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional ChatMessage reference = 5;
 * @return {?proto.jungletv.ChatMessage}
 */
proto.jungletv.ChatMessage.prototype.getReference = function() {
  return /** @type{?proto.jungletv.ChatMessage} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.ChatMessage, 5));
};


/**
 * @param {?proto.jungletv.ChatMessage|undefined} value
 * @return {!proto.jungletv.ChatMessage} returns this
*/
proto.jungletv.ChatMessage.prototype.setReference = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ChatMessage} returns this
 */
proto.jungletv.ChatMessage.prototype.clearReference = function() {
  return this.setReference(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ChatMessage.prototype.hasReference = function() {
  return jspb.Message.getField(this, 5) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.UserChatMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.UserChatMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.UserChatMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UserChatMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    author: (f = msg.getAuthor()) && proto.jungletv.User.toObject(includeInstance, f),
    content: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.UserChatMessage}
 */
proto.jungletv.UserChatMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.UserChatMessage;
  return proto.jungletv.UserChatMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.UserChatMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.UserChatMessage}
 */
proto.jungletv.UserChatMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.User;
      reader.readMessage(value,proto.jungletv.User.deserializeBinaryFromReader);
      msg.setAuthor(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setContent(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.UserChatMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.UserChatMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.UserChatMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UserChatMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAuthor();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.jungletv.User.serializeBinaryToWriter
    );
  }
  f = message.getContent();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional User author = 1;
 * @return {?proto.jungletv.User}
 */
proto.jungletv.UserChatMessage.prototype.getAuthor = function() {
  return /** @type{?proto.jungletv.User} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.User, 1));
};


/**
 * @param {?proto.jungletv.User|undefined} value
 * @return {!proto.jungletv.UserChatMessage} returns this
*/
proto.jungletv.UserChatMessage.prototype.setAuthor = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.UserChatMessage} returns this
 */
proto.jungletv.UserChatMessage.prototype.clearAuthor = function() {
  return this.setAuthor(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.UserChatMessage.prototype.hasAuthor = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string content = 2;
 * @return {string}
 */
proto.jungletv.UserChatMessage.prototype.getContent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.UserChatMessage} returns this
 */
proto.jungletv.UserChatMessage.prototype.setContent = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SystemChatMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SystemChatMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SystemChatMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SystemChatMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    content: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SystemChatMessage}
 */
proto.jungletv.SystemChatMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SystemChatMessage;
  return proto.jungletv.SystemChatMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SystemChatMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SystemChatMessage}
 */
proto.jungletv.SystemChatMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setContent(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SystemChatMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SystemChatMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SystemChatMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SystemChatMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getContent();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string content = 1;
 * @return {string}
 */
proto.jungletv.SystemChatMessage.prototype.getContent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SystemChatMessage} returns this
 */
proto.jungletv.SystemChatMessage.prototype.setContent = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ChatDisabledEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ChatDisabledEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ChatDisabledEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatDisabledEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    reason: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ChatDisabledEvent}
 */
proto.jungletv.ChatDisabledEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ChatDisabledEvent;
  return proto.jungletv.ChatDisabledEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ChatDisabledEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ChatDisabledEvent}
 */
proto.jungletv.ChatDisabledEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.jungletv.ChatDisabledReason} */ (reader.readEnum());
      msg.setReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ChatDisabledEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ChatDisabledEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ChatDisabledEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatDisabledEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getReason();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * optional ChatDisabledReason reason = 1;
 * @return {!proto.jungletv.ChatDisabledReason}
 */
proto.jungletv.ChatDisabledEvent.prototype.getReason = function() {
  return /** @type {!proto.jungletv.ChatDisabledReason} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.jungletv.ChatDisabledReason} value
 * @return {!proto.jungletv.ChatDisabledEvent} returns this
 */
proto.jungletv.ChatDisabledEvent.prototype.setReason = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ChatEnabledEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ChatEnabledEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ChatEnabledEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatEnabledEvent.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ChatEnabledEvent}
 */
proto.jungletv.ChatEnabledEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ChatEnabledEvent;
  return proto.jungletv.ChatEnabledEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ChatEnabledEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ChatEnabledEvent}
 */
proto.jungletv.ChatEnabledEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ChatEnabledEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ChatEnabledEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ChatEnabledEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatEnabledEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ChatMessageCreatedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ChatMessageCreatedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ChatMessageCreatedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatMessageCreatedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    message: (f = msg.getMessage()) && proto.jungletv.ChatMessage.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ChatMessageCreatedEvent}
 */
proto.jungletv.ChatMessageCreatedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ChatMessageCreatedEvent;
  return proto.jungletv.ChatMessageCreatedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ChatMessageCreatedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ChatMessageCreatedEvent}
 */
proto.jungletv.ChatMessageCreatedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.ChatMessage;
      reader.readMessage(value,proto.jungletv.ChatMessage.deserializeBinaryFromReader);
      msg.setMessage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ChatMessageCreatedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ChatMessageCreatedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ChatMessageCreatedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatMessageCreatedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMessage();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.jungletv.ChatMessage.serializeBinaryToWriter
    );
  }
};


/**
 * optional ChatMessage message = 1;
 * @return {?proto.jungletv.ChatMessage}
 */
proto.jungletv.ChatMessageCreatedEvent.prototype.getMessage = function() {
  return /** @type{?proto.jungletv.ChatMessage} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.ChatMessage, 1));
};


/**
 * @param {?proto.jungletv.ChatMessage|undefined} value
 * @return {!proto.jungletv.ChatMessageCreatedEvent} returns this
*/
proto.jungletv.ChatMessageCreatedEvent.prototype.setMessage = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ChatMessageCreatedEvent} returns this
 */
proto.jungletv.ChatMessageCreatedEvent.prototype.clearMessage = function() {
  return this.setMessage(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ChatMessageCreatedEvent.prototype.hasMessage = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ChatMessageDeletedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ChatMessageDeletedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ChatMessageDeletedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatMessageDeletedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "0")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ChatMessageDeletedEvent}
 */
proto.jungletv.ChatMessageDeletedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ChatMessageDeletedEvent;
  return proto.jungletv.ChatMessageDeletedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ChatMessageDeletedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ChatMessageDeletedEvent}
 */
proto.jungletv.ChatMessageDeletedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readInt64String());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ChatMessageDeletedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ChatMessageDeletedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ChatMessageDeletedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatMessageDeletedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (parseInt(f, 10) !== 0) {
    writer.writeInt64String(
      1,
      f
    );
  }
};


/**
 * optional int64 id = 1;
 * @return {string}
 */
proto.jungletv.ChatMessageDeletedEvent.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, "0"));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ChatMessageDeletedEvent} returns this
 */
proto.jungletv.ChatMessageDeletedEvent.prototype.setId = function(value) {
  return jspb.Message.setProto3StringIntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ChatHeartbeatEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ChatHeartbeatEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ChatHeartbeatEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatHeartbeatEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    sequence: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ChatHeartbeatEvent}
 */
proto.jungletv.ChatHeartbeatEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ChatHeartbeatEvent;
  return proto.jungletv.ChatHeartbeatEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ChatHeartbeatEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ChatHeartbeatEvent}
 */
proto.jungletv.ChatHeartbeatEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setSequence(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ChatHeartbeatEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ChatHeartbeatEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ChatHeartbeatEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ChatHeartbeatEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSequence();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
};


/**
 * optional uint32 sequence = 1;
 * @return {number}
 */
proto.jungletv.ChatHeartbeatEvent.prototype.getSequence = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.ChatHeartbeatEvent} returns this
 */
proto.jungletv.ChatHeartbeatEvent.prototype.setSequence = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SendChatMessageRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SendChatMessageRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SendChatMessageRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SendChatMessageRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    content: jspb.Message.getFieldWithDefault(msg, 1, ""),
    trusted: jspb.Message.getBooleanFieldWithDefault(msg, 2, false),
    replyReferenceId: jspb.Message.getFieldWithDefault(msg, 3, "0")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SendChatMessageRequest}
 */
proto.jungletv.SendChatMessageRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SendChatMessageRequest;
  return proto.jungletv.SendChatMessageRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SendChatMessageRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SendChatMessageRequest}
 */
proto.jungletv.SendChatMessageRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setContent(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setTrusted(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readInt64String());
      msg.setReplyReferenceId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SendChatMessageRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SendChatMessageRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SendChatMessageRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SendChatMessageRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getContent();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTrusted();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 3));
  if (f != null) {
    writer.writeInt64String(
      3,
      f
    );
  }
};


/**
 * optional string content = 1;
 * @return {string}
 */
proto.jungletv.SendChatMessageRequest.prototype.getContent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SendChatMessageRequest} returns this
 */
proto.jungletv.SendChatMessageRequest.prototype.setContent = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bool trusted = 2;
 * @return {boolean}
 */
proto.jungletv.SendChatMessageRequest.prototype.getTrusted = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.SendChatMessageRequest} returns this
 */
proto.jungletv.SendChatMessageRequest.prototype.setTrusted = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};


/**
 * optional int64 reply_reference_id = 3;
 * @return {string}
 */
proto.jungletv.SendChatMessageRequest.prototype.getReplyReferenceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, "0"));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SendChatMessageRequest} returns this
 */
proto.jungletv.SendChatMessageRequest.prototype.setReplyReferenceId = function(value) {
  return jspb.Message.setField(this, 3, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.jungletv.SendChatMessageRequest} returns this
 */
proto.jungletv.SendChatMessageRequest.prototype.clearReplyReferenceId = function() {
  return jspb.Message.setField(this, 3, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.SendChatMessageRequest.prototype.hasReplyReferenceId = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SendChatMessageResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SendChatMessageResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SendChatMessageResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SendChatMessageResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SendChatMessageResponse}
 */
proto.jungletv.SendChatMessageResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SendChatMessageResponse;
  return proto.jungletv.SendChatMessageResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SendChatMessageResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SendChatMessageResponse}
 */
proto.jungletv.SendChatMessageResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt64());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SendChatMessageResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SendChatMessageResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SendChatMessageResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SendChatMessageResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt64(
      1,
      f
    );
  }
};


/**
 * optional int64 id = 1;
 * @return {number}
 */
proto.jungletv.SendChatMessageResponse.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.SendChatMessageResponse} returns this
 */
proto.jungletv.SendChatMessageResponse.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RemoveChatMessageRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RemoveChatMessageRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RemoveChatMessageRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveChatMessageRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "0")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RemoveChatMessageRequest}
 */
proto.jungletv.RemoveChatMessageRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RemoveChatMessageRequest;
  return proto.jungletv.RemoveChatMessageRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RemoveChatMessageRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RemoveChatMessageRequest}
 */
proto.jungletv.RemoveChatMessageRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readInt64String());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RemoveChatMessageRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RemoveChatMessageRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RemoveChatMessageRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveChatMessageRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (parseInt(f, 10) !== 0) {
    writer.writeInt64String(
      1,
      f
    );
  }
};


/**
 * optional int64 id = 1;
 * @return {string}
 */
proto.jungletv.RemoveChatMessageRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, "0"));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.RemoveChatMessageRequest} returns this
 */
proto.jungletv.RemoveChatMessageRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringIntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RemoveChatMessageResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RemoveChatMessageResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RemoveChatMessageResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveChatMessageResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RemoveChatMessageResponse}
 */
proto.jungletv.RemoveChatMessageResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RemoveChatMessageResponse;
  return proto.jungletv.RemoveChatMessageResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RemoveChatMessageResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RemoveChatMessageResponse}
 */
proto.jungletv.RemoveChatMessageResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RemoveChatMessageResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RemoveChatMessageResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RemoveChatMessageResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveChatMessageResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetChatSettingsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetChatSettingsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetChatSettingsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetChatSettingsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    enabled: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    slowmode: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetChatSettingsRequest}
 */
proto.jungletv.SetChatSettingsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetChatSettingsRequest;
  return proto.jungletv.SetChatSettingsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetChatSettingsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetChatSettingsRequest}
 */
proto.jungletv.SetChatSettingsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setEnabled(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setSlowmode(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetChatSettingsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetChatSettingsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetChatSettingsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetChatSettingsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEnabled();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getSlowmode();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional bool enabled = 1;
 * @return {boolean}
 */
proto.jungletv.SetChatSettingsRequest.prototype.getEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.SetChatSettingsRequest} returns this
 */
proto.jungletv.SetChatSettingsRequest.prototype.setEnabled = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional bool slowmode = 2;
 * @return {boolean}
 */
proto.jungletv.SetChatSettingsRequest.prototype.getSlowmode = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.SetChatSettingsRequest} returns this
 */
proto.jungletv.SetChatSettingsRequest.prototype.setSlowmode = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetChatSettingsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetChatSettingsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetChatSettingsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetChatSettingsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetChatSettingsResponse}
 */
proto.jungletv.SetChatSettingsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetChatSettingsResponse;
  return proto.jungletv.SetChatSettingsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetChatSettingsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetChatSettingsResponse}
 */
proto.jungletv.SetChatSettingsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetChatSettingsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetChatSettingsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetChatSettingsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetChatSettingsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.BanUserRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.BanUserRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.BanUserRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.BanUserRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: jspb.Message.getFieldWithDefault(msg, 1, ""),
    remoteAddress: jspb.Message.getFieldWithDefault(msg, 2, ""),
    chatBanned: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
    enqueuingBanned: jspb.Message.getBooleanFieldWithDefault(msg, 4, false),
    rewardsBanned: jspb.Message.getBooleanFieldWithDefault(msg, 5, false),
    reason: jspb.Message.getFieldWithDefault(msg, 6, ""),
    duration: (f = msg.getDuration()) && google_protobuf_duration_pb.Duration.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.BanUserRequest}
 */
proto.jungletv.BanUserRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.BanUserRequest;
  return proto.jungletv.BanUserRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.BanUserRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.BanUserRequest}
 */
proto.jungletv.BanUserRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setRemoteAddress(value);
      break;
    case 3:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setChatBanned(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setEnqueuingBanned(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setRewardsBanned(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setReason(value);
      break;
    case 7:
      var value = new google_protobuf_duration_pb.Duration;
      reader.readMessage(value,google_protobuf_duration_pb.Duration.deserializeBinaryFromReader);
      msg.setDuration(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.BanUserRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.BanUserRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.BanUserRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.BanUserRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRemoteAddress();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getChatBanned();
  if (f) {
    writer.writeBool(
      3,
      f
    );
  }
  f = message.getEnqueuingBanned();
  if (f) {
    writer.writeBool(
      4,
      f
    );
  }
  f = message.getRewardsBanned();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
  f = message.getReason();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getDuration();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      google_protobuf_duration_pb.Duration.serializeBinaryToWriter
    );
  }
};


/**
 * optional string address = 1;
 * @return {string}
 */
proto.jungletv.BanUserRequest.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.BanUserRequest} returns this
 */
proto.jungletv.BanUserRequest.prototype.setAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string remote_address = 2;
 * @return {string}
 */
proto.jungletv.BanUserRequest.prototype.getRemoteAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.BanUserRequest} returns this
 */
proto.jungletv.BanUserRequest.prototype.setRemoteAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional bool chat_banned = 3;
 * @return {boolean}
 */
proto.jungletv.BanUserRequest.prototype.getChatBanned = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 3, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.BanUserRequest} returns this
 */
proto.jungletv.BanUserRequest.prototype.setChatBanned = function(value) {
  return jspb.Message.setProto3BooleanField(this, 3, value);
};


/**
 * optional bool enqueuing_banned = 4;
 * @return {boolean}
 */
proto.jungletv.BanUserRequest.prototype.getEnqueuingBanned = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 4, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.BanUserRequest} returns this
 */
proto.jungletv.BanUserRequest.prototype.setEnqueuingBanned = function(value) {
  return jspb.Message.setProto3BooleanField(this, 4, value);
};


/**
 * optional bool rewards_banned = 5;
 * @return {boolean}
 */
proto.jungletv.BanUserRequest.prototype.getRewardsBanned = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.BanUserRequest} returns this
 */
proto.jungletv.BanUserRequest.prototype.setRewardsBanned = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};


/**
 * optional string reason = 6;
 * @return {string}
 */
proto.jungletv.BanUserRequest.prototype.getReason = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.BanUserRequest} returns this
 */
proto.jungletv.BanUserRequest.prototype.setReason = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional google.protobuf.Duration duration = 7;
 * @return {?proto.google.protobuf.Duration}
 */
proto.jungletv.BanUserRequest.prototype.getDuration = function() {
  return /** @type{?proto.google.protobuf.Duration} */ (
    jspb.Message.getWrapperField(this, google_protobuf_duration_pb.Duration, 7));
};


/**
 * @param {?proto.google.protobuf.Duration|undefined} value
 * @return {!proto.jungletv.BanUserRequest} returns this
*/
proto.jungletv.BanUserRequest.prototype.setDuration = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.BanUserRequest} returns this
 */
proto.jungletv.BanUserRequest.prototype.clearDuration = function() {
  return this.setDuration(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.BanUserRequest.prototype.hasDuration = function() {
  return jspb.Message.getField(this, 7) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.BanUserResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.BanUserResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.BanUserResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.BanUserResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.BanUserResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    banIdsList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.BanUserResponse}
 */
proto.jungletv.BanUserResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.BanUserResponse;
  return proto.jungletv.BanUserResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.BanUserResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.BanUserResponse}
 */
proto.jungletv.BanUserResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addBanIds(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.BanUserResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.BanUserResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.BanUserResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.BanUserResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBanIdsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
};


/**
 * repeated string ban_ids = 1;
 * @return {!Array<string>}
 */
proto.jungletv.BanUserResponse.prototype.getBanIdsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.jungletv.BanUserResponse} returns this
 */
proto.jungletv.BanUserResponse.prototype.setBanIdsList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.jungletv.BanUserResponse} returns this
 */
proto.jungletv.BanUserResponse.prototype.addBanIds = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.BanUserResponse} returns this
 */
proto.jungletv.BanUserResponse.prototype.clearBanIdsList = function() {
  return this.setBanIdsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RemoveBanRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RemoveBanRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RemoveBanRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveBanRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    banId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    reason: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RemoveBanRequest}
 */
proto.jungletv.RemoveBanRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RemoveBanRequest;
  return proto.jungletv.RemoveBanRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RemoveBanRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RemoveBanRequest}
 */
proto.jungletv.RemoveBanRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setBanId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RemoveBanRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RemoveBanRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RemoveBanRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveBanRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBanId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getReason();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string ban_id = 1;
 * @return {string}
 */
proto.jungletv.RemoveBanRequest.prototype.getBanId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.RemoveBanRequest} returns this
 */
proto.jungletv.RemoveBanRequest.prototype.setBanId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string reason = 2;
 * @return {string}
 */
proto.jungletv.RemoveBanRequest.prototype.getReason = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.RemoveBanRequest} returns this
 */
proto.jungletv.RemoveBanRequest.prototype.setReason = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RemoveBanResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RemoveBanResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RemoveBanResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveBanResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RemoveBanResponse}
 */
proto.jungletv.RemoveBanResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RemoveBanResponse;
  return proto.jungletv.RemoveBanResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RemoveBanResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RemoveBanResponse}
 */
proto.jungletv.RemoveBanResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RemoveBanResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RemoveBanResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RemoveBanResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveBanResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetVideoEnqueuingEnabledRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetVideoEnqueuingEnabledRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetVideoEnqueuingEnabledRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetVideoEnqueuingEnabledRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    allowed: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetVideoEnqueuingEnabledRequest}
 */
proto.jungletv.SetVideoEnqueuingEnabledRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetVideoEnqueuingEnabledRequest;
  return proto.jungletv.SetVideoEnqueuingEnabledRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetVideoEnqueuingEnabledRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetVideoEnqueuingEnabledRequest}
 */
proto.jungletv.SetVideoEnqueuingEnabledRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.jungletv.AllowedVideoEnqueuingType} */ (reader.readEnum());
      msg.setAllowed(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetVideoEnqueuingEnabledRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetVideoEnqueuingEnabledRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetVideoEnqueuingEnabledRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetVideoEnqueuingEnabledRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAllowed();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * optional AllowedVideoEnqueuingType allowed = 1;
 * @return {!proto.jungletv.AllowedVideoEnqueuingType}
 */
proto.jungletv.SetVideoEnqueuingEnabledRequest.prototype.getAllowed = function() {
  return /** @type {!proto.jungletv.AllowedVideoEnqueuingType} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.jungletv.AllowedVideoEnqueuingType} value
 * @return {!proto.jungletv.SetVideoEnqueuingEnabledRequest} returns this
 */
proto.jungletv.SetVideoEnqueuingEnabledRequest.prototype.setAllowed = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetVideoEnqueuingEnabledResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetVideoEnqueuingEnabledResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetVideoEnqueuingEnabledResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetVideoEnqueuingEnabledResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetVideoEnqueuingEnabledResponse}
 */
proto.jungletv.SetVideoEnqueuingEnabledResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetVideoEnqueuingEnabledResponse;
  return proto.jungletv.SetVideoEnqueuingEnabledResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetVideoEnqueuingEnabledResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetVideoEnqueuingEnabledResponse}
 */
proto.jungletv.SetVideoEnqueuingEnabledResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetVideoEnqueuingEnabledResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetVideoEnqueuingEnabledResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetVideoEnqueuingEnabledResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetVideoEnqueuingEnabledResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.UserChatMessagesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.UserChatMessagesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.UserChatMessagesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UserChatMessagesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: jspb.Message.getFieldWithDefault(msg, 1, ""),
    numMessages: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.UserChatMessagesRequest}
 */
proto.jungletv.UserChatMessagesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.UserChatMessagesRequest;
  return proto.jungletv.UserChatMessagesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.UserChatMessagesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.UserChatMessagesRequest}
 */
proto.jungletv.UserChatMessagesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setNumMessages(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.UserChatMessagesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.UserChatMessagesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.UserChatMessagesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UserChatMessagesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getNumMessages();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
};


/**
 * optional string address = 1;
 * @return {string}
 */
proto.jungletv.UserChatMessagesRequest.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.UserChatMessagesRequest} returns this
 */
proto.jungletv.UserChatMessagesRequest.prototype.setAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional uint32 num_messages = 2;
 * @return {number}
 */
proto.jungletv.UserChatMessagesRequest.prototype.getNumMessages = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.UserChatMessagesRequest} returns this
 */
proto.jungletv.UserChatMessagesRequest.prototype.setNumMessages = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.UserChatMessagesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.UserChatMessagesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.UserChatMessagesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.UserChatMessagesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UserChatMessagesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    messagesList: jspb.Message.toObjectList(msg.getMessagesList(),
    proto.jungletv.ChatMessage.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.UserChatMessagesResponse}
 */
proto.jungletv.UserChatMessagesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.UserChatMessagesResponse;
  return proto.jungletv.UserChatMessagesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.UserChatMessagesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.UserChatMessagesResponse}
 */
proto.jungletv.UserChatMessagesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.ChatMessage;
      reader.readMessage(value,proto.jungletv.ChatMessage.deserializeBinaryFromReader);
      msg.addMessages(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.UserChatMessagesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.UserChatMessagesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.UserChatMessagesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UserChatMessagesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMessagesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.jungletv.ChatMessage.serializeBinaryToWriter
    );
  }
};


/**
 * repeated ChatMessage messages = 1;
 * @return {!Array<!proto.jungletv.ChatMessage>}
 */
proto.jungletv.UserChatMessagesResponse.prototype.getMessagesList = function() {
  return /** @type{!Array<!proto.jungletv.ChatMessage>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jungletv.ChatMessage, 1));
};


/**
 * @param {!Array<!proto.jungletv.ChatMessage>} value
 * @return {!proto.jungletv.UserChatMessagesResponse} returns this
*/
proto.jungletv.UserChatMessagesResponse.prototype.setMessagesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.jungletv.ChatMessage=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jungletv.ChatMessage}
 */
proto.jungletv.UserChatMessagesResponse.prototype.addMessages = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.jungletv.ChatMessage, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.UserChatMessagesResponse} returns this
 */
proto.jungletv.UserChatMessagesResponse.prototype.clearMessagesList = function() {
  return this.setMessagesList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.UserPermissionLevelRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.UserPermissionLevelRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.UserPermissionLevelRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UserPermissionLevelRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.UserPermissionLevelRequest}
 */
proto.jungletv.UserPermissionLevelRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.UserPermissionLevelRequest;
  return proto.jungletv.UserPermissionLevelRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.UserPermissionLevelRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.UserPermissionLevelRequest}
 */
proto.jungletv.UserPermissionLevelRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.UserPermissionLevelRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.UserPermissionLevelRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.UserPermissionLevelRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UserPermissionLevelRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.UserPermissionLevelResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.UserPermissionLevelResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.UserPermissionLevelResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UserPermissionLevelResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    permissionLevel: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.UserPermissionLevelResponse}
 */
proto.jungletv.UserPermissionLevelResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.UserPermissionLevelResponse;
  return proto.jungletv.UserPermissionLevelResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.UserPermissionLevelResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.UserPermissionLevelResponse}
 */
proto.jungletv.UserPermissionLevelResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.jungletv.PermissionLevel} */ (reader.readEnum());
      msg.setPermissionLevel(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.UserPermissionLevelResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.UserPermissionLevelResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.UserPermissionLevelResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UserPermissionLevelResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPermissionLevel();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
};


/**
 * optional PermissionLevel permission_level = 1;
 * @return {!proto.jungletv.PermissionLevel}
 */
proto.jungletv.UserPermissionLevelResponse.prototype.getPermissionLevel = function() {
  return /** @type {!proto.jungletv.PermissionLevel} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.jungletv.PermissionLevel} value
 * @return {!proto.jungletv.UserPermissionLevelResponse} returns this
 */
proto.jungletv.UserPermissionLevelResponse.prototype.setPermissionLevel = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.DisallowedVideosRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.DisallowedVideosRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.DisallowedVideosRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.DisallowedVideosRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    paginationParams: (f = msg.getPaginationParams()) && proto.jungletv.PaginationParameters.toObject(includeInstance, f),
    searchQuery: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.DisallowedVideosRequest}
 */
proto.jungletv.DisallowedVideosRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.DisallowedVideosRequest;
  return proto.jungletv.DisallowedVideosRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.DisallowedVideosRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.DisallowedVideosRequest}
 */
proto.jungletv.DisallowedVideosRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.PaginationParameters;
      reader.readMessage(value,proto.jungletv.PaginationParameters.deserializeBinaryFromReader);
      msg.setPaginationParams(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setSearchQuery(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.DisallowedVideosRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.DisallowedVideosRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.DisallowedVideosRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.DisallowedVideosRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPaginationParams();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.jungletv.PaginationParameters.serializeBinaryToWriter
    );
  }
  f = message.getSearchQuery();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional PaginationParameters pagination_params = 1;
 * @return {?proto.jungletv.PaginationParameters}
 */
proto.jungletv.DisallowedVideosRequest.prototype.getPaginationParams = function() {
  return /** @type{?proto.jungletv.PaginationParameters} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.PaginationParameters, 1));
};


/**
 * @param {?proto.jungletv.PaginationParameters|undefined} value
 * @return {!proto.jungletv.DisallowedVideosRequest} returns this
*/
proto.jungletv.DisallowedVideosRequest.prototype.setPaginationParams = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.DisallowedVideosRequest} returns this
 */
proto.jungletv.DisallowedVideosRequest.prototype.clearPaginationParams = function() {
  return this.setPaginationParams(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.DisallowedVideosRequest.prototype.hasPaginationParams = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string search_query = 2;
 * @return {string}
 */
proto.jungletv.DisallowedVideosRequest.prototype.getSearchQuery = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.DisallowedVideosRequest} returns this
 */
proto.jungletv.DisallowedVideosRequest.prototype.setSearchQuery = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.DisallowedVideo.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.DisallowedVideo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.DisallowedVideo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.DisallowedVideo.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    disallowedBy: jspb.Message.getFieldWithDefault(msg, 2, ""),
    disallowedAt: (f = msg.getDisallowedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    ytVideoId: jspb.Message.getFieldWithDefault(msg, 4, ""),
    ytVideoTitle: jspb.Message.getFieldWithDefault(msg, 5, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.DisallowedVideo}
 */
proto.jungletv.DisallowedVideo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.DisallowedVideo;
  return proto.jungletv.DisallowedVideo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.DisallowedVideo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.DisallowedVideo}
 */
proto.jungletv.DisallowedVideo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setDisallowedBy(value);
      break;
    case 3:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setDisallowedAt(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setYtVideoId(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setYtVideoTitle(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.DisallowedVideo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.DisallowedVideo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.DisallowedVideo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.DisallowedVideo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getDisallowedBy();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getDisallowedAt();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getYtVideoId();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getYtVideoTitle();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.DisallowedVideo.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.DisallowedVideo} returns this
 */
proto.jungletv.DisallowedVideo.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string disallowed_by = 2;
 * @return {string}
 */
proto.jungletv.DisallowedVideo.prototype.getDisallowedBy = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.DisallowedVideo} returns this
 */
proto.jungletv.DisallowedVideo.prototype.setDisallowedBy = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.Timestamp disallowed_at = 3;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.DisallowedVideo.prototype.getDisallowedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 3));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.DisallowedVideo} returns this
*/
proto.jungletv.DisallowedVideo.prototype.setDisallowedAt = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.DisallowedVideo} returns this
 */
proto.jungletv.DisallowedVideo.prototype.clearDisallowedAt = function() {
  return this.setDisallowedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.DisallowedVideo.prototype.hasDisallowedAt = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string yt_video_id = 4;
 * @return {string}
 */
proto.jungletv.DisallowedVideo.prototype.getYtVideoId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.DisallowedVideo} returns this
 */
proto.jungletv.DisallowedVideo.prototype.setYtVideoId = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional string yt_video_title = 5;
 * @return {string}
 */
proto.jungletv.DisallowedVideo.prototype.getYtVideoTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.DisallowedVideo} returns this
 */
proto.jungletv.DisallowedVideo.prototype.setYtVideoTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.DisallowedVideosResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.DisallowedVideosResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.DisallowedVideosResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.DisallowedVideosResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.DisallowedVideosResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    disallowedVideosList: jspb.Message.toObjectList(msg.getDisallowedVideosList(),
    proto.jungletv.DisallowedVideo.toObject, includeInstance),
    offset: jspb.Message.getFieldWithDefault(msg, 2, 0),
    total: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.DisallowedVideosResponse}
 */
proto.jungletv.DisallowedVideosResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.DisallowedVideosResponse;
  return proto.jungletv.DisallowedVideosResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.DisallowedVideosResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.DisallowedVideosResponse}
 */
proto.jungletv.DisallowedVideosResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.DisallowedVideo;
      reader.readMessage(value,proto.jungletv.DisallowedVideo.deserializeBinaryFromReader);
      msg.addDisallowedVideos(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setOffset(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTotal(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.DisallowedVideosResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.DisallowedVideosResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.DisallowedVideosResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.DisallowedVideosResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDisallowedVideosList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.jungletv.DisallowedVideo.serializeBinaryToWriter
    );
  }
  f = message.getOffset();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getTotal();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * repeated DisallowedVideo disallowed_videos = 1;
 * @return {!Array<!proto.jungletv.DisallowedVideo>}
 */
proto.jungletv.DisallowedVideosResponse.prototype.getDisallowedVideosList = function() {
  return /** @type{!Array<!proto.jungletv.DisallowedVideo>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jungletv.DisallowedVideo, 1));
};


/**
 * @param {!Array<!proto.jungletv.DisallowedVideo>} value
 * @return {!proto.jungletv.DisallowedVideosResponse} returns this
*/
proto.jungletv.DisallowedVideosResponse.prototype.setDisallowedVideosList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.jungletv.DisallowedVideo=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jungletv.DisallowedVideo}
 */
proto.jungletv.DisallowedVideosResponse.prototype.addDisallowedVideos = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.jungletv.DisallowedVideo, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.DisallowedVideosResponse} returns this
 */
proto.jungletv.DisallowedVideosResponse.prototype.clearDisallowedVideosList = function() {
  return this.setDisallowedVideosList([]);
};


/**
 * optional uint64 offset = 2;
 * @return {number}
 */
proto.jungletv.DisallowedVideosResponse.prototype.getOffset = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.DisallowedVideosResponse} returns this
 */
proto.jungletv.DisallowedVideosResponse.prototype.setOffset = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 total = 3;
 * @return {number}
 */
proto.jungletv.DisallowedVideosResponse.prototype.getTotal = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.DisallowedVideosResponse} returns this
 */
proto.jungletv.DisallowedVideosResponse.prototype.setTotal = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.AddDisallowedVideoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.AddDisallowedVideoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.AddDisallowedVideoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.AddDisallowedVideoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    ytVideoId: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.AddDisallowedVideoRequest}
 */
proto.jungletv.AddDisallowedVideoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.AddDisallowedVideoRequest;
  return proto.jungletv.AddDisallowedVideoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.AddDisallowedVideoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.AddDisallowedVideoRequest}
 */
proto.jungletv.AddDisallowedVideoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setYtVideoId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.AddDisallowedVideoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.AddDisallowedVideoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.AddDisallowedVideoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.AddDisallowedVideoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getYtVideoId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string yt_video_id = 1;
 * @return {string}
 */
proto.jungletv.AddDisallowedVideoRequest.prototype.getYtVideoId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.AddDisallowedVideoRequest} returns this
 */
proto.jungletv.AddDisallowedVideoRequest.prototype.setYtVideoId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.AddDisallowedVideoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.AddDisallowedVideoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.AddDisallowedVideoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.AddDisallowedVideoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.AddDisallowedVideoResponse}
 */
proto.jungletv.AddDisallowedVideoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.AddDisallowedVideoResponse;
  return proto.jungletv.AddDisallowedVideoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.AddDisallowedVideoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.AddDisallowedVideoResponse}
 */
proto.jungletv.AddDisallowedVideoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.AddDisallowedVideoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.AddDisallowedVideoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.AddDisallowedVideoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.AddDisallowedVideoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.AddDisallowedVideoResponse.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.AddDisallowedVideoResponse} returns this
 */
proto.jungletv.AddDisallowedVideoResponse.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RemoveDisallowedVideoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RemoveDisallowedVideoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RemoveDisallowedVideoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveDisallowedVideoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RemoveDisallowedVideoRequest}
 */
proto.jungletv.RemoveDisallowedVideoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RemoveDisallowedVideoRequest;
  return proto.jungletv.RemoveDisallowedVideoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RemoveDisallowedVideoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RemoveDisallowedVideoRequest}
 */
proto.jungletv.RemoveDisallowedVideoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RemoveDisallowedVideoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RemoveDisallowedVideoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RemoveDisallowedVideoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveDisallowedVideoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.RemoveDisallowedVideoRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.RemoveDisallowedVideoRequest} returns this
 */
proto.jungletv.RemoveDisallowedVideoRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RemoveDisallowedVideoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RemoveDisallowedVideoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RemoveDisallowedVideoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveDisallowedVideoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RemoveDisallowedVideoResponse}
 */
proto.jungletv.RemoveDisallowedVideoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RemoveDisallowedVideoResponse;
  return proto.jungletv.RemoveDisallowedVideoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RemoveDisallowedVideoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RemoveDisallowedVideoResponse}
 */
proto.jungletv.RemoveDisallowedVideoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RemoveDisallowedVideoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RemoveDisallowedVideoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RemoveDisallowedVideoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RemoveDisallowedVideoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.GetDocumentRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.GetDocumentRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.GetDocumentRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.GetDocumentRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.GetDocumentRequest}
 */
proto.jungletv.GetDocumentRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.GetDocumentRequest;
  return proto.jungletv.GetDocumentRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.GetDocumentRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.GetDocumentRequest}
 */
proto.jungletv.GetDocumentRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.GetDocumentRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.GetDocumentRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.GetDocumentRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.GetDocumentRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.GetDocumentRequest.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.GetDocumentRequest} returns this
 */
proto.jungletv.GetDocumentRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.Document.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.Document.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.Document} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.Document.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    format: jspb.Message.getFieldWithDefault(msg, 2, ""),
    content: jspb.Message.getFieldWithDefault(msg, 3, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.Document}
 */
proto.jungletv.Document.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.Document;
  return proto.jungletv.Document.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.Document} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.Document}
 */
proto.jungletv.Document.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setFormat(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setContent(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.Document.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.Document.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.Document} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.Document.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getFormat();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getContent();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.Document.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.Document} returns this
 */
proto.jungletv.Document.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string format = 2;
 * @return {string}
 */
proto.jungletv.Document.prototype.getFormat = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.Document} returns this
 */
proto.jungletv.Document.prototype.setFormat = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string content = 3;
 * @return {string}
 */
proto.jungletv.Document.prototype.getContent = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.Document} returns this
 */
proto.jungletv.Document.prototype.setContent = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.UpdateDocumentResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.UpdateDocumentResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.UpdateDocumentResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UpdateDocumentResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.UpdateDocumentResponse}
 */
proto.jungletv.UpdateDocumentResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.UpdateDocumentResponse;
  return proto.jungletv.UpdateDocumentResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.UpdateDocumentResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.UpdateDocumentResponse}
 */
proto.jungletv.UpdateDocumentResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.UpdateDocumentResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.UpdateDocumentResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.UpdateDocumentResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.UpdateDocumentResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetChatNicknameRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetChatNicknameRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetChatNicknameRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetChatNicknameRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    nickname: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetChatNicknameRequest}
 */
proto.jungletv.SetChatNicknameRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetChatNicknameRequest;
  return proto.jungletv.SetChatNicknameRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetChatNicknameRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetChatNicknameRequest}
 */
proto.jungletv.SetChatNicknameRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setNickname(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetChatNicknameRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetChatNicknameRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetChatNicknameRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetChatNicknameRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getNickname();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string nickname = 1;
 * @return {string}
 */
proto.jungletv.SetChatNicknameRequest.prototype.getNickname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SetChatNicknameRequest} returns this
 */
proto.jungletv.SetChatNicknameRequest.prototype.setNickname = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetChatNicknameResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetChatNicknameResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetChatNicknameResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetChatNicknameResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetChatNicknameResponse}
 */
proto.jungletv.SetChatNicknameResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetChatNicknameResponse;
  return proto.jungletv.SetChatNicknameResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetChatNicknameResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetChatNicknameResponse}
 */
proto.jungletv.SetChatNicknameResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetChatNicknameResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetChatNicknameResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetChatNicknameResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetChatNicknameResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetUserChatNicknameRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetUserChatNicknameRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetUserChatNicknameRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetUserChatNicknameRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    address: jspb.Message.getFieldWithDefault(msg, 1, ""),
    nickname: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetUserChatNicknameRequest}
 */
proto.jungletv.SetUserChatNicknameRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetUserChatNicknameRequest;
  return proto.jungletv.SetUserChatNicknameRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetUserChatNicknameRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetUserChatNicknameRequest}
 */
proto.jungletv.SetUserChatNicknameRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setNickname(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetUserChatNicknameRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetUserChatNicknameRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetUserChatNicknameRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetUserChatNicknameRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getNickname();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string address = 1;
 * @return {string}
 */
proto.jungletv.SetUserChatNicknameRequest.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SetUserChatNicknameRequest} returns this
 */
proto.jungletv.SetUserChatNicknameRequest.prototype.setAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string nickname = 2;
 * @return {string}
 */
proto.jungletv.SetUserChatNicknameRequest.prototype.getNickname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.SetUserChatNicknameRequest} returns this
 */
proto.jungletv.SetUserChatNicknameRequest.prototype.setNickname = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetUserChatNicknameResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetUserChatNicknameResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetUserChatNicknameResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetUserChatNicknameResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetUserChatNicknameResponse}
 */
proto.jungletv.SetUserChatNicknameResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetUserChatNicknameResponse;
  return proto.jungletv.SetUserChatNicknameResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetUserChatNicknameResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetUserChatNicknameResponse}
 */
proto.jungletv.SetUserChatNicknameResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetUserChatNicknameResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetUserChatNicknameResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetUserChatNicknameResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetUserChatNicknameResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetPricesMultiplierRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetPricesMultiplierRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetPricesMultiplierRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetPricesMultiplierRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    multiplier: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetPricesMultiplierRequest}
 */
proto.jungletv.SetPricesMultiplierRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetPricesMultiplierRequest;
  return proto.jungletv.SetPricesMultiplierRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetPricesMultiplierRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetPricesMultiplierRequest}
 */
proto.jungletv.SetPricesMultiplierRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMultiplier(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetPricesMultiplierRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetPricesMultiplierRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetPricesMultiplierRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetPricesMultiplierRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMultiplier();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
};


/**
 * optional int32 multiplier = 1;
 * @return {number}
 */
proto.jungletv.SetPricesMultiplierRequest.prototype.getMultiplier = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.SetPricesMultiplierRequest} returns this
 */
proto.jungletv.SetPricesMultiplierRequest.prototype.setMultiplier = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetPricesMultiplierResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetPricesMultiplierResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetPricesMultiplierResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetPricesMultiplierResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetPricesMultiplierResponse}
 */
proto.jungletv.SetPricesMultiplierResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetPricesMultiplierResponse;
  return proto.jungletv.SetPricesMultiplierResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetPricesMultiplierResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetPricesMultiplierResponse}
 */
proto.jungletv.SetPricesMultiplierResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetPricesMultiplierResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetPricesMultiplierResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetPricesMultiplierResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetPricesMultiplierResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.WithdrawRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.WithdrawRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.WithdrawRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.WithdrawRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.WithdrawRequest}
 */
proto.jungletv.WithdrawRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.WithdrawRequest;
  return proto.jungletv.WithdrawRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.WithdrawRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.WithdrawRequest}
 */
proto.jungletv.WithdrawRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.WithdrawRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.WithdrawRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.WithdrawRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.WithdrawRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.WithdrawResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.WithdrawResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.WithdrawResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.WithdrawResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.WithdrawResponse}
 */
proto.jungletv.WithdrawResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.WithdrawResponse;
  return proto.jungletv.WithdrawResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.WithdrawResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.WithdrawResponse}
 */
proto.jungletv.WithdrawResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.WithdrawResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.WithdrawResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.WithdrawResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.WithdrawResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.LeaderboardsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.LeaderboardsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.LeaderboardsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.LeaderboardsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.LeaderboardsRequest}
 */
proto.jungletv.LeaderboardsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.LeaderboardsRequest;
  return proto.jungletv.LeaderboardsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.LeaderboardsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.LeaderboardsRequest}
 */
proto.jungletv.LeaderboardsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.LeaderboardsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.LeaderboardsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.LeaderboardsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.LeaderboardsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.LeaderboardsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.LeaderboardsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.LeaderboardsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.LeaderboardsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.LeaderboardsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    leaderboardsList: jspb.Message.toObjectList(msg.getLeaderboardsList(),
    proto.jungletv.Leaderboard.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.LeaderboardsResponse}
 */
proto.jungletv.LeaderboardsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.LeaderboardsResponse;
  return proto.jungletv.LeaderboardsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.LeaderboardsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.LeaderboardsResponse}
 */
proto.jungletv.LeaderboardsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.Leaderboard;
      reader.readMessage(value,proto.jungletv.Leaderboard.deserializeBinaryFromReader);
      msg.addLeaderboards(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.LeaderboardsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.LeaderboardsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.LeaderboardsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.LeaderboardsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getLeaderboardsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.jungletv.Leaderboard.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Leaderboard leaderboards = 1;
 * @return {!Array<!proto.jungletv.Leaderboard>}
 */
proto.jungletv.LeaderboardsResponse.prototype.getLeaderboardsList = function() {
  return /** @type{!Array<!proto.jungletv.Leaderboard>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jungletv.Leaderboard, 1));
};


/**
 * @param {!Array<!proto.jungletv.Leaderboard>} value
 * @return {!proto.jungletv.LeaderboardsResponse} returns this
*/
proto.jungletv.LeaderboardsResponse.prototype.setLeaderboardsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.jungletv.Leaderboard=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jungletv.Leaderboard}
 */
proto.jungletv.LeaderboardsResponse.prototype.addLeaderboards = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.jungletv.Leaderboard, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.LeaderboardsResponse} returns this
 */
proto.jungletv.LeaderboardsResponse.prototype.clearLeaderboardsList = function() {
  return this.setLeaderboardsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.Leaderboard.repeatedFields_ = [2,3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.Leaderboard.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.Leaderboard.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.Leaderboard} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.Leaderboard.toObject = function(includeInstance, msg) {
  var f, obj = {
    title: jspb.Message.getFieldWithDefault(msg, 1, ""),
    valueTitlesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f,
    rowsList: jspb.Message.toObjectList(msg.getRowsList(),
    proto.jungletv.LeaderboardRow.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.Leaderboard}
 */
proto.jungletv.Leaderboard.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.Leaderboard;
  return proto.jungletv.Leaderboard.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.Leaderboard} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.Leaderboard}
 */
proto.jungletv.Leaderboard.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addValueTitles(value);
      break;
    case 3:
      var value = new proto.jungletv.LeaderboardRow;
      reader.readMessage(value,proto.jungletv.LeaderboardRow.deserializeBinaryFromReader);
      msg.addRows(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.Leaderboard.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.Leaderboard.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.Leaderboard} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.Leaderboard.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTitle();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getValueTitlesList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
  f = message.getRowsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.jungletv.LeaderboardRow.serializeBinaryToWriter
    );
  }
};


/**
 * optional string title = 1;
 * @return {string}
 */
proto.jungletv.Leaderboard.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.Leaderboard} returns this
 */
proto.jungletv.Leaderboard.prototype.setTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated string value_titles = 2;
 * @return {!Array<string>}
 */
proto.jungletv.Leaderboard.prototype.getValueTitlesList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.jungletv.Leaderboard} returns this
 */
proto.jungletv.Leaderboard.prototype.setValueTitlesList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.jungletv.Leaderboard} returns this
 */
proto.jungletv.Leaderboard.prototype.addValueTitles = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.Leaderboard} returns this
 */
proto.jungletv.Leaderboard.prototype.clearValueTitlesList = function() {
  return this.setValueTitlesList([]);
};


/**
 * repeated LeaderboardRow rows = 3;
 * @return {!Array<!proto.jungletv.LeaderboardRow>}
 */
proto.jungletv.Leaderboard.prototype.getRowsList = function() {
  return /** @type{!Array<!proto.jungletv.LeaderboardRow>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jungletv.LeaderboardRow, 3));
};


/**
 * @param {!Array<!proto.jungletv.LeaderboardRow>} value
 * @return {!proto.jungletv.Leaderboard} returns this
*/
proto.jungletv.Leaderboard.prototype.setRowsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.jungletv.LeaderboardRow=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jungletv.LeaderboardRow}
 */
proto.jungletv.Leaderboard.prototype.addRows = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.jungletv.LeaderboardRow, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.Leaderboard} returns this
 */
proto.jungletv.Leaderboard.prototype.clearRowsList = function() {
  return this.setRowsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.LeaderboardRow.repeatedFields_ = [5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.LeaderboardRow.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.LeaderboardRow.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.LeaderboardRow} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.LeaderboardRow.toObject = function(includeInstance, msg) {
  var f, obj = {
    rowNum: jspb.Message.getFieldWithDefault(msg, 1, 0),
    position: jspb.Message.getFieldWithDefault(msg, 2, 0),
    address: jspb.Message.getFieldWithDefault(msg, 3, ""),
    nickname: jspb.Message.getFieldWithDefault(msg, 4, ""),
    valuesList: jspb.Message.toObjectList(msg.getValuesList(),
    proto.jungletv.LeaderboardValue.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.LeaderboardRow}
 */
proto.jungletv.LeaderboardRow.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.LeaderboardRow;
  return proto.jungletv.LeaderboardRow.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.LeaderboardRow} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.LeaderboardRow}
 */
proto.jungletv.LeaderboardRow.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setRowNum(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setPosition(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAddress(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setNickname(value);
      break;
    case 5:
      var value = new proto.jungletv.LeaderboardValue;
      reader.readMessage(value,proto.jungletv.LeaderboardValue.deserializeBinaryFromReader);
      msg.addValues(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.LeaderboardRow.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.LeaderboardRow.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.LeaderboardRow} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.LeaderboardRow.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRowNum();
  if (f !== 0) {
    writer.writeUint32(
      1,
      f
    );
  }
  f = message.getPosition();
  if (f !== 0) {
    writer.writeUint32(
      2,
      f
    );
  }
  f = message.getAddress();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 4));
  if (f != null) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getValuesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.jungletv.LeaderboardValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional uint32 row_num = 1;
 * @return {number}
 */
proto.jungletv.LeaderboardRow.prototype.getRowNum = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.LeaderboardRow} returns this
 */
proto.jungletv.LeaderboardRow.prototype.setRowNum = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional uint32 position = 2;
 * @return {number}
 */
proto.jungletv.LeaderboardRow.prototype.getPosition = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.LeaderboardRow} returns this
 */
proto.jungletv.LeaderboardRow.prototype.setPosition = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string address = 3;
 * @return {string}
 */
proto.jungletv.LeaderboardRow.prototype.getAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.LeaderboardRow} returns this
 */
proto.jungletv.LeaderboardRow.prototype.setAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string nickname = 4;
 * @return {string}
 */
proto.jungletv.LeaderboardRow.prototype.getNickname = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.LeaderboardRow} returns this
 */
proto.jungletv.LeaderboardRow.prototype.setNickname = function(value) {
  return jspb.Message.setField(this, 4, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.jungletv.LeaderboardRow} returns this
 */
proto.jungletv.LeaderboardRow.prototype.clearNickname = function() {
  return jspb.Message.setField(this, 4, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.LeaderboardRow.prototype.hasNickname = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * repeated LeaderboardValue values = 5;
 * @return {!Array<!proto.jungletv.LeaderboardValue>}
 */
proto.jungletv.LeaderboardRow.prototype.getValuesList = function() {
  return /** @type{!Array<!proto.jungletv.LeaderboardValue>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jungletv.LeaderboardValue, 5));
};


/**
 * @param {!Array<!proto.jungletv.LeaderboardValue>} value
 * @return {!proto.jungletv.LeaderboardRow} returns this
*/
proto.jungletv.LeaderboardRow.prototype.setValuesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.jungletv.LeaderboardValue=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jungletv.LeaderboardValue}
 */
proto.jungletv.LeaderboardRow.prototype.addValues = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.jungletv.LeaderboardValue, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.LeaderboardRow} returns this
 */
proto.jungletv.LeaderboardRow.prototype.clearValuesList = function() {
  return this.setValuesList([]);
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.LeaderboardValue.oneofGroups_ = [[1]];

/**
 * @enum {number}
 */
proto.jungletv.LeaderboardValue.ValueCase = {
  VALUE_NOT_SET: 0,
  AMOUNT: 1
};

/**
 * @return {proto.jungletv.LeaderboardValue.ValueCase}
 */
proto.jungletv.LeaderboardValue.prototype.getValueCase = function() {
  return /** @type {proto.jungletv.LeaderboardValue.ValueCase} */(jspb.Message.computeOneofCase(this, proto.jungletv.LeaderboardValue.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.LeaderboardValue.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.LeaderboardValue.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.LeaderboardValue} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.LeaderboardValue.toObject = function(includeInstance, msg) {
  var f, obj = {
    amount: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.LeaderboardValue}
 */
proto.jungletv.LeaderboardValue.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.LeaderboardValue;
  return proto.jungletv.LeaderboardValue.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.LeaderboardValue} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.LeaderboardValue}
 */
proto.jungletv.LeaderboardValue.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setAmount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.LeaderboardValue.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.LeaderboardValue.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.LeaderboardValue} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.LeaderboardValue.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string amount = 1;
 * @return {string}
 */
proto.jungletv.LeaderboardValue.prototype.getAmount = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.LeaderboardValue} returns this
 */
proto.jungletv.LeaderboardValue.prototype.setAmount = function(value) {
  return jspb.Message.setOneofField(this, 1, proto.jungletv.LeaderboardValue.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.jungletv.LeaderboardValue} returns this
 */
proto.jungletv.LeaderboardValue.prototype.clearAmount = function() {
  return jspb.Message.setOneofField(this, 1, proto.jungletv.LeaderboardValue.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.LeaderboardValue.prototype.hasAmount = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RewardHistoryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RewardHistoryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RewardHistoryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RewardHistoryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    paginationParams: (f = msg.getPaginationParams()) && proto.jungletv.PaginationParameters.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RewardHistoryRequest}
 */
proto.jungletv.RewardHistoryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RewardHistoryRequest;
  return proto.jungletv.RewardHistoryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RewardHistoryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RewardHistoryRequest}
 */
proto.jungletv.RewardHistoryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.PaginationParameters;
      reader.readMessage(value,proto.jungletv.PaginationParameters.deserializeBinaryFromReader);
      msg.setPaginationParams(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RewardHistoryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RewardHistoryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RewardHistoryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RewardHistoryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPaginationParams();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.jungletv.PaginationParameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional PaginationParameters pagination_params = 1;
 * @return {?proto.jungletv.PaginationParameters}
 */
proto.jungletv.RewardHistoryRequest.prototype.getPaginationParams = function() {
  return /** @type{?proto.jungletv.PaginationParameters} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.PaginationParameters, 1));
};


/**
 * @param {?proto.jungletv.PaginationParameters|undefined} value
 * @return {!proto.jungletv.RewardHistoryRequest} returns this
*/
proto.jungletv.RewardHistoryRequest.prototype.setPaginationParams = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.RewardHistoryRequest} returns this
 */
proto.jungletv.RewardHistoryRequest.prototype.clearPaginationParams = function() {
  return this.setPaginationParams(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.RewardHistoryRequest.prototype.hasPaginationParams = function() {
  return jspb.Message.getField(this, 1) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.ReceivedReward.oneofGroups_ = [[6]];

/**
 * @enum {number}
 */
proto.jungletv.ReceivedReward.MediaInfoCase = {
  MEDIA_INFO_NOT_SET: 0,
  YOUTUBE_VIDEO_DATA: 6
};

/**
 * @return {proto.jungletv.ReceivedReward.MediaInfoCase}
 */
proto.jungletv.ReceivedReward.prototype.getMediaInfoCase = function() {
  return /** @type {proto.jungletv.ReceivedReward.MediaInfoCase} */(jspb.Message.computeOneofCase(this, proto.jungletv.ReceivedReward.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ReceivedReward.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ReceivedReward.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ReceivedReward} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ReceivedReward.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, ""),
    rewardsAddress: jspb.Message.getFieldWithDefault(msg, 2, ""),
    amount: jspb.Message.getFieldWithDefault(msg, 3, ""),
    receivedAt: (f = msg.getReceivedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    mediaId: jspb.Message.getFieldWithDefault(msg, 5, ""),
    youtubeVideoData: (f = msg.getYoutubeVideoData()) && proto.jungletv.QueueYouTubeVideoData.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ReceivedReward}
 */
proto.jungletv.ReceivedReward.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ReceivedReward;
  return proto.jungletv.ReceivedReward.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ReceivedReward} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ReceivedReward}
 */
proto.jungletv.ReceivedReward.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setRewardsAddress(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAmount(value);
      break;
    case 4:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setReceivedAt(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setMediaId(value);
      break;
    case 6:
      var value = new proto.jungletv.QueueYouTubeVideoData;
      reader.readMessage(value,proto.jungletv.QueueYouTubeVideoData.deserializeBinaryFromReader);
      msg.setYoutubeVideoData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ReceivedReward.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ReceivedReward.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ReceivedReward} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ReceivedReward.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRewardsAddress();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getAmount();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getReceivedAt();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getMediaId();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getYoutubeVideoData();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.jungletv.QueueYouTubeVideoData.serializeBinaryToWriter
    );
  }
};


/**
 * optional string id = 1;
 * @return {string}
 */
proto.jungletv.ReceivedReward.prototype.getId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ReceivedReward} returns this
 */
proto.jungletv.ReceivedReward.prototype.setId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string rewards_address = 2;
 * @return {string}
 */
proto.jungletv.ReceivedReward.prototype.getRewardsAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ReceivedReward} returns this
 */
proto.jungletv.ReceivedReward.prototype.setRewardsAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string amount = 3;
 * @return {string}
 */
proto.jungletv.ReceivedReward.prototype.getAmount = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ReceivedReward} returns this
 */
proto.jungletv.ReceivedReward.prototype.setAmount = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional google.protobuf.Timestamp received_at = 4;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.ReceivedReward.prototype.getReceivedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 4));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.ReceivedReward} returns this
*/
proto.jungletv.ReceivedReward.prototype.setReceivedAt = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ReceivedReward} returns this
 */
proto.jungletv.ReceivedReward.prototype.clearReceivedAt = function() {
  return this.setReceivedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ReceivedReward.prototype.hasReceivedAt = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional string media_id = 5;
 * @return {string}
 */
proto.jungletv.ReceivedReward.prototype.getMediaId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ReceivedReward} returns this
 */
proto.jungletv.ReceivedReward.prototype.setMediaId = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional QueueYouTubeVideoData youtube_video_data = 6;
 * @return {?proto.jungletv.QueueYouTubeVideoData}
 */
proto.jungletv.ReceivedReward.prototype.getYoutubeVideoData = function() {
  return /** @type{?proto.jungletv.QueueYouTubeVideoData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.QueueYouTubeVideoData, 6));
};


/**
 * @param {?proto.jungletv.QueueYouTubeVideoData|undefined} value
 * @return {!proto.jungletv.ReceivedReward} returns this
*/
proto.jungletv.ReceivedReward.prototype.setYoutubeVideoData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 6, proto.jungletv.ReceivedReward.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.ReceivedReward} returns this
 */
proto.jungletv.ReceivedReward.prototype.clearYoutubeVideoData = function() {
  return this.setYoutubeVideoData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.ReceivedReward.prototype.hasYoutubeVideoData = function() {
  return jspb.Message.getField(this, 6) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.RewardHistoryResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RewardHistoryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RewardHistoryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RewardHistoryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RewardHistoryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    receivedRewardsList: jspb.Message.toObjectList(msg.getReceivedRewardsList(),
    proto.jungletv.ReceivedReward.toObject, includeInstance),
    offset: jspb.Message.getFieldWithDefault(msg, 2, 0),
    total: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RewardHistoryResponse}
 */
proto.jungletv.RewardHistoryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RewardHistoryResponse;
  return proto.jungletv.RewardHistoryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RewardHistoryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RewardHistoryResponse}
 */
proto.jungletv.RewardHistoryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.ReceivedReward;
      reader.readMessage(value,proto.jungletv.ReceivedReward.deserializeBinaryFromReader);
      msg.addReceivedRewards(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setOffset(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTotal(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RewardHistoryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RewardHistoryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RewardHistoryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RewardHistoryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getReceivedRewardsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.jungletv.ReceivedReward.serializeBinaryToWriter
    );
  }
  f = message.getOffset();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getTotal();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * repeated ReceivedReward received_rewards = 1;
 * @return {!Array<!proto.jungletv.ReceivedReward>}
 */
proto.jungletv.RewardHistoryResponse.prototype.getReceivedRewardsList = function() {
  return /** @type{!Array<!proto.jungletv.ReceivedReward>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jungletv.ReceivedReward, 1));
};


/**
 * @param {!Array<!proto.jungletv.ReceivedReward>} value
 * @return {!proto.jungletv.RewardHistoryResponse} returns this
*/
proto.jungletv.RewardHistoryResponse.prototype.setReceivedRewardsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.jungletv.ReceivedReward=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jungletv.ReceivedReward}
 */
proto.jungletv.RewardHistoryResponse.prototype.addReceivedRewards = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.jungletv.ReceivedReward, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.RewardHistoryResponse} returns this
 */
proto.jungletv.RewardHistoryResponse.prototype.clearReceivedRewardsList = function() {
  return this.setReceivedRewardsList([]);
};


/**
 * optional uint64 offset = 2;
 * @return {number}
 */
proto.jungletv.RewardHistoryResponse.prototype.getOffset = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.RewardHistoryResponse} returns this
 */
proto.jungletv.RewardHistoryResponse.prototype.setOffset = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 total = 3;
 * @return {number}
 */
proto.jungletv.RewardHistoryResponse.prototype.getTotal = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.RewardHistoryResponse} returns this
 */
proto.jungletv.RewardHistoryResponse.prototype.setTotal = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.WithdrawalHistoryRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.WithdrawalHistoryRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.WithdrawalHistoryRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.WithdrawalHistoryRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    paginationParams: (f = msg.getPaginationParams()) && proto.jungletv.PaginationParameters.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.WithdrawalHistoryRequest}
 */
proto.jungletv.WithdrawalHistoryRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.WithdrawalHistoryRequest;
  return proto.jungletv.WithdrawalHistoryRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.WithdrawalHistoryRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.WithdrawalHistoryRequest}
 */
proto.jungletv.WithdrawalHistoryRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.PaginationParameters;
      reader.readMessage(value,proto.jungletv.PaginationParameters.deserializeBinaryFromReader);
      msg.setPaginationParams(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.WithdrawalHistoryRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.WithdrawalHistoryRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.WithdrawalHistoryRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.WithdrawalHistoryRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPaginationParams();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.jungletv.PaginationParameters.serializeBinaryToWriter
    );
  }
};


/**
 * optional PaginationParameters pagination_params = 1;
 * @return {?proto.jungletv.PaginationParameters}
 */
proto.jungletv.WithdrawalHistoryRequest.prototype.getPaginationParams = function() {
  return /** @type{?proto.jungletv.PaginationParameters} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.PaginationParameters, 1));
};


/**
 * @param {?proto.jungletv.PaginationParameters|undefined} value
 * @return {!proto.jungletv.WithdrawalHistoryRequest} returns this
*/
proto.jungletv.WithdrawalHistoryRequest.prototype.setPaginationParams = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.WithdrawalHistoryRequest} returns this
 */
proto.jungletv.WithdrawalHistoryRequest.prototype.clearPaginationParams = function() {
  return this.setPaginationParams(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.WithdrawalHistoryRequest.prototype.hasPaginationParams = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.Withdrawal.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.Withdrawal.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.Withdrawal} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.Withdrawal.toObject = function(includeInstance, msg) {
  var f, obj = {
    txHash: jspb.Message.getFieldWithDefault(msg, 1, ""),
    rewardsAddress: jspb.Message.getFieldWithDefault(msg, 2, ""),
    amount: jspb.Message.getFieldWithDefault(msg, 3, ""),
    startedAt: (f = msg.getStartedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    completedAt: (f = msg.getCompletedAt()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.Withdrawal}
 */
proto.jungletv.Withdrawal.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.Withdrawal;
  return proto.jungletv.Withdrawal.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.Withdrawal} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.Withdrawal}
 */
proto.jungletv.Withdrawal.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setTxHash(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setRewardsAddress(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAmount(value);
      break;
    case 4:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setStartedAt(value);
      break;
    case 5:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCompletedAt(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.Withdrawal.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.Withdrawal.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.Withdrawal} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.Withdrawal.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTxHash();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getRewardsAddress();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getAmount();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getStartedAt();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getCompletedAt();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional string tx_hash = 1;
 * @return {string}
 */
proto.jungletv.Withdrawal.prototype.getTxHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.Withdrawal} returns this
 */
proto.jungletv.Withdrawal.prototype.setTxHash = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string rewards_address = 2;
 * @return {string}
 */
proto.jungletv.Withdrawal.prototype.getRewardsAddress = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.Withdrawal} returns this
 */
proto.jungletv.Withdrawal.prototype.setRewardsAddress = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string amount = 3;
 * @return {string}
 */
proto.jungletv.Withdrawal.prototype.getAmount = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.Withdrawal} returns this
 */
proto.jungletv.Withdrawal.prototype.setAmount = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional google.protobuf.Timestamp started_at = 4;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.Withdrawal.prototype.getStartedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 4));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.Withdrawal} returns this
*/
proto.jungletv.Withdrawal.prototype.setStartedAt = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.Withdrawal} returns this
 */
proto.jungletv.Withdrawal.prototype.clearStartedAt = function() {
  return this.setStartedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.Withdrawal.prototype.hasStartedAt = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional google.protobuf.Timestamp completed_at = 5;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.Withdrawal.prototype.getCompletedAt = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 5));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.Withdrawal} returns this
*/
proto.jungletv.Withdrawal.prototype.setCompletedAt = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.Withdrawal} returns this
 */
proto.jungletv.Withdrawal.prototype.clearCompletedAt = function() {
  return this.setCompletedAt(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.Withdrawal.prototype.hasCompletedAt = function() {
  return jspb.Message.getField(this, 5) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.WithdrawalHistoryResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.WithdrawalHistoryResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.WithdrawalHistoryResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.WithdrawalHistoryResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.WithdrawalHistoryResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    withdrawalsList: jspb.Message.toObjectList(msg.getWithdrawalsList(),
    proto.jungletv.Withdrawal.toObject, includeInstance),
    offset: jspb.Message.getFieldWithDefault(msg, 2, 0),
    total: jspb.Message.getFieldWithDefault(msg, 3, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.WithdrawalHistoryResponse}
 */
proto.jungletv.WithdrawalHistoryResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.WithdrawalHistoryResponse;
  return proto.jungletv.WithdrawalHistoryResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.WithdrawalHistoryResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.WithdrawalHistoryResponse}
 */
proto.jungletv.WithdrawalHistoryResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.Withdrawal;
      reader.readMessage(value,proto.jungletv.Withdrawal.deserializeBinaryFromReader);
      msg.addWithdrawals(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setOffset(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readUint64());
      msg.setTotal(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.WithdrawalHistoryResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.WithdrawalHistoryResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.WithdrawalHistoryResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.WithdrawalHistoryResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getWithdrawalsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.jungletv.Withdrawal.serializeBinaryToWriter
    );
  }
  f = message.getOffset();
  if (f !== 0) {
    writer.writeUint64(
      2,
      f
    );
  }
  f = message.getTotal();
  if (f !== 0) {
    writer.writeUint64(
      3,
      f
    );
  }
};


/**
 * repeated Withdrawal withdrawals = 1;
 * @return {!Array<!proto.jungletv.Withdrawal>}
 */
proto.jungletv.WithdrawalHistoryResponse.prototype.getWithdrawalsList = function() {
  return /** @type{!Array<!proto.jungletv.Withdrawal>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jungletv.Withdrawal, 1));
};


/**
 * @param {!Array<!proto.jungletv.Withdrawal>} value
 * @return {!proto.jungletv.WithdrawalHistoryResponse} returns this
*/
proto.jungletv.WithdrawalHistoryResponse.prototype.setWithdrawalsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.jungletv.Withdrawal=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jungletv.Withdrawal}
 */
proto.jungletv.WithdrawalHistoryResponse.prototype.addWithdrawals = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.jungletv.Withdrawal, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.WithdrawalHistoryResponse} returns this
 */
proto.jungletv.WithdrawalHistoryResponse.prototype.clearWithdrawalsList = function() {
  return this.setWithdrawalsList([]);
};


/**
 * optional uint64 offset = 2;
 * @return {number}
 */
proto.jungletv.WithdrawalHistoryResponse.prototype.getOffset = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.WithdrawalHistoryResponse} returns this
 */
proto.jungletv.WithdrawalHistoryResponse.prototype.setOffset = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional uint64 total = 3;
 * @return {number}
 */
proto.jungletv.WithdrawalHistoryResponse.prototype.getTotal = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 3, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.WithdrawalHistoryResponse} returns this
 */
proto.jungletv.WithdrawalHistoryResponse.prototype.setTotal = function(value) {
  return jspb.Message.setProto3IntField(this, 3, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetCrowdfundedSkippingEnabledRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetCrowdfundedSkippingEnabledRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetCrowdfundedSkippingEnabledRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetCrowdfundedSkippingEnabledRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    enabled: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetCrowdfundedSkippingEnabledRequest}
 */
proto.jungletv.SetCrowdfundedSkippingEnabledRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetCrowdfundedSkippingEnabledRequest;
  return proto.jungletv.SetCrowdfundedSkippingEnabledRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetCrowdfundedSkippingEnabledRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetCrowdfundedSkippingEnabledRequest}
 */
proto.jungletv.SetCrowdfundedSkippingEnabledRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setEnabled(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetCrowdfundedSkippingEnabledRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetCrowdfundedSkippingEnabledRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetCrowdfundedSkippingEnabledRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetCrowdfundedSkippingEnabledRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEnabled();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool enabled = 1;
 * @return {boolean}
 */
proto.jungletv.SetCrowdfundedSkippingEnabledRequest.prototype.getEnabled = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.SetCrowdfundedSkippingEnabledRequest} returns this
 */
proto.jungletv.SetCrowdfundedSkippingEnabledRequest.prototype.setEnabled = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetCrowdfundedSkippingEnabledResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetCrowdfundedSkippingEnabledResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetCrowdfundedSkippingEnabledResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetCrowdfundedSkippingEnabledResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetCrowdfundedSkippingEnabledResponse}
 */
proto.jungletv.SetCrowdfundedSkippingEnabledResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetCrowdfundedSkippingEnabledResponse;
  return proto.jungletv.SetCrowdfundedSkippingEnabledResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetCrowdfundedSkippingEnabledResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetCrowdfundedSkippingEnabledResponse}
 */
proto.jungletv.SetCrowdfundedSkippingEnabledResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetCrowdfundedSkippingEnabledResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetCrowdfundedSkippingEnabledResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetCrowdfundedSkippingEnabledResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetCrowdfundedSkippingEnabledResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetSkipPriceMultiplierRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetSkipPriceMultiplierRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetSkipPriceMultiplierRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetSkipPriceMultiplierRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    multiplier: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetSkipPriceMultiplierRequest}
 */
proto.jungletv.SetSkipPriceMultiplierRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetSkipPriceMultiplierRequest;
  return proto.jungletv.SetSkipPriceMultiplierRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetSkipPriceMultiplierRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetSkipPriceMultiplierRequest}
 */
proto.jungletv.SetSkipPriceMultiplierRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMultiplier(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetSkipPriceMultiplierRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetSkipPriceMultiplierRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetSkipPriceMultiplierRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetSkipPriceMultiplierRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getMultiplier();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
};


/**
 * optional int32 multiplier = 1;
 * @return {number}
 */
proto.jungletv.SetSkipPriceMultiplierRequest.prototype.getMultiplier = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.SetSkipPriceMultiplierRequest} returns this
 */
proto.jungletv.SetSkipPriceMultiplierRequest.prototype.setMultiplier = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SetSkipPriceMultiplierResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SetSkipPriceMultiplierResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SetSkipPriceMultiplierResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetSkipPriceMultiplierResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SetSkipPriceMultiplierResponse}
 */
proto.jungletv.SetSkipPriceMultiplierResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SetSkipPriceMultiplierResponse;
  return proto.jungletv.SetSkipPriceMultiplierResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SetSkipPriceMultiplierResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SetSkipPriceMultiplierResponse}
 */
proto.jungletv.SetSkipPriceMultiplierResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SetSkipPriceMultiplierResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SetSkipPriceMultiplierResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SetSkipPriceMultiplierResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SetSkipPriceMultiplierResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ProduceSegchaChallengeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ProduceSegchaChallengeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ProduceSegchaChallengeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ProduceSegchaChallengeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ProduceSegchaChallengeRequest}
 */
proto.jungletv.ProduceSegchaChallengeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ProduceSegchaChallengeRequest;
  return proto.jungletv.ProduceSegchaChallengeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ProduceSegchaChallengeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ProduceSegchaChallengeRequest}
 */
proto.jungletv.ProduceSegchaChallengeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ProduceSegchaChallengeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ProduceSegchaChallengeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ProduceSegchaChallengeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ProduceSegchaChallengeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.jungletv.ProduceSegchaChallengeResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ProduceSegchaChallengeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ProduceSegchaChallengeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ProduceSegchaChallengeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ProduceSegchaChallengeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    challengeId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    stepsList: jspb.Message.toObjectList(msg.getStepsList(),
    proto.jungletv.SegchaChallengeStep.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ProduceSegchaChallengeResponse}
 */
proto.jungletv.ProduceSegchaChallengeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ProduceSegchaChallengeResponse;
  return proto.jungletv.ProduceSegchaChallengeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ProduceSegchaChallengeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ProduceSegchaChallengeResponse}
 */
proto.jungletv.ProduceSegchaChallengeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setChallengeId(value);
      break;
    case 2:
      var value = new proto.jungletv.SegchaChallengeStep;
      reader.readMessage(value,proto.jungletv.SegchaChallengeStep.deserializeBinaryFromReader);
      msg.addSteps(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ProduceSegchaChallengeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ProduceSegchaChallengeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ProduceSegchaChallengeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ProduceSegchaChallengeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getChallengeId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getStepsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.jungletv.SegchaChallengeStep.serializeBinaryToWriter
    );
  }
};


/**
 * optional string challenge_id = 1;
 * @return {string}
 */
proto.jungletv.ProduceSegchaChallengeResponse.prototype.getChallengeId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ProduceSegchaChallengeResponse} returns this
 */
proto.jungletv.ProduceSegchaChallengeResponse.prototype.setChallengeId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated SegchaChallengeStep steps = 2;
 * @return {!Array<!proto.jungletv.SegchaChallengeStep>}
 */
proto.jungletv.ProduceSegchaChallengeResponse.prototype.getStepsList = function() {
  return /** @type{!Array<!proto.jungletv.SegchaChallengeStep>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.jungletv.SegchaChallengeStep, 2));
};


/**
 * @param {!Array<!proto.jungletv.SegchaChallengeStep>} value
 * @return {!proto.jungletv.ProduceSegchaChallengeResponse} returns this
*/
proto.jungletv.ProduceSegchaChallengeResponse.prototype.setStepsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.jungletv.SegchaChallengeStep=} opt_value
 * @param {number=} opt_index
 * @return {!proto.jungletv.SegchaChallengeStep}
 */
proto.jungletv.ProduceSegchaChallengeResponse.prototype.addSteps = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.jungletv.SegchaChallengeStep, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.jungletv.ProduceSegchaChallengeResponse} returns this
 */
proto.jungletv.ProduceSegchaChallengeResponse.prototype.clearStepsList = function() {
  return this.setStepsList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.SegchaChallengeStep.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SegchaChallengeStep.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SegchaChallengeStep} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SegchaChallengeStep.toObject = function(includeInstance, msg) {
  var f, obj = {
    image: msg.getImage_asB64()
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.SegchaChallengeStep}
 */
proto.jungletv.SegchaChallengeStep.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SegchaChallengeStep;
  return proto.jungletv.SegchaChallengeStep.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SegchaChallengeStep} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SegchaChallengeStep}
 */
proto.jungletv.SegchaChallengeStep.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setImage(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.SegchaChallengeStep.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SegchaChallengeStep.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SegchaChallengeStep} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SegchaChallengeStep.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getImage_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
};


/**
 * optional bytes image = 1;
 * @return {!(string|Uint8Array)}
 */
proto.jungletv.SegchaChallengeStep.prototype.getImage = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes image = 1;
 * This is a type-conversion wrapper around `getImage()`
 * @return {string}
 */
proto.jungletv.SegchaChallengeStep.prototype.getImage_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getImage()));
};


/**
 * optional bytes image = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getImage()`
 * @return {!Uint8Array}
 */
proto.jungletv.SegchaChallengeStep.prototype.getImage_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getImage()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.jungletv.SegchaChallengeStep} returns this
 */
proto.jungletv.SegchaChallengeStep.prototype.setImage = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ConfirmRaffleWinnerRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ConfirmRaffleWinnerRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ConfirmRaffleWinnerRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ConfirmRaffleWinnerRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    raffleId: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ConfirmRaffleWinnerRequest}
 */
proto.jungletv.ConfirmRaffleWinnerRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ConfirmRaffleWinnerRequest;
  return proto.jungletv.ConfirmRaffleWinnerRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ConfirmRaffleWinnerRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ConfirmRaffleWinnerRequest}
 */
proto.jungletv.ConfirmRaffleWinnerRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setRaffleId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ConfirmRaffleWinnerRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ConfirmRaffleWinnerRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ConfirmRaffleWinnerRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ConfirmRaffleWinnerRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRaffleId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string raffle_id = 1;
 * @return {string}
 */
proto.jungletv.ConfirmRaffleWinnerRequest.prototype.getRaffleId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.ConfirmRaffleWinnerRequest} returns this
 */
proto.jungletv.ConfirmRaffleWinnerRequest.prototype.setRaffleId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.ConfirmRaffleWinnerResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ConfirmRaffleWinnerResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ConfirmRaffleWinnerResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ConfirmRaffleWinnerResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.ConfirmRaffleWinnerResponse}
 */
proto.jungletv.ConfirmRaffleWinnerResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ConfirmRaffleWinnerResponse;
  return proto.jungletv.ConfirmRaffleWinnerResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ConfirmRaffleWinnerResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ConfirmRaffleWinnerResponse}
 */
proto.jungletv.ConfirmRaffleWinnerResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.ConfirmRaffleWinnerResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ConfirmRaffleWinnerResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ConfirmRaffleWinnerResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ConfirmRaffleWinnerResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.CompleteRaffleRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.CompleteRaffleRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.CompleteRaffleRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.CompleteRaffleRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    raffleId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    prizeTxHash: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.CompleteRaffleRequest}
 */
proto.jungletv.CompleteRaffleRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.CompleteRaffleRequest;
  return proto.jungletv.CompleteRaffleRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.CompleteRaffleRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.CompleteRaffleRequest}
 */
proto.jungletv.CompleteRaffleRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setRaffleId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setPrizeTxHash(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.CompleteRaffleRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.CompleteRaffleRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.CompleteRaffleRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.CompleteRaffleRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRaffleId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPrizeTxHash();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string raffle_id = 1;
 * @return {string}
 */
proto.jungletv.CompleteRaffleRequest.prototype.getRaffleId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.CompleteRaffleRequest} returns this
 */
proto.jungletv.CompleteRaffleRequest.prototype.setRaffleId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string prize_tx_hash = 2;
 * @return {string}
 */
proto.jungletv.CompleteRaffleRequest.prototype.getPrizeTxHash = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.CompleteRaffleRequest} returns this
 */
proto.jungletv.CompleteRaffleRequest.prototype.setPrizeTxHash = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.CompleteRaffleResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.CompleteRaffleResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.CompleteRaffleResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.CompleteRaffleResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.CompleteRaffleResponse}
 */
proto.jungletv.CompleteRaffleResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.CompleteRaffleResponse;
  return proto.jungletv.CompleteRaffleResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.CompleteRaffleResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.CompleteRaffleResponse}
 */
proto.jungletv.CompleteRaffleResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.CompleteRaffleResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.CompleteRaffleResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.CompleteRaffleResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.CompleteRaffleResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RedrawRaffleRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RedrawRaffleRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RedrawRaffleRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RedrawRaffleRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    raffleId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    reason: jspb.Message.getFieldWithDefault(msg, 2, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RedrawRaffleRequest}
 */
proto.jungletv.RedrawRaffleRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RedrawRaffleRequest;
  return proto.jungletv.RedrawRaffleRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RedrawRaffleRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RedrawRaffleRequest}
 */
proto.jungletv.RedrawRaffleRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setRaffleId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RedrawRaffleRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RedrawRaffleRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RedrawRaffleRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RedrawRaffleRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRaffleId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getReason();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
};


/**
 * optional string raffle_id = 1;
 * @return {string}
 */
proto.jungletv.RedrawRaffleRequest.prototype.getRaffleId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.RedrawRaffleRequest} returns this
 */
proto.jungletv.RedrawRaffleRequest.prototype.setRaffleId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string reason = 2;
 * @return {string}
 */
proto.jungletv.RedrawRaffleRequest.prototype.getReason = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.RedrawRaffleRequest} returns this
 */
proto.jungletv.RedrawRaffleRequest.prototype.setReason = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.RedrawRaffleResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.RedrawRaffleResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.RedrawRaffleResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RedrawRaffleResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.RedrawRaffleResponse}
 */
proto.jungletv.RedrawRaffleResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.RedrawRaffleResponse;
  return proto.jungletv.RedrawRaffleResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.RedrawRaffleResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.RedrawRaffleResponse}
 */
proto.jungletv.RedrawRaffleResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.RedrawRaffleResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.RedrawRaffleResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.RedrawRaffleResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.RedrawRaffleResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.OngoingRaffleInfoRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.OngoingRaffleInfoRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.OngoingRaffleInfoRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.OngoingRaffleInfoRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.OngoingRaffleInfoRequest}
 */
proto.jungletv.OngoingRaffleInfoRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.OngoingRaffleInfoRequest;
  return proto.jungletv.OngoingRaffleInfoRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.OngoingRaffleInfoRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.OngoingRaffleInfoRequest}
 */
proto.jungletv.OngoingRaffleInfoRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.OngoingRaffleInfoRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.OngoingRaffleInfoRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.OngoingRaffleInfoRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.OngoingRaffleInfoRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.OngoingRaffleInfoResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.OngoingRaffleInfoResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.OngoingRaffleInfoResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.OngoingRaffleInfoResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    raffleInfo: (f = msg.getRaffleInfo()) && proto.jungletv.OngoingRaffleInfo.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.OngoingRaffleInfoResponse}
 */
proto.jungletv.OngoingRaffleInfoResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.OngoingRaffleInfoResponse;
  return proto.jungletv.OngoingRaffleInfoResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.OngoingRaffleInfoResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.OngoingRaffleInfoResponse}
 */
proto.jungletv.OngoingRaffleInfoResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.jungletv.OngoingRaffleInfo;
      reader.readMessage(value,proto.jungletv.OngoingRaffleInfo.deserializeBinaryFromReader);
      msg.setRaffleInfo(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.OngoingRaffleInfoResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.OngoingRaffleInfoResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.OngoingRaffleInfoResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.OngoingRaffleInfoResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRaffleInfo();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.jungletv.OngoingRaffleInfo.serializeBinaryToWriter
    );
  }
};


/**
 * optional OngoingRaffleInfo raffle_info = 1;
 * @return {?proto.jungletv.OngoingRaffleInfo}
 */
proto.jungletv.OngoingRaffleInfoResponse.prototype.getRaffleInfo = function() {
  return /** @type{?proto.jungletv.OngoingRaffleInfo} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.OngoingRaffleInfo, 1));
};


/**
 * @param {?proto.jungletv.OngoingRaffleInfo|undefined} value
 * @return {!proto.jungletv.OngoingRaffleInfoResponse} returns this
*/
proto.jungletv.OngoingRaffleInfoResponse.prototype.setRaffleInfo = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.OngoingRaffleInfoResponse} returns this
 */
proto.jungletv.OngoingRaffleInfoResponse.prototype.clearRaffleInfo = function() {
  return this.setRaffleInfo(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.OngoingRaffleInfoResponse.prototype.hasRaffleInfo = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.jungletv.OngoingRaffleInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.OngoingRaffleInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.OngoingRaffleInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.OngoingRaffleInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    raffleId: jspb.Message.getFieldWithDefault(msg, 1, ""),
    entriesUrl: jspb.Message.getFieldWithDefault(msg, 2, ""),
    infoUrl: jspb.Message.getFieldWithDefault(msg, 3, ""),
    periodStart: (f = msg.getPeriodStart()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    periodEnd: (f = msg.getPeriodEnd()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    totalTickets: jspb.Message.getFieldWithDefault(msg, 6, 0),
    userTickets: jspb.Message.getFieldWithDefault(msg, 7, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.jungletv.OngoingRaffleInfo}
 */
proto.jungletv.OngoingRaffleInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.OngoingRaffleInfo;
  return proto.jungletv.OngoingRaffleInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.OngoingRaffleInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.OngoingRaffleInfo}
 */
proto.jungletv.OngoingRaffleInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setRaffleId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setEntriesUrl(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setInfoUrl(value);
      break;
    case 4:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setPeriodStart(value);
      break;
    case 5:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setPeriodEnd(value);
      break;
    case 6:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setTotalTickets(value);
      break;
    case 7:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setUserTickets(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.jungletv.OngoingRaffleInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.OngoingRaffleInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.OngoingRaffleInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.OngoingRaffleInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRaffleId();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getEntriesUrl();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getInfoUrl();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getPeriodStart();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getPeriodEnd();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getTotalTickets();
  if (f !== 0) {
    writer.writeUint32(
      6,
      f
    );
  }
  f = /** @type {number} */ (jspb.Message.getField(message, 7));
  if (f != null) {
    writer.writeUint32(
      7,
      f
    );
  }
};


/**
 * optional string raffle_id = 1;
 * @return {string}
 */
proto.jungletv.OngoingRaffleInfo.prototype.getRaffleId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.OngoingRaffleInfo} returns this
 */
proto.jungletv.OngoingRaffleInfo.prototype.setRaffleId = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string entries_url = 2;
 * @return {string}
 */
proto.jungletv.OngoingRaffleInfo.prototype.getEntriesUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.OngoingRaffleInfo} returns this
 */
proto.jungletv.OngoingRaffleInfo.prototype.setEntriesUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional string info_url = 3;
 * @return {string}
 */
proto.jungletv.OngoingRaffleInfo.prototype.getInfoUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.OngoingRaffleInfo} returns this
 */
proto.jungletv.OngoingRaffleInfo.prototype.setInfoUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional google.protobuf.Timestamp period_start = 4;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.OngoingRaffleInfo.prototype.getPeriodStart = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 4));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.OngoingRaffleInfo} returns this
*/
proto.jungletv.OngoingRaffleInfo.prototype.setPeriodStart = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.OngoingRaffleInfo} returns this
 */
proto.jungletv.OngoingRaffleInfo.prototype.clearPeriodStart = function() {
  return this.setPeriodStart(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.OngoingRaffleInfo.prototype.hasPeriodStart = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional google.protobuf.Timestamp period_end = 5;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.jungletv.OngoingRaffleInfo.prototype.getPeriodEnd = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 5));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.jungletv.OngoingRaffleInfo} returns this
*/
proto.jungletv.OngoingRaffleInfo.prototype.setPeriodEnd = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.OngoingRaffleInfo} returns this
 */
proto.jungletv.OngoingRaffleInfo.prototype.clearPeriodEnd = function() {
  return this.setPeriodEnd(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.OngoingRaffleInfo.prototype.hasPeriodEnd = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional uint32 total_tickets = 6;
 * @return {number}
 */
proto.jungletv.OngoingRaffleInfo.prototype.getTotalTickets = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 6, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.OngoingRaffleInfo} returns this
 */
proto.jungletv.OngoingRaffleInfo.prototype.setTotalTickets = function(value) {
  return jspb.Message.setProto3IntField(this, 6, value);
};


/**
 * optional uint32 user_tickets = 7;
 * @return {number}
 */
proto.jungletv.OngoingRaffleInfo.prototype.getUserTickets = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 7, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.OngoingRaffleInfo} returns this
 */
proto.jungletv.OngoingRaffleInfo.prototype.setUserTickets = function(value) {
  return jspb.Message.setField(this, 7, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.jungletv.OngoingRaffleInfo} returns this
 */
proto.jungletv.OngoingRaffleInfo.prototype.clearUserTickets = function() {
  return jspb.Message.setField(this, 7, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.OngoingRaffleInfo.prototype.hasUserTickets = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * @enum {number}
 */
proto.jungletv.EnqueueMediaTicketStatus = {
  ACTIVE: 0,
  PAID: 1,
  EXPIRED: 2
};

/**
 * @enum {number}
 */
proto.jungletv.SkipStatus = {
  SKIP_STATUS_ALLOWED: 0,
  SKIP_STATUS_UNSKIPPABLE: 1,
  SKIP_STATUS_END_OF_MEDIA_PERIOD: 2,
  SKIP_STATUS_NO_MEDIA: 3,
  SKIP_STATUS_UNAVAILABLE: 4,
  SKIP_STATUS_DISABLED: 5,
  SKIP_STATUS_START_OF_MEDIA_PERIOD: 6
};

/**
 * @enum {number}
 */
proto.jungletv.UserRole = {
  MODERATOR: 0,
  TIER_1_REQUESTER: 1,
  TIER_2_REQUESTER: 2,
  TIER_3_REQUESTER: 3,
  CURRENT_ENTRY_REQUESTER: 4
};

/**
 * @enum {number}
 */
proto.jungletv.ForcedTicketEnqueueType = {
  ENQUEUE: 0,
  PLAY_NEXT: 1,
  PLAY_NOW: 2
};

/**
 * @enum {number}
 */
proto.jungletv.ChatDisabledReason = {
  UNSPECIFIED: 0,
  MODERATOR_NOT_PRESENT: 1
};

/**
 * @enum {number}
 */
proto.jungletv.AllowedVideoEnqueuingType = {
  DISABLED: 0,
  STAFF_ONLY: 1,
  ENABLED: 2
};

/**
 * @enum {number}
 */
proto.jungletv.PermissionLevel = {
  UNAUTHENTICATED: 0,
  USER: 1,
  ADMIN: 2
};

goog.object.extend(exports, proto.jungletv);
