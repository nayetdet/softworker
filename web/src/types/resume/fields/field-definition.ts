import type { FieldType } from '@/types/resume/fields/field-type'

export type FieldDefinition = {
  key: string
  label: string
  type?: FieldType
  full?: boolean
  required?: boolean
}
