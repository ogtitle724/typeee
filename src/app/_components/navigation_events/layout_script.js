"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && pathname !== "/write") {
      sessionStorage.setItem("prevUrl", window.location.href);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function Wrapper() {
  return (
    <Suspense>
      <NavigationEvents />
    </Suspense>
  );
}
