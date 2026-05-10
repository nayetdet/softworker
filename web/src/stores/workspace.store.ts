'use client'

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { DEFAULT_LANGUAGE, DEFAULT_RESUME, PREVIEW_LANGUAGES } from '@/constants/workspace'
import { formatJson, insertArrayItem, removeArrayItem, setAtPath } from '@/utils/json'
import { getFormSections, getUiStrings, lowercaseForLanguage } from '@/services/resume-i18n.service'
import { buildValidationIssueCounts } from '@/services/resume-form.service'
import { validateResume } from '@/schemas/resume.schema'
import type { ResumeLanguage } from '@/types/ui/resume-language'
import { clearWorkspacePersistence } from '@/services/workspace.service'
import { generatePreviewHtml } from '@/lib/trpc'
import type { JsonObject } from '@/types/resume/json/json-object'
import type { JsonValue } from '@/types/resume/json/json-value'
import type { PathPart } from '@/types/resume/json/path-part'
import type { WorkspaceViewMode } from '@/types/ui/workspace-view-mode'

type WorkspaceState = {
  hydrated: boolean
  language: ResumeLanguage
  mode: WorkspaceViewMode
  jsonDraft: string
  jsonStatusMessage: string
  previewHtml: string
  previewStatusMessage: string
  resumeDraft: JsonObject
  openSections: string[]
}

export type WorkspaceHydrationSnapshot = Omit<WorkspaceState, 'previewHtml' | 'previewStatusMessage'>

type WorkspaceActions = {
  hydrateWorkspace: (snapshot: WorkspaceHydrationSnapshot) => void
  setLanguage: (language: ResumeLanguage) => void
  setMode: (mode: WorkspaceViewMode) => void
  setJsonDraft: (value: string) => void
  setJsonStatusMessage: (message: string) => void
  clearJsonStatus: () => void
  renderPreview: () => Promise<void>
  setResumeDraft: (value: JsonObject) => void
  updateField: (path: PathPart[], value: JsonValue) => void
  addArrayItem: (path: string[], item: JsonObject) => void
  removeArrayItem: (path: string[], index: number) => void
  toggleSection: (key: string, open: boolean) => void
  syncJsonDraftFromResume: () => void
  resetToDefaults: () => void
}

export type WorkspaceStore = WorkspaceState & WorkspaceActions
export type WorkspaceViewModel = WorkspaceState & {
  hasValidationIssues: boolean
  languageOptions: typeof PREVIEW_LANGUAGES
  lowercaseForLanguage: typeof lowercaseForLanguage
  downloadJsonFilename: string
  formSections: ReturnType<typeof getFormSections>
  ui: ReturnType<typeof getUiStrings>
  validationIssueCounts: ReturnType<typeof buildValidationIssueCounts>
  validationState: ReturnType<typeof validateResume>
  previewHtml: string
  previewStatusMessage: string
}

const initialState: WorkspaceState = {
  hydrated: false,
  language: DEFAULT_LANGUAGE,
  mode: 'form',
  jsonDraft: formatJson(DEFAULT_RESUME),
  jsonStatusMessage: '',
  previewHtml: '',
  previewStatusMessage: '',
  resumeDraft: DEFAULT_RESUME,
  openSections: [],
}

let previewRenderSequence = 0

