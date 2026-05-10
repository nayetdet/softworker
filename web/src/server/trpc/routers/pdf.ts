import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { pdfRequestSchema } from '@/schemas/pdf.schema'
import { renderResumePdf } from '@/server/services/pdf.service'
import { t } from '@/server/trpc/trpc'
import { rateLimit, rateLimitIdentifier } from '@/lib/rate-limit'

export const pdfOutputSchema = z.object({
  filename: z.string(),
  mimeType: z.literal('application/pdf'),
  base64: z.string(),
})

const RATE_LIMIT = {
  limit: 4,
  windowInSeconds: 60,
} as const

export const pdfRouter = t.router({
  generate: t.procedure.input(pdfRequestSchema).output(pdfOutputSchema).mutation(async ({ input, ctx }) => {
    const ratelimit = await rateLimit({
      namespace: 'trpc:pdf:generate',
      identifier: rateLimitIdentifier(ctx.headers),
      ...RATE_LIMIT,
    })

    if (!ratelimit.allowed) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Muitas requisições. Tente novamente em alguns instantes.',
      })
    }

    try {
      const pdf = await renderResumePdf(input.language, input.resume)

      return {
        filename: input.language === 'pt_BR' ? 'curriculo.pdf' : 'resume.pdf',
        mimeType: 'application/pdf' as const,
        base64: Buffer.from(pdf).toString('base64'),
      }
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Failed to generate PDF.',
      })
    }
  }),
})
