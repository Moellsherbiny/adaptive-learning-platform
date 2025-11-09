import type { Metadata } from "next";
import { Alexandria, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserPreferenceProvider } from "@/context/UserPreferencesContext";
import Footer from "@/components/Footer";
import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import AppLayout from "@/components/AppLayout";
export const dynamic = "force-dynamic";

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic", "latin"],
  weight: ["200", "400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["200", "400", "500", "600", "700"],
})


export const metadata: Metadata = {
  title: "Mai Badran",
  description: "Mai Badran Master Degree Project",
  icons: {
    icon: "/icon?<generated>",
  },
};

export default function RootLayout({ children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
 
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
      </head>
      <body
        className={`${alexandria.variable} ${cairo.variable} antialiased`}
      >
          <UserPreferenceProvider>
          <AppLayout />
          <DynamicBreadcrumb/>
          {children}
          <Footer/>
          </UserPreferenceProvider>
        <Toaster />
      </body>
    </html>
  );
}
