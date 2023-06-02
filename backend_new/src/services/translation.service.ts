import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LanguagesEnum } from '@prisma/client';

@Injectable()
export class TranslationService {
  constructor(private prisma: PrismaService) {}

  public async getTranslationByLanguageAndJurisdictionOrDefaultEn(
    language: LanguagesEnum,
    jurisdictionId: string | null,
  ) {
    const translations = await this.prisma.translations.findUnique({
      where: {
        jurisdictionId_language: { language, jurisdictionId },
      },
    });
    // TODO: cover scenario where language/jurisdictionId combo doesn't exist and needs to fall back to english
    return translations;
  }
}
