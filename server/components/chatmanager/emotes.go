package chatmanager

import (
	"context"
	"fmt"
	"regexp"
	"strconv"

	"github.com/bwmarrin/snowflake"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/stores/chat"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils"
)

func (c *Manager) ChatEmotes(ctx context.Context) ([]*types.ChatEmote, error) {
	emotes, err := c.emoteCache.ChatEmotes(ctx)
	if err != nil {
		return nil, stacktrace.Propagate(err, "")
	}
	return emotes, nil
}

// emoteRegexp captures chat emotes in messages, including escaped emotes
// the first capturing group, (\\{0,1}), is used to let us determine whether an emote is escaped (and should therefore
// be ignored). it'd have been nicer if we could have used a non-capturing group (?:^|[^\\])
// but this made it so that the second one in this example case would not be matched: <a:123><a:456>
// (because of the lack of a character inbetween matches)
// (?:|[^\\]) would make it so that it'd prefer not to match the \ on <a:123>\<a:456>, leading to the \ being ignored
// and the second emote being a match despite being escaped
var emoteRegexp = regexp.MustCompile(`(\\{0,1})<([ae])(:[a-zA-Z0-9_]+){0,1}:([0-9]{1,20})(?:\/{0,1})>`)

var codeTagRegexp = regexp.MustCompile("```.*?```|`.*?`")

func (c *Manager) processEmotesForStorage(ctx context.Context, author auth.User, content string) (string, error) {
	// this function:
	// - removes the emote shortcode from the tag for each emote
	//     we don't store the shortcodes along with the message to save on DB space and to ensure
	//     the shortcodes are always up-to-date when rendering
	// - if an emote tag is present but does not correspond to a valid emote, it is escaped
	//   so that a broken image is not rendered on the client, instead it will appear exactly as
	//   the messagecreator sent it
	return utils.ReplaceAllStringSubmatchFuncExcludingInside(emoteRegexp, codeTagRegexp, content, func(s []string) string {
		if s[1] == `\` {
			// escaped emote, do not do anything, return the original as-is
			return s[0]
		}
		id, err := strconv.ParseInt(s[4], 10, 64)
		if err != nil {
			// this shouldn't happen, but somehow this is an invalid match
			// escape it for storage
			return `\` + s[0]
		}
		emote, found := c.emoteCache.EmoteByID(ctx, snowflake.ID(id))
		if !found || !emote.AvailableForNewMessages || (emote.Animated && s[2] != "a") {
			// valid syntax but emote does not exist, is not available anymore, or does not match this type
			// escape it
			return `\` + s[0]
		}
		return fmt.Sprintf("<%s:%d>", s[2], emote.ID)

	}), nil
}

func (c *Manager) processEmotesForLoadingMessages(ctx context.Context, messages []*chat.Message) error {
	for _, message := range messages {
		err := c.processEmotesForLoadingMessage(ctx, message)
		if err != nil {
			return stacktrace.Propagate(err, "failed to process emotes on message "+message.ID.String())
		}
	}
	return nil
}

func (c *Manager) processEmotesForLoadingMessage(ctx context.Context, message *chat.Message) error {
	// all this function does is add the current emote shortcodes to the tag for each emote
	// this lets the clients show the correct alt/title text for them
	// we don't store the shortcodes along with the message to save on DB space and to ensure
	// the shortcodes are always up-to-date when rendering
	message.Content = utils.ReplaceAllStringSubmatchFuncExcludingInside(emoteRegexp, codeTagRegexp, message.Content, func(s []string) string {
		if s[1] == `\` {
			// escaped emote, do not do anything, return the original as-is
			return s[0]
		}
		id, err := strconv.ParseInt(s[4], 10, 64)
		if err != nil {
			// this shouldn't happen, but somehow this is an invalid match
			// escape it so it doesn't render
			return `\` + s[0]
		}
		emote, found := c.emoteCache.EmoteByID(ctx, snowflake.ID(id))
		if !found {
			// the emote was probably hard-deleted from the database (not something we should do...)
			// escape it so it doesn't render on the client
			return `\` + s[0]
		}
		return fmt.Sprintf("<%s:%s:%d>", s[2], emote.Shortcode, emote.ID)

	})
	if message.Reference != nil {
		c.processEmotesForLoadingMessage(ctx, message.Reference)
	}
	return nil
}
