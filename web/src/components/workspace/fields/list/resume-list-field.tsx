'use client'

import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { useListFieldInput } from '@/hooks/workspace/fields/use-list-field'
import { ResumeListFieldItem } from '@/components/workspace/fields/list/resume-list-field-item'

type ResumeListFieldProps = {
  fieldId: string
  items: string[]
  onValueChange: (items: string[]) => void
  workspace: WorkspaceViewModel
}

export function ResumeListField({ fieldId, items, onValueChange, workspace }: ResumeListFieldProps): React.JSX.Element {
  const { draftValue, getRemoveAriaLabel, handleKeyDown, handlePaste, handleRemoveItem, setDraftValue } = useListFieldInput(
    items,
    onValueChange,
    workspace.ui.listRemoveAriaPrefix,
  )

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-inset ring-border/40">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{workspace.ui.listTitle}</p>
        </div>
      </div>

      <div className="grid gap-3">
        <input
          id={fieldId}
          value={draftValue}
          onChange={(event) => setDraftValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          spellCheck={false}
          placeholder={workspace.ui.listPlaceholder}
          className="h-11 rounded-md border border-border/80 bg-background px-3 outline-none transition-colors focus:border-primary"
        />

        {items.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border/70 bg-background">
            {items.map((item, index) => (
              <ResumeListFieldItem
                key={`${item}-${index}`}
                index={index}
                isLast={index === items.length - 1}
                item={item}
                onRemove={handleRemoveItem}
                removeAriaLabel={getRemoveAriaLabel(item)}
                removeButtonLabel={workspace.ui.listRemoveButton}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/70 bg-background px-4 py-5">
            <p className="text-sm font-medium text-foreground">{workspace.ui.listEmptyTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">{workspace.ui.listEmptyDescription}</p>
          </div>
        )}
      </div>
    </div>
  )
}
