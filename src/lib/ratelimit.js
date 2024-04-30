import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";

export default async function rateLimit(req) {
  const routes = ["/mypage", "/post", "/search", "/topic", "/write"];
  const path = req.nextUrl.pathname;
  const method = req.method;
  const rateLimiter = new Ratelimit({
    limiter: Ratelimit.slidingWindow(5, "10 s"),
    redis: Redis.fromEnv(),
    analytics: true,
    ephemeralCache: undefined,
    prefix: "@upstash/ratelimit",
    timeout: undefined,
  });

  let isTarget = false;

  if (path === "/" || (path.includes("/api/post") && method !== "GET")) {
    isTarget = true;
  } else if (!path.includes("/api") && !path.includes("/_next")) {
    routes.forEach((route) => {
      if (path.includes(route)) {
        isTarget = true;
      }
    });
  }

  if (isTarget) {
    console.log("RATE LIMITING COUNT++", path);
    const ip = req.ip ?? req.headers.get("X-Forwarded-For") ?? "unknown";
    const { success } = await rateLimiter.limit(ip);

    if (!success) {
      return NextResponse.json({ error: "rate limited" }, { status: 429 });
    }
  }
}
