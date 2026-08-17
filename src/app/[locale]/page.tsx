import { useTranslations } from 'next-intl';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const t = useTranslations('Journal');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium tracking-tight">Chào buổi sáng,</h1>
        <p className="text-[var(--muted-foreground)]">Hôm nay bạn cảm thấy thế nào?</p>
      </div>

      <EmptyState 
        title={t('emptyStateTitle')} 
        description={t('emptyStateDesc')} 
        action={<Button>{t('newEntry')}</Button>}
      />
    </div>
  );
}
