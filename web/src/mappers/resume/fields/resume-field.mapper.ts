import type { JsonValue } from '@/types/resume/json/json-value'
import type { FieldDefinition } from '@/types/resume/fields/field-definition'

export type ResumeFieldInputType = 'date' | 'email' | 'text' | 'url'

export function getResumeFieldListItems(field: FieldDefinition, value: JsonValue | undefined): string[] {
  if (field.type === 'list') {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
  }

  return []
}

export function getResumeFieldTextValue(field: FieldDefinition, value: JsonValue | undefined): string {
  if (field.type === 'list') {
    return ''
  }

  return typeof value === 'string' ? value : ''
}

export function getResumeFieldInputType(field: FieldDefinition): ResumeFieldInputType {
  if (field.type === 'email' || field.type === 'url' || field.type === 'date') {
    return field.type
  }

  return 'text'
}

export function getResumeFieldPlaceholder(field: FieldDefinition): string | undefined {
  if (field.type === 'date') {
    return 'yyyy-mm-dd'
  }

  if (field.type === 'url') {
    return 'https://'
  }

  return undefined
}
