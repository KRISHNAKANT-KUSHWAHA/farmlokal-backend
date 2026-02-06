// import Redis from "ioredis";

// const redis = new Redis({
//   host: process.env.REDIS_HOST,
//   port: Number(process.env.REDIS_PORT),
// });

// redis.on("connect", () => {
//   console.log("✅ Redis connected");
// });

// redis.on("error", (err) => {
//   console.error("❌ Redis error", err);
// });

// export default redis;
import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined");
}

const redis = new Redis(redisUrl, {
  lazyConnect: true,        // 🔑 KEY FIX
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 200, 2000);
  },
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.warn("⚠️ Redis not ready yet");
});

export default redis;

