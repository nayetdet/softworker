import type { JsonValue } from '@/types/resume/json/json-value'

export type JsonObject = {
  [key: string]: JsonValue | undefined
}
