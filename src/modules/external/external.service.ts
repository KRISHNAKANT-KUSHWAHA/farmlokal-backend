import axios from "axios";
import axiosRetry from "axios-retry";

/**
 * Axios instance for external API
 */
const externalClient = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 3000, // 3s timeout
});

/**
 * Retry configuration
 */
axiosRetry(externalClient, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error);
  },
});

/**
 * Fetch products from external API
 */
export async function fetchExternalProducts() {
  try {
    const response = await externalClient.get("/products");
    return response.data;
  } catch (error) {
    console.error("❌ External API failed", error);
    throw new Error("External API unavailable");
  }
}
