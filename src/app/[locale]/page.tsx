
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/Button";
import { getTranslations, getLocale } from "next-intl/server";
import { DynamicGreeting } from "@/components/ui/DynamicGreeting";
import { OnboardingCarousel } from "@/components/home/OnboardingCarousel";
import { DashboardBentoGrid } from "@/components/home/DashboardBentoGrid";
import { getDashboardData } from "@/app/actions/dashboard";
import { auth } from '@/auth';

export default async function Home() {
  const session = await auth();
  const locale = await getLocale();
  const t = await getTranslations('Journal');
  const th = await getTranslations('Home');

  if (!session) {
    return (
      <>
        <OnboardingCarousel />
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
      </>
    );
  }

  const dashboardData = await getDashboardData();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-10 flex flex-col items-center pt-16 pb-32 min-h-[75vh] px-4">
      
      {/* Greeting Header */}
      <div className="space-y-3 text-center w-full max-w-2xl mb-4">
        <DynamicGreeting name={session.user?.name || session.user?.email?.split('@')[0] || ""} />
        <p className="text-lg text-[var(--muted-foreground)] font-light">{th("howAreYou")}</p>
      </div>

      <DashboardBentoGrid data={dashboardData} locale={locale} />
      
    </div>
  );
}
