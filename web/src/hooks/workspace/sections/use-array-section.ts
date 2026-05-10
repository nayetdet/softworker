'use client'

import { useState, type AnimationEvent } from 'react'
import { getAtPath } from '@/utils/json'
import { getSectionKey } from '@/mappers/resume/sections/section.mapper'
import { formatCountLabel, formatTemplate } from '@/services/resume-i18n.service'
import type { JsonValue } from '@/types/resume/json/json-value'
import type { ArraySectionDefinition } from '@/types/resume/sections/array/array-section-definition'
import type { WorkspaceStore } from '@/stores/workspace.store'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { useWorkspaceStore } from '@/stores/workspace.store'

type UseArraySectionResult = {
  addItemAriaLabel: string
  addItemTitle: string
  contentClassName: string
  itemErrorCounts: number[]
  items: JsonValue[]
  sectionErrorCount: number
  isOpen: boolean
  highlightedIndex: number | null
  subtitle: string
  handleAddItem: () => void
  handleItemAnimationEnd: (event: AnimationEvent<HTMLElement>, index: number) => void
  handleToggle: () => void
  removeItem: (index: number) => void
}

const EMPTY_JSON_ARRAY: JsonValue[] = []

export function useArraySection(section: ArraySectionDefinition, workspace: WorkspaceViewModel): UseArraySectionResult {
  const key = getSectionKey(section.path)
  const items = useWorkspaceStore((state: WorkspaceStore) => {
    const current = getAtPath(state.resumeDraft, section.path)
    return Array.isArray(current) ? current : EMPTY_JSON_ARRAY
  })
  const isOpen = useWorkspaceStore((state: WorkspaceStore) => state.openSections.includes(key))
  const toggleSection = useWorkspaceStore((state: WorkspaceStore) => state.toggleSection)
  const addArrayItem = useWorkspaceStore((state: WorkspaceStore) => state.addArrayItem)
  const removeArrayItem = useWorkspaceStore((state: WorkspaceStore) => state.removeArrayItem)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const sectionErrorCount = workspace.validationIssueCounts[key] ?? 0
  const itemErrorCounts = items.map((_, index) => workspace.validationIssueCounts[`${key}.${index}`] ?? 0)
  const itemTitleLowercase = workspace.lowercaseForLanguage(section.itemTitle, workspace.language)
  const subtitle = formatCountLabel(items.length, workspace.ui.arrayItemCountOne, workspace.ui.arrayItemCountOther)
  const addItemAriaLabel = formatTemplate(workspace.ui.addItemAria, { item: itemTitleLowercase })
  const addItemTitle = formatTemplate(workspace.ui.addItemTitle, { item: itemTitleLowercase })
  const contentClassName =
    items.length === 0 ? 'space-y-4 bg-muted/10 pt-4' : 'space-y-4 border-t border-border/70 bg-muted/10 pt-5'

  function handleToggle(): void {
    toggleSection(key, !isOpen)
  }

  function handleAddItem(): void {
    if (!isOpen) {
      toggleSection(key, true)
    }

    const nextIndex = items.length
    setHighlightedIndex(nextIndex)
    addArrayItem(section.path, section.createItem())
  }

  function handleItemAnimationEnd(event: AnimationEvent<HTMLElement>, index: number): void {
    if (event.currentTarget !== event.target) {
      return
    }

    setHighlightedIndex((current) => (current === index ? null : current))
  }

  function removeItem(index: number): void {
    removeArrayItem(section.path, index)
  }

  return {
    addItemAriaLabel,
    addItemTitle,
    contentClassName,
    itemErrorCounts,
    items,
    sectionErrorCount,
    isOpen,
    highlightedIndex,
    subtitle,
    handleAddItem,
    handleItemAnimationEnd,
    handleToggle,
    removeItem,
  }
}
