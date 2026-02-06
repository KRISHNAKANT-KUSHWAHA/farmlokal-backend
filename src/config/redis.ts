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
  lazyConnect: true,
  enableOfflineQueue: true,   // 🔑 queue commands until Redis wakes
  retryStrategy(times) {
    return Math.min(times * 300, 3000); // keep retrying calmly
  },
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("ready", () => {
  console.log("🟢 Redis ready");
});

redis.on("error", () => {
  console.warn("⚠️ Redis warming up (normal on free tier)");
});

export default redis;

