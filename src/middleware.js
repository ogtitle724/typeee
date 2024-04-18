import { NextResponse } from "next/server";

/* export const runtime = "experimental-edge"; */

const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
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
const cspOptions = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; style-src 'self' https://authjs.dev 'nonce-${nonce}'; img-src 'self' https://authjs.dev; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://accounts.google.com/; frame-ancestors 'none'; report-to csp-endpoint;`;
const allowedOrigins = [process.env.URL, process.env.AUTH_GOOGLE_URL];

const headerOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Authorization, Content-Security-Policy, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  "Access-Control-Allow-Credentials": "true",
  "Content-Security-Policy": cspOptions.trim(),
  "Report-To": JSON.stringify(reportingGroup),
};

export function middleware(request) {
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
