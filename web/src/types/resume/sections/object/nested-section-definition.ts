import type { FieldDefinition } from '@/types/resume/fields/field-definition'

export type NestedSectionDefinition = {
  key: string
  title: string
  fields: FieldDefinition[]
}
