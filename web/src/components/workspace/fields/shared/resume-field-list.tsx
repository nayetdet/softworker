'use client'

import type { FieldDefinition } from '@/types/resume/fields/field-definition'
import type { PathPart } from '@/types/resume/json/path-part'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { getPathKey } from '@/mappers/resume/path.mapper'
import { ResumeField } from '@/components/workspace/fields/input/resume-field'

type ResumeFieldListProps = {
  fields: FieldDefinition[]
  pathPrefix: PathPart[]
  workspace: WorkspaceViewModel
}

export function ResumeFieldList({ fields, pathPrefix, workspace }: ResumeFieldListProps): React.JSX.Element {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {fields.map((field) => {
        const path = [...pathPrefix, field.key]

        return <ResumeField key={getPathKey(path)} field={field} path={path} workspace={workspace} />
      })}
    </div>
  )
}
