import axios from "axios";
import redis from "../../config/redis";

/**
 * Redis Keys
 */
const TOKEN_KEY = "oauth:access_token";
const LOCK_KEY = "oauth:lock";

/**
 * OAuth Config
 */
const TOKEN_URL = process.env.OAUTH_TOKEN_URL!;
const CLIENT_ID = process.env.OAUTH_CLIENT_ID!;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET!;

/**
 * Public function used by other services
 */
export async function getAccessToken(): Promise<string> {
  // 1️⃣ Check if token already exists in Redis
  const cachedToken = await redis.get(TOKEN_KEY);
  if (cachedToken) {
    return cachedToken;
  }

  // 2️⃣ Acquire Redis lock (prevents concurrent token fetch)
  const lockAcquired = await redis.set(LOCK_KEY, "1", "NX", "EX", 5);

  if (!lockAcquired) {
    // Another request is fetching token → wait & retry
    await sleep(300);
    return getAccessToken();
  }

  try {
    // 3️⃣ Fetch token from OAuth server
    const response = await axios.post(
      TOKEN_URL,
      {
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
      {
        timeout: 3000,
      }
    );

    const { access_token, expires_in } = response.data;

    // 4️⃣ Store token in Redis with TTL
    await redis.set(
      TOKEN_KEY,
      access_token,
      "EX",
      expires_in - 10 // buffer to avoid edge expiry
    );

    return access_token;
  } catch (error) {
    console.error("❌ Failed to fetch OAuth token", error);
    throw new Error("OAuth token fetch failed");
  } finally {
    // 5️⃣ Release lock
    await redis.del(LOCK_KEY);
  }
}

/**
 * Helper sleep function
 */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
