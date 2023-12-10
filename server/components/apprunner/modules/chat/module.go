package chat

import (
	"context"
	"fmt"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/bwmarrin/snowflake"
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/icza/gox/stringsx"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/apprunner/modules/pages"
	"github.com/tnyim/jungletv/server/components/chatmanager"
	"github.com/tnyim/jungletv/server/stores/chat"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:chat"

type chatModule struct {
	runtime        *goja.Runtime
	exports        *goja.Object
	appContext     modules.ApplicationContext
	pagesModule    pages.PagesModule
	chatManager    *chatmanager.Manager
	dateSerializer func(time.Time) interface{}
	eventAdapter   *gojautil.EventAdapter

	executionContext context.Context
}

// New returns a new chat module
func New(appContext modules.ApplicationContext, chatManager *chatmanager.Manager, pagesModule pages.PagesModule) modules.NativeModule {
	return &chatModule{
		appContext:  appContext,
		pagesModule: pagesModule,
		chatManager: chatManager,
	}
}

func (m *chatModule) IsNodeBuiltin() bool {
	return false
}

func (m *chatModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.eventAdapter = gojautil.NewEventAdapter(runtime, m.appContext.Schedule)
		m.dateSerializer = func(t time.Time) interface{} {
			return gojautil.SerializeTime(runtime, t)
		}
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("addEventListener", m.eventAdapter.AddEventListener)
		m.exports.Set("removeEventListener", m.eventAdapter.RemoveEventListener)
		m.exports.Set("createSystemMessage", m.createSystemMessage)
		m.exports.Set("createMessage", m.createMessage)
		m.exports.Set("createMessageWithPageAttachment", m.createMessageWithPageAttachment)
		m.exports.Set("getMessages", m.getMessages)
		m.exports.Set("removeMessage", m.removeMessage)

		m.exports.DefineAccessorProperty("nickname", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(m.chatManager.GetNickname(m.executionContext, m.appContext.ApplicationUser()))
		}), m.runtime.ToValue(m.setApplicationNickname), goja.FLAG_FALSE, goja.FLAG_TRUE)

		m.exports.DefineAccessorProperty("enabled", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			enabled, _ := m.chatManager.Enabled()
			return m.runtime.ToValue(enabled)
		}), m.runtime.ToValue(m.setEnabled), goja.FLAG_FALSE, goja.FLAG_TRUE)

		m.exports.DefineAccessorProperty("slowMode", m.runtime.ToValue(func(call goja.FunctionCall) goja.Value {
			return m.runtime.ToValue(m.chatManager.SlowModeEnabled())
		}), m.runtime.ToValue(m.setSlowModeEnabled), goja.FLAG_FALSE, goja.FLAG_TRUE)

		gojautil.AdaptNoArgEvent(m.eventAdapter, m.chatManager.OnChatEnabled(), "chatenabled", nil)
		gojautil.AdaptEvent(m.eventAdapter, m.chatManager.OnChatDisabled(), "chatdisabled", func(vm *goja.Runtime, arg chatmanager.DisabledReason) map[string]interface{} {
			return map[string]interface{}{
				"reason": arg.SerializeForAPI(),
			}
		})
		gojautil.AdaptEvent(m.eventAdapter, m.chatManager.OnMessageCreated(), "messagecreated", func(vm *goja.Runtime, arg chatmanager.MessageCreatedEventArgs) map[string]interface{} {
			return map[string]interface{}{
				"message": m.serializeMessage(m.executionContext, arg.Message),
			}
		})
		gojautil.AdaptEvent(m.eventAdapter, m.chatManager.OnMessageDeleted(), "messagedeleted", func(vm *goja.Runtime, arg snowflake.ID) map[string]interface{} {
			return map[string]interface{}{
				"messageID": arg.String(),
			}
		})
		m.eventAdapter.StartOrResume()
	}
}
func (m *chatModule) ModuleName() string {
	return ModuleName
}
func (m *chatModule) AutoRequire() (bool, string) {
	return false, ""
}

func (m *chatModule) ExecutionResumed(ctx context.Context) {
	m.executionContext = ctx
	if m.eventAdapter != nil {
		m.eventAdapter.StartOrResume()
	}
}

func (m *chatModule) ExecutionPaused() {
	if m.eventAdapter != nil {
		m.eventAdapter.Pause()
	}
}

