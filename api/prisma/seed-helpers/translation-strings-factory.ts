import {
  LanguagesEnum,
  Prisma,
  PrismaClient,
  SiteEnum,
  TranslationOrigin,
} from '@prisma/client';
import { sourceHash } from '../../src/utilities/translation-source-hash';

const FORK_ONLY_KEY = 'listingFilters.countyFilterNote';
const FORK_ONLY_ENGLISH =
  'Select a county to see the listings available there.';
const OVERRIDDEN_KEY = 't.getDirections';

export const translationStringsFactory = (jurisdictionId: string) => {
  const rows: Prisma.TranslationStringsUncheckedCreateInput[] = [
    {
      jurisdictionId,
      language: LanguagesEnum.en,
      site: SiteEnum.public,
      key: FORK_ONLY_KEY,
      value: FORK_ONLY_ENGLISH,
      origin: TranslationOrigin.human,
    },
    {
      jurisdictionId,
      language: LanguagesEnum.es,
      site: SiteEnum.public,
      key: FORK_ONLY_KEY,
      value: 'Seleccione un condado para ver los listados disponibles alli.',
      sourceHash: sourceHash(FORK_ONLY_ENGLISH),
      origin: TranslationOrigin.human,
    },
    {
      jurisdictionId,
      language: LanguagesEnum.en,
      site: SiteEnum.public,
      key: OVERRIDDEN_KEY,
      value: 'Get travel directions',
      origin: TranslationOrigin.human,
    },
  ];

  return rows;
};

export async function upsertTranslationStrings(
  prisma: PrismaClient,
  rows: Prisma.TranslationStringsUncheckedCreateInput[],
): Promise<void> {
  for (const row of rows) {
    const { jurisdictionId, language, site, key, ...fields } = row;
    const existing = await prisma.translationStrings.findFirst({
      where: { jurisdictionId, language, site, key },
      select: { id: true },
    });

    if (existing) {
      await prisma.translationStrings.update({
        where: { id: existing.id },
        data: fields,
      });
    } else {
      await prisma.translationStrings.create({ data: row });
    }
  }
}
