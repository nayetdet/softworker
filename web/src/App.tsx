import { PreviewPanel } from '@/components/preview/preview-panel'
import { StatusAlert } from '@/components/feedback/status-alert'
import { Card } from '@/components/ui/card'
import { WorkspaceHeader } from '@/components/workspace/header'
import { WorkspaceModeSwitch } from '@/components/workspace/mode-switch'
import { ArraySection } from '@/components/workspace/sections/array-section'
import { ObjectSection } from '@/components/workspace/sections/object-section'
import { SourceEditor } from '@/components/workspace/source-editor'
import { useEffect, type ReactElement } from 'react'
import { getFormSections, syncI18nLanguage } from '@/services/ui-i18n.service'
import { saveWorkspacePersistence } from '@/services/workspace-persistence.service'
import { useFormStore, type FormState } from '@/stores/form.store'
import { useResumeStore, type ResumeState } from '@/stores/resume.store'

function App(): ReactElement {
  const mode = useFormStore((state) => state.mode)
  const language = useResumeStore((state) => state.language)
  const formSections = getFormSections(language)

  function persistCurrentWorkspace(): void {
    const snapshot = {
      jsonDraft: useFormStore.getState().jsonDraft,
      language: useResumeStore.getState().language,
      mode: useFormStore.getState().mode,
      resumeDraft: useResumeStore.getState().resumeDraft,
    }

    saveWorkspacePersistence(snapshot)
  }

  useEffect(() => {
    void syncI18nLanguage(language)
    persistCurrentWorkspace()
    void useResumeStore.getState().renderPreview()

    const unsubscribeResume = useResumeStore.subscribe((state: ResumeState, previousState: ResumeState): void => {
      if (state.resumeDraft === previousState.resumeDraft && state.language === previousState.language) {
        return
      }

      persistCurrentWorkspace()
      void state.renderPreview()
    })

    const unsubscribeForm = useFormStore.subscribe((state: FormState, previousState: FormState): void => {
      if (state.jsonDraft === previousState.jsonDraft && state.mode === previousState.mode) {
        return
      }

      persistCurrentWorkspace()
    })

    return () => {
      unsubscribeResume()
      unsubscribeForm()
    }
  }, [language])

  return (
    <main className="min-h-screen px-2 py-2 sm:px-3 sm:py-3 xl:px-4 xl:py-4">
      <div className="mx-auto grid max-w-[1888px] gap-3 lg:gap-4 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] xl:items-start">
        <Card className="grid min-h-0 min-w-0 overflow-hidden border-border/80 bg-card xl:grid-rows-[auto_auto_minmax(0,1fr)]">
          <WorkspaceHeader />
          <StatusAlert />
          <WorkspaceModeSwitch />
          {mode === 'source' ? (
            <SourceEditor />
          ) : (
            <div className="grid gap-3 overflow-auto p-3 sm:p-4">
              {formSections.map((section) =>
                'key' in section ? (
                  <ObjectSection key={section.key} section={section} />
                ) : (
                  <ArraySection key={section.path.join('.')} section={section} />
                ),
              )}
            </div>
          )}
        </Card>
        <PreviewPanel />
      </div>
    </main>
  )
}

export default App