func (m *chatModule) serializeMessage(ctx context.Context, message *chat.Message) goja.Value {
	result := map[string]interface{}{
		"id":           message.ID.String(),
		"createdAt":    gojautil.SerializeTime(m.runtime, message.CreatedAt),
		"content":      message.Content,
		"shadowbanned": message.Shadowbanned,
		"author":       gojautil.SerializeUser(m.runtime, message.Author),
	}

	if message.Reference != nil {
		result["reference"] = m.serializeMessage(ctx, message.Reference)
	}

	attachments := []map[string]interface{}{}
	for _, a := range message.AttachmentsView {
		attachments = append(attachments, a.SerializeForJS(ctx, m.runtime))
	}
	result["attachments"] = attachments

	result["remove"] = func() goja.Value {
		message := m.removeMessageAndLog(message.ID)
		return m.serializeMessage(m.executionContext, message)
	}

	return m.runtime.ToValue(result)
}

func (m *chatModule) createSystemMessage(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	contentValue := call.Argument(0)

	message, err := m.chatManager.CreateSystemMessage(m.executionContext, contentValue.String())
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.serializeMessage(m.executionContext, message)
}

func (m *chatModule) createMessage(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	contentValue := call.Argument(0)

	var reference *chat.Message
	referenceValue := call.Argument(1)
	if referenceString := referenceValue.String(); !goja.IsUndefined(referenceValue) && !goja.IsNull(referenceValue) && referenceString != "" {
		id, err := snowflake.ParseString(referenceString)
		if err != nil {
			panic(m.runtime.NewTypeError("Second argument must be a message ID string"))
		}
		reference, err = m.chatManager.LoadMessage(m.executionContext, id)
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
		if reference.Author == nil || reference.Author.IsUnknown() {
			panic(m.runtime.NewTypeError("Referenced message must not be a system message"))
		}
	}

	content := strings.TrimSpace(contentValue.String())
	if content == "" {
		panic(m.runtime.NewTypeError("Message content is empty"))
	}

	message, err := m.chatManager.CreateMessage(m.executionContext, m.appContext.ApplicationUser(), content, reference, []chat.MessageAttachmentStorage{})
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.serializeMessage(m.executionContext, message)
}

func (m *chatModule) createMessageWithPageAttachment(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 3 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	contentValue := call.Argument(0)

	pageID := call.Argument(1).String()

	_, ok := m.pagesModule.ResolvePage(pageID)
	if !ok {
		panic(m.runtime.NewTypeError("Second argument to createMessageWithPageAttachment must be the ID of a published page"))
	}

	var height int
	err := m.runtime.ExportTo(call.Argument(2), &height)
	if err != nil || height == 0 {
		panic(m.runtime.NewTypeError("Third argument to createMessageWithPageAttachment must be a non-zero integer"))
	}
	if height > 512 {
		panic(m.runtime.NewTypeError("Desired height must be lower or equal to 512 pixels"))
	}

	attachment := &MessageAttachmentApplicationPageStorage{
		ApplicationID:      m.appContext.ApplicationID(),
		ApplicationVersion: m.appContext.ApplicationVersion(),
		PageID:             pageID,
		Height:             height,
	}

	var reference *chat.Message
	referenceValue := call.Argument(3)
	if referenceString := referenceValue.String(); !goja.IsUndefined(referenceValue) && !goja.IsNull(referenceValue) && referenceString != "" {
		id, err := snowflake.ParseString(referenceString)
		if err != nil {
			panic(m.runtime.NewTypeError("Fourth argument must be a message ID string"))
		}
		reference, err = m.chatManager.LoadMessage(m.executionContext, id)
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}
		if reference.Author == nil || reference.Author.IsUnknown() {
			panic(m.runtime.NewTypeError("Referenced message must not be a system message"))
		}
	}

	content := ""
	if !goja.IsUndefined(contentValue) && !goja.IsNull(contentValue) {
		content = strings.TrimSpace(contentValue.String())
	}

	message, err := m.chatManager.CreateMessage(m.executionContext, m.appContext.ApplicationUser(), content, reference, []chat.MessageAttachmentStorage{attachment})
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return m.serializeMessage(m.executionContext, message)
}