export const useWorkspaceStore = create<WorkspaceStore>()(
  immer((set) => ({
    ...initialState,
    hydrateWorkspace: (snapshot) => {
      previewRenderSequence += 1
      set((state) => {
        state.hydrated = true
        state.language = snapshot.language
        state.mode = snapshot.mode
        state.jsonDraft = snapshot.jsonDraft
        state.jsonStatusMessage = snapshot.jsonStatusMessage
        state.previewHtml = ''
        state.previewStatusMessage = ''
        state.resumeDraft = snapshot.resumeDraft
        state.openSections = snapshot.openSections
      })
    },
    setLanguage: (language) => set((state) => {
      state.language = language
    }),
    setMode: (mode) => set((state) => {
      state.mode = mode
    }),
    setJsonDraft: (value) => set((state) => {
      state.jsonDraft = value
    }),
    setJsonStatusMessage: (message) => set((state) => {
      state.jsonStatusMessage = message
    }),
    clearJsonStatus: () => set((state) => {
      state.jsonStatusMessage = ''
    }),
    renderPreview: async () => {
      const renderSequence = ++previewRenderSequence
      const { language, resumeDraft } = useWorkspaceStore.getState()

      try {
        const { html } = await generatePreviewHtml({
          language,
          resume: resumeDraft,
        })

        if (renderSequence !== previewRenderSequence) {
          return
        }

        set((state) => {
          state.previewHtml = html
          state.previewStatusMessage = ''
        })
      } catch {
        if (renderSequence !== previewRenderSequence) {
          return
        }

        set((state) => {
          state.previewStatusMessage =
            language === 'en_US'
              ? 'Failed to render the preview.'
              : 'Falha ao renderizar a pré-visualização.'
        })
      }
    },
    setResumeDraft: (value) => set((state) => {
      state.resumeDraft = value
    }),
    updateField: (path, value) =>
      set((state) => {
        state.resumeDraft = setAtPath(state.resumeDraft, path, value)
      }),
    addArrayItem: (path, item) =>
      set((state) => {
        state.resumeDraft = insertArrayItem(state.resumeDraft, path, item)
      }),
    removeArrayItem: (path, index) =>
      set((state) => {
        state.resumeDraft = removeArrayItem(state.resumeDraft, path, index)
      }),
    toggleSection: (key, open) =>
      set((state) => {
        const next = new Set(state.openSections)
        if (open) {
          next.add(key)
        } else {
          next.delete(key)
        }
        state.openSections = Array.from(next)
      }),
    syncJsonDraftFromResume: () =>
      set((state) => {
        state.jsonDraft = formatJson(state.resumeDraft)
      }),
    resetToDefaults: () => {
      previewRenderSequence += 1
      clearWorkspacePersistence()
      set(() => ({
        ...initialState,
        hydrated: true,
      }))
    },
  })),
)

export function selectWorkspaceSnapshot(state: WorkspaceStore): WorkspaceHydrationSnapshot {
  return {
    hydrated: state.hydrated,
    language: state.language,
    mode: state.mode,
    jsonDraft: state.jsonDraft,
    jsonStatusMessage: state.jsonStatusMessage,
    resumeDraft: state.resumeDraft,
    openSections: state.openSections,
  }
}

export function useWorkspaceViewModel(): WorkspaceViewModel {
  const hydrated = useWorkspaceStore((state) => state.hydrated)
  const language = useWorkspaceStore((state) => state.language)
  const mode = useWorkspaceStore((state) => state.mode)
  const jsonDraft = useWorkspaceStore((state) => state.jsonDraft)
  const jsonStatusMessage = useWorkspaceStore((state) => state.jsonStatusMessage)
  const previewHtml = useWorkspaceStore((state) => state.previewHtml)
  const previewStatusMessage = useWorkspaceStore((state) => state.previewStatusMessage)
  const resumeDraft = useWorkspaceStore((state) => state.resumeDraft)
  const openSections = useWorkspaceStore((state) => state.openSections)
  const state: WorkspaceHydrationSnapshot = {
    hydrated,
    language,
    mode,
    jsonDraft,
    jsonStatusMessage,
    resumeDraft,
    openSections,
  }
  const validationState = validateResume(state.resumeDraft, state.language)

  return {
    ...state,
    validationState,
    validationIssueCounts: buildValidationIssueCounts(validationState.byPath),
    hasValidationIssues: validationState.issues.length > 0,
    ui: getUiStrings(state.language),
    formSections: getFormSections(state.language),
    languageOptions: PREVIEW_LANGUAGES,
    lowercaseForLanguage,
    downloadJsonFilename: state.language === 'pt_BR' ? 'curriculo.json' : 'resume.json',
    previewHtml,
    previewStatusMessage,
  }
}
