"use server";

import { cookies } from "next/headers";
import { Locale, defaultLocale, COOKIE_NAME } from "./config";
export async function getUserLocale() {
  const cookie = await cookies();
  return cookie.get(COOKIE_NAME)?.value || defaultLocale.id;
}

export async function setUserLocale(locale: Locale) {
  const cookie = await cookies();
  cookie.set(COOKIE_NAME, locale.id);
}
