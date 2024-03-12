// This function can be marked `async` if using `await` inside
import { NextResponse } from "next/server";

export async function middleware(req) {
  return NextResponse.next();

  newRequestHeaders.set("some-thing", "something from headers");

  const response = NextResponse.next({
    request: {
      headers: newRequestHeaders,
    },
  });
  response.cookies.set({
    name: "hi",
    value: "bye",
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/api/:path*", "/:path*"],
};
