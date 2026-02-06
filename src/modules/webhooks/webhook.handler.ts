import redis from "../../config/redis";

/**
 * Handle incoming webhook events
 */
export async function webhookHandler(req: any, reply: any) {
  const { eventId, payload } = req.body;

  if (!eventId) {
    return reply.status(400).send({ message: "Missing eventId" });
  }

  const alreadyProcessed = await redis.get(`webhook:${eventId}`);
  if (alreadyProcessed) {
    return reply.send({ message: "Duplicate event ignored" });
  }

  // Mark event as processed
  await redis.set(`webhook:${eventId}`, "1", "EX", 3600);

  // Simulate processing
  console.log("✅ Webhook processed:", payload);

  return reply.send({ message: "Webhook processed" });
}
