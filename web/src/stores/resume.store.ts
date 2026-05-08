import type { ValidationState } from '@/mappers/resume.mapper'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { buildValidationIssueCounts, type ValidationIssueCounts } from '@/services/resume-form.service'
import {
  formatJson,
  insertArrayItem,
  removeArrayItem,
  setAtPath,
  validateResume,
  type JsonObject,
  type JsonValue,
  type PathPart,
} from '@/services/resume.service'
import {
  JSON_DOWNLOAD_FILENAME,
  renderResumeDocument,
  type ResumeLanguage,
} from '@/services/preview.service'
import { loadWorkspacePersistence } from '@/services/workspace-persistence.service'

function downloadTextFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export interface ResumeState {
  resumeDraft: JsonObject
  language: ResumeLanguage
  validationState: ValidationState
  validationIssueCounts: ValidationIssueCounts
  previewHtml: string
  previewStatusMessage: string
  setLanguage: (language: ResumeLanguage) => void
  setResumeDraft: (next: JsonObject) => void
  updateField: (path: PathPart[], value: JsonValue) => void
  addArrayItem: (path: string[], item: JsonObject) => void
  removeArrayItem: (path: string[], index: number) => void
  renderPreview: () => Promise<void>
  downloadJson: () => void
}

const initialWorkspace = loadWorkspacePersistence()
const initialResume = initialWorkspace.resumeDraft
const initialValidationState = validateResume(initialResume, initialWorkspace.language)

export const useResumeStore = create<ResumeState>()(
  immer((set, get) => {
    const commitResumeDraft = (resumeDraft: JsonObject): void => {
      const validationState = validateResume(resumeDraft, get().language)

      set(() => ({
        resumeDraft,
        validationState,
        validationIssueCounts: buildValidationIssueCounts(validationState.byPath),
      }))
    }

    const updateResumeDraft = (transform: (resumeDraft: JsonObject) => JsonObject): void => {
      commitResumeDraft(transform(get().resumeDraft))
    }

    return {
      resumeDraft: initialResume,
      language: initialWorkspace.language,
      validationState: initialValidationState,
      validationIssueCounts: buildValidationIssueCounts(initialValidationState.byPath),
      previewHtml: '',
      previewStatusMessage: '',

      setLanguage: (language: ResumeLanguage): void => {
        const resumeDraft = get().resumeDraft
        const validationState = validateResume(resumeDraft, language)

        set(() => ({
          language,
          validationState,
          validationIssueCounts: buildValidationIssueCounts(validationState.byPath),
        }))
      },

      setResumeDraft: (next: JsonObject): void => {
        commitResumeDraft(next)
      },

      updateField: (path: PathPart[], value: JsonValue): void => {
        updateResumeDraft((resumeDraft) => setAtPath(resumeDraft, path, value))
      },

      addArrayItem: (path: string[], item: JsonObject): void => {
        updateResumeDraft((resumeDraft) => insertArrayItem(resumeDraft, path, item))
      },

      removeArrayItem: (path: string[], index: number): void => {
        updateResumeDraft((resumeDraft) => removeArrayItem(resumeDraft, path, index))
      },

      renderPreview: async (): Promise<void> => {
        const { language, resumeDraft } = get()

        try {
          const html = await renderResumeDocument(resumeDraft, language)

          set(() => ({
            previewHtml: html,
            previewStatusMessage: '',
          }))
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : language === 'en_US'
                ? 'Failed to render the preview.'
                : 'Falha ao renderizar a pré-visualização.'

          set(() => ({
            previewStatusMessage: message,
          }))
        }
      },

      downloadJson: (): void => {
        const { resumeDraft } = get()
        downloadTextFile(JSON_DOWNLOAD_FILENAME, formatJson(resumeDraft), 'application/json;charset=utf-8')
      },
    }
  }),
)
