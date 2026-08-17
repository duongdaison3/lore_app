import { Metadata } from 'next';
import { Archivo, Space_Grotesk } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { Navigation } from '@/components/Navigation';
import { auth } from '@/auth';
import '../globals.css';

const archivo = Archivo({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-archivo',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lore - A tiny daily conversation with yourself',
  description: 'Vietnamese-first daily journaling web application.',
  icons: {
    icon: [
      { url: '/lore/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/lore/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/lore/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/lore/favicon/site.webmanifest'
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!['vi', 'en'].includes(locale as string)) {
    notFound();
  }

  const messages = await getMessages();
  const session = await auth();

  return (
    <html lang={locale} className={`${archivo.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col bg-[var(--background)]">
              <Navigation isAuthenticated={!!session} />
              <main className="flex-1 mx-auto w-full max-w-3xl px-6 py-8">
                {children}
              </main>
            </div>
            <Toaster position="bottom-center" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
