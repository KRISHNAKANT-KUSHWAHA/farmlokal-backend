
// import { getProducts } from "./products.service";
// import redis from "../../config/redis";
// import crypto from "crypto";

// function getCacheKey(query: any) {
//   return `products:${crypto
//     .createHash("md5")
//     .update(JSON.stringify(query))
//     .digest("hex")}`;
// }

// export async function getProductsHandler(req: any, reply: any) {
//   const cacheKey = getCacheKey(req.query);

//   // 1️⃣ Try Redis (NON-BLOCKING)
//   if (redis) {
//     try {
//       const cached = await redis.get(cacheKey);
//       if (cached) {
//         return reply.send(JSON.parse(cached));
//       }
//     } catch {
//       // ignore redis failure
//     }
//   }

//   // 2️⃣ Always fetch from DB
//   const products = await getProducts(req.query);

//   // 3️⃣ Try to cache result (BEST EFFORT)
//   if (redis) {
//     try {
//       await redis.set(cacheKey, JSON.stringify(products), "EX", 60);
//     } catch {
//       // ignore redis failure
//     }
//   }

//   return reply.send(products);
// }

import { getProducts } from "./products.service";
import redis from "../../config/redis";
import crypto from "crypto";

function getCacheKey(query: any) {
  return `products:${crypto
    .createHash("md5")
    .update(JSON.stringify(query))
    .digest("hex")}`;
}

export async function getProductsHandler(req: any, reply: any) {
  const cacheKey = getCacheKey(req.query);

  // ✅ Try Redis only if READY
  if (redis && redis.status === "ready") {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return reply.send(JSON.parse(cached));
      }
    } catch {
      // ignore redis error
    }
  }

  // ✅ Always fetch from DB
  const products = await getProducts(req.query);

  // ✅ Best-effort cache
  if (redis && redis.status === "ready") {
    try {
      await redis.set(cacheKey, JSON.stringify(products), "EX", 60);
    } catch {
      // ignore redis error
    }
  }

  return reply.send(products);
}
