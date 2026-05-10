import type { ZodIssue } from 'zod'
import type { ResumeLanguage } from '@/types/ui/resume-language'
import type { ValidationIssue } from '@/types/resume/validation/issue'
import type { ValidationState } from '@/types/resume/validation/state'
import { getPathKey } from '@/mappers/resume/path.mapper'
import { getTranslatedPathLabel, translateValidationMessage } from '@/services/resume-i18n.service'

function toPathLabel(path: string[], language: ResumeLanguage): string {
  if (path.length === 0) {
    return language === 'en_US' ? 'resume' : 'currículo'
  }

  return getTranslatedPathLabel(language, path)
}

export function mapValidationIssues(issues: ZodIssue[], language: ResumeLanguage): ValidationState {
  const byPath: Record<string, string[]> = {}
  const formattedIssues: ValidationIssue[] = []

  for (const issue of issues) {
    const pathParts: string[] = issue.path.map(String)
    const path: string = getPathKey(pathParts)
    const message: string = language === 'en_US' ? translateValidationMessage(issue.message, language) : issue.message

    byPath[path] ??= []
    byPath[path].push(message)
    formattedIssues.push({
      label: toPathLabel(pathParts, language),
      message,
      path,
    })
  }

  return {
    byPath,
    issues: formattedIssues,
  }
}
