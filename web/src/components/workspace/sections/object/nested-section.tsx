'use client'

import type { NestedSectionDefinition } from '@/types/resume/sections/object/nested-section-definition'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { ResumeFieldList } from '@/components/workspace/fields/shared/resume-field-list'
import { ValidationBadge } from '@/components/workspace/sections/common/validation-badge'
import { useNestedSection } from '@/hooks/workspace/sections/use-nested-section'

type NestedSectionProps = {
  parentKey: string
  section: NestedSectionDefinition
  workspace: WorkspaceViewModel
}

export function NestedSection({ parentKey, section, workspace }: NestedSectionProps): React.JSX.Element {
  const { subtitle } = useNestedSection(parentKey, section, workspace)

  return (
    <section className="rounded-xl border border-border/70 bg-background/80 p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-[0.92rem] font-extrabold leading-[1.18]">{section.title}</h3>
        {subtitle ? <ValidationBadge>{subtitle}</ValidationBadge> : null}
      </div>

      <ResumeFieldList fields={section.fields} pathPrefix={[parentKey, section.key]} workspace={workspace} />
    </section>
  )
}
