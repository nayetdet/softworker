import type { JsonObject } from '@/types/resume/json/json-object'
import type { JsonPrimitive } from '@/types/resume/json/json-primitive'

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]
