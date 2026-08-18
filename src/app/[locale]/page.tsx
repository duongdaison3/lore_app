
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/Button";
import { getTranslations, getLocale } from "next-intl/server";
import { DynamicGreeting } from "@/components/ui/DynamicGreeting";
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();
  const locale = await getLocale();
  const t = await getTranslations('Journal');
  const th = await getTranslations('Home');

  if (!session) {
    return (
      <div className="relative min-h-[75vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col items-center text-center space-y-10 px-4 w-full">
          
          <div className="glass-panel p-10 md:p-14 rounded-3xl flex flex-col items-center w-full max-w-2xl shadow-xl">
            <div className="w-full max-w-[240px] sm:max-w-[280px] mb-8 drop-shadow-md">
              <Image 
                src="/lore/Logo_with_tagline.png" 
                alt="Lore Logo" 
                width={600} 
                height={300} 
                className="w-full h-auto object-contain dark:invert" 
                priority
              />
            </div>
            
            <div className="space-y-4 max-w-lg">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] font-heading leading-tight">
                {th("welcomeTitle")}
              </h1>
              <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed max-w-md mx-auto">
                {th("welcomeDesc")}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-10 w-full sm:w-auto">
              <Link href={`/${locale}/login`} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-base font-medium shadow-sm hover:shadow-md transition-all border-[var(--border)] bg-[var(--card)]/50 hover:bg-[var(--card)]">
                  {th("loginBtn")}
                </Button>
              </Link>
              <Link href={`/${locale}/register`} className="w-full sm:w-auto">
                <Button variant="default" size="lg" className="w-full sm:w-auto rounded-full px-10 h-14 text-base font-medium shadow-md hover:shadow-xl hover:-translate-y-1 transition-all bg-[var(--primary)] text-[var(--primary-foreground)]">
                  {th("registerBtn")}
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-12 flex flex-col items-center pt-20 min-h-[75vh]">
      <div className="space-y-4 text-center w-full max-w-2xl">
        <DynamicGreeting name={session.user?.name || session.user?.email?.split('@')[0] || ""} />
        <p className="text-lg md:text-xl text-[var(--muted-foreground)] font-light">{th("howAreYou")}</p>
      </div>

      <div className="w-full max-w-md pt-6 flex justify-center">
        <Link href={`/${locale}/journal`} className="w-full group">
          <div className="w-full px-8 py-6 rounded-3xl glass-panel shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/0 via-[var(--primary)]/5 to-[var(--primary)]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
            <span className="text-xl font-medium text-[var(--foreground)] transition-colors relative z-10 flex items-center justify-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              {t('newEntry')}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
