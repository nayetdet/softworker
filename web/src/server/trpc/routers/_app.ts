import { pdfRouter } from '@/server/trpc/routers/pdf'
import { previewRouter } from '@/server/trpc/routers/preview'
import { t } from '@/server/trpc/trpc'

export const appRouter = t.router({
  pdf: pdfRouter,
  preview: previewRouter,
})

export type AppRouter = typeof appRouter
