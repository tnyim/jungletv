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
goog.exportSymbol('proto.jungletv.ConsumeChatRequest', null, global);
goog.exportSymbol('proto.jungletv.ConsumeMediaRequest', null, global);
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
goog.exportSymbol('proto.jungletv.MediaConsumptionCheckpoint', null, global);
goog.exportSymbol('proto.jungletv.MediaConsumptionCheckpoint.MediaInfoCase', null, global);
goog.exportSymbol('proto.jungletv.MonitorQueueRequest', null, global);
goog.exportSymbol('proto.jungletv.MonitorTicketRequest', null, global);
goog.exportSymbol('proto.jungletv.NowPlayingStubData', null, global);
goog.exportSymbol('proto.jungletv.NowPlayingYouTubeVideoData', null, global);
goog.exportSymbol('proto.jungletv.PermissionLevel', null, global);
goog.exportSymbol('proto.jungletv.ProofOfWorkTask', null, global);
goog.exportSymbol('proto.jungletv.Queue', null, global);
goog.exportSymbol('proto.jungletv.QueueEntry', null, global);
goog.exportSymbol('proto.jungletv.QueueEntry.MediaInfoCase', null, global);
goog.exportSymbol('proto.jungletv.QueueYouTubeVideoData', null, global);
goog.exportSymbol('proto.jungletv.RemoveBanRequest', null, global);
goog.exportSymbol('proto.jungletv.RemoveBanResponse', null, global);
goog.exportSymbol('proto.jungletv.RemoveChatMessageRequest', null, global);
goog.exportSymbol('proto.jungletv.RemoveChatMessageResponse', null, global);
goog.exportSymbol('proto.jungletv.RemoveQueueEntryRequest', null, global);
goog.exportSymbol('proto.jungletv.RemoveQueueEntryResponse', null, global);
goog.exportSymbol('proto.jungletv.RewardInfoRequest', null, global);
goog.exportSymbol('proto.jungletv.RewardInfoResponse', null, global);
goog.exportSymbol('proto.jungletv.SendChatMessageRequest', null, global);
goog.exportSymbol('proto.jungletv.SendChatMessageResponse', null, global);
goog.exportSymbol('proto.jungletv.SetChatSettingsRequest', null, global);
goog.exportSymbol('proto.jungletv.SetChatSettingsResponse', null, global);
goog.exportSymbol('proto.jungletv.SetVideoEnqueuingEnabledRequest', null, global);
goog.exportSymbol('proto.jungletv.SetVideoEnqueuingEnabledResponse', null, global);
goog.exportSymbol('proto.jungletv.SignInAccountUnopened', null, global);
goog.exportSymbol('proto.jungletv.SignInProgress', null, global);
goog.exportSymbol('proto.jungletv.SignInProgress.StepCase', null, global);
goog.exportSymbol('proto.jungletv.SignInRequest', null, global);
goog.exportSymbol('proto.jungletv.SignInResponse', null, global);
goog.exportSymbol('proto.jungletv.SignInVerification', null, global);
goog.exportSymbol('proto.jungletv.SignInVerificationExpired', null, global);
goog.exportSymbol('proto.jungletv.SubmitActivityChallengeRequest', null, global);
goog.exportSymbol('proto.jungletv.SubmitActivityChallengeResponse', null, global);
goog.exportSymbol('proto.jungletv.SubmitProofOfWorkRequest', null, global);
goog.exportSymbol('proto.jungletv.SubmitProofOfWorkResponse', null, global);
goog.exportSymbol('proto.jungletv.SystemChatMessage', null, global);
goog.exportSymbol('proto.jungletv.User', null, global);
goog.exportSymbol('proto.jungletv.UserChatMessage', null, global);
goog.exportSymbol('proto.jungletv.UserChatMessagesRequest', null, global);
goog.exportSymbol('proto.jungletv.UserChatMessagesResponse', null, global);
goog.exportSymbol('proto.jungletv.UserPermissionLevelRequest', null, global);
goog.exportSymbol('proto.jungletv.UserPermissionLevelResponse', null, global);
goog.exportSymbol('proto.jungletv.UserRole', null, global);
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
proto.jungletv.ProofOfWorkTask = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.ProofOfWorkTask, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.ProofOfWorkTask.displayName = 'proto.jungletv.ProofOfWorkTask';
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
proto.jungletv.SubmitProofOfWorkRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SubmitProofOfWorkRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SubmitProofOfWorkRequest.displayName = 'proto.jungletv.SubmitProofOfWorkRequest';
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
proto.jungletv.SubmitProofOfWorkResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.jungletv.SubmitProofOfWorkResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.jungletv.SubmitProofOfWorkResponse.displayName = 'proto.jungletv.SubmitProofOfWorkResponse';
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
proto.jungletv.EnqueueMediaTicket.oneofGroups_ = [[10]];

