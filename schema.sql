
DROP TABLE IF EXISTS "withdrawal";
DROP TABLE IF EXISTS "pending_withdrawal";
DROP TABLE IF EXISTS "reward_balance";
DROP TABLE IF EXISTS "received_reward";
DROP TABLE IF EXISTS "chat_message";
DROP TABLE IF EXISTS "chat_user";
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

CREATE TABLE IF NOT EXISTS "chat_user" (
    "address" VARCHAR(64) PRIMARY KEY,
    permission_level VARCHAR(36) NOT NULL,
    nickname VARCHAR(32)
);

CREATE TABLE IF NOT EXISTS "chat_message" (
    id BIGINT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    author VARCHAR(64) REFERENCES chat_user ("address"),
    content TEXT NOT NULL,
    reference BIGINT REFERENCES chat_message (id),
    shadowbanned BOOLEAN NOT NULL
);
CREATE INDEX index_created_at_on_chat_message ON chat_message USING BTREE (created_at);

CREATE TABLE IF NOT EXISTS "received_reward" (
    id VARCHAR(36) PRIMARY KEY,
    rewards_address VARCHAR(64) NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,
    amount NUMERIC(39, 0) NOT NULL,
    media VARCHAR(36) NOT NULL REFERENCES played_media (id)
);
CREATE INDEX index_rewards_address_on_received_reward ON received_reward USING HASH (rewards_address);
CREATE INDEX index_received_at_on_received_reward ON received_reward USING BTREE (received_at);

CREATE TABLE IF NOT EXISTS "reward_balance" (
    rewards_address VARCHAR(64) PRIMARY KEY,
    balance NUMERIC(39, 0) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "pending_withdrawal" (
    rewards_address VARCHAR(64) PRIMARY KEY,
    amount NUMERIC(39, 0) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "withdrawal" (
    tx_hash VARCHAR(64) PRIMARY KEY,
    rewards_address VARCHAR(64) NOT NULL,
    amount NUMERIC(39, 0) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL
);
CREATE INDEX index_rewards_address_on_withdrawal ON withdrawal USING HASH (rewards_address);
CREATE INDEX index_started_at_on_withdrawal ON withdrawal USING BTREE (started_at);