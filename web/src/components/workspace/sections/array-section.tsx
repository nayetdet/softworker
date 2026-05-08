import { ResumeFieldList } from '@/components/workspace/fields/resume-field-list'
import { CollapsibleSectionPanel } from '@/components/workspace/sections/collapsible-section-panel'
import { Button } from '@/components/ui/button'
import { getAtPath } from '@/services/resume.service'
import type { ArraySectionDefinition } from '@/services/resume-form.service'
import { getUiStrings } from '@/services/ui-i18n.service'
import { useFormStore } from '@/stores/form.store'
import { useResumeStore } from '@/stores/resume.store'
import { useEffect, useState, type ReactElement } from 'react'

function ArraySectionItem({
  index,
  itemTitle,
  path,
  fields,
  isHighlighted,
  onRemove,
}: {
  index: number
  itemTitle: string
  path: string[]
  fields: ArraySectionDefinition['fields']
  isHighlighted?: boolean
  onRemove: () => void
}): ReactElement {
  const itemErrorCount = useResumeStore((state) => state.validationIssueCounts[`${path.join('.')}.${index}`] ?? 0)
  const language = useResumeStore((state) => state.language)
  const ui = getUiStrings(language)

  return (
    <article
      className={[
        'rounded-xl border p-4 transition-[box-shadow,transform,border-color,background-color] duration-300 focus-within:ring-2 focus-within:ring-emerald-300/70',
        itemErrorCount > 0 ? 'border-rose-300/70 bg-rose-50/85' : 'border-border/70 bg-background/90',
        isHighlighted ? 'array-item-focus-pop border-emerald-300/70 bg-emerald-50/50 shadow-[0_0_0_1px_rgba(16,185,129,0.14)]' : '',
      ].join(' ')}
    >
      <div className="mb-3 flex flex-col gap-3 border-b pb-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h3 className="break-words text-[0.92rem] font-extrabold leading-[1.18]">{itemTitle}</h3>
          <p className="mt-1 text-[0.72rem] text-muted-foreground">Item {index + 1}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <Button
            variant="outline"
            size="sm"
            className="border-border bg-muted/40 text-foreground hover:bg-muted/70"
            onClick={onRemove}
          >
            {ui.listRemoveButton}
          </Button>
        </div>
      </div>
      <ResumeFieldList
        fields={fields}
        pathPrefix={[...path, index]}
      />
    </article>
  )
}

export function ArraySection({ section }: { section: ArraySectionDefinition }): ReactElement {
  const key = section.path.join('.')
  const sectionId = `section-${key.replaceAll('.', '-')}`
  const headingId = `${sectionId}-heading`
  const contentId = `${sectionId}-content`
  const errorCount = useResumeStore((state) => state.validationIssueCounts[key] ?? 0)
  const isOpen = useFormStore((state) => state.openSections.has(key))
  const toggleSection = useFormStore((state) => state.toggleSection)
  const itemCount = useResumeStore((state) => {
    const value = getAtPath(state.resumeDraft, section.path)
    return Array.isArray(value) ? value.length : 0
  })
  const addArrayItem = useResumeStore((state) => state.addArrayItem)
  const removeArrayItem = useResumeStore((state) => state.removeArrayItem)
  const language = useResumeStore((state) => state.language)
  const ui = getUiStrings(language)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  function focusNewItem(nextIndex: number): void {
    const firstFieldKey = section.fields[0]?.key

    if (!firstFieldKey) {
      return
    }

    const elementId = [...section.path, nextIndex, firstFieldKey].join('.')

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = document.getElementById(elementId)
        if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' })
          target.focus()
        }
      })
    })
  }

  function handleAddItem(): void {
    const nextIndex = itemCount

    if (!isOpen) {
      toggleSection(key, true)
    }

    setHighlightedIndex(nextIndex)
    addArrayItem(section.path, section.createItem())
    focusNewItem(nextIndex)
  }

  useEffect(() => {
    if (highlightedIndex == null) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setHighlightedIndex(null)
    }, 1400)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [highlightedIndex])

  return (
    <CollapsibleSectionPanel
      title={section.title}
      subtitle={`${itemCount} ${itemCount === 1 ? ui.arrayItemCountOne : ui.arrayItemCountOther}`}
      sectionId={sectionId}
      headingId={headingId}
      contentId={contentId}
      isOpen={isOpen}
      onToggle={() => toggleSection(key, !isOpen)}
      status={
        errorCount > 0 ? (
          <span className="rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
            {language === 'en_US' ? 'Pending review' : 'Revisão pendente'}
          </span>
        ) : undefined
      }
      actions={
        <Button
          variant="outline"
          size="sm"
          className="size-8 rounded-full border-border/80 bg-background p-0 text-base leading-none text-muted-foreground shadow-none hover:border-border hover:bg-accent/50 hover:text-foreground"
          aria-label={ui.addItemAria.replace('{item}', section.itemTitle.toLocaleLowerCase(language === 'en_US' ? 'en-US' : 'pt-BR'))}
          title={ui.addItemTitle.replace('{item}', section.itemTitle.toLocaleLowerCase(language === 'en_US' ? 'en-US' : 'pt-BR'))}
          onClick={handleAddItem}
        >
          +
        </Button>
      }
      contentClassName={
        itemCount === 0
          ? 'space-y-4 bg-muted/10 pt-4'
          : 'space-y-4 border-t border-border/70 bg-muted/10 pt-5'
      }
    >
      {itemCount === 0 ? (
        <p className="rounded-lg border border-dashed border-border/70 bg-background/70 px-4 py-5 text-sm leading-6 text-muted-foreground">
          {ui.arraySectionEmpty}
        </p>
      ) : (
        <>
          <p className="text-[0.8rem] leading-[1.45] text-muted-foreground">
            {ui.arraySectionHint}
          </p>

          <div className="grid gap-3">
            {Array.from({ length: itemCount }, (_, index) => (
              <ArraySectionItem
                key={`${section.path.join('.')}.${index}`}
                index={index}
                itemTitle={section.itemTitle}
                path={section.path}
                fields={section.fields}
                isHighlighted={highlightedIndex === index}
                onRemove={() => removeArrayItem(section.path, index)}
              />
            ))}
          </div>
        </>
      )}
    </CollapsibleSectionPanel>
  )
}
