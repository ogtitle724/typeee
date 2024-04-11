import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getMetadata } from "@/config/metadata";
import Header from "@comps/header/header_cli/header";
import SessionWrapper from "@comps/session_provider/session_provider";
import SvrHeader from "@comps/header/header_svr/header";
import NavigationEvents from "@comps/navigation_events/layout_script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata = getMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
