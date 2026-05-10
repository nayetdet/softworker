'use client'

import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { ObjectSection } from '@/components/workspace/sections/object/object-section'
import { ArraySection } from '@/components/workspace/sections/array/array-section'
import { getSectionKey, isObjectSectionDefinition } from '@/mappers/resume/sections/section.mapper'

type WorkspaceSectionsProps = {
  workspace: WorkspaceViewModel
}

export function WorkspaceSections({ workspace }: WorkspaceSectionsProps): React.JSX.Element {
  return (
    <div className="grid gap-4 p-3 sm:p-4">
      {workspace.formSections.map((section) =>
        isObjectSectionDefinition(section) ? (
          <ObjectSection key={section.key} section={section} workspace={workspace} />
        ) : (
          <ArraySection key={getSectionKey(section.path)} section={section} workspace={workspace} />
        ),
      )}
    </div>
  )
}
