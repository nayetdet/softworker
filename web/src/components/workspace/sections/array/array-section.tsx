'use client'

import { getSectionContentId, getSectionHeadingId, getSectionId, getSectionKey } from '@/mappers/resume/sections/section.mapper'
import type { ArraySectionDefinition } from '@/types/resume/sections/array/array-section-definition'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { useArraySection } from '@/hooks/workspace/sections/use-array-section'
import { CollapsibleSectionPanel } from '@/components/workspace/sections/common/collapsible-section-panel'
import { ArraySectionItem } from '@/components/workspace/sections/array/array-section-item'
import { ValidationBadge } from '@/components/workspace/sections/common/validation-badge'

function ArraySection({
  section,
  workspace,
}: {
  section: ArraySectionDefinition
  workspace: WorkspaceViewModel
}): React.JSX.Element {
  const key = getSectionKey(section.path)
  const sectionId = getSectionId(key)
  const headingId = getSectionHeadingId(key)
  const contentId = getSectionContentId(key)
  const {
    addItemAriaLabel,
    addItemTitle,
    contentClassName,
    highlightedIndex,
    handleAddItem,
    handleItemAnimationEnd,
    handleToggle,
    isOpen,
    itemErrorCounts,
    items,
    sectionErrorCount,
    subtitle,
    removeItem,
  } = useArraySection(section, workspace)

  return (
    <CollapsibleSectionPanel
      title={section.title}
      subtitle={subtitle}
      sectionId={sectionId}
      headingId={headingId}
      contentId={contentId}
      isOpen={isOpen}
      onToggle={handleToggle}
      status={sectionErrorCount > 0 ? <ValidationBadge>{workspace.ui.reviewPendingLabel}</ValidationBadge> : undefined}
      actions={
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-full border border-border/80 bg-background text-lg leading-none text-muted-foreground transition-colors hover:border-border hover:bg-accent/50 hover:text-foreground"
          aria-label={addItemAriaLabel}
          title={addItemTitle}
          onClick={handleAddItem}
        >
          +
        </button>
      }
      contentClassName={contentClassName}
    >
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/70 bg-background/70 px-4 py-5 text-sm leading-6 text-muted-foreground">
          {workspace.ui.arraySectionEmpty}
        </p>
      ) : (
        <>
          <p className="text-[0.8rem] leading-[1.45] text-muted-foreground">{workspace.ui.arraySectionHint}</p>
          <div className="grid gap-3">
            {items.map((_, index: number) => (
              <ArraySectionItem
                key={`${key}.${index}`}
                index={index}
                itemErrorCount={itemErrorCounts[index] ?? 0}
                isHighlighted={highlightedIndex === index}
                onAnimationEnd={handleItemAnimationEnd}
                onRemove={removeItem}
                section={section}
                workspace={workspace}
                removeLabel={workspace.ui.listRemoveButton}
              />
            ))}
          </div>
        </>
      )}
    </CollapsibleSectionPanel>
  )
}

export { ArraySection }
