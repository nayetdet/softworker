'use client'

import { useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { DEFAULT_LANGUAGE, DEFAULT_RESUME } from '@/constants/workspace'
import { loadWorkspacePersistence, saveWorkspacePersistence } from '@/services/workspace.service'
import { useWorkspaceStore, type WorkspaceStore } from '@/stores/workspace.store'

export function useWorkspacePersistence(): void {
  const hydrateWorkspace = useWorkspaceStore((state: WorkspaceStore) => state.hydrateWorkspace)
  const renderPreview = useWorkspaceStore((state: WorkspaceStore) => state.renderPreview)
  const hydrated = useWorkspaceStore((state: WorkspaceStore) => state.hydrated)
  const jsonDraft = useWorkspaceStore((state: WorkspaceStore) => state.jsonDraft)
  const language = useWorkspaceStore((state: WorkspaceStore) => state.language)
  const mode = useWorkspaceStore((state: WorkspaceStore) => state.mode)
  const openSections = useWorkspaceStore((state: WorkspaceStore) => state.openSections)
  const resumeDraft = useWorkspaceStore((state: WorkspaceStore) => state.resumeDraft)
  const debouncedRenderPreview = useDebouncedCallback(() => {
    void renderPreview()
  }, 250)

  useEffect(() => {
    hydrateWorkspace({
      ...loadWorkspacePersistence(DEFAULT_RESUME, DEFAULT_LANGUAGE),
      jsonStatusMessage: '',
      hydrated: true,
    })
  }, [hydrateWorkspace])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    saveWorkspacePersistence({
      jsonDraft,
      language,
      mode,
      openSections,
      resumeDraft,
    })
  }, [hydrated, jsonDraft, language, mode, openSections, resumeDraft])

  useEffect(() => {
    if (!hydrated) {
      return
    }

    debouncedRenderPreview()

    return () => {
      debouncedRenderPreview.cancel()
    }
  }, [debouncedRenderPreview, hydrated, language, resumeDraft])
}
