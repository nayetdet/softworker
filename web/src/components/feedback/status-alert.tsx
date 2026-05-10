'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { getStatusAlertState } from '@/mappers/workspace/status-alert.mapper'

type StatusAlertProps = {
  workspace: WorkspaceViewModel
}

export function StatusAlert({ workspace }: StatusAlertProps): React.JSX.Element | null {
  const { ui } = workspace
  const { issues, message } = getStatusAlertState({
    jsonStatusMessage: workspace.jsonStatusMessage,
    previewStatusMessage: workspace.previewStatusMessage,
    validationIssues: workspace.validationState.issues,
  })

  if (!message && issues.length === 0) {
    return null
  }

  return (
    <div className="border-b border-border/70 bg-destructive/5 px-5 py-4">
      <Alert variant="destructive">
        <AlertTitle>{ui.statusTitle}</AlertTitle>
        {message ? <AlertDescription>{message}</AlertDescription> : null}
        {issues.length > 0 ? (
          <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-destructive">
            {issues.map((issue) => (
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
