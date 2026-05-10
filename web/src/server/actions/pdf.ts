'use server'

import { headers } from 'next/headers'
import { pdfRequestSchema } from '@/schemas/pdf.schema'
import { rateLimit, rateLimitIdentifier } from '@/lib/rate-limit'
import { renderResumePdf } from '@/server/services/pdf.service'

const RATE_LIMIT = {
  limit: 4,
  windowInSeconds: 60,
} as const

export type PdfDownloadResult = {
  filename: string
  mimeType: 'application/pdf'
  base64: string
}

export async function generatePdfAction(input: unknown): Promise<PdfDownloadResult> {
  const parsed = pdfRequestSchema.parse(input)
  const requestHeaders = await headers()
  const ratelimit = await rateLimit({
    namespace: 'action:pdf:generate',
    identifier: rateLimitIdentifier(requestHeaders),
    ...RATE_LIMIT,
  })

  if (!ratelimit.allowed) {
    throw new Error('Muitas requisições. Tente novamente em alguns instantes.')
  }

  const pdf = await renderResumePdf(parsed.language, parsed.resume)

  return {
    filename: parsed.language === 'pt_BR' ? 'curriculo.pdf' : 'resume.pdf',
    mimeType: 'application/pdf',
    base64: Buffer.from(pdf).toString('base64'),
  }
}
