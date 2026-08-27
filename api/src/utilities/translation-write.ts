import { LanguagesEnum, Prisma, SiteEnum } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';

// Email copy has no site of its own, so it lives where getMergedTranslations reads.
// TODO: #6632 moves these onto their own SiteEnum value, changing this and the read's filter.
export const EMAIL_TRANSLATION_SITE: SiteEnum | null = null;

// Only the backfill may write this; any other writer would switch email to a half-filled table.
// TODO: #6519's backfill writes it. Until then no environment reads the key rows for email.
export const TRANSLATION_BACKFILL_MARKER_KEY = '_backfill.completedAt';

export type TranslationWriteScope = {
  jurisdictionId: string | null;
  language: LanguagesEnum;
  site: SiteEnum | null;
};

// Generic scope, so a jurisdiction that has not overridden a key follows the base.
export const emailTranslationScope = (
  language: LanguagesEnum,
): TranslationWriteScope => ({
  jurisdictionId: null,
  language,
  site: EMAIL_TRANSLATION_SITE,
});

// The blob nests values; rows key them by the dotted path polyglot addresses.
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

// What getMergedTranslations switches on. Until it is set the blob is still the read path.
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
