'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Locale, locales } from '@/i18n/config';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { setUserLocale } from '@/i18n/action';

 
export default function LocaleSwitcher() {
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const handleLocaleChange = (locale: string) => {
    startTransition(async () => {
        await setUserLocale({id:locale} as Locale) 
    });
  };

  return (
    <Select
      defaultValue={currentLocale}
      onValueChange={handleLocaleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="选择语言" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale.id} value={locale.id}>
            {locale.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}