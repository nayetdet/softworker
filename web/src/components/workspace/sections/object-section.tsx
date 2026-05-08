import { ResumeFieldList } from '@/components/workspace/fields/resume-field-list'
import { CollapsibleSectionPanel } from '@/components/workspace/sections/collapsible-section-panel'
import { Badge } from '@/components/ui/badge'
import type { NestedSectionDefinition, ObjectSectionDefinition } from '@/services/resume-form.service'
import { getUiStrings } from '@/services/ui-i18n.service'
import { useFormStore } from '@/stores/form.store'
import { useResumeStore } from '@/stores/resume.store'
import type { ReactElement } from 'react'

function NestedSection({
  parentKey,
  section,
}: {
  parentKey: string
  section: NestedSectionDefinition
}): ReactElement {
  const errorCount = useResumeStore((state) => state.validationIssueCounts[`${parentKey}.${section.key}`] ?? 0)
  const language = useResumeStore((state) => state.language)

  return (
    <section className="rounded-xl border border-border/70 bg-background/80 p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-[0.92rem] font-extrabold leading-[1.18]">{section.title}</h3>
        {errorCount > 0 ? (
          <Badge className="border-rose-200 bg-rose-50 text-rose-700">
            {errorCount} {language === 'en_US' ? (errorCount === 1 ? 'issue' : 'issues') : errorCount === 1 ? 'ajuste' : 'ajustes'}
          </Badge>
        ) : null}
      </div>
      <ResumeFieldList
        fields={section.fields}
        pathPrefix={[parentKey, section.key]}
      />
    </section>
  )
}

export function ObjectSection({ section }: { section: ObjectSectionDefinition }): ReactElement {
  const sectionId = `section-${section.key.replaceAll('.', '-')}`
  const headingId = `${sectionId}-heading`
  const contentId = `${sectionId}-content`
  const errorCount = useResumeStore((state) => state.validationIssueCounts[section.key] ?? 0)
  const isOpen = useFormStore((state) => state.openSections.has(section.key))
  const toggleSection = useFormStore((state) => state.toggleSection)
  const language = useResumeStore((state) => state.language)
  const ui = getUiStrings(language)

  return (
    <CollapsibleSectionPanel
      title={section.title}
      subtitle={
        errorCount > 0
          ? `${errorCount} ${
              language === 'en_US'
                ? errorCount === 1
                  ? 'pending fix'
                  : 'pending fixes'
                : errorCount === 1
                  ? ui.validationAdjustOne
                  : ui.validationAdjustOther
            }`
          : undefined
      }
      sectionId={sectionId}
      headingId={headingId}
      contentId={contentId}
      isOpen={isOpen}
      onToggle={() => toggleSection(section.key, !isOpen)}
      contentClassName="space-y-4 border-t border-border/70 bg-muted/10 pt-5"
    >
      <ResumeFieldList
        fields={section.fields}
        pathPrefix={[section.key]}
      />

      {section.nested?.map((nested) => (
        <NestedSection
          key={`${section.key}.${nested.key}`}
          parentKey={section.key}
          section={nested}
        />
      ))}
    </CollapsibleSectionPanel>
  )
}
