import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const rateLimiter = new Ratelimit({
  limiter: Ratelimit.slidingWindow(7, "10 s"),
  redis: Redis.fromEnv(),
  analytics: true,
  ephemeralCache: undefined,
  prefix: "@upstash/ratelimit",
  timeout: undefined,
});

export default async function rateLimit(identifier) {
  try {
    const result = await rateLimiter.limit(identifier);
    return result;
  } catch (err) {
    console.error(err.message);
  }
}
