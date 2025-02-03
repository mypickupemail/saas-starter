import en from '../messages/en.json';

type Messages = typeof en;
 
declare global {
  // Use type safe message keys with `next-intl`
  type IntlMessages = Messages
}

export type Locale = Pick<(typeof locales)[number],'id'>;

export const locales = [
  { id: 'en', name: 'English' },
  { id: 'zh', name: '中文' },
  { id: 'jp', name: '日本語' }
] as const;

export const defaultLocale: Locale = {
    id:'en'
};

export const COOKIE_NAME = 'NEXT_LOCALE';