import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getMetadata } from "@/config/metadata";
import Header from "@comps/header/header_cli/header";
import SessionWrapper from "@comps/session_provider/session_provider";
import SvrHeader from "@comps/header/header_svr/header";
import NavigationEvents from "@comps/navigation_events/layout_script";
import { headers } from "next/headers";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
export const metadata = getMetadata();

export default function RootLayout({ children }) {
  const nonce = headers().get("x-nonce");

  return (
    <html lang="en">
      <head>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          <SvrHeader />
          <Header />
          <main className="main">{children}</main>
          <NavigationEvents />
        </SessionWrapper>
      </body>
      <GoogleAnalytics gaId="G-NL8JMR1330" />
    </html>
  );
}
