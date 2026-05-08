import type { ZodIssue } from 'zod'
import type { ResumeLanguage } from '@/services/preview.service'
import { getTranslatedPathLabel, translateValidationMessage } from '@/services/ui-i18n.service'

export interface ValidationIssue {
  label: string
  message: string
  path: string
}

export interface ValidationState {
  byPath: Record<string, string[]>
  issues: ValidationIssue[]
}

function toPathLabel(path: string[], language: ResumeLanguage): string {
  if (path.length === 0) {
    return language === 'en_US' ? 'resume' : 'currículo'
  }

  if (language !== 'en_US') {
    return path
      .map((part) => (/^\d+$/.test(part) ? `item ${Number(part) + 1}` : part))
      .join(' / ')
  }

  return getTranslatedPathLabel(language, path)
}

export function mapValidationIssues(issues: ZodIssue[], language: ResumeLanguage): ValidationState {
  const byPath: Record<string, string[]> = {}
  const formattedIssues: ValidationIssue[] = []

  for (const issue of issues) {
    const pathParts: string[] = issue.path.map(String)
    const path: string = pathParts.join('.')
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
