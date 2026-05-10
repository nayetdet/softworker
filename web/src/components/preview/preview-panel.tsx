'use client'

import { useId, useRef } from 'react'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { PreviewFrame } from '@/components/preview/preview-frame'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePreviewDownloads } from '@/hooks/preview/use-preview-downloads'

type PreviewPanelProps = {
  workspace: WorkspaceViewModel
}

function DownloadSpinner(): React.JSX.Element {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-current/30 border-t-current animate-spin"
    />
  )
}

export function PreviewPanel({ workspace }: PreviewPanelProps): React.JSX.Element {
  const iframeId = useId()
  const previewFrameRef = useRef<HTMLIFrameElement | null>(null)
  const { downloadJson, downloadPdf, isDownloadingJson, isDownloadingPdf } = usePreviewDownloads(workspace)
  const hasPreviewHtml = workspace.previewHtml.trim().length > 0

  return (
    <Card className="min-h-0 overflow-hidden border-border/80 bg-card xl:sticky xl:top-4 xl:grid xl:h-[calc(100vh-2rem)] xl:grid-rows-[auto_minmax(0,1fr)]">
      <CardHeader className="flex flex-col gap-4 border-b border-border/70 bg-card p-4 sm:p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-primary">{workspace.ui.previewEyebrow}</p>
          <CardTitle className="mt-1 text-[1.05rem] font-extrabold tracking-[-0.02em] sm:text-[1.15rem]">
            {workspace.ui.previewTitle}
          </CardTitle>
          <CardDescription className="mt-1 max-w-lg text-[0.92rem] leading-6">{workspace.ui.previewDescription}</CardDescription>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10 w-full rounded-xl border-border/80 bg-card px-3.5 text-[0.92rem] font-medium text-muted-foreground shadow-none hover:border-border hover:bg-muted/60 hover:text-foreground sm:w-auto"
            onClick={() => void downloadJson()}
            disabled={isDownloadingJson || isDownloadingPdf}
            aria-busy={isDownloadingJson}
            aria-live="polite"
          >
            {isDownloadingJson ? <DownloadSpinner /> : <span aria-hidden="true" className="text-base leading-none">{'{ }'}</span>}
            {workspace.ui.downloadJson}
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-10 w-full rounded-xl px-4 text-[0.92rem] font-semibold shadow-none sm:w-auto"
            disabled={isDownloadingPdf || isDownloadingJson}
            aria-busy={isDownloadingPdf}
            aria-live="polite"
            onClick={() => void downloadPdf()}
          >
            {isDownloadingPdf ? <DownloadSpinner /> : <span aria-hidden="true" className="text-base leading-none">↓</span>}
            {workspace.ui.downloadPdf}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="h-full overflow-auto overscroll-contain bg-muted/30 p-2.5 sm:p-4">
        {hasPreviewHtml ? (
          <PreviewFrame iframeId={iframeId} previewFrameRef={previewFrameRef} previewHtml={workspace.previewHtml} workspace={workspace} />
        ) : (
          <div className="flex min-h-[34vh] w-full items-center justify-center rounded-[1.25rem] border border-dashed border-border/70 bg-background/80 px-6 py-10 text-center text-sm text-muted-foreground sm:min-h-[42vh] lg:min-h-[52vh] xl:min-h-[calc(100vh-18rem)]">
            {workspace.ui.previewEmpty}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
