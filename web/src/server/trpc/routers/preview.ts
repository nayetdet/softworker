import { z } from 'zod'
import { pdfRequestSchema } from '@/schemas/pdf.schema'
import { renderResumeDocument } from '@/server/services/preview.service'
import { t } from '@/server/trpc/trpc'

export const previewOutputSchema = z.object({
  html: z.string(),
})

export const previewRouter = t.router({
  generate: t.procedure.input(pdfRequestSchema).output(previewOutputSchema).mutation(async ({ input }) => {
    const html = await renderResumeDocument(input.resume, input.language)

    return {
      html,
    }
  }),
})
