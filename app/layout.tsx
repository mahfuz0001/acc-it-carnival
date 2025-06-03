import type React from "react";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { OfflineIndicator } from "@/components/offline-indicator";
import { PushNotifications } from "@/components/push-notifications";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageTransition } from "@/components/page-transition";
import { UserActivityTracker } from "@/components/user-activity-tracker";
import "./globals.css";
import { PWAInstall } from "@/components/pwa-install";

export const metadata = {
  title: "ACC IT Carnival 4.0",
  description: "The biggest IT event of the year",
  manifest: "/manifest.json",
  // themeColor: "#131943",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ACC IT Carnival",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className="min-h-screen bg-[#131943] font-sans antialiased">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ErrorBoundary>
              <Header />
              <PageTransition>
                <main className="flex-1">{children}</main>
              </PageTransition>
              <Footer />
              <Toaster position="bottom-right" />
              <OfflineIndicator />
              <PWAInstall />
              {/* <PushNotifications /> */}
              {/* <UserActivityTracker /> */}
            </ErrorBoundary>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
