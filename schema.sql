DROP TABLE IF EXISTS "document";
DROP TABLE IF EXISTS "disallowed_media";
DROP TABLE IF EXISTS "played_media";
DROP TABLE IF EXISTS "media_type";

CREATE TABLE IF NOT EXISTS "media_type" (
    media_type VARCHAR(10) PRIMARY KEY
);
INSERT INTO "media_type" VALUES ('yt_video');

CREATE TABLE IF NOT EXISTS "played_media" (
    id VARCHAR(36) PRIMARY KEY,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    media_length INTERVAL NOT NULL,
    requested_by VARCHAR(64) NOT NULL,
    request_cost NUMERIC(39, 0) NOT NULL,
    unskippable BOOLEAN NOT NULL,
    media_type VARCHAR(10) NOT NULL REFERENCES media_type (media_type),
    yt_video_id VARCHAR(11),
    yt_video_title VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS "disallowed_media" (
    id VARCHAR(36) PRIMARY KEY,
    disallowed_by VARCHAR(64),
    disallowed_at TIMESTAMP WITH TIME ZONE,
    media_type VARCHAR(10) NOT NULL REFERENCES media_type (media_type),
    yt_video_id VARCHAR(11),
    yt_video_title VARCHAR(150)
);

CREATE TABLE IF NOT EXISTS "document" (
    id VARCHAR(36) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_by VARCHAR(64),
    public BOOLEAN,
    "format" VARCHAR(36),
    content TEXT,
    PRIMARY KEY (id, updated_at)
);