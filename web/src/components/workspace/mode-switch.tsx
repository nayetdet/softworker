import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { DEFAULT_LANGUAGE, DEFAULT_RESUME } from '@/services/preview.service'
import { buildValidationIssueCounts } from '@/services/resume-form.service'
import { clearWorkspacePersistence } from '@/services/workspace-persistence.service'
import { formatJson, validateResume } from '@/services/resume.service'
import { getUiStrings } from '@/services/ui-i18n.service'
import { useFormStore, type EditorMode } from '@/stores/form.store'
import { useResumeStore } from '@/stores/resume.store'
import type { ReactElement } from 'react'

export function WorkspaceModeSwitch(): ReactElement {
  const mode = useFormStore((state) => state.mode)
  const setMode = useFormStore((state) => state.setMode)
  const syncJsonDraftFromResume = useFormStore((state) => state.syncJsonDraftFromResume)
  const language = useResumeStore((state) => state.language)
  const ui = getUiStrings(language)

  return (
    <section className="flex flex-col gap-3 border-b border-border/70 bg-card px-4 py-4 sm:px-5 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <span className="block text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-primary">
          {ui.modeLabel}
        </span>
        <strong className="mt-1 block text-[0.88rem] font-semibold leading-5 text-foreground sm:text-[0.92rem] sm:leading-6">
          {ui.modeDescription}
        </strong>
      </div>
      <div className="flex w-full items-center gap-2 rounded-lg border border-border/70 bg-muted/15 p-2.5 shadow-none sm:w-auto sm:p-3">
        <Tabs
          value={mode}
          onValueChange={(value: string): void => {
            const nextMode = value as EditorMode
            setMode(nextMode)

            if (nextMode === 'source') {
              syncJsonDraftFromResume(useResumeStore.getState().resumeDraft)
            }
          }}
          className="min-w-0 flex-1"
        >
          <TabsList className="grid h-11 w-full min-w-0 grid-cols-2 rounded-xl border-border/70 bg-background/70 shadow-none sm:h-10 sm:w-[12.5rem]">
            <TabsTrigger value="form" className="px-2 text-[0.8rem] leading-none sm:px-3 sm:text-[0.9rem]">
              {ui.modeForm}
            </TabsTrigger>
            <TabsTrigger value="source" className="px-2 text-[0.8rem] leading-none sm:px-3 sm:text-[0.9rem]">
              {ui.modeSource}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button
          type="button"
          variant="outline"
          className="!h-11 !w-11 !min-w-0 shrink-0 !rounded-lg border-border/80 bg-background !p-0 text-muted-foreground shadow-none hover:border-border hover:bg-accent/50 hover:text-foreground sm:!h-9 sm:!w-9"
          onClick={async (): Promise<void> => {
            if (typeof window !== 'undefined') {
              const confirmed = window.confirm(ui.resetConfirm)

              if (!confirmed) {
                return
              }
            }

            clearWorkspacePersistence()

            const validationState = validateResume(DEFAULT_RESUME, DEFAULT_LANGUAGE)

            useResumeStore.setState({
              language: DEFAULT_LANGUAGE,
              previewHtml: '',
              previewStatusMessage: '',
              resumeDraft: DEFAULT_RESUME,
              validationIssueCounts: buildValidationIssueCounts(validationState.byPath),
              validationState,
            })

            useFormStore.setState({
              jsonDraft: formatJson(DEFAULT_RESUME),
              jsonStatusMessage: '',
              mode: 'form',
              openSections: new Set<string>(),
            })

            await useResumeStore.getState().renderPreview()
          }}
          aria-label={ui.resetAriaLabel}
          title={ui.resetTitle}
        >
          <span aria-hidden="true" className="text-[1.05rem] leading-none sm:text-[1.15rem]">
            ↻
          </span>
        </Button>
      </div>
    </section>
  )
}
