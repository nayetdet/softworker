'use client'

import { useWorkspaceStore } from '@/stores/workspace.store'

type UseWorkspaceModeSwitchResult = {
  handleFormModeClick: () => void
  handleSourceModeClick: () => void
  handleResetClick: () => void
}

export function useWorkspaceModeSwitch(resetConfirm: string): UseWorkspaceModeSwitchResult {
  const setMode = useWorkspaceStore((state) => state.setMode)
  const syncJsonDraftFromResume = useWorkspaceStore((state) => state.syncJsonDraftFromResume)
  const resetToDefaults = useWorkspaceStore((state) => state.resetToDefaults)

  function handleFormModeClick(): void {
    setMode('form')
  }

  function handleSourceModeClick(): void {
    syncJsonDraftFromResume()
    setMode('source')
  }

  function handleResetClick(): void {
    if (typeof window !== 'undefined' && !window.confirm(resetConfirm)) {
      return
    }

    resetToDefaults()
  }

  return {
    handleFormModeClick,
    handleSourceModeClick,
    handleResetClick,
  }
}
