import { FastifyRequest, FastifyReply } from 'fastify';
import { redisClient } from '../config/redis'

/**
 * Tier-based rate limits
 * (Numbers are examples – tune later)
 */
const RATE_LIMITS: Record<string, any> = {
  FREE: {
    submissions: { limit: 5, window: 1 },     // 5 req / sec
    problems: { limit: 20, window: 1 }         // 20 req / sec
  },
  PREMIUM: {
    submissions: { limit: 25, window: 1 },
    problems: { limit: 100, window: 1 }
  },
  ENTERPRISE: {
    submissions: { limit: 50, window: 1 },
    problems: { limit: 200, window: 1 }
  }
};

/**
 * Map URL → rate-limit bucket
 */
function resolveBucket(url: string): 'submissions' | 'problems' {
  if (url.startsWith('/submissions')) return 'submissions';
  return 'problems';
}

export async function rateLimitMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = req.user as any;

  if (!user?.id || !user?.tier) {
    // Auth middleware should guarantee this
    return reply.code(401).send({ message: 'Unauthorized' });
  }

  const tier = user.tier;
  const bucket = resolveBucket(req.url);

  const rule = RATE_LIMITS[tier]?.[bucket];

  // Safety fallback
  if (!rule) return;

  const redisKey = `rate:${tier}:${user.id}:${bucket}`;

  // Atomic counter
  const current = await redisClient.incr(redisKey);

  // Set expiry only on first hit
  if (current === 1) {
    await redisClient.expire(redisKey, rule.window);
  }

  if (current > rule.limit) {
    return reply
      .code(429)
      .header('Retry-After', rule.window)
      .send({
        message: 'Too frequent requests. Please wait.'
      });
  }
}
