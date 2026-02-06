import Fastify from "fastify";
import { getAccessToken } from "./modules/auth/auth.service";
import { productRoutes } from "./modules/products/products.routes";
import { fetchExternalProducts } from "./modules/external/external.service";
import { webhookHandler } from "./modules/webhooks/webhook.handler";
import { rateLimit } from "./plugins/rateLimit";
const app = Fastify({ logger: true });

/**
 * MOCK OAUTH TOKEN ENDPOINT
 */
app.post("/mock-oauth/token", async () => {
  return {
    access_token: "mock-access-token-" + Date.now(),
    expires_in: 60, // 1 minute
  };
});

/**
 * TEST AUTH
 */
app.get("/test-auth", async () => {
  const token = await getAccessToken();
  return { token };
});

// ✅ REGISTER PRODUCT ROUTES
app.register(productRoutes);

// test external api
app.get("/external/products", async () => {
  const data = await fetchExternalProducts();
  return data;
});

//webhook
app.post("/webhooks/event", webhookHandler);

// apply globally
app.addHook("preHandler", rateLimit);

export default app;
