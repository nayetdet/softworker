import { formatJson, isJsonRecord } from '@/utils/json'
import type { JsonObject } from '@/types/resume/json/json-object'
import type { ResumeLanguage } from '@/types/ui/resume-language'
import type { WorkspaceViewMode } from '@/types/ui/workspace-view-mode'

export type WorkspacePersistenceSnapshot = {
  jsonDraft: string
  language: ResumeLanguage
  mode: WorkspaceViewMode
  resumeDraft: JsonObject
  openSections: string[]
}

const STORAGE_KEY = 'softworker.workspace.v1'

function createDefaultSnapshot(defaultResume: JsonObject, defaultLanguage: ResumeLanguage): WorkspacePersistenceSnapshot {
  return {
    jsonDraft: formatJson(defaultResume),
    language: defaultLanguage,
    mode: 'form',
    resumeDraft: defaultResume,
    openSections: [],
  }
}

function readRawSnapshot(key: string): unknown | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

function readPersistedSnapshot(defaultResume: JsonObject, defaultLanguage: ResumeLanguage): WorkspacePersistenceSnapshot {
  const candidate = readRawSnapshot(STORAGE_KEY)

  if (!isJsonRecord(candidate)) {
    return createDefaultSnapshot(defaultResume, defaultLanguage)
  }

  const resumeDraft = isJsonRecord(candidate.resumeDraft) ? candidate.resumeDraft : defaultResume
  const mode = candidate.mode === 'source' ? 'source' : 'form'

  return {
    jsonDraft: typeof candidate.jsonDraft === 'string' ? candidate.jsonDraft : formatJson(resumeDraft),
    language: candidate.language === 'en_US' ? 'en_US' : defaultLanguage,
    mode,
    resumeDraft,
    openSections: Array.isArray(candidate.openSections)
      ? candidate.openSections.filter((value): value is string => typeof value === 'string')
      : [],
  }
}

export function loadWorkspacePersistence(defaultResume: JsonObject, defaultLanguage: ResumeLanguage): WorkspacePersistenceSnapshot {
  if (typeof window === 'undefined') {
    return createDefaultSnapshot(defaultResume, defaultLanguage)
  }

  return readPersistedSnapshot(defaultResume, defaultLanguage)
}

export function saveWorkspacePersistence(snapshot: WorkspacePersistenceSnapshot): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  } catch {
    return
  }
}

export function clearWorkspacePersistence(): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}
