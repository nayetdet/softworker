import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@/server/trpc/routers/_app'
import type { JsonObject } from '@/types/resume/json/json-object'
import type { PdfRequestBody } from '@/schemas/pdf.schema'

export type PreviewHtmlPayload = {
  html: string
}

const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
})

export async function generatePreviewHtml(payload: {
  language: PdfRequestBody['language']
  resume: JsonObject
}): Promise<PreviewHtmlPayload> {
  return trpcClient.preview.generate.mutate({
    language: payload.language,
    resume: payload.resume as PdfRequestBody['resume'],
  })
}
