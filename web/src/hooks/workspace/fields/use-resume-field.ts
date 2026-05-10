'use client'

import { getAtPath } from '@/utils/json'
import type { WorkspaceStore, WorkspaceViewModel } from '@/stores/workspace.store'
import { useWorkspaceStore } from '@/stores/workspace.store'
import type { JsonValue } from '@/types/resume/json/json-value'
import type { PathPart } from '@/types/resume/json/path-part'
import type { FieldDefinition } from '@/types/resume/fields/field-definition'
import { getPathKey } from '@/mappers/resume/path.mapper'
import {
  getResumeFieldInputType,
  getResumeFieldListItems,
  getResumeFieldPlaceholder,
  getResumeFieldTextValue,
} from '@/mappers/resume/fields/resume-field.mapper'

type UseResumeFieldResult = {
  error: string | undefined
  fieldId: string
  inputType: ReturnType<typeof getResumeFieldInputType>
  listItems: string[]
  placeholder: string | undefined
  textValue: string
  updateListValue: (nextValue: string[]) => void
  updateTextValue: (nextValue: string) => void
}

export function useResumeField(
  field: FieldDefinition,
  path: PathPart[],
  workspace: WorkspaceViewModel,
): UseResumeFieldResult {
  const clearJsonStatus = useWorkspaceStore((state: WorkspaceStore) => state.clearJsonStatus)
  const updateField = useWorkspaceStore((state: WorkspaceStore) => state.updateField)
  const fieldId = getPathKey(path)
  const error = workspace.validationState.byPath[fieldId]?.[0]
  const value = getAtPath(workspace.resumeDraft, path)

  function updateValue(nextValue: JsonValue): void {
    updateField(path, nextValue)
    clearJsonStatus()
  }

  return {
    error,
    fieldId,
    inputType: getResumeFieldInputType(field),
    listItems: getResumeFieldListItems(field, value),
    placeholder: getResumeFieldPlaceholder(field),
    textValue: getResumeFieldTextValue(field, value),
    updateListValue: (nextValue) => updateValue(nextValue),
    updateTextValue: (nextValue) => updateValue(nextValue),
  }
}
