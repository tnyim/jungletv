DROP TABLE IF EXISTS "as_number_reputation";
DROP TABLE IF EXISTS "subscription";
DROP TABLE IF EXISTS "points_balance";
DROP TABLE IF EXISTS "points_tx";
DROP TABLE IF EXISTS "points_tx_type";
DROP TABLE IF EXISTS "chat_emote";
DROP TABLE IF EXISTS "verified_user";
DROP TABLE IF EXISTS "blocked_user";
DROP TABLE IF EXISTS "media_queue_event";
DROP TABLE IF EXISTS "media_queue_event_type";
DROP TABLE IF EXISTS "user_profile";
DROP TABLE IF EXISTS "connection";
DROP TABLE IF EXISTS "connection_service";
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
DROP TABLE IF EXISTS "disallowed_media_collections";
DROP TABLE IF EXISTS "media_collection_type";
DROP TABLE IF EXISTS "disallowed_media";
DROP TABLE IF EXISTS "played_media";
DROP TABLE IF EXISTS "media_type";

CREATE TABLE IF NOT EXISTS "media_type" (
    media_type VARCHAR(10) PRIMARY KEY
);
INSERT INTO "media_type" VALUES ('yt_video'), ('sc_track'), ('document');

CREATE TABLE IF NOT EXISTS "played_media" (
    id VARCHAR(36) PRIMARY KEY,
    enqueued_at TIMESTAMP WITH TIME ZONE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE,
    media_offset INTERVAL NOT NULL,
    media_length INTERVAL NOT NULL,
    requested_by VARCHAR(64) NOT NULL,
    request_cost NUMERIC(39, 0) NOT NULL,
    unskippable BOOLEAN NOT NULL,
    media_type VARCHAR(10) NOT NULL REFERENCES media_type (media_type),
    media_id VARCHAR(36) NOT NULL,
    media_info JSONB NOT NULL,
);
CREATE INDEX index_requested_by_on_played_media ON played_media USING BTREE (requested_by);
CREATE INDEX index_started_at_on_played_media ON played_media USING BTREE (started_at);

CREATE TABLE IF NOT EXISTS "disallowed_media" (
    id VARCHAR(36) PRIMARY KEY,
    disallowed_by VARCHAR(64),
    disallowed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    media_type VARCHAR(10) NOT NULL REFERENCES media_type (media_type),
    media_id VARCHAR(36) NOT NULL,
    media_title VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS "media_collection_type" (
    collection_type VARCHAR(10) PRIMARY KEY
);
INSERT INTO "media_collection_type" VALUES ('yt_channel'), ('sc_user');

CREATE TABLE IF NOT EXISTS "disallowed_media_collection" (
    id VARCHAR(36) PRIMARY KEY,
    disallowed_by VARCHAR(64),
    disallowed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    collection_type VARCHAR(10) NOT NULL REFERENCES media_collection_type (collection_type),
    collection_id VARCHAR(36) NOT NULL,
    collection_title VARCHAR(150) NOT NULL
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
    shadowbanned BOOLEAN NOT NULL,
    attachments TEXT[] NOT NULL
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

CREATE TABLE IF NOT EXISTS "user_profile" (
    "address" VARCHAR(64) PRIMARY KEY,
    biography TEXT NOT NULL,
    featured_media VARCHAR(36) REFERENCES played_media (id) -- nullable
);

CREATE TABLE IF NOT EXISTS "media_queue_event_type" (
    event_type VARCHAR(20) PRIMARY KEY
);
INSERT INTO "media_queue_event_type" VALUES ('filled'), ('emptied');

CREATE TABLE IF NOT EXISTS "media_queue_event" (
    created_at TIMESTAMP WITH TIME ZONE NOT NULL PRIMARY KEY,
    event_type VARCHAR(10) NOT NULL REFERENCES media_queue_event_type (event_type)
);

CREATE TABLE IF NOT EXISTS "blocked_user" (
    id VARCHAR(36) PRIMARY KEY,
    "address" VARCHAR(64),
    blocked_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE("address", blocked_by)
);

CREATE INDEX index_blocked_by_on_blocked_user ON blocked_user USING BTREE (blocked_by);

CREATE TABLE IF NOT EXISTS "verified_user" (
    id VARCHAR(36) PRIMARY KEY,
    "address" VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    skip_client_integrity_checks BOOLEAN NOT NULL,
    skip_ip_address_reputation_checks BOOLEAN NOT NULL,
    reduce_hard_challenge_frequency BOOLEAN NOT NULL,
    reason TEXT NOT NULL,
    moderator_address VARCHAR(64) NOT NULL,
    moderator_name VARCHAR(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS "chat_emote" (
    id BIGINT PRIMARY KEY,
    shortcode TEXT NOT NULL UNIQUE,
    animated BOOLEAN NOT NULL,
    available_for_new_messages BOOLEAN NOT NULL,
    requires_subscription BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS "points_tx_type" (
    points_tx_type INTEGER PRIMARY KEY,
    points_tx_type_name VARCHAR(36) NOT NULL UNIQUE
);
INSERT INTO "points_tx_type" VALUES
    (1, 'activity_challenge_reward'),
    (2, 'chat_activity_reward'),
    (3, 'media_enqueued_reward'),
    (4, 'chat_gif_attachment'),
    (5, 'manual_adjustment'),
    (6, 'media_enqueued_reward_reversal'),
    (7, 'conversion_from_banano'),
    (8, 'queue_entry_reordering'),
    (9, 'monthly_subscription');

CREATE TABLE IF NOT EXISTS "points_tx" (
    id BIGINT PRIMARY KEY,
    rewards_address VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    value INTEGER NOT NULL,
    type INTEGER NOT NULL REFERENCES points_tx_type (points_tx_type),
    extra JSONB NOT NULL
);
CREATE INDEX ON points_tx (created_at);
CREATE INDEX ON points_tx (rewards_address);

CREATE TABLE IF NOT EXISTS "points_balance" (
    rewards_address VARCHAR(64) PRIMARY KEY,
    balance INTEGER NOT NULL CHECK (balance >= 0)
);

CREATE TABLE IF NOT EXISTS "subscription" (
    rewards_address VARCHAR(64) NOT NULL,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_txs BIGINT[] NOT NULL,
    PRIMARY KEY (rewards_address, starts_at)
);

CREATE TABLE IF NOT EXISTS "as_number_reputation" (
    as_number INTEGER PRIMARY KEY,
    is_proxy BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);