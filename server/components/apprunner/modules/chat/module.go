package chat

import (
	"context"
	"sync"
	"time"

	"github.com/bwmarrin/snowflake"
	"github.com/dop251/goja"
	"github.com/dop251/goja_nodejs/require"
	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/components/apprunner/gojautil"
	"github.com/tnyim/jungletv/server/components/apprunner/modules"
	"github.com/tnyim/jungletv/server/components/chatmanager"
	"github.com/tnyim/jungletv/server/stores/chat"
)

// ModuleName is the name by which this module can be require()d in a script
const ModuleName = "jungletv:chat"

type chatModule struct {
	runtime        *goja.Runtime
	exports        *goja.Object
	chatManager    *chatmanager.Manager
	schedule       gojautil.ScheduleFunction
	runOnLoop      gojautil.ScheduleFunctionNoError
	dateSerializer func(time.Time) interface{}
	eventAdapter   *gojautil.EventAdapter

	executionContext context.Context
	mu               sync.RWMutex
}

type eventListener struct {
	value    goja.Value
	callable goja.Callable
}

// New returns a new chat module
func New(chatManager *chatmanager.Manager, schedule gojautil.ScheduleFunction, runOnLoop gojautil.ScheduleFunctionNoError) modules.NativeModule {
	return &chatModule{
		chatManager: chatManager,
		schedule:    schedule,
		runOnLoop:   runOnLoop,
	}
}

func (m *chatModule) ModuleLoader() require.ModuleLoader {
	return func(runtime *goja.Runtime, module *goja.Object) {
		m.runtime = runtime
		m.eventAdapter = gojautil.NewEventAdapter(runtime, m.schedule)
		m.dateSerializer = func(t time.Time) interface{} {
			return gojautil.ToJSDate(runtime, t)
		}
		m.exports = module.Get("exports").(*goja.Object)
		m.exports.Set("addEventListener", m.eventAdapter.AddEventListener)
		m.exports.Set("removeEventListener", m.eventAdapter.RemoveEventListener)
		m.exports.Set("createSystemMessage", m.createSystemMessage)
		m.exports.Set("getMessages", m.getMessages)

		gojautil.AdaptNoArgEvent(m.eventAdapter, m.chatManager.OnChatEnabled(), "chatenabled", nil)
		gojautil.AdaptEvent(m.eventAdapter, m.chatManager.OnChatDisabled(), "chatdisabled", func(vm *goja.Runtime, arg chatmanager.DisabledReason) map[string]interface{} {
			return map[string]interface{}{
				"reason": arg.SerializeForAPI(),
			}
		})
		gojautil.AdaptEvent(m.eventAdapter, m.chatManager.OnMessageCreated(), "messagecreated", func(vm *goja.Runtime, arg chatmanager.MessageCreatedEventArgs) map[string]interface{} {
			return map[string]interface{}{
				"message": arg.Message.SerializeForJS(m.executionContext, m.dateSerializer),
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
	m.executionContext = nil
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

	return m.runtime.ToValue(message.SerializeForJS(m.executionContext, m.dateSerializer))
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

	return gojautil.DoAsyncWithTransformer(m.runtime, m.runOnLoop, func() ([]*chat.Message, gojautil.PromiseResultTransformer[[]*chat.Message]) {
		messages, err := m.chatManager.LoadMessagesBetween(m.executionContext, nil, since, until)
		if err != nil {
			panic(m.runtime.NewGoError(stacktrace.Propagate(err, "")))
		}

		return messages, func(_ *goja.Runtime, messages []*chat.Message) interface{} {
			jsMessages := make([]map[string]interface{}, len(messages))
			for i := range messages {
				jsMessages[i] = messages[i].SerializeForJS(m.executionContext, m.dateSerializer)
			}
			return jsMessages
		}
	})
}
