import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar";
const sourceCodeProRegular = localFont({
  src: "./fonts/SourceCodePro-Regular.ttf",
});

export const metadata: Metadata = {
  title: "Typephoon",
  description: "Realtime multiplayer typing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`p-2 ${sourceCodeProRegular.className}`}
      >
        <Navbar />
        {children}
        {/*  <Footer /> */}
      </body>
    </html>
  );
}
