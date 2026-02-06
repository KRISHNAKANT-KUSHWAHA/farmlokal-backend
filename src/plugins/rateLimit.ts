import redis from "../config/redis";

export async function rateLimit(req: any, reply: any) {
  const ip = req.ip;
  const key = `rate:${ip}`;

  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, 60); // 60 seconds window
  }

  if (count > 100) {
    return reply.status(429).send({
      message: "Too many requests, please try again later",
    });
  }
}
