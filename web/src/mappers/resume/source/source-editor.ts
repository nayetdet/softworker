import { parseJsonObject } from '@/utils/json'
import type { JsonObject } from '@/types/resume/json/json-object'
import type { ResumeLanguage } from '@/types/ui/resume-language'

export type ParseSourceDraftResult =
  | {
      errorMessage: null
      resumeDraft: JsonObject
    }
  | {
      errorMessage: string
      resumeDraft: null
    }

export function parseSourceDraft(value: string, language: ResumeLanguage): ParseSourceDraftResult {
  try {
    return {
      errorMessage: null,
      resumeDraft: parseJsonObject(value, language === 'en_US' ? 'JSON must be an object.' : 'JSON precisa ser um objeto.'),
    }
  } catch (error) {
    return {
      errorMessage: error instanceof Error ? error.message : 'JSON inválido.',
      resumeDraft: null,
    }
  }
}
