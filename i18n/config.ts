export type Locale = "fr";
export const defaultLocale: Locale = "fr";

const dictionaries = {
  fr: () => import("./fr.json").then((m) => m.default),
};

export async function getDictionary(locale: Locale = defaultLocale) {
  return dictionaries[locale]();
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;