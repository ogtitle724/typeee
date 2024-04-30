import { NextResponse, NextRequest } from "next/server";
import rateLimit from "@/lib/ratelimit";

const allowedOrigins = [process.env.URL, process.env.AUTH_GOOGLE_URL];

//CSP
const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
const cspOptions = `
  default-src 'self'; 
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; 
  style-src 'self' https://authjs.dev 'nonce-${nonce}'; 
  img-src 'self' https://authjs.dev; 
  font-src 'self'; 
  object-src 'none'; 
  base-uri 'self'; 
  form-action 'self' https://accounts.google.com/; 
  frame-ancestors 'none'; 
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
  await rateLimit(request);
  /* const origin = request.nextUrl.origin ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflighted requests
  if (request.method === "OPTIONS") {
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
    Object.entries(headerOptions).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } else {
    return NextResponse.json(
      {
        error: "Origin not allowed",
        message: "Ther request origin is not allowed to access this resource.",
      },
      { status: 403 }
    );
  } */
}

export const config = {
  matcher: "/:path*",
};
