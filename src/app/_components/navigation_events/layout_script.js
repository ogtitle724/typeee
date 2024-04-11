"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && pathname !== "/write") {
      sessionStorage.setItem("prevUrl", window.location.href);
    }
  }, [pathname, searchParams]);

  return null;
}
