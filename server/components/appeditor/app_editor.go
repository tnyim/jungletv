package appeditor

import (
	"context"
	"fmt"
	"log"
	"mime"
	"time"

	"github.com/palantir/stacktrace"
	"github.com/tnyim/jungletv/server/auth"
	"github.com/tnyim/jungletv/server/components/apprunner"
	"github.com/tnyim/jungletv/types"
	"github.com/tnyim/jungletv/utils/transaction"
)

type AppEditor struct {
	log    *log.Logger
	runner *apprunner.AppRunner
}

// New returns a new initialized AppEditor
func New(log *log.Logger, appRunner *apprunner.AppRunner) *AppEditor {
	return &AppEditor{
		log:    log,
		runner: appRunner,
	}
}

func (*AppEditor) UpdateApplication(ctxCtx context.Context, applicationID string, updatedBy auth.User, editMessage string, allowLaunching, allowFileEditing, autorun bool) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	applications, err := types.GetApplicationsWithIDs(ctx, []string{applicationID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	_, existed := applications[applicationID]

	application := &types.Application{
		ID:               applicationID,
		UpdatedAt:        types.ApplicationVersion(time.Now()),
		UpdatedBy:        updatedBy.Address(),
		EditMessage:      editMessage,
		AllowLaunching:   allowLaunching,
		AllowFileEditing: allowFileEditing,
		Autorun:          autorun,
		RuntimeVersion:   apprunner.RuntimeVersion,
	}

	if application.EditMessage == "" {
		if existed {
			application.EditMessage = "Update application properties"
		} else {
			application.EditMessage = fmt.Sprintf("Create application '%s'", applicationID)
		}
	}

	err = application.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	if !existed {
		file := &types.ApplicationFile{
			ApplicationID: applicationID,
			Name:          apprunner.MainFileName,
			UpdatedAt:     time.Time(application.UpdatedAt),
			UpdatedBy:     updatedBy.Address(),
			EditMessage:   application.EditMessage,
			Deleted:       false,
			Public:        false,
			Type:          apprunner.ServerScriptMIMEType,
			Content:       []byte(defaultMainScript),
		}

		err = file.Update(ctx)
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

// UpdateApplicationFile creates or updates an application file. If a file with the same name had been deleted before, it will be undeleted.
func (*AppEditor) UpdateApplicationFile(ctxCtx context.Context, applicationID string, fileName string, updatedBy auth.User, fileType string, public bool, content []byte, editMessage string) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	applications, err := types.GetApplicationsWithIDs(ctx, []string{applicationID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	application, ok := applications[applicationID]
	if !ok {
		return stacktrace.NewError("application not found")
	}
	if !application.AllowFileEditing {
		return stacktrace.NewError("application is currently read-only")
	}

	_, _, err = mime.ParseMediaType(fileType)
	if err != nil {
		return stacktrace.Propagate(err, "invalid file type")
	}

	file := &types.ApplicationFile{
		ApplicationID: applicationID,
		Name:          fileName,
		UpdatedAt:     time.Now(),
		UpdatedBy:     updatedBy.Address(),
		EditMessage:   editMessage,
		Deleted:       false,
		Public:        public,
		Type:          fileType,
		Content:       content,
	}

	if content == nil {
		files, err := types.GetApplicationFilesWithNamesForApplication(ctx, applicationID, []string{fileName})
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
		oldFile, ok := files[fileName]
		if ok {
			file.Content = oldFile.Content
		}
	}

	err = file.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	application.UpdatedAt = types.ApplicationVersion(file.UpdatedAt)
	application.UpdatedBy = file.UpdatedBy
	application.EditMessage = file.EditMessage
	if application.EditMessage == "" {
		application.EditMessage = fmt.Sprintf("Update %s", file.Name)
	}

	err = application.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

func (*AppEditor) CloneApplicationFile(ctxCtx context.Context, applicationID, fileName, destinationApplicationID, destinationFileName string, clonedBy auth.User) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	applications, err := types.GetApplicationsWithIDs(ctx, []string{applicationID, destinationApplicationID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	application, ok := applications[applicationID]
	if !ok {
		return stacktrace.NewError("origin application not found")
	}

	destApplication, ok := applications[destinationApplicationID]
	if !ok {
		return stacktrace.NewError("destination application not found")
	}

	if !destApplication.AllowFileEditing {
		return stacktrace.NewError("destination application is currently read-only")
	}

	files, err := types.GetApplicationFilesWithNamesForApplication(ctx, applicationID, []string{fileName})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	file, ok := files[fileName]
	if !ok {
		return stacktrace.NewError("file not found")
	}

	destFiles, err := types.GetApplicationFilesWithNamesForApplication(ctx, destinationApplicationID, []string{destinationFileName})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	_, ok = destFiles[destinationFileName]
	if ok {
		return stacktrace.NewError("destination file already exists")
	}

	file.ApplicationID = destApplication.ID
	file.Name = destinationFileName
	file.UpdatedAt = time.Now()
	file.UpdatedBy = clonedBy.Address()
	if application.ID != destApplication.ID {
		file.EditMessage = fmt.Sprintf("Clone from '%s' %s", application.ID, fileName)
	} else {
		file.EditMessage = fmt.Sprintf("Clone from %s", fileName)
	}

	err = file.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	destApplication.UpdatedAt = types.ApplicationVersion(file.UpdatedAt)
	destApplication.UpdatedBy = file.UpdatedBy
	destApplication.EditMessage = file.EditMessage

	err = destApplication.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

func (*AppEditor) DeleteApplicationFile(ctxCtx context.Context, applicationID, fileName string, deletedBy auth.User) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	applications, err := types.GetApplicationsWithIDs(ctx, []string{applicationID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	application, ok := applications[applicationID]
	if !ok {
		return stacktrace.NewError("application not found")
	}
	if !application.AllowFileEditing {
		return stacktrace.NewError("application is currently read-only")
	}

	files, err := types.GetApplicationFilesWithNamesForApplication(ctx, applicationID, []string{fileName})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	file, ok := files[fileName]
	if !ok {
		return stacktrace.NewError("file not found")
	}

	file.Deleted = true
	file.UpdatedAt = time.Now()
	file.UpdatedBy = deletedBy.Address()
	file.EditMessage = fmt.Sprintf("Delete %s", file.Name)

	err = file.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	application.UpdatedAt = types.ApplicationVersion(file.UpdatedAt)
	application.UpdatedBy = file.UpdatedBy
	application.EditMessage = file.EditMessage

	err = application.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

func (*AppEditor) CloneApplication(ctxCtx context.Context, applicationID string, destinationApplicationID string, clonedBy auth.User) error {
	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	applications, err := types.GetApplicationsWithIDs(ctx, []string{applicationID, destinationApplicationID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	application, ok := applications[applicationID]
	if !ok {
		return stacktrace.NewError("application not found")
	}

	// ensure new application ID is free
	_, ok = applications[destinationApplicationID]
	if ok {
		return stacktrace.NewError("application already exists")
	}
	files, _, err := types.GetApplicationFilesForApplication[*types.ApplicationFile](ctx, application.ID, "", nil)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	now := time.Now()
	for _, file := range files {
		file.ApplicationID = destinationApplicationID
		file.UpdatedAt = now
		file.UpdatedBy = clonedBy.Address()
		file.EditMessage = fmt.Sprintf("Clone from '%s' %s", application.ID, file.Name)
		err = file.Update(ctx) // this clones the file since we're changing one of the elements of its primary key, without deleting the old one
		if err != nil {
			return stacktrace.Propagate(err, "")
		}
	}

	newApplication := &types.Application{
		ID:               destinationApplicationID,
		UpdatedAt:        types.ApplicationVersion(now),
		UpdatedBy:        clonedBy.Address(),
		EditMessage:      fmt.Sprintf("Clone application '%s' from '%s'", destinationApplicationID, applicationID),
		AllowLaunching:   false,
		AllowFileEditing: true,
		Autorun:          false,
		RuntimeVersion:   application.RuntimeVersion,
	}

	err = newApplication.Update(ctx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}

// DeleteApplication fully deletes an application including all its past versions
func (e *AppEditor) DeleteApplication(ctxCtx context.Context, applicationID string) error {
	running, _, _ := e.runner.IsRunning(applicationID)
	if running {
		return stacktrace.NewError("application is running")
	}

	ctx, err := transaction.Begin(ctxCtx)
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	defer ctx.Rollback()

	applications, err := types.GetApplicationsWithIDs(ctx, []string{applicationID})
	if err != nil {
		return stacktrace.Propagate(err, "")
	}
	application, ok := applications[applicationID]
	if !ok {
		return stacktrace.NewError("application not found")
	}

	err = application.Delete(ctx) // this takes care of deleting all application files too
	if err != nil {
		return stacktrace.Propagate(err, "")
	}

	return stacktrace.Propagate(ctx.Commit(), "")
}
