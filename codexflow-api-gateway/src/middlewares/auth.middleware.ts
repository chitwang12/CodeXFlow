import { FastifyRequest, FastifyReply } from 'fastify';
import { stripUntrustedHeaders } from '../utils/stripHeaders';

export async function authMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // 🔒 Remove any client-forged identity
    stripUntrustedHeaders(req);

    // 🔐 Verify JWT
    await req.jwtVerify();

    const payload = req.user as any;

    if (!payload?.userId || !payload?.tier) {
      return reply.code(401).send({ message: 'Invalid token' });
    }

    // ✅ Attach trusted user context
    req.user = {
      id: payload.userId,
      tier: payload.tier
    };
  } catch (err) {
    req.log.warn({ err }, 'JWT verification failed');
    return reply.code(401).send({ message: 'Unauthorized' });
  }
}
