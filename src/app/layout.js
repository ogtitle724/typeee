import SessionWrapper from "@comps/session_provider/session_provider";
import SvrHeader from "@comps/header/header_svr/header";
import NavigationEvents from "@comps/navigation_events/layout_script";
import { Inter } from "next/font/google";
import { getMetadata } from "@/config/metadata";
import { headers } from "next/headers";
import { Suspense } from "react";
import Header from "@comps/header/header_cli/header";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata = getMetadata();

export default function RootLayout({ children }) {
  const nonce = headers().get("X-Nonce");

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
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <Script
            id="gtm-script"
            nonce={nonce}
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', "${process.env.NEXT_PUBLIC_GTM_ID}");
  `,
            }}
          />
        </Suspense>
      </body>
    </html>
  );
}