/**
 * @enum {number}
 */
proto.jungletv.EnqueueMediaTicket.MediaInfoCase = {
  MEDIA_INFO_NOT_SET: 0,
  YOUTUBE_VIDEO_DATA: 10
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
  f = message.getYoutubeVideoData();
  if (f != null) {
    writer.writeMessage(
      10,
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
 * optional QueueYouTubeVideoData youtube_video_data = 10;
 * @return {?proto.jungletv.QueueYouTubeVideoData}
 */
proto.jungletv.EnqueueMediaTicket.prototype.getYoutubeVideoData = function() {
  return /** @type{?proto.jungletv.QueueYouTubeVideoData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.QueueYouTubeVideoData, 10));
};


/**
 * @param {?proto.jungletv.QueueYouTubeVideoData|undefined} value
 * @return {!proto.jungletv.EnqueueMediaTicket} returns this
*/
proto.jungletv.EnqueueMediaTicket.prototype.setYoutubeVideoData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 10, proto.jungletv.EnqueueMediaTicket.oneofGroups_[0], value);
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
  return jspb.Message.getField(this, 10) != null;
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
    participateInPow: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
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
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setParticipateInPow(value);
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
  f = message.getParticipateInPow();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool participate_in_pow = 1;
 * @return {boolean}
 */
proto.jungletv.ConsumeMediaRequest.prototype.getParticipateInPow = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.ConsumeMediaRequest} returns this
 */
proto.jungletv.ConsumeMediaRequest.prototype.setParticipateInPow = function(value) {
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
proto.jungletv.MediaConsumptionCheckpoint.oneofGroups_ = [[9,10]];

/**
 * @enum {number}
 */
proto.jungletv.MediaConsumptionCheckpoint.MediaInfoCase = {
  MEDIA_INFO_NOT_SET: 0,
  STUB_DATA: 9,
  YOUTUBE_VIDEO_DATA: 10
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
    requestedBy: (f = msg.getRequestedBy()) && proto.jungletv.User.toObject(includeInstance, f),
    requestCost: jspb.Message.getFieldWithDefault(msg, 4, ""),
    currentlyWatching: jspb.Message.getFieldWithDefault(msg, 5, 0),
    reward: jspb.Message.getFieldWithDefault(msg, 6, ""),
    activityChallenge: (f = msg.getActivityChallenge()) && proto.jungletv.ActivityChallenge.toObject(includeInstance, f),
    powTask: (f = msg.getPowTask()) && proto.jungletv.ProofOfWorkTask.toObject(includeInstance, f),
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
      var value = new proto.jungletv.User;
      reader.readMessage(value,proto.jungletv.User.deserializeBinaryFromReader);
      msg.setRequestedBy(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setRequestCost(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readUint32());
      msg.setCurrentlyWatching(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setReward(value);
      break;
    case 7:
      var value = new proto.jungletv.ActivityChallenge;
      reader.readMessage(value,proto.jungletv.ActivityChallenge.deserializeBinaryFromReader);
      msg.setActivityChallenge(value);
      break;
    case 8:
      var value = new proto.jungletv.ProofOfWorkTask;
      reader.readMessage(value,proto.jungletv.ProofOfWorkTask.deserializeBinaryFromReader);
      msg.setPowTask(value);
      break;
    case 9:
      var value = new proto.jungletv.NowPlayingStubData;
      reader.readMessage(value,proto.jungletv.NowPlayingStubData.deserializeBinaryFromReader);
      msg.setStubData(value);
      break;
    case 10:
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
  f = message.getRequestedBy();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.jungletv.User.serializeBinaryToWriter
    );
  }
  f = message.getRequestCost();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getCurrentlyWatching();
  if (f !== 0) {
    writer.writeUint32(
      5,
      f
    );
  }
  f = /** @type {string} */ (jspb.Message.getField(message, 6));
  if (f != null) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getActivityChallenge();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.jungletv.ActivityChallenge.serializeBinaryToWriter
    );
  }
  f = message.getPowTask();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.jungletv.ProofOfWorkTask.serializeBinaryToWriter
    );
  }
  f = message.getStubData();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      proto.jungletv.NowPlayingStubData.serializeBinaryToWriter
    );
  }
  f = message.getYoutubeVideoData();
  if (f != null) {
    writer.writeMessage(
      10,
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
 * optional User requested_by = 3;
 * @return {?proto.jungletv.User}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getRequestedBy = function() {
  return /** @type{?proto.jungletv.User} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.User, 3));
};


/**
 * @param {?proto.jungletv.User|undefined} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
*/
proto.jungletv.MediaConsumptionCheckpoint.prototype.setRequestedBy = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
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
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional string request_cost = 4;
 * @return {string}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getRequestCost = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.setRequestCost = function(value) {
  return jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional uint32 currently_watching = 5;
 * @return {number}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getCurrentlyWatching = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.setCurrentlyWatching = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional string reward = 6;
 * @return {string}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getReward = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.setReward = function(value) {
  return jspb.Message.setField(this, 6, value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.clearReward = function() {
  return jspb.Message.setField(this, 6, undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.hasReward = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional ActivityChallenge activity_challenge = 7;
 * @return {?proto.jungletv.ActivityChallenge}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getActivityChallenge = function() {
  return /** @type{?proto.jungletv.ActivityChallenge} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.ActivityChallenge, 7));
};


/**
 * @param {?proto.jungletv.ActivityChallenge|undefined} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
*/
proto.jungletv.MediaConsumptionCheckpoint.prototype.setActivityChallenge = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
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
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional ProofOfWorkTask pow_task = 8;
 * @return {?proto.jungletv.ProofOfWorkTask}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getPowTask = function() {
  return /** @type{?proto.jungletv.ProofOfWorkTask} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.ProofOfWorkTask, 8));
};


/**
 * @param {?proto.jungletv.ProofOfWorkTask|undefined} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
*/
proto.jungletv.MediaConsumptionCheckpoint.prototype.setPowTask = function(value) {
  return jspb.Message.setWrapperField(this, 8, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.clearPowTask = function() {
  return this.setPowTask(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.hasPowTask = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional NowPlayingStubData stub_data = 9;
 * @return {?proto.jungletv.NowPlayingStubData}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getStubData = function() {
  return /** @type{?proto.jungletv.NowPlayingStubData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.NowPlayingStubData, 9));
};


/**
 * @param {?proto.jungletv.NowPlayingStubData|undefined} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
*/
proto.jungletv.MediaConsumptionCheckpoint.prototype.setStubData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 9, proto.jungletv.MediaConsumptionCheckpoint.oneofGroups_[0], value);
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
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional NowPlayingYouTubeVideoData youtube_video_data = 10;
 * @return {?proto.jungletv.NowPlayingYouTubeVideoData}
 */
proto.jungletv.MediaConsumptionCheckpoint.prototype.getYoutubeVideoData = function() {
  return /** @type{?proto.jungletv.NowPlayingYouTubeVideoData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.NowPlayingYouTubeVideoData, 10));
};


/**
 * @param {?proto.jungletv.NowPlayingYouTubeVideoData|undefined} value
 * @return {!proto.jungletv.MediaConsumptionCheckpoint} returns this
*/
proto.jungletv.MediaConsumptionCheckpoint.prototype.setYoutubeVideoData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 10, proto.jungletv.MediaConsumptionCheckpoint.oneofGroups_[0], value);
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
  return jspb.Message.getField(this, 10) != null;
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
proto.jungletv.ProofOfWorkTask.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.ProofOfWorkTask.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.ProofOfWorkTask} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ProofOfWorkTask.toObject = function(includeInstance, msg) {
  var f, obj = {
    target: msg.getTarget_asB64(),
    previous: msg.getPrevious_asB64()
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
 * @return {!proto.jungletv.ProofOfWorkTask}
 */
proto.jungletv.ProofOfWorkTask.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.ProofOfWorkTask;
  return proto.jungletv.ProofOfWorkTask.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.ProofOfWorkTask} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.ProofOfWorkTask}
 */
proto.jungletv.ProofOfWorkTask.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setTarget(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPrevious(value);
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
proto.jungletv.ProofOfWorkTask.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.ProofOfWorkTask.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.ProofOfWorkTask} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.ProofOfWorkTask.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTarget_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getPrevious_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * optional bytes target = 1;
 * @return {!(string|Uint8Array)}
 */
proto.jungletv.ProofOfWorkTask.prototype.getTarget = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes target = 1;
 * This is a type-conversion wrapper around `getTarget()`
 * @return {string}
 */
proto.jungletv.ProofOfWorkTask.prototype.getTarget_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getTarget()));
};


/**
 * optional bytes target = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getTarget()`
 * @return {!Uint8Array}
 */
proto.jungletv.ProofOfWorkTask.prototype.getTarget_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getTarget()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.jungletv.ProofOfWorkTask} returns this
 */
proto.jungletv.ProofOfWorkTask.prototype.setTarget = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bytes previous = 2;
 * @return {!(string|Uint8Array)}
 */
proto.jungletv.ProofOfWorkTask.prototype.getPrevious = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes previous = 2;
 * This is a type-conversion wrapper around `getPrevious()`
 * @return {string}
 */
proto.jungletv.ProofOfWorkTask.prototype.getPrevious_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPrevious()));
};


/**
 * optional bytes previous = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPrevious()`
 * @return {!Uint8Array}
 */
proto.jungletv.ProofOfWorkTask.prototype.getPrevious_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPrevious()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.jungletv.ProofOfWorkTask} returns this
 */
proto.jungletv.ProofOfWorkTask.prototype.setPrevious = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
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
    channelTitle: jspb.Message.getFieldWithDefault(msg, 4, "")
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
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.jungletv.QueueEntry.oneofGroups_ = [[6]];

/**
 * @enum {number}
 */
proto.jungletv.QueueEntry.MediaInfoCase = {
  MEDIA_INFO_NOT_SET: 0,
  YOUTUBE_VIDEO_DATA: 6
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
    length: (f = msg.getLength()) && google_protobuf_duration_pb.Duration.toObject(includeInstance, f),
    unskippable: jspb.Message.getBooleanFieldWithDefault(msg, 5, false),
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
      var value = new google_protobuf_duration_pb.Duration;
      reader.readMessage(value,google_protobuf_duration_pb.Duration.deserializeBinaryFromReader);
      msg.setLength(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setUnskippable(value);
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
  f = message.getLength();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_duration_pb.Duration.serializeBinaryToWriter
    );
  }
  f = message.getUnskippable();
  if (f) {
    writer.writeBool(
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
 * optional google.protobuf.Duration length = 4;
 * @return {?proto.google.protobuf.Duration}
 */
proto.jungletv.QueueEntry.prototype.getLength = function() {
  return /** @type{?proto.google.protobuf.Duration} */ (
    jspb.Message.getWrapperField(this, google_protobuf_duration_pb.Duration, 4));
};


/**
 * @param {?proto.google.protobuf.Duration|undefined} value
 * @return {!proto.jungletv.QueueEntry} returns this
*/
proto.jungletv.QueueEntry.prototype.setLength = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
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
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional bool unskippable = 5;
 * @return {boolean}
 */
proto.jungletv.QueueEntry.prototype.getUnskippable = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.jungletv.QueueEntry} returns this
 */
proto.jungletv.QueueEntry.prototype.setUnskippable = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};


/**
 * optional QueueYouTubeVideoData youtube_video_data = 6;
 * @return {?proto.jungletv.QueueYouTubeVideoData}
 */
proto.jungletv.QueueEntry.prototype.getYoutubeVideoData = function() {
  return /** @type{?proto.jungletv.QueueYouTubeVideoData} */ (
    jspb.Message.getWrapperField(this, proto.jungletv.QueueYouTubeVideoData, 6));
};


/**
 * @param {?proto.jungletv.QueueYouTubeVideoData|undefined} value
 * @return {!proto.jungletv.QueueEntry} returns this
*/
proto.jungletv.QueueEntry.prototype.setYoutubeVideoData = function(value) {
  return jspb.Message.setOneofWrapperField(this, 6, proto.jungletv.QueueEntry.oneofGroups_[0], value);
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
  return jspb.Message.getField(this, 6) != null;
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
    rolesList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f
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
    reason: jspb.Message.getFieldWithDefault(msg, 6, "")
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
proto.jungletv.SubmitProofOfWorkRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SubmitProofOfWorkRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SubmitProofOfWorkRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SubmitProofOfWorkRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    previous: msg.getPrevious_asB64(),
    work: msg.getWork_asB64()
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
 * @return {!proto.jungletv.SubmitProofOfWorkRequest}
 */
proto.jungletv.SubmitProofOfWorkRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SubmitProofOfWorkRequest;
  return proto.jungletv.SubmitProofOfWorkRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SubmitProofOfWorkRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SubmitProofOfWorkRequest}
 */
proto.jungletv.SubmitProofOfWorkRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setPrevious(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.setWork(value);
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
proto.jungletv.SubmitProofOfWorkRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SubmitProofOfWorkRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SubmitProofOfWorkRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SubmitProofOfWorkRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getPrevious_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      1,
      f
    );
  }
  f = message.getWork_asU8();
  if (f.length > 0) {
    writer.writeBytes(
      2,
      f
    );
  }
};


/**
 * optional bytes previous = 1;
 * @return {!(string|Uint8Array)}
 */
proto.jungletv.SubmitProofOfWorkRequest.prototype.getPrevious = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * optional bytes previous = 1;
 * This is a type-conversion wrapper around `getPrevious()`
 * @return {string}
 */
proto.jungletv.SubmitProofOfWorkRequest.prototype.getPrevious_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getPrevious()));
};


