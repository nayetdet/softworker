import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ReactElement } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useResumeStore } from '@/stores/resume.store'
import { getUiStrings } from '@/services/ui-i18n.service'

export function StatusAlert(): ReactElement | null {
  const { message, validationIssues } = useResumeStore(
    useShallow((state) => ({
      message: state.previewStatusMessage,
      validationIssues: state.validationState.issues,
      })),
  )
  const language = useResumeStore((state) => state.language)
  const ui = getUiStrings(language)

  if (!message && validationIssues.length === 0) {
    return null
  }

  return (
    <div className="border-b border-border/70 bg-destructive/5 px-5 py-4">
      <Alert variant="destructive">
        <AlertTitle>{ui.statusTitle}</AlertTitle>
        {message ? <AlertDescription>{message}</AlertDescription> : null}
        {validationIssues.length > 0 ? (
          <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-destructive">
            {validationIssues.map((issue) => (
              <li key={`${issue.path}:${issue.message}`}>
                <strong>{issue.label}</strong>: {issue.message}
              </li>
            ))}
          </ul>
        ) : null}
      </Alert>
    </div>
  )
}
