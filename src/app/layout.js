import { Inter } from "next/font/google";
import { metadata as meta } from "@/config/metadata";
import Header from "@/app/_components/header/header_cli/header";
import "./globals.css";
import SessionWrapper from "@/lib/session_provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import SvrHeader from "./_components/header/header_svr/header";

const inter = Inter({ subsets: ["latin"] });
export const metadata = meta;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <SvrHeader />
          <Header />
          <main className="main">{children}</main>
        </SessionWrapper>
      </body>
      <GoogleAnalytics gaId="G-NL8JMR1330" />
    </html>
  );
}
