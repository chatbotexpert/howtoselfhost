import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'howtoselfhost.com — Self-Host Everything',
    template: '%s | howtoselfhost.com',
  },
  description:
    'Practical guides and tutorials for self-hosting your own infrastructure. Docker, VPS, Nginx, databases, security, and more.',
  keywords: [
    'self-hosting',
    'docker',
    'vps',
    'nginx',
    'postgresql',
    'linux',
    'server',
    'self-hosted',
  ],
  authors: [{ name: 'howtoselfhost.com' }],
  creator: 'howtoselfhost.com',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://howtoselfhost.com',
    siteName: 'howtoselfhost.com',
    title: 'howtoselfhost.com — Self-Host Everything',
    description:
      'Practical guides for self-hosting Docker, VPS, Nginx, databases, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'howtoselfhost.com — Self-Host Everything',
    description:
      'Practical guides for self-hosting Docker, VPS, Nginx, databases, and more.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen font-sans flex flex-col bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="howtoselfhost-theme"
          disableTransitionOnChange={false}
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
