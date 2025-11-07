import type { Metadata } from "next";
import { Alexandria, Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { UserPreferenceProvider } from "@/context/UserPreferencesContext";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserPreferenceProvider>

          {children}
          </UserPreferenceProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
