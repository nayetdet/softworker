import type { ValidationIssue } from '@/types/resume/validation/issue'

export type ValidationState = {
  byPath: Record<string, string[]>
  issues: ValidationIssue[]
}
