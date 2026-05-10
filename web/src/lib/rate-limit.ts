import 'server-only'

import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'

export type RateLimit = {
  allowed: boolean
  limit: number
  remaining: number
  retryAfterInSeconds: number
  resetAtUnix: number
}

const limiterMap = new Map<string, RateLimiterMemory>()

export const rateLimitIdentifier = (headers: Pick<Headers, 'get'>): string => {
  const forwardedFor = headers
    .get('x-forwarded-for')
    ?.split(',')[0]
    ?.trim()

  const realIp = headers.get('x-real-ip')?.trim()
  return forwardedFor ?? realIp ?? 'unknown'
}

export const rateLimit = async (
  options: {
    namespace: string
    identifier: string
    limit: number
    windowInSeconds: number
  },
): Promise<RateLimit> => {
  const limiterKey = `${options.namespace}:${options.limit}:${options.windowInSeconds}`.toLowerCase()
  let limiter = limiterMap.get(limiterKey)

  if (!limiter) {
    limiter = new RateLimiterMemory({
      keyPrefix: `rate-limit:${options.namespace}`,
      points: options.limit,
      duration: options.windowInSeconds,
    })

    limiterMap.set(limiterKey, limiter)
  }

  try {
    const result = await limiter.consume(options.identifier)
    const msBeforeNext = Math.max(result.msBeforeNext ?? options.windowInSeconds * 1000, 0)

    return {
      allowed: true,
      limit: options.limit,
      remaining: Math.max(result.remainingPoints ?? 0, 0),
      retryAfterInSeconds: 0,
      resetAtUnix: Math.floor((Date.now() + msBeforeNext) / 1000),
    }
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      const msBeforeNext = Math.max(error.msBeforeNext ?? options.windowInSeconds * 1000, 0)

      return {
        allowed: false,
        limit: options.limit,
        remaining: Math.max(error.remainingPoints ?? 0, 0),
        retryAfterInSeconds: Math.max(Math.ceil(msBeforeNext / 1000), 1),
        resetAtUnix: Math.floor((Date.now() + msBeforeNext) / 1000),
      }
    }

    return {
      allowed: true,
      limit: options.limit,
      remaining: options.limit,
      retryAfterInSeconds: 0,
      resetAtUnix: Math.floor(Date.now() / 1000) + options.windowInSeconds,
    }
  }
}
