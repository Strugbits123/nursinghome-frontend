import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'locomotive-scroll/dist/locomotive-scroll.css';
import { FacilitiesProvider } from './context/FacilitiesContext'
import { CustomToaster } from "./components/CustomToaster";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nursing Home Finder - Find the Right Care for Your Loved Ones",
  description: "Trusted data from CMS, Google Reviews, and AI insights to help you make the most important decision for your family. Find top-rated nursing homes near you.",
  keywords: "nursing homes, senior care, healthcare facilities, CMS ratings, reviews",
  authors: [{ name: "Nursing Home Finder" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Nursing Home Finder",
    description: "Find the right nursing home for your loved ones",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-8855354849568036"
        />
        {/* <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8855354849568036"
          crossOrigin="anonymous"
        ></script> */}
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CustomToaster />
        <FacilitiesProvider>
          {children}
        </FacilitiesProvider>

      </body>
    </html>
  );
}
