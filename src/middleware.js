import { NextResponse, NextRequest } from "next/server";
import rateLimit from "@/lib/ratelimit";

const allowedOrigins = [
  "vercel.app",
  process.env.URL,
  process.env.AUTH_GOOGLE_URL,
];

//CSP
const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
const cspOptions = `
  default-src 'self'; 
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
  process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
}; 
  style-src 'self' https://authjs.dev https://www.googletagmanager.com  https://fonts.googleapis.com 'unsafe-inline'; 
  img-src 'self' https://authjs.dev https://typeee-s3.s3.ap-northeast-2.amazonaws.com https://www.google-analytics.com https://googletagmanager.com data:; 
  font-src 'self' https://fonts.gstatic.com; 
  object-src 'none'; 
  base-uri 'self'; 
  form-action 'self' https://accounts.google.com; 
  frame-ancestors 'none'; 
  connect-src 'self' https://www.google-analytics.com;
`;

const headerOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Authorization, Content-Security-Policy, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  "Access-Control-Allow-Credentials": "true",
  "x-nonce": nonce,
  "Content-Security-Policy": cspOptions.replace(/\s{2,}/g, " ").trim(),
};

export async function middleware(request) {
  const origin = request.nextUrl.origin ?? "";
  const path = request.nextUrl.pathname ?? "";
  console.log("\nMiddleware***********************************", path);
  console.log("start:", new Date());

  const ip = request.ip ?? request.headers.get("X-Forwarded-For") ?? "unknown";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  if (isAllowedOrigin) {
    let limitResult;

    if (path.startsWith("/api")) {
      limitResult = await rateLimit("api_" + ip);
    } else {
      limitResult = await rateLimit("page_" + ip);
    }

    console.log(
      "Rate Limiting:",
      path.startsWith("/api") ? "(API)" : "(PAGE)",
      `${limitResult.remaining}/${limitResult.limit}`,
      limitResult.success,
      request.method
    );

    if (!limitResult.success) {
      if (path === "/ratelimit") {
        return new Response.sendStatus(429);
      } else {
        return NextResponse.redirect(new URL("/ratelimit", origin));
      }
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", limitResult.result);
    response.headers.set("X-RateLimit-Remaining", limitResult.remaining);
    response.headers.set("Access-Control-Allow-Origin", origin);

    Object.entries(headerOptions).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    console.log("end:", new Date());
    return response;
  } else {
    return NextResponse.json(
      {
        error: "Origin not allowed",
        message: "There request origin is not allowed to access this resource.",
      },
      { status: 403 }
    );
  }
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

//1.2초
