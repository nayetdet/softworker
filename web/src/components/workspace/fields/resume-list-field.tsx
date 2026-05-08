import { useState, type ChangeEvent, type ClipboardEvent, type KeyboardEvent, type ReactElement } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getUiStrings } from '@/services/ui-i18n.service'
import { useResumeStore } from '@/stores/resume.store'

function parseListInput(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function ResumeListField({
  fieldId,
  items,
  onValueChange,
}: {
  fieldId: string
  items: string[]
  onValueChange: (items: string[]) => void
}): ReactElement {
  const [draftValue, setDraftValue] = useState('')
  const language = useResumeStore((state) => state.language)
  const ui = getUiStrings(language)

  function appendItems(rawValue: string): boolean {
    const nextItems = parseListInput(rawValue)

    if (nextItems.length === 0) {
      return false
    }

    onValueChange([...items, ...nextItems])
    setDraftValue('')
    return true
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    appendItems(draftValue)
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>): void {
    const pastedText = event.clipboardData.getData('text')

    if (!/[\n,]/.test(pastedText)) {
      return
    }

    event.preventDefault()

    const selectionStart = event.currentTarget.selectionStart ?? draftValue.length
    const selectionEnd = event.currentTarget.selectionEnd ?? draftValue.length
    const nextDraftValue =
      draftValue.slice(0, selectionStart) + pastedText + draftValue.slice(selectionEnd)

    appendItems(nextDraftValue)
  }

  function handleRemoveItem(index: number): void {
    onValueChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm ring-1 ring-inset ring-border/40">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{ui.listTitle}</p>
        </div>
      </div>

      <div className="grid gap-3">
        <div>
          <Input
            id={fieldId}
            value={draftValue}
            onChange={(event: ChangeEvent<HTMLInputElement>): void => setDraftValue(event.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            spellCheck={false}
            placeholder={ui.listPlaceholder}
            className="h-11 bg-background"
          />
        </div>

        {items.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-border/70 bg-background">
            {items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/40',
                  index !== items.length - 1 && 'border-b border-border/80',
                )}
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[0.7rem] font-semibold tabular-nums text-muted-foreground">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.95rem] text-foreground">{item}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem(index)}
                  className="shrink-0 border-border/90 bg-card text-foreground shadow-sm transition-colors hover:bg-muted"
                  aria-label={ui.listRemoveAriaPrefix.replace('{item}', item)}
                  title={ui.listRemoveAriaPrefix.replace('{item}', item)}
                >
                  {ui.listRemoveButton}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/70 bg-background px-4 py-5">
            <p className="text-sm font-medium text-foreground">{ui.listEmptyTitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {ui.listEmptyDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