func (m *chatModule) getMessages(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 2 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	var since, until time.Time
	err := m.runtime.ExportTo(call.Argument(0), &since)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to getMessages must be a Date"))
	}
	err = m.runtime.ExportTo(call.Argument(1), &until)
	if err != nil {
		panic(m.runtime.NewTypeError("Second argument to getMessages must be a Date"))
	}

	return gojautil.DoAsyncWithTransformer(m.runtime, m.appContext.ScheduleNoError, func(actx gojautil.AsyncContext) ([]*chat.Message, gojautil.PromiseResultTransformer[[]*chat.Message]) {
		messages, err := m.chatManager.LoadMessagesBetween(m.executionContext, nil, since, until)
		if err != nil {
			panic(actx.NewGoError(stacktrace.Propagate(err, "")))
		}

		return messages, func(vm *goja.Runtime, messages []*chat.Message) interface{} {
			jsMessages := make([]goja.Value, len(messages))
			for i := range messages {
				jsMessages[i] = m.serializeMessage(m.executionContext, messages[i])
			}
			return jsMessages
		}
	})
}

func (m *chatModule) removeMessage(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	id, err := snowflake.ParseString(call.Argument(0).String())
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to getMessages must be a message ID"))
	}

	message := m.removeMessageAndLog(id)

	return m.serializeMessage(m.executionContext, message)
}

func (m *chatModule) removeMessageAndLog(id snowflake.ID) *chat.Message {
	message, err := m.chatManager.DeleteMessage(m.executionContext, id)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	attachments := ""
	if len(message.AttachmentsView) > 0 {
		attachments = "\n\nAttachments:\n"
		for _, a := range message.AttachmentsView {
			attachments += "- " + a.SerializeForModLog(m.executionContext) + "\n"
		}
	}

	content := "> " + strings.Join(strings.Split(message.Content, "\n"), "\n> ")

	if message.Author != nil && !message.Author.IsUnknown() && len(message.Author.Address()) >= 14 {
		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("deleted chat message from %s:\n\n%s%s", message.Author.Address()[:14], content, attachments))
	} else {
		m.appContext.Logger().RuntimeAuditLog(fmt.Sprintf("deleted system chat message:\n\n%s%s", content, attachments))
	}

	return message
}

func (m *chatModule) setApplicationNickname(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}
	nicknameValue := call.Argument(0)
	var nickname *string
	if nicknameString := nicknameValue.String(); !goja.IsUndefined(nicknameValue) && !goja.IsNull(nicknameValue) && nicknameString != "" {
		nicknameString = strings.TrimSpace(nicknameString)

		nicknameString = stringsx.Clean(nicknameString)
		if utf8.RuneCountInString(nicknameString) < 3 {
			panic(m.runtime.NewTypeError("Nickname must be at least 3 characters long"))
		}
		if utf8.RuneCountInString(nicknameString) > 16 {
			panic(m.runtime.NewTypeError("Nickname must be at most 16 characters long"))
		}
		if strings.HasPrefix(nicknameString, "ban_1") || strings.HasPrefix(nicknameString, "ban_3") {
			panic(m.runtime.NewTypeError("Nickname must not look like a Banano address"))
		}

		nickname = &nicknameString
	}

	err := m.chatManager.SetNickname(m.executionContext, m.appContext.ApplicationUser(), nickname, true)
	if err != nil {
		panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
	}

	return goja.Undefined()
}

func (m *chatModule) setEnabled(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	var enabled bool
	err := m.runtime.ExportTo(call.Argument(0), &enabled)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to setEnabled must be a boolean"))
	}

	if enabled {
		m.chatManager.EnableChat()
		m.appContext.Logger().RuntimeAuditLog("enabled chat")
	} else {
		m.chatManager.DisableChat(chatmanager.DisabledReasonUnspecified)
		m.appContext.Logger().RuntimeAuditLog("disabled chat")
	}

	return goja.Undefined()
}

func (m *chatModule) setSlowModeEnabled(call goja.FunctionCall) goja.Value {
	if len(call.Arguments) < 1 {
		panic(m.runtime.NewTypeError("Missing argument"))
	}

	var enabled bool
	err := m.runtime.ExportTo(call.Argument(0), &enabled)
	if err != nil {
		panic(m.runtime.NewTypeError("First argument to setSlowmodeEnabled must be a boolean"))
	}

	m.chatManager.SetSlowModeEnabled(enabled)
	if enabled {
		m.appContext.Logger().RuntimeAuditLog("enabled chat slowmode")
	} else {
		m.appContext.Logger().RuntimeAuditLog("disabled chat slowmode")
	}

	return goja.Undefined()
}
