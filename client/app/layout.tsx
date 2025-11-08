import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Veda CLI',
    template: '%s | Veda CLI',
  },
  description:
    'Veda CLI is a command-line interface built on top of Gemini, designed for fast, reliable, and extensible workflows.',
  keywords: ['Veda CLI', 'CLI', 'Gemini', 'developer tools', 'command-line'],
  authors: [{ name: 'Soumadip Majila' }],
  creator: 'Soumadip Majila',

  openGraph: {
    title: 'Veda CLI',
    description:
      'Veda CLI is a command-line interface built on top of Gemini, offering a seamless developer experience.',
    siteName: 'Veda CLI',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Veda CLI',
    description: 'A powerful command-line interface built on top of Gemini.',
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
