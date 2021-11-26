DROP TABLE IF EXISTS "connection_service";
DROP TABLE IF EXISTS "connection";
DROP TABLE IF EXISTS "counter";
DROP TABLE IF EXISTS "banned_user";
DROP TABLE IF EXISTS "raffle_drawing";
DROP TABLE IF EXISTS "raffle_drawing_status";
DROP TABLE IF EXISTS "crowdfunded_transaction";
DROP TABLE IF EXISTS "crowdfunded_transaction_type";
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
    media_offset INTERVAL NOT NULL,
    media_length INTERVAL NOT NULL,
    requested_by VARCHAR(64) NOT NULL,
    request_cost NUMERIC(39, 0) NOT NULL,
    unskippable BOOLEAN NOT NULL,
    media_type VARCHAR(10) NOT NULL REFERENCES media_type (media_type),
    yt_video_id VARCHAR(11),
    yt_video_title VARCHAR(150)
);
CREATE INDEX index_requested_by_on_played_media ON played_media USING BTREE (requested_by);
CREATE INDEX index_started_at_on_played_media ON played_media USING BTREE (started_at);

CREATE TABLE IF NOT EXISTS "disallowed_media" (
    id VARCHAR(36) PRIMARY KEY,
    disallowed_by VARCHAR(64),
    disallowed_at TIMESTAMP WITH TIME ZONE NOT NULL,
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

CREATE TABLE IF NOT EXISTS "crowdfunded_transaction_type" (
    transaction_type VARCHAR(10) PRIMARY KEY
);
INSERT INTO "crowdfunded_transaction_type" VALUES ('skip'), ('rain');

CREATE TABLE IF NOT EXISTS "crowdfunded_transaction" (
    tx_hash VARCHAR(64) PRIMARY KEY,
    from_address VARCHAR(64) NOT NULL,
    amount NUMERIC(39, 0) NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,
    transaction_type VARCHAR(10) NOT NULL REFERENCES crowdfunded_transaction_type (transaction_type),
    for_media VARCHAR(36) REFERENCES played_media (id) -- nullable
);

CREATE TABLE IF NOT EXISTS "raffle_drawing_status" (
    drawing_status VARCHAR(10) PRIMARY KEY
);
INSERT INTO "raffle_drawing_status" VALUES ('ongoing'), ('pending'), ('confirmed'), ('voided'), ('complete');

-- (drawing created) -> ongoing
--   (no tickets) -> complete
--   (draw happens) -> pending
--     (raffle supervisor rejects winner) -> voided (a new drawing is created with the reason added to the plaintext)
--     (raffle supervisor approves winner) -> confirmed
--       (winner is paid) -> complete

CREATE TABLE IF NOT EXISTS "raffle_drawing" (
    raffle_id VARCHAR(36) NOT NULL,
    drawing_number INTEGER NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(10) NOT NULL REFERENCES raffle_drawing_status (drawing_status),
    reason TEXT NOT NULL,
    plaintext TEXT, -- nullable
    vrf_hash TEXT, -- nullable
    vrf_proof TEXT, -- nullable
    winning_ticket_number INTEGER, -- nullable
    winning_rewards_address VARCHAR(64), -- nullable
    prize_tx_hash VARCHAR(64), -- nullable
    PRIMARY KEY (raffle_id, drawing_number)
);

CREATE TABLE IF NOT EXISTS "banned_user" (
    ban_id VARCHAR(36) PRIMARY KEY,
    banned_at TIMESTAMP WITH TIME ZONE NOT NULL,
    banned_until TIMESTAMP WITH TIME ZONE, -- nullable
    "address" VARCHAR(64) NOT NULL,
    remote_address VARCHAR(50) NOT NULL,
    from_chat BOOLEAN NOT NULL,
    from_enqueuing BOOLEAN NOT NULL,
    from_rewards BOOLEAN NOT NULL,
    reason TEXT NOT NULL,
    unban_reason TEXT NOT NULL,
    moderator_address VARCHAR(64) NOT NULL,
    moderator_name VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS "counter" (
    counter_name VARCHAR(36) PRIMARY KEY,
    counter_value INTEGER NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS "connection_service" (
    connection_service VARCHAR(20) PRIMARY KEY
);
INSERT INTO "connection_service" VALUES ('cryptomonkeys');

CREATE TABLE IF NOT EXISTS "connection" (
    id VARCHAR(36) PRIMARY KEY,
    "service" VARCHAR(20) NOT NULL REFERENCES connection_service (connection_service),
    rewards_address VARCHAR(64) NOT NULL,
    "name" TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    oauth_refresh_token TEXT -- nullable
);
CREATE INDEX index_rewards_address_on_connection ON connection USING HASH (rewards_address);