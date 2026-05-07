import { Prisma, PrismaClient } from '@prisma/client';
import * as lodash from 'lodash';

/**
 * Create or merge translation JSON for one (language, jurisdictionId) pair
 */
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
