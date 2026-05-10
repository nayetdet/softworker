'use client'

import type { FieldDefinition } from '@/types/resume/fields/field-definition'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { ResumeListField } from '@/components/workspace/fields/list/resume-list-field'

type ResumeFieldControlProps = {
  field: FieldDefinition
  fieldId: string
  inputType: 'date' | 'email' | 'text' | 'url'
  listItems: string[]
  placeholder: string | undefined
  textValue: string
  updateListValue: (nextValue: string[]) => void
  updateTextValue: (nextValue: string) => void
  workspace: WorkspaceViewModel
}

export function ResumeFieldControl({
  field,
  fieldId,
  inputType,
  listItems,
  placeholder,
  textValue,
  updateListValue,
  updateTextValue,
  workspace,
}: ResumeFieldControlProps): React.JSX.Element {
  if (field.type === 'textarea') {
    return (
      <textarea
        id={fieldId}
        value={textValue}
        spellCheck={true}
        onChange={(event) => {
          updateTextValue(event.target.value)
        }}
        className="min-h-28 rounded-md border border-border/80 bg-background px-3 py-2 outline-none transition-colors focus:border-primary"
      />
    )
  }

  if (field.type === 'list') {
    return (
      <ResumeListField
        fieldId={fieldId}
        items={listItems}
        workspace={workspace}
        onValueChange={(nextValue) => {
          updateListValue(nextValue)
        }}
      />
    )
  }

  return (
    <input
      id={fieldId}
      type={inputType}
      placeholder={placeholder}
      value={textValue}
      onChange={(event) => {
        updateTextValue(event.target.value)
      }}
      spellCheck={false}
      className="h-11 rounded-md border border-border/80 bg-background px-3 outline-none transition-colors focus:border-primary"
    />
  )
}
