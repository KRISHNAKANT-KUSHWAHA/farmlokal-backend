

// import Redis from "ioredis";

// const redisUrl = process.env.REDIS_URL;

// if (!redisUrl) {
//   throw new Error("REDIS_URL is not defined");
// }

// const redis = new Redis(redisUrl, {
//   lazyConnect: true,
//   enableOfflineQueue: true,   // 🔑 queue commands until Redis wakes
//   retryStrategy(times) {
//     return Math.min(times * 300, 3000); // keep retrying calmly
//   },
// });

// redis.on("connect", () => {
//   console.log("✅ Redis connected");
// });

// redis.on("ready", () => {
//   console.log("🟢 Redis ready");
// });

// redis.on("error", () => {
//   console.warn("⚠️ Redis warming up (normal on free tier)");
// });


// import Redis from "ioredis";

// const redisUrl = process.env.REDIS_URL;

// let redis: Redis | null = null;

// if (redisUrl) {
//   redis = new Redis(redisUrl, {
//     lazyConnect: true,
//     enableOfflineQueue: true,
//     retryStrategy(times) {
//       return Math.min(times * 300, 3000);
//     },
//   });

//   redis.on("connect", () => {
//     console.log("✅ Redis connected");
//   });

//   redis.on("ready", () => {
//     console.log("🟢 Redis ready");
//   });

//   redis.on("error", () => {
//     console.warn("⚠️ Redis warming up or unavailable");
//   });
// } else {
//   console.warn("⚠️ REDIS_URL not set, running without cache");
// }

// export default redis;

// import Redis from "ioredis";

// const redisUrl = process.env.REDIS_URL;

// let redis: Redis | null = null;

// if (redisUrl) {
//   redis = new Redis(redisUrl, {
//     lazyConnect: true,
//     enableOfflineQueue: false, // ❌ IMPORTANT
//     maxRetriesPerRequest: 1,   // ❌ IMPORTANT
//     retryStrategy(times) {
//       return Math.min(times * 200, 1000);
//     },
//   });

//   redis.on("ready", () => {
//     console.log("🟢 Redis ready");
//   });

//   redis.on("error", () => {
//     console.warn("⚠️ Redis unavailable, continuing without cache");
//   });
// } else {
//   console.warn("⚠️ REDIS_URL not set, running without Redis");
// }

// export default redis;

import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

let redis: Redis | null = null;

if (redisUrl) {
  redis = new Redis(redisUrl, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
  });

  redis.on("ready", () => {
    console.log("🟢 Redis ready");
  });

  redis.on("error", () => {
    console.warn("⚠️ Redis unavailable, continuing without cache");
  });
} else {
  console.warn("⚠️ REDIS_URL not set, running without Redis");
}

export default redis;






















