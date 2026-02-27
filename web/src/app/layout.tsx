import type { Metadata } from "next";
import { Aldrich, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/providers";
import { ScrollToTop } from "@/components/scroll-to-top";

const aldrich = Aldrich({
  variable: "--font-aldrich",
  subsets: ["latin"],
  weight: "400",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Pentasec - AI Powered Pentest Reporting",
  description: "AI-powered penetration testing and security reporting platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.removeItem('theme');
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${aldrich.variable} ${poppins.variable} antialiased font-poppins`}
      >
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <ScrollToTop />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
