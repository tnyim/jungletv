export interface Metadata {
  id: number;
  playable: boolean;
  artworkURL: string;
  caption: null;
  commentable: boolean;
  commentCount: number;
  createdAt: string;
  description: string;
  downloadable: boolean;
  downloadCount: number;
  duration: number;
  fullDuration: number;
  embeddableBy: string;
  genre: string;
  hasDownloadsLeft: boolean;
  kind: string;
  labelName: null;
  lastModified: string;
  license: string;
  likesCount: number;
  permalink: string;
  permalinkURL: string;
  playbackCount: number;
  public: boolean;
  publisherMetadata: PublisherMetadata;
  purchaseTitle: string;
  purchaseURL: string;
  releaseDate: null;
  repostsCount: number;
  secretToken: null;
  sharing: string;
  state: string;
  streamable: boolean;
  tagList: string;
  title: string;
  trackFormat: string;
  uri: string;
  urn: string;
  userID: number;
  visuals: null;
  waveformURL: string;
  displayDate: string;
  media: Media;
  stationUrn: string;
  stationPermalink: string;
  trackAuthorization: string;
  monetizationModel: string;
  policy: string;
  user: User;
  resourceID: number;
  resourceType: string;
}

export interface Media {
  transcodings: Transcoding[];
}

export interface Transcoding {
  url: string;
  preset: string;
  duration: number;
  snipped: boolean;
  format: Format;
  quality: string;
}

export interface Format {
  protocol: string;
  mimeType: string;
}

export interface PublisherMetadata {
  id: number;
  urn: string;
  artist: string;
  containsMusic: boolean;
  isrc: string;
}

export interface User {
  avatarURL: string;
  city: string;
  commentsCount: number;
  countryCode: null;
  createdAt: string;
  creatorSubscriptions: CreatorSubscription[];
  creatorSubscription: CreatorSubscription;
  description: string;
  followersCount: number;
  followingsCount: number;
  firstName: string;
  fullName: string;
  groupsCount: number;
  id: number;
  kind: string;
  lastModified: string;
  lastName: string;
  likesCount: number;
  playlistLikesCount: number;
  permalink: string;
  permalinkURL: string;
  playlistCount: number;
  repostsCount: null;
  trackCount: number;
  uri: string;
  urn: string;
  username: string;
  verified: boolean;
  visuals: Visuals;
  badges: Badges;
  stationUrn: string;
  stationPermalink: string;
}

export interface Badges {
  pro: boolean;
  proUnlimited: boolean;
  verified: boolean;
}

export interface CreatorSubscription {
  product: Product;
}

export interface Product {
  id: string;
}

export interface Visuals {
  urn: string;
  enabled: boolean;
  visuals: Visual[];
  tracking: null;
}

export interface Visual {
  urn: string;
  entryTime: number;
  visualURL: string;
}
