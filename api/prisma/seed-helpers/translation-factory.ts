import { LanguagesEnum, Prisma, PrismaClient, SiteEnum } from '@prisma/client';
import {
  jurisdictionTranslationRows,
  translations,
} from '../../src/locales/email-translations';

// Only a jurisdiction's own strings are seeded. The generic values are read from
// src/locales/email-translations.ts rather than stored.
export async function upsertEmailTranslations(
  prisma: PrismaClient,
  jurisdiction: { id: string; name: string },
): Promise<void> {
  const language = LanguagesEnum.en;
  for (const { key, value } of jurisdictionTranslationRows(jurisdiction)) {
    await prisma.translationStrings.upsert({
      where: {
        jurisdictionId_language_site_key: {
          jurisdictionId: jurisdiction.id,
          language,
          site: SiteEnum.email,
          key,
        },
      },
      create: {
        jurisdictionId: jurisdiction.id,
        language,
        site: SiteEnum.email,
        key,
        value,
      },
      update: { value },
    });
  }
}

export const translationFactory = (optionalParams?: {
  jurisdiction?: {
    id: string;
    name: string;
  };
  language?: LanguagesEnum;
}): Prisma.TranslationsCreateInput => {
  return {
    language: optionalParams?.language || LanguagesEnum.en,
    translations: translations(
      optionalParams?.jurisdiction,
      optionalParams?.language,
    ),
    jurisdictions: optionalParams?.jurisdiction
      ? {
          connect: {
            id: optionalParams.jurisdiction.id,
          },
        }
      : undefined,
  };
};
