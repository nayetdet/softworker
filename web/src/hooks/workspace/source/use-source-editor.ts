'use client'

import { parseSourceDraft } from '@/mappers/resume/source/source-editor'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { useWorkspaceStore } from '@/stores/workspace.store'

type UseSourceEditorResult = {
  hasErrors: boolean
  handleValueChange: (nextValue: string) => void
}

export function useSourceEditor(workspace: WorkspaceViewModel): UseSourceEditorResult {
  const setJsonDraft = useWorkspaceStore((state) => state.setJsonDraft)
  const setJsonStatusMessage = useWorkspaceStore((state) => state.setJsonStatusMessage)
  const clearJsonStatus = useWorkspaceStore((state) => state.clearJsonStatus)
  const setResumeDraft = useWorkspaceStore((state) => state.setResumeDraft)
  const hasErrors = Boolean(workspace.jsonStatusMessage) || workspace.hasValidationIssues

  function handleValueChange(nextValue: string): void {
    setJsonDraft(nextValue)

    const { errorMessage, resumeDraft } = parseSourceDraft(nextValue, workspace.language)
    if (resumeDraft) {
      setResumeDraft(resumeDraft)
      clearJsonStatus()
      return
    }

    setJsonStatusMessage(`${workspace.ui.sourceInvalidJsonPrefix} ${errorMessage}`)
  }

  return {
    hasErrors,
    handleValueChange,
  }
}
