'use client'

import { getSectionKey } from '@/mappers/resume/sections/section.mapper'
import { formatCountLabel } from '@/services/resume-i18n.service'
import type { NestedSectionDefinition } from '@/types/resume/sections/object/nested-section-definition'
import type { WorkspaceViewModel } from '@/stores/workspace.store'

type UseNestedSectionResult = {
  subtitle: string | undefined
}

export function useNestedSection(
  parentKey: string,
  section: NestedSectionDefinition,
  workspace: WorkspaceViewModel,
): UseNestedSectionResult {
  const sectionKey = getSectionKey([parentKey, section.key])
  const errorCount = workspace.validationIssueCounts[sectionKey] ?? 0

  return {
    subtitle:
      errorCount > 0
        ? formatCountLabel(errorCount, workspace.ui.validationIssueOne, workspace.ui.validationIssueOther)
        : undefined,
  }
}
