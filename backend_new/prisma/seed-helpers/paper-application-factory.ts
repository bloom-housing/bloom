import { Prisma, LanguagesEnum } from '@prisma/client';

export const paperApplicationFactory = (
  i: number,
): Prisma.PaperApplicationsCreateInput => ({
  language: LanguagesEnum.en,
  assets: {
    create: {
      fileId: `paperApplication ${i} asset fileId`,
      label: `paperApplication ${i} asset label`,
    },
  },
});
