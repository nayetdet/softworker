import type { JsonObject } from '@/types/resume/json/json-object'
import type { JsonValue } from '@/types/resume/json/json-value'
import type { PathPart } from '@/types/resume/json/path-part'

export function isJsonRecord(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function formatJson(value: JsonObject): string {
  return JSON.stringify(value, null, 2)
}

export function parseJsonObject(value: string, errorMessage: string): JsonObject {
  const parsed: unknown = JSON.parse(value)

  if (!isJsonRecord(parsed)) {
    throw new Error(errorMessage)
  }

  return parsed
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
  const nextValue: JsonValue = updateAtPath(target, path, value)

  if (!isJsonRecord(nextValue)) {
    throw new Error('setAtPath must resolve to a JSON object.')
  }

  return nextValue
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
