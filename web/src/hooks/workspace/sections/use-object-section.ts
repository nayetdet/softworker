'use client'

import { formatCountLabel } from '@/services/resume-i18n.service'
import { getSectionContentId, getSectionHeadingId, getSectionId } from '@/mappers/resume/sections/section.mapper'
import type { ObjectSectionDefinition } from '@/types/resume/sections/object/object-section-definition'
import type { WorkspaceStore } from '@/stores/workspace.store'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { useWorkspaceStore } from '@/stores/workspace.store'

type UseObjectSectionResult = {
  contentId: string
  headingId: string
  isOpen: boolean
  subtitle: string | undefined
  sectionId: string
  handleToggle: () => void
}

export function useObjectSection(section: ObjectSectionDefinition, workspace: WorkspaceViewModel): UseObjectSectionResult {
  const sectionKey = section.key
  const sectionId = getSectionId(sectionKey)
  const headingId = getSectionHeadingId(sectionKey)
  const contentId = getSectionContentId(sectionKey)
  const isOpen = useWorkspaceStore((state: WorkspaceStore) => state.openSections.includes(sectionKey))
  const errorCount = workspace.validationIssueCounts[sectionKey] ?? 0
  const subtitle =
    errorCount > 0
      ? formatCountLabel(errorCount, workspace.ui.validationAdjustOne, workspace.ui.validationAdjustOther)
      : undefined
  const toggleSection = useWorkspaceStore((state: WorkspaceStore) => state.toggleSection)

  function handleToggle(): void {
    toggleSection(sectionKey, !isOpen)
  }

  return {
    contentId,
    headingId,
    isOpen,
    subtitle,
    sectionId,
    handleToggle,
  }
}
