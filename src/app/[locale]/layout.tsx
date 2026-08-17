import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { Navigation } from '@/components/Navigation';
import '../globals.css';

export const metadata = {
  title: 'Lore - A tiny daily conversation with yourself',
  description: 'Vietnamese-first daily journaling web application.',
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

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col bg-[var(--background)]">
              <Navigation />
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
