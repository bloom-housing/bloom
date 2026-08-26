import { LanguagesEnum, Prisma, SiteEnum } from '@prisma/client';

// Email copy has no site of its own, so it lives where getMergedTranslations reads.
// TODO: #6632 moves these onto their own SiteEnum value, changing this and the read's filter.
export const EMAIL_TRANSLATION_SITE: SiteEnum | null = null;

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

export type TranslationRowWriter = {
  translationStrings: {
    count: (args: unknown) => Promise<number>;
    updateMany: (args: unknown) => Promise<{ count: number }>;
    create: (args: unknown) => Promise<unknown>;
  };
};

// The base row getMergedTranslations switches on. Until it exists the blob is still the read path.
export const hasMigratedTranslations = async (
  prisma: TranslationRowWriter,
): Promise<boolean> =>
  (await prisma.translationStrings.count({
    where: {
      jurisdictionId: null,
      language: LanguagesEnum.en,
      site: EMAIL_TRANSLATION_SITE,
    },
  })) > 0;

// Prisma cannot upsert on the rows' compound unique, since it includes nullable columns.
export const writeTranslationRows = async (
  prisma: TranslationRowWriter,
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
