import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./app.module.scss";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const sourceCodeProRegular = localFont({
  src: "../fonts/SourceCodePro-Regular.ttf",
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
      <body className={`${styles.bg_color} ${sourceCodeProRegular.className}`}>
        <div className={`${styles.container}`}>
          <div className={styles.nav_container}>
            <Navbar />
          </div>
          <div className={styles.content_container}>{children}</div>
          <div className={styles.footer_container}>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
