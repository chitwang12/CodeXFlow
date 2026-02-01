import Fastify from 'fastify';
import './config/redis';
import jwtPlugin from './plugins/jwt.plugin';
import { authMiddleware } from './middlewares/auth.middleware';
import { rateLimitMiddleware } from './middlewares/rateLimiter.middlewares';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(jwtPlugin);

  // Public route
  app.get(
    '/health',
    { config: { public: true } },
    async () => ({
      status: 'ok',
      service: 'codexflow-api-gateway'
    })
  );

  // Global enforcement
  app.addHook('onRequest', async (req, reply) => {
    const isPublic = (req.routeOptions?.config as any)?.public;
    if (isPublic) return;

    await authMiddleware(req, reply);
    await rateLimitMiddleware(req, reply);
  });

  return app;
}
