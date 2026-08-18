import { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Fira_Code, Fira_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { Navigation } from '@/components/Navigation';
import { auth } from '@/auth';
import '../globals.css';

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const firaSans = Fira_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-admin',
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
    <html lang={locale} className={`${plusJakarta.variable} ${inter.variable} ${firaCode.variable} ${firaSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground bg-gradient-ambient selection:bg-primary/20">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <Navigation isAuthenticated={!!session} />
              <main className="flex-1 mx-auto w-full max-w-3xl px-6 pt-28 pb-8 relative z-10">
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
