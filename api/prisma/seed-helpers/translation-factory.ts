import { LanguagesEnum, Prisma, PrismaClient } from '@prisma/client';
import * as lodash from 'lodash';
import { translations } from '../../src/locales/email-translations';

export async function upsertTranslation(
  prisma: PrismaClient,
  data: Prisma.TranslationsCreateInput,
): Promise<void> {
  const jurisdictionId = data.jurisdictions?.connect?.id ?? null;
  const { language } = data;

  const existing = await prisma.translations.findFirst({
    where: { language, jurisdictionId },
  });

  if (!existing) {
    await prisma.translations.create({ data });
    return;
  }

  const merged = lodash.merge(
    {},
    existing.translations as Record<string, unknown>,
    data.translations as Record<string, unknown>,
  );

  await prisma.translations.update({
    where: { id: existing.id },
    data: { translations: merged as Prisma.InputJsonValue },
  });
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
