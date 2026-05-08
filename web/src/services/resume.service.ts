import { mapValidationIssues, type ValidationState } from '@/mappers/resume.mapper'
import { resumeSchema } from '@/schemas/resume.schema'
import type { ResumeLanguage } from '@/services/preview.service'

export type JsonPrimitive = boolean | number | string | null
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[]

export interface JsonObject {
  [key: string]: JsonValue | undefined
}

export type PathPart = number | string

export function formatJson(value: JsonObject): string {
  return JSON.stringify(value, null, 2)
}

export function parseResumeJson(value: string, language: ResumeLanguage): JsonObject {
  const parsed: JsonValue = JSON.parse(value) as JsonValue

  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
    throw new Error(language === 'en_US' ? 'JSON must be an object.' : 'JSON precisa ser um objeto.')
  }

  return parsed as JsonObject
}

export function getAtPath(target: JsonValue | undefined, path: PathPart[]): JsonValue | undefined {
  return path.reduce<JsonValue | undefined>((value, part) => {
    if (value == null) {
      return undefined
    }

    if (Array.isArray(value)) {
      return typeof part === 'number' ? value[part] : undefined
    }

    if (typeof value === 'object') {
      return typeof part === 'string' ? value[part] : undefined
    }

    return undefined
  }, target)
}

export function isJsonRecord(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function updateAtPath(target: JsonValue | undefined, path: PathPart[], value: JsonValue): JsonValue {
  const [part, ...rest] = path

  if (part == null) {
    return value
  }

  if (typeof part === 'number') {
    const current: JsonValue[] = Array.isArray(target) ? target : []
    const next: JsonValue[] = current.slice()
    const branch: JsonValue | undefined = current[part]

    next[part] = rest.length > 0 ? updateAtPath(branch, rest, value) : value

    return next
  }

  const current: JsonObject = isJsonRecord(target) ? target : {}
  const branch: JsonValue | undefined = current[part]

  return {
    ...current,
    [part]: rest.length > 0 ? updateAtPath(branch, rest, value) : value,
  }
}

export function setAtPath(target: JsonObject, path: PathPart[], value: JsonValue): JsonObject {
  return updateAtPath(target, path, value) as JsonObject
}

export function insertArrayItem(target: JsonObject, path: string[], item: JsonObject): JsonObject {
  const current: JsonValue | undefined = getAtPath(target, path)
  const nextItems: JsonValue[] = Array.isArray(current) ? [...current, item] : [item]

  return setAtPath(target, path, nextItems)
}

export function removeArrayItem(target: JsonObject, path: string[], index: number): JsonObject {
  const current: JsonValue | undefined = getAtPath(target, path)

  if (!Array.isArray(current)) {
    return target
  }

  return setAtPath(
    target,
    path,
    current.filter((_, itemIndex) => itemIndex !== index),
  )
}

export function validateResume(resume: JsonObject, language: ResumeLanguage): ValidationState {
  const result = resumeSchema.safeParse(resume)

  if (result.success) {
    return {
      byPath: {},
      issues: [],
    }
  }

  return mapValidationIssues(result.error.issues, language)
}
