import { NextResponse, NextRequest } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

//rate limiting
const rateLimiter = new Ratelimit({
  limiter: Ratelimit.slidingWindow(5, "10 s"),
  redis: Redis.fromEnv(),
  analytics: true,
  ephemeralCache: undefined,
  prefix: "@upstash/ratelimit",
  timeout: undefined,
});

const allowedOrigins = [process.env.URL, process.env.AUTH_GOOGLE_URL];

//CSP
const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
const cspOptions = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; style-src 'self' https://authjs.dev 'nonce-${nonce}'; img-src 'self' https://authjs.dev; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://accounts.google.com/; frame-ancestors 'none'; report-to csp-endpoint;`;
const reportingGroup = {
  group: "csp-endpoint",
  max_age: 10886400,
  endpoints: [
    {
      url: "/csp-report-endpoint",
      priority: 1,
    },
  ],
};

const headerOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Authorization, Content-Security-Policy, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  "Access-Control-Allow-Credentials": "true",
  "Content-Security-Policy": cspOptions.trim(),
  "Report-To": JSON.stringify(reportingGroup),
};

export async function middleware(request) {
  const ip = request.ip ?? request.headers.get("X-Forwarded-For") ?? "unknown";
  const { success } = await rateLimiter.limit(ip);
  console.log(success);
  if (!success) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  console.log("MIDDLEWARE EXECUTED!");
  // Check the origin from the request
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...headerOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }

  Object.entries(headerOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
