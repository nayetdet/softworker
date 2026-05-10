import type { JsonObject } from '@/types/resume/json/json-object'
import type { FieldDefinition } from '@/types/resume/fields/field-definition'

export type ArraySectionDefinition = {
  path: string[]
  title: string
  itemTitle: string
  createItem: () => JsonObject
  fields: FieldDefinition[]
}
