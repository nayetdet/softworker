import type { ValidationIssue } from '@/types/resume/validation/issue'

type StatusAlertSource = {
  jsonStatusMessage: string
  previewStatusMessage: string
  validationIssues: ValidationIssue[]
}

export type StatusAlertState = {
  issues: ValidationIssue[]
  message: string | null
}

export function getStatusAlertState(source: StatusAlertSource): StatusAlertState {
  const message = source.previewStatusMessage || source.jsonStatusMessage

  return {
    issues: source.validationIssues,
    message: message || null,
  }
}
