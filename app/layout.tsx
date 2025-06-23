import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";


const poppins = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400','500','600','700'],
  display: 'swap',
  variable: '--font-poppins'
})


export const metadata: Metadata = {
  title: "AI System",
  description: "Gen AI System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
