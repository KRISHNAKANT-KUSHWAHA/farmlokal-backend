// import { getProducts } from "./products.service";
// import redis from "../../config/redis";
// import crypto from "crypto";

// /**
//  * Generate unique cache key per query
//  */
// function getCacheKey(query: any): string {
//   const queryString = JSON.stringify(query);
//   const hash = crypto.createHash("md5").update(queryString).digest("hex");
//   return `products:${hash}`;
// }

// export async function getProductsHandler(req: any, reply: any) {
//   const cacheKey = getCacheKey(req.query);

//   // 1️⃣ Check Redis cache
//   const cachedData = await redis.get(cacheKey);
//   if (cachedData) {
//     return reply.send(JSON.parse(cachedData));
//   }

//   // 2️⃣ Fetch from MySQL
//   const products = await getProducts(req.query);

//   // 3️⃣ Save response in Redis
//   await redis.set(cacheKey, JSON.stringify(products), "EX", 60);

//   return reply.send(products);
// }


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

//   // Redis cache check
//   const cached = await redis.get(cacheKey);
//   if (cached) {
//     return reply.send(JSON.parse(cached));
//   }

//   // DB fetch
//   const products = await getProducts(req.query);

//   // Cache result
//   await redis.set(cacheKey, JSON.stringify(products), "EX", 60);

//   return reply.send(products);
// }


import { getProducts } from "./products.service";
import redis from "../../config/redis";
import crypto from "crypto";

function getCacheKey(query: any) {
  const hash = crypto
    .createHash("md5")
    .update(JSON.stringify(query))
    .digest("hex");

  return `products:${hash}`;
}

export async function getProductsHandler(req: any, reply: any) {
  const cacheKey = getCacheKey(req.query);

  // 1️⃣ Try cache (NON-BLOCKING)
  try {
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return reply.send(JSON.parse(cached));
      }
    }
  } catch (err) {
    console.warn("⚠️ Redis unavailable, skipping cache read");
  }

  // 2️⃣ Fetch from DB
  const products = await getProducts(req.query);

  // 3️⃣ Store in cache (BEST-EFFORT)
  try {
    if (redis) {
      await redis.set(cacheKey, JSON.stringify(products), "EX", 60);
    }
  } catch (err) {
    console.warn("⚠️ Redis unavailable, skipping cache write");
  }

  return reply.send(products);
}
