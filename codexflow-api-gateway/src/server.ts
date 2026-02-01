import { buildApp } from "./app";
import { serverConfig } from "./config";

async function start() {
  const app = await buildApp();

  const PORT = serverConfig.port || 3005;

  await app.listen({
    port: PORT,
    host: "0.0.0.0"
  });

  app.log.info(`Server is running on port ${PORT}`);
}

start().catch((err) => {
  console.error("Error starting server:", err);
  process.exit(1);
});