/**
 * optional bytes previous = 1;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getPrevious()`
 * @return {!Uint8Array}
 */
proto.jungletv.SubmitProofOfWorkRequest.prototype.getPrevious_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getPrevious()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.jungletv.SubmitProofOfWorkRequest} returns this
 */
proto.jungletv.SubmitProofOfWorkRequest.prototype.setPrevious = function(value) {
  return jspb.Message.setProto3BytesField(this, 1, value);
};


/**
 * optional bytes work = 2;
 * @return {!(string|Uint8Array)}
 */
proto.jungletv.SubmitProofOfWorkRequest.prototype.getWork = function() {
  return /** @type {!(string|Uint8Array)} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * optional bytes work = 2;
 * This is a type-conversion wrapper around `getWork()`
 * @return {string}
 */
proto.jungletv.SubmitProofOfWorkRequest.prototype.getWork_asB64 = function() {
  return /** @type {string} */ (jspb.Message.bytesAsB64(
      this.getWork()));
};


/**
 * optional bytes work = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getWork()`
 * @return {!Uint8Array}
 */
proto.jungletv.SubmitProofOfWorkRequest.prototype.getWork_asU8 = function() {
  return /** @type {!Uint8Array} */ (jspb.Message.bytesAsU8(
      this.getWork()));
};


/**
 * @param {!(string|Uint8Array)} value
 * @return {!proto.jungletv.SubmitProofOfWorkRequest} returns this
 */
proto.jungletv.SubmitProofOfWorkRequest.prototype.setWork = function(value) {
  return jspb.Message.setProto3BytesField(this, 2, value);
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
proto.jungletv.SubmitProofOfWorkResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.jungletv.SubmitProofOfWorkResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.jungletv.SubmitProofOfWorkResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SubmitProofOfWorkResponse.toObject = function(includeInstance, msg) {
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
 * @return {!proto.jungletv.SubmitProofOfWorkResponse}
 */
proto.jungletv.SubmitProofOfWorkResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.jungletv.SubmitProofOfWorkResponse;
  return proto.jungletv.SubmitProofOfWorkResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.jungletv.SubmitProofOfWorkResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.jungletv.SubmitProofOfWorkResponse}
 */
proto.jungletv.SubmitProofOfWorkResponse.deserializeBinaryFromReader = function(msg, reader) {
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
proto.jungletv.SubmitProofOfWorkResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.jungletv.SubmitProofOfWorkResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.jungletv.SubmitProofOfWorkResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.jungletv.SubmitProofOfWorkResponse.serializeBinaryToWriter = function(message, writer) {
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
proto.jungletv.UserRole = {
  MODERATOR: 0
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
