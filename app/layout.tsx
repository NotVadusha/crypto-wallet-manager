import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";

const euclidCircular = localFont({
  src: [
    {
      path: "../public/fonts/EuclidCircularA-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/EuclidCircularA-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-euclid-circular",
});

export const metadata: Metadata = {
  title: "Wallet Manager",
  description: "Wallet Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${euclidCircular.variable} ${euclidCircular.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
