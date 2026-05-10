'use client'

import type { AnimationEvent } from 'react'
import { cn } from '@/lib/utils'
import type { ArraySectionDefinition } from '@/types/resume/sections/array/array-section-definition'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { ResumeFieldList } from '@/components/workspace/fields/shared/resume-field-list'

type ArraySectionItemProps = {
  index: number
  itemErrorCount: number
  isHighlighted: boolean
  onAnimationEnd: (event: AnimationEvent<HTMLElement>, index: number) => void
  onRemove: (index: number) => void
  section: ArraySectionDefinition
  workspace: WorkspaceViewModel
  removeLabel: string
}

export function ArraySectionItem({
  index,
  itemErrorCount,
  isHighlighted,
  onAnimationEnd,
  onRemove,
  section,
  workspace,
  removeLabel,
}: ArraySectionItemProps): React.JSX.Element {
  return (
    <article
      className={cn(
        'rounded-xl border p-4 transition-[box-shadow,transform,border-color,background-color] duration-300 focus-within:ring-2 focus-within:ring-emerald-300/70',
        itemErrorCount > 0 ? 'border-rose-300/70 bg-rose-50/85' : 'border-border/70 bg-background/90',
        isHighlighted ? 'array-item-focus-pop border-emerald-300/70 bg-emerald-50/50 shadow-[0_0_0_1px_rgba(16,185,129,0.14)]' : '',
      )}
      onAnimationEnd={(event) => onAnimationEnd(event, index)}
    >
      <div className="mb-3 flex flex-col gap-3 border-b pb-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h3 className="break-words text-[0.92rem] font-extrabold leading-[1.18]">{section.itemTitle}</h3>
          <p className="mt-1 text-[0.72rem] text-muted-foreground">Item {index + 1}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <button
            type="button"
            className="rounded-full border border-border bg-muted/40 px-3.5 py-1.5 text-sm text-foreground transition-colors hover:bg-muted/70"
            onClick={() => onRemove(index)}
          >
            {removeLabel}
          </button>
        </div>
      </div>

      <ResumeFieldList fields={section.fields} pathPrefix={[...section.path, index]} workspace={workspace} />
    </article>
  )
}
