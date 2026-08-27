import { LanguagesEnum, Prisma, SiteEnum } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

// Email copy has no site of its own, and getMergedTranslations reads rows with no site.
// TODO: #6632 moves these onto their own SiteEnum value, changing this and getMergedTranslations.
export const EMAIL_TRANSLATION_SITE: SiteEnum | null = null;

// Only the backfill may write this. If anything else did, email would read a table holding only that writer's keys.
// TODO: #6519's backfill writes it. Until then email always reads the translations table.
export const TRANSLATION_BACKFILL_MARKER_KEY = '_backfill.completedAt';

export type TranslationWriteScope = {
  jurisdictionId: string | null;
  language: LanguagesEnum;
  site: SiteEnum | null;
};

// Written with no jurisdiction, so a jurisdiction that has not overridden a key gets this value.
export const emailTranslationScope = (
  language: LanguagesEnum,
): TranslationWriteScope => ({
  jurisdictionId: null,
  language,
  site: EMAIL_TRANSLATION_SITE,
});

// The translations table nests values; rows use the dotted key polyglot looks up.
export const flattenTranslationTree = (
  tree: Record<string, unknown>,
  prefix = '',
): Record<string, string> => {
  const flat: Record<string, string> = {};

  for (const [key, value] of Object.entries(tree ?? {})) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      flat[path] = value;
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(
        flat,
        flattenTranslationTree(value as Record<string, unknown>, path),
      );
    } else {
      throw new Error(
        `Invalid translation value at ${path}. Values must be strings or nested objects.`,
      );
    }
  }

  return flat;
};

// getMergedTranslations checks this. Until it is set, email reads the translations table.
export const hasMigratedTranslations = async (
  prisma: PrismaService,
): Promise<boolean> =>
  (await prisma.translationStrings.count({
    where: {
      jurisdictionId: null,
      language: LanguagesEnum.en,
      site: EMAIL_TRANSLATION_SITE,
      key: TRANSLATION_BACKFILL_MARKER_KEY,
    },
  })) > 0;

// Prisma cannot upsert on the rows' compound unique, since it includes nullable columns.
export const writeTranslationRows = async (
  prisma: PrismaService,
  scope: TranslationWriteScope,
  values: Record<string, string>,
): Promise<number> => {
  let written = 0;

  for (const [key, value] of Object.entries(values)) {
    const where = { ...scope, key };
    const updated = await prisma.translationStrings.updateMany({
      where,
      data: { value },
    });

    if (updated.count > 0) {
      written += updated.count;
      continue;
    }

    try {
      await prisma.translationStrings.create({ data: { ...where, value } });
      written += 1;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const retried = await prisma.translationStrings.updateMany({
          where,
          data: { value },
        });
        written += retried.count;
        continue;
      }
      throw error;
    }
  }

  return written;
};
