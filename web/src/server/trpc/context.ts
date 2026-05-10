import type { NextRequest } from 'next/server'

export type TrpcContext = {
  headers: Headers
}

export function createTrpcContext(request: NextRequest | Request): TrpcContext {
  return {
    headers: request.headers,
  }
}
