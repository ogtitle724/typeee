import { Inter } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { getMetadata } from "@/config/metadata";
import Header from "@comps/header/header_cli/header";
import SessionWrapper from "@comps/session_provider/session_provider";
import SvrHeader from "@comps/header/header_svr/header";
import NavigationEvents from "@comps/navigation_events/layout_script";
import { headers } from "next/headers";
import "./globals.css";
import { Suspense } from "react";
import Analytics from "./_components/gtm/gtm";

const inter = Inter({ subsets: ["latin"] });
export const metadata = getMetadata();

export default function RootLayout({ children }) {
  const nonce = headers().get("x-nonce");

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <SvrHeader />
          <Header />
          <main className="main">{children}</main>
          <NavigationEvents />
        </SessionWrapper>
        <Suspense>
          <Analytics nonce={nonce} />
        </Suspense>
      </body>
      {/* <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} nonce={nonce} /> */}
      {/* <GoogleAnalytics gaId={process.env.GA4_ID} /> */}
    </html>
  );
}
