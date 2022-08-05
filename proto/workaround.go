package proto

// this works around the short-sightedness of the protoc maintainers in the face of numerous requests and valid use cases
// https://github.com/golang/protobuf/issues/261
// https://github.com/golang/protobuf/issues/1326

type IsEnqueueMediaRequest_MediaInfo = isEnqueueMediaRequest_MediaInfo
type IsReceivedReward_MediaInfo = isReceivedReward_MediaInfo
type IsPlayedMedia_MediaInfo = isPlayedMedia_MediaInfo
type IsUserProfileResponse_FeaturedMedia = isUserProfileResponse_FeaturedMedia
