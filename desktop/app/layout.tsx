import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ExitButton } from '@/components/ExitButton';
import { ThemeProvider } from '@/components/theme-provider';
import { VersionGate } from '@/components/VersionGate';


const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Pentasec - AI Powered Pentest Reporting Tool',
  description: 'AI Powered Pentest Reporting Tool',
  generator: 'Pentasec',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased text-foreground bg-background`}>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dracula"
          enableSystem={false}
          disableTransitionOnChange
        >
          <VersionGate>{children}</VersionGate>
        </ThemeProvider>
      </body>
    </html>
  )
}
