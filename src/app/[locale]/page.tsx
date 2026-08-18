
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/Button";
import { getTranslations, getLocale } from "next-intl/server";
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();
  const locale = await getLocale();
  const t = await getTranslations('Journal');
  const th = await getTranslations('Home');

  if (!session) {
    return (
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Artistic glowing orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-[var(--accent)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-64 aspect-square bg-[var(--primary)]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center text-center space-y-10 px-4">
          
          <div className="w-full max-w-[320px] sm:max-w-md drop-shadow-sm">
            <Image 
              src="/lore/Logo_with_tagline.png" 
              alt="Lore Logo" 
              width={800} 
              height={400} 
              className="w-full h-auto object-contain dark:invert" 
              priority
            />
          </div>
          
          <div className="space-y-6 max-w-xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--foreground)] font-heading leading-tight">
              {th("welcomeTitle")}
            </h1>
            <p className="text-lg sm:text-xl text-[var(--muted-foreground)] leading-relaxed font-sans max-w-lg mx-auto">
              {th("welcomeDesc")}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 w-full sm:w-auto">
            <Link href={`/${locale}/login`} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 h-12 text-base font-medium shadow-sm hover:shadow-md transition-all">
                {th("loginBtn")}
              </Button>
            </Link>
            <Link href={`/${locale}/register`} className="w-full sm:w-auto">
              <Button variant="default" size="lg" className="w-full sm:w-auto rounded-full px-8 h-12 text-base font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
                {th("registerBtn")}
              </Button>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-1000 space-y-12 flex flex-col items-center pt-24 min-h-[80vh]">
      <div className="space-y-4 text-center w-full max-w-2xl">
        <h1 className="text-3xl font-serif tracking-tight text-[var(--foreground)] opacity-90">{th("morning")} {session.user?.name || session.user?.email?.split('@')[0]}</h1>
        <p className="text-lg text-[var(--muted-foreground)] opacity-80">{th("howAreYou")}</p>
      </div>

      <div className="w-full max-w-md pt-8 flex justify-center">
        <Link href={`/${locale}/journal`} className="w-full">
          <div className="w-full px-6 py-4 rounded-2xl bg-[var(--card)] border border-[var(--border)]/30 shadow-sm hover:shadow-md hover:bg-[var(--accent)]/5 transition-all duration-300 text-center cursor-pointer group">
            <span className="text-lg text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-colors">
              {t('newEntry')}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
