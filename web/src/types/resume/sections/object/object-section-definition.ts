import type { NestedSectionDefinition } from '@/types/resume/sections/object/nested-section-definition'
import type { FieldDefinition } from '@/types/resume/fields/field-definition'

export type ObjectSectionDefinition = {
  key: string
  title: string
  fields: FieldDefinition[]
  nested?: NestedSectionDefinition[]
}
