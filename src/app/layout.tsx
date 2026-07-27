import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { LightboxProvider } from "@/components/Lightbox";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sebastiano-nicoras.vercel.app"),
  title: "Sebastiano Nicoras — Men's Fashion Model",
  description: "Official model book. Height 181cm, Chest 99, Waist 81, Shoes 42. Based in Cluj-Napoca, Romania. Available for international bookings.",
  openGraph: {
    title: "Sebastiano Nicoras — Men's Fashion Model",
    description: "Official model book. Available for international bookings.",
    images: ["/portfolio/IMG_5192.jpeg"],
    type: "website",
    url: "https://sebastiano-nicoras.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebastiano Nicoras — Men's Fashion Model",
    description: "Available for international bookings.",
    images: ["/portfolio/IMG_5192.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable}`}
    >
      <body>
        <LightboxProvider>{children}</LightboxProvider>
      </body>
    </html>
  );
}