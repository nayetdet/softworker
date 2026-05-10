'use client'

import { cn } from '@/lib/utils'

type ResumeListFieldItemProps = {
  index: number
  isLast: boolean
  item: string
  onRemove: (index: number) => void
  removeAriaLabel: string
  removeButtonLabel: string
}

export function ResumeListFieldItem({
  index,
  isLast,
  item,
  onRemove,
  removeAriaLabel,
  removeButtonLabel,
}: ResumeListFieldItemProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40',
        !isLast && 'border-b border-border/80',
      )}
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[0.7rem] font-semibold tabular-nums text-muted-foreground">
        {index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.95rem] text-foreground">{item}</p>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-full border border-border/90 bg-card px-3.5 py-1.5 text-sm text-foreground shadow-sm transition-colors hover:bg-muted"
        onClick={() => onRemove(index)}
        aria-label={removeAriaLabel}
        title={removeAriaLabel}
      >
        {removeButtonLabel}
      </button>
    </div>
  )
}
