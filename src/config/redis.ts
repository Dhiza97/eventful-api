import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redis = new Redis(redisUrl, {
  connectTimeout: 10000, 
  retryStrategy(times) {
    if (times > 10) {
      console.error("Redis reconnection failed after 10 attempts.");
      return null;
    }
    return Math.min(times * 100, 3000);
  },
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.warn("Redis error:", err.message);
});

export default redis;