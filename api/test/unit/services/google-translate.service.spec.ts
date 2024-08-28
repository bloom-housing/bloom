import { Test, TestingModule } from '@nestjs/testing';
import { LanguagesEnum } from '@prisma/client';
import { Translate } from '@google-cloud/translate/build/src/v2';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { PrismaService } from '../../../src/services/prisma.service';
jest.mock('@google-cloud/translate/build/src/v2');

describe('GoogleTranslateService', () => {
  let service: GoogleTranslateService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, GoogleTranslateService],
    }).compile();

    service = module.get<GoogleTranslateService>(GoogleTranslateService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('isConfigured', () => {
    it('should return true if all variables are present', () => {
      process.env.GOOGLE_API_ID = 'api-id';
      process.env.GOOGLE_API_EMAIL = 'api-email';
      process.env.GOOGLE_API_KEY = 'api-key';
      expect(service.isConfigured()).toBe(true);
    });
    it('should return false if variables are not present', () => {
      delete process.env.GOOGLE_API_ID;
      delete process.env.GOOGLE_API_EMAIL;
      delete process.env.GOOGLE_API_KEY;
      expect(service.isConfigured()).toBe(false);
    });
  });
  describe('fetch', () => {
    it('should make the translate service', () => {
      process.env.GOOGLE_API_ID = 'api-id';
      process.env.GOOGLE_API_EMAIL = 'api-email';
      process.env.GOOGLE_API_KEY = 'api-key';

      service.fetch(
        ['listing.petPolicy', 'listing.unitAmenities'],
        LanguagesEnum.es,
      );

      expect(Translate).toHaveBeenCalledTimes(1);
    });
  });
});
