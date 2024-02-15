import { Inter } from "next/font/google";
import { metadata as meta } from "@/config/metadata";
import Header from "@comps/header/header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata = meta;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
