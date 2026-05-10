'use client'

import { useState } from 'react'
import { generatePdfAction } from '@/server/actions/pdf'
import type { WorkspaceViewModel } from '@/stores/workspace.store'
import { base64ToBlob, downloadBlob, waitForNextPaint } from '@/utils/download'

type UsePreviewDownloadsResult = {
  isDownloadingJson: boolean
  isDownloadingPdf: boolean
  downloadJson: () => Promise<void>
  downloadPdf: () => Promise<void>
}

export function usePreviewDownloads(workspace: WorkspaceViewModel): UsePreviewDownloadsResult {
  const [isDownloadingJson, setIsDownloadingJson] = useState(false)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

  async function downloadPdf(): Promise<void> {
    if (isDownloadingPdf) {
      return
    }

    setIsDownloadingPdf(true)

    try {
      await waitForNextPaint()

      const result = await generatePdfAction({
        language: workspace.language,
        resume: workspace.resumeDraft,
      })

      downloadBlob(base64ToBlob(result.base64, result.mimeType), result.filename)
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  async function downloadJson(): Promise<void> {
    if (isDownloadingJson) {
      return
    }

    setIsDownloadingJson(true)

    try {
      await waitForNextPaint()

      downloadBlob(
        new Blob([JSON.stringify(workspace.resumeDraft, null, 2)], { type: 'application/json' }),
        workspace.downloadJsonFilename,
      )
    } finally {
      setIsDownloadingJson(false)
    }
  }

  return {
    isDownloadingJson,
    isDownloadingPdf,
    downloadJson,
    downloadPdf,
  }
}
