import Redis from "ioredis";

let redis: Redis | null = null;

try {
  redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

  redis.on("connect", () => {
    console.log("Redis connected");
  });

  redis.on("error", (err) => {
    console.error("Redis error:", err.message);
  });
} catch (err) {
  console.warn("Redis not available, continuing without cache");
}

export default redis;