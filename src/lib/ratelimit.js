import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const rateLimiter = new Ratelimit({
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  redis: Redis.fromEnv(),
  analytics: true,
  ephemeralCache: undefined,
  prefix: "@upstash/ratelimit",
  timeout: undefined,
});

const rateLimiterMax = new Ratelimit({
  limiter: Ratelimit.slidingWindow(30, "10 s"),
  redis: Redis.fromEnv(),
  analytics: true,
  ephemeralCache: undefined,
  prefix: "@upstash/ratelimit",
  timeout: undefined,
});

export async function rateLimit(identifier) {
  try {
    const result = await rateLimiter.limit(identifier);
    return result;
  } catch (err) {
    console.error(err.message);
  }
}

export async function rateLimitMax(identifier) {
  try {
    const result = await rateLimiter.limit(identifier);
    return result;
  } catch (err) {
    console.error(err.message);
  }
}
