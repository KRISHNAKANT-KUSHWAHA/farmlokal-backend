

// import { getProducts } from "./products.service";
// import redis from "../../config/redis";
// import crypto from "crypto";

// function getCacheKey(query: any) {
//   const hash = crypto
//     .createHash("md5")
//     .update(JSON.stringify(query))
//     .digest("hex");

//   return `products:${hash}`;
// }

// export async function getProductsHandler(req: any, reply: any) {
//   const cacheKey = getCacheKey(req.query);

//   // 1️⃣ Try cache (NON-BLOCKING)
//   try {
//     if (redis) {
//       const cached = await redis.get(cacheKey);
//       if (cached) {
//         return reply.send(JSON.parse(cached));
//       }
//     }
//   } catch (err) {
//     console.warn("⚠️ Redis unavailable, skipping cache read");
//   }

//   // 2️⃣ Fetch from DB
//   const products = await getProducts(req.query);

//   // 3️⃣ Store in cache (BEST-EFFORT)
//   try {
//     if (redis) {
//       await redis.set(cacheKey, JSON.stringify(products), "EX", 60);
//     }
//   } catch (err) {
//     console.warn("⚠️ Redis unavailable, skipping cache write");
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

  // 1️⃣ Try Redis (NON-BLOCKING)
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return reply.send(JSON.parse(cached));
      }
    } catch {
      // ignore redis failure
    }
  }

  // 2️⃣ Always fetch from DB
  const products = await getProducts(req.query);

  // 3️⃣ Try to cache result (BEST EFFORT)
  if (redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(products), "EX", 60);
    } catch {
      // ignore redis failure
    }
  }

  return reply.send(products);
}
