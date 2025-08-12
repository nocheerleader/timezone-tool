import type React from "react"
import { Open_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${openSans.variable} ${jetbrainsMono.variable} antialiased`}>
      <body className="bg-background text-foreground font-sans">{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
