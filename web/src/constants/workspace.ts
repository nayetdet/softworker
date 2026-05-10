import defaultResume from '@docs/examples/resume.json'
import type { JsonObject } from '@/types/resume/json/json-object'
import type { ResumeLanguage } from '@/types/ui/resume-language'

export const DEFAULT_LANGUAGE: ResumeLanguage = 'pt_BR'
export const JSON_DOWNLOAD_FILENAME = 'curriculo.json'

export const PREVIEW_LANGUAGES = [
  { value: 'pt_BR' as const, label: 'Português (Brasil)' },
  { value: 'en_US' as const, label: 'English (US)' },
] as const

export const DEFAULT_RESUME = defaultResume as JsonObject
