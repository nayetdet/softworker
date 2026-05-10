'use client'

import { useWorkspaceStore } from '@/stores/workspace.store'
import type { ResumeLanguage } from '@/types/ui/resume-language'
import type { WorkspaceStore } from '@/stores/workspace.store'

type UseWorkspaceHeaderResult = {
  handleLanguageChange: (value: string) => void
}

export function useWorkspaceHeader(): UseWorkspaceHeaderResult {
  const setLanguage = useWorkspaceStore((state: WorkspaceStore) => state.setLanguage)

  function handleLanguageChange(value: string): void {
    setLanguage(value as ResumeLanguage)
  }

  return {
    handleLanguageChange,
  }
}
