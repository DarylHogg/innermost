import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Gracefully handle missing Redis config
let redis: Redis | null = null
let aiFeedbackRatelimit: Ratelimit | null = null

if (process.env.REDIS_URL && process.env.REDIS_URL !== 'redis://localhost:6379') {
  try {
    redis = Redis.fromEnv()
    aiFeedbackRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(2, '30 s'),
      analytics: true,
      prefix: 'innermost:ai',
    })
  } catch {
    console.warn('Redis not configured, rate limiting disabled')
  }
}

export { redis, aiFeedbackRatelimit }
