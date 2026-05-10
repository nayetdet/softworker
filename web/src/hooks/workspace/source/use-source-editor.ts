'use client'

import { useState, type ChangeEvent, type UIEvent } from 'react'
import { parseSourceDraft } from '@/mappers/resume/source/source-editor'
import { tokenizeJsonSource, type JsonSourceToken } from '@/mappers/resume/source/json-source-highlight'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { useWorkspaceStore } from '@/stores/workspace.store'

type UseSourceEditorResult = {
  highlightedJson: JsonSourceToken[]
  hasErrors: boolean
  scrollLeft: number
  scrollTop: number
  handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  handleScroll: (event: UIEvent<HTMLTextAreaElement>) => void
}

export function useSourceEditor(workspace: WorkspaceViewModel): UseSourceEditorResult {
  const setJsonDraft = useWorkspaceStore((state) => state.setJsonDraft)
  const setJsonStatusMessage = useWorkspaceStore((state) => state.setJsonStatusMessage)
  const clearJsonStatus = useWorkspaceStore((state) => state.clearJsonStatus)
  const setResumeDraft = useWorkspaceStore((state) => state.setResumeDraft)
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const highlightedJson = tokenizeJsonSource(workspace.jsonDraft)
  const hasErrors = Boolean(workspace.jsonStatusMessage) || workspace.hasValidationIssues

  function handleScroll(event: UIEvent<HTMLTextAreaElement>): void {
    setScrollTop(event.currentTarget.scrollTop)
    setScrollLeft(event.currentTarget.scrollLeft)
  }

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    const nextValue = event.target.value
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
    highlightedJson,
    hasErrors,
    scrollLeft,
    scrollTop,
    handleChange,
    handleScroll,
  }
}
