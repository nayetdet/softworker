'use client'

import type { FieldDefinition } from '@/types/resume/fields/field-definition'
import type { PathPart } from '@/types/resume/json/path-part'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { useResumeField } from '@/hooks/workspace/fields/use-resume-field'
import { ResumeFieldControl } from '@/components/workspace/fields/input/resume-field-control'

type ResumeFieldProps = {
  field: FieldDefinition
  path: PathPart[]
  workspace: WorkspaceViewModel
}

export function ResumeField({ field, path, workspace }: ResumeFieldProps): React.JSX.Element {
  const { error, fieldId, inputType, listItems, placeholder, textValue, updateListValue, updateTextValue } =
    useResumeField(field, path, workspace)

  return (
    <div className={field.full ? 'flex h-full flex-col gap-2.5 md:col-span-2' : 'flex h-full flex-col gap-2.5'}>
      <label htmlFor={fieldId} className="text-sm font-medium">
        {field.label}
        {field.required ? <span className="ml-1 text-destructive">*</span> : null}
      </label>
      <div className="flex flex-1 flex-col">
        <ResumeFieldControl
          field={field}
          fieldId={fieldId}
          inputType={inputType}
          listItems={listItems}
          placeholder={placeholder}
          textValue={textValue}
          updateListValue={updateListValue}
          updateTextValue={updateTextValue}
          workspace={workspace}
        />
      </div>

      <p className="min-h-4 text-xs font-medium text-destructive">{error ?? ''}</p>
    </div>
  )
}
