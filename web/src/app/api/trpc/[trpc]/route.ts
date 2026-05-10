import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { type NextRequest } from 'next/server'
import { appRouter } from '@/server/trpc/routers/_app'
import { createTrpcContext } from '@/server/trpc/context'

export const runtime = 'nodejs'

const MAX_BODY_BYTES = 256_000

function isBodyTooLarge(request: NextRequest): boolean {
  const contentLength = request.headers.get('content-length')
  if (!contentLength) {
    return false
  }

  return Number(contentLength) > MAX_BODY_BYTES
}

async function handler(request: NextRequest): Promise<Response> {
  if (request.method === 'POST' && isBodyTooLarge(request)) {
    return Response.json({ error: 'Request body too large.' }, { status: 413 })
  }

  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: () => createTrpcContext(request),
  })
}

export { handler as GET, handler as POST, handler as OPTIONS }
