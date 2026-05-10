import { initTRPC } from '@trpc/server'
import type { TrpcContext } from '@/server/trpc/context'

export const t = initTRPC.context<TrpcContext>().create()
