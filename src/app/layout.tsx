import type { Metadata, Viewport } from "next";
import { Italiana, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

/**
 * Self-hosted at build time, so no request reaches Google and the German
 * audience stays clear of the Google Fonts hotlinking problem.
 *
 * Atelier uses exactly three faces. Themes inside a previewed invitation load
 * their own; those are the renderer's concern, not the chrome's.
 */
const italiana = Italiana({
  subsets: ["latin"], weight: ["400"], display: "swap", variable: "--f-italiana",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"], weight: ["300", "400"], display: "swap", variable: "--f-cormorant",
});
const jost = Jost({
  subsets: ["latin"], weight: ["300", "400"], display: "swap", variable: "--f-jost",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Always Ever After",
  description:
    "One invitation, one link, sent to everyone you love. Priced once, not per guest.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* Never disable zoom. Pinch to zoom is an accessibility guarantee. */
  maximumScale: 5,
  themeColor: "#faf8f5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = `${italiana.variable} ${cormorant.variable} ${jost.variable}`;
  return (
    <html lang="en" className={fonts}>
      <body>{children}</body>
    </html>
  );
}
