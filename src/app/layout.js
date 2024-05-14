import SessionWrapper from "@comps/session_provider/session_provider";
import SvrHeader from "@comps/header/header_svr/header";
import NavigationEvents from "@comps/navigation_events/layout_script";
import Analytics from "@comps/gtm/gtm";
import { Inter } from "next/font/google";
import { getMetadata } from "@/config/metadata";
import { headers } from "next/headers";
import { Suspense } from "react";
import Header from "@comps/header/header_cli/header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata = getMetadata();

export default function RootLayout({ children }) {
  const nonce = headers().get("x-nonce");

  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense>
          <Analytics nonce={nonce} />
        </Suspense>
        <SessionWrapper>
          <SvrHeader />
          <Header />
          <main className="main">{children}</main>
          <NavigationEvents />
        </SessionWrapper>
      </body>
    </html>
  );
}
