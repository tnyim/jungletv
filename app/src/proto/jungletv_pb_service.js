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

JungleTV.SubmitProofOfWork = {
  methodName: "SubmitProofOfWork",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.SubmitProofOfWorkRequest,
  responseType: jungletv_pb.SubmitProofOfWorkResponse
};

JungleTV.UserPermissionLevel = {
  methodName: "UserPermissionLevel",
  service: JungleTV,
  requestStream: false,
  responseStream: false,
  requestType: jungletv_pb.UserPermissionLevelRequest,
  responseType: jungletv_pb.UserPermissionLevelResponse
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

JungleTVClient.prototype.submitProofOfWork = function submitProofOfWork(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(JungleTV.SubmitProofOfWork, {
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

exports.JungleTVClient = JungleTVClient;

