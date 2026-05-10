import { z } from 'zod'
import { resumeSchema } from '@/schemas/resume.schema'

export const pdfRequestSchema = z.object({
  language: z.enum(['pt_BR', 'en_US']),
  resume: resumeSchema,
})

export type PdfRequestBody = z.infer<typeof pdfRequestSchema>
