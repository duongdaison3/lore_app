import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations('Journal');
  const th = await getTranslations('Home');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 flex flex-col items-center pt-8">
      <div className="space-y-2 text-center w-full max-w-2xl">
        <h1 className="text-2xl font-medium tracking-tight">{th("morning")}</h1>
        <p className="text-[var(--muted-foreground)]">{th("howAreYou")}</p>
      </div>

      <div className="w-full max-w-2xl">
        <EmptyState
          title={t('emptyStateTitle')}
          description={t('emptyStateDesc')}
          action={<Button>{t('newEntry')}</Button>}
        />
      </div>
    </div>
  );
}
