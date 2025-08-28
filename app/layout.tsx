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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Comprehensive ResizeObserver error suppression
              (function() {
                const resizeObserverErrorHandler = function(e) {
                  if (
                    e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
                    e.message === 'ResizeObserver loop limit exceeded' ||
                    e.message.includes('ResizeObserver') ||
                    e.error?.message?.includes('ResizeObserver')
                  ) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                  }
                };

                // Handle both error events and unhandled promise rejections
                window.addEventListener('error', resizeObserverErrorHandler);
                window.addEventListener('unhandledrejection', function(e) {
                  if (e.reason?.message?.includes('ResizeObserver')) {
                    e.preventDefault();
                    return false;
                  }
                });

                // Override console.error to filter ResizeObserver errors
                const originalConsoleError = console.error;
                console.error = function(...args) {
                  if (args.some(arg => 
                    typeof arg === 'string' && arg.includes('ResizeObserver')
                  )) {
                    return;
                  }
                  originalConsoleError.apply(console, args);
                };
              })();
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground font-sans">{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
