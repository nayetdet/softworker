'use client'

import { getSectionKey } from '@/mappers/resume/sections/section.mapper'
import type { ObjectSectionDefinition } from '@/types/resume/sections/object/object-section-definition'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { ResumeFieldList } from '@/components/workspace/fields/shared/resume-field-list'
import { CollapsibleSectionPanel } from '@/components/workspace/sections/common/collapsible-section-panel'
import { useObjectSection } from '@/hooks/workspace/sections/use-object-section'
import { NestedSection } from '@/components/workspace/sections/object/nested-section'

type ObjectSectionProps = {
  section: ObjectSectionDefinition
  workspace: WorkspaceViewModel
}

export function ObjectSection({ section, workspace }: ObjectSectionProps): React.JSX.Element {
  const { contentId, headingId, handleToggle, isOpen, sectionId, subtitle } = useObjectSection(section, workspace)

  return (
    <CollapsibleSectionPanel
      title={section.title}
      subtitle={subtitle}
      sectionId={sectionId}
      headingId={headingId}
      contentId={contentId}
      isOpen={isOpen}
      onToggle={handleToggle}
      contentClassName="space-y-4 border-t border-border/70 bg-muted/10 pt-5"
    >
      <ResumeFieldList fields={section.fields} pathPrefix={[section.key]} workspace={workspace} />

      {section.nested?.map((nested) => (
        <NestedSection key={getSectionKey([section.key, nested.key])} parentKey={section.key} section={nested} workspace={workspace} />
      ))}
    </CollapsibleSectionPanel>
  )
}
