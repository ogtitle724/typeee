import { NextResponse } from "next/server";
import { rateLimit, rateLimitMax } from "@/lib/ratelimit";
import { getHeaders } from "@/config/response_headers";
import { allowedOrigins } from "@/config/allowed_origin";

export async function middleware(request) {
  const origin = request.nextUrl.origin ?? "";
  const path = request.nextUrl.pathname ?? "";
  const method = request.method;
  const ip = request.ip ?? request.headers.get("X-Forwarded-For") ?? "unknown";
  const isAllowedOrigin = allowedOrigins.includes(origin);
  let limitResult;

  if (isAllowedOrigin) {
    if (path.startsWith("/api")) {
      if (method === "DELETE") {
        limitResult = await rateLimitMax("typeee-api-delete" + ip);
      } else {
        limitResult = await rateLimit("typeee-api-" + ip);
      }
    } else {
      limitResult = await rateLimit("typeee-page-" + ip);
    }

    if (!limitResult.success) {
      if (path !== "/ratelimit") {
        return NextResponse.redirect(new URL("/ratelimit", origin));
      }
    } else {
      const response = NextResponse.next();

      response.headers.set("X-RateLimit-Limit", limitResult.limit);
      response.headers.set("X-RateLimit-Remaining", limitResult.remaining);
      response.headers.set("Access-Control-Allow-Origin", origin);

      Object.entries(getHeaders()).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }
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
