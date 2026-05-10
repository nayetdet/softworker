'use client'

import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { A4_WIDTH, usePreviewFrame } from '@/hooks/preview/use-preview-frame'

const BOTTOM_GAP = 32

type PreviewFrameProps = {
  iframeId: string
  previewFrameRef: React.RefObject<HTMLIFrameElement | null>
  previewHtml: string
  workspace: WorkspaceViewModel
}

export function PreviewFrame({ iframeId, previewFrameRef, previewHtml, workspace }: PreviewFrameProps): React.JSX.Element {
  const { containerRef, contentHeight, scale, handleLoad } = usePreviewFrame(previewFrameRef)

  return (
    <div className="h-full w-full pb-3 pt-1.5 sm:px-3 sm:pb-6 sm:pt-3 xl:px-4 xl:pb-8 xl:pt-4">
      <div ref={containerRef} className="flex min-h-[34vh] w-full items-start justify-center sm:min-h-[42vh] lg:min-h-[52vh] xl:min-h-0 xl:items-center">
        <div
          className="relative shrink-0 max-w-full"
          style={{
            height: `${(contentHeight + BOTTOM_GAP) * scale}px`,
            width: `${A4_WIDTH * scale}px`,
          }}
        >
          <iframe
            ref={previewFrameRef}
            id={iframeId}
            title={workspace.ui.previewFrameTitle}
            scrolling="no"
            className="absolute left-0 top-0 rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_1px_2px_rgb(15_23_42/0.05)]"
            style={{
              height: `${contentHeight}px`,
              width: `${A4_WIDTH}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
            srcDoc={previewHtml}
            onLoad={handleLoad}
          />
        </div>
      </div>
    </div>
  )
}
