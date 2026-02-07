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


// import redis from "../../config/redis";

// export async function webhookHandler(req: any, reply: any) {
//   const eventId = req.headers["x-event-id"];

//   if (!eventId) {
//     return reply.status(400).send({ message: "Missing x-event-id" });
//   }

//   // ✅ Idempotency only if Redis is READY
//   if (redis && redis.status === "ready") {
//     try {
//       const exists = await redis.get(`event:${eventId}`);
//       if (exists) {
//         return reply.send({ message: "Duplicate ignored" });
//       }
//       await redis.set(`event:${eventId}`, "1", "EX", 300);
//     } catch {
//       // ignore redis failure
//     }
//   }

//   // Continue webhook processing
//   return reply.send({ message: "Processed" });
// }

