import { HttpService } from '@nestjs/axios';
import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguagesEnum, SiteEnum, TranslationOrigin } from '@prisma/client';
import { randomUUID } from 'crypto';
import { of, throwError } from 'rxjs';
import { ContentTransferService } from '../../../src/services/content-transfer.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { User } from '../../../src/dtos/users/user.dto';

describe('Testing content transfer service', () => {
  let service: ContentTransferService;
  let prisma: PrismaService;
  let permissionServiceMock;
  let httpServiceMock;
  const adminUser = { id: 'admin-user' } as User;

  const translationRow = {
    site: SiteEnum.public,
    language: LanguagesEnum.es,
    key: 'nav.listings',
    value: 'Listados',
    origin: TranslationOrigin.machine,
    sourceHash: 'abc123',
  };

  const englishContent = {
    language: LanguagesEnum.en,
    footer: { logo: { logoFileId: 'footer-logo' } },
    faq: null,
    resources: null,
    disclaimers: { privacyHtml: '<p>Privacy</p>' },
    contact: null,
  };

  const spanishContent = {
    language: LanguagesEnum.es,
    footer: { logo: { logoFileId: 'brand-logo' } },
    faq: null,
    resources: null,
    disclaimers: {
      privacyHtml: '<p>Privacidad</p>',
      _sourceHashes: { privacyHtml: 'def456' },
    },
    contact: null,
  };

  const mockJurisdiction = () => {
    prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
      name: 'Bloomington',
      brand: { primary: { base: '#773E98' } },
      brandLogo: { fileId: 'brand-logo' },
      brandFavicon: null,
    });
    prisma.translationStrings.findMany = jest
      .fn()
      .mockResolvedValue([translationRow]);
    prisma.jurisdictionContent.findMany = jest
      .fn()
      .mockResolvedValue([englishContent, spanishContent]);
  };

  beforeEach(async () => {
    process.env.CLOUDINARY_CLOUD_NAME = 'exygy';
    delete process.env.S3_PUBLIC_BUCKET;
    delete process.env.S3_REGION;
    permissionServiceMock = { canOrThrow: jest.fn() };
    httpServiceMock = {
      get: jest.fn().mockImplementation((url: string) =>
        of({
          data: Buffer.from(`bytes of ${url.split('/').pop()}`),
          headers: { 'content-type': 'image/png' },
        }),
      ),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentTransferService,
        PrismaService,
        { provide: PermissionService, useValue: permissionServiceMock },
        { provide: HttpService, useValue: httpServiceMock },
      ],
    }).compile();

    service = module.get<ContentTransferService>(ContentTransferService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('exportJurisdiction', () => {
    it('exports translations, stored content, the brand and its files', async () => {
      mockJurisdiction();
      const jurisdictionId = randomUUID();

      const file = await service.exportJurisdiction(jurisdictionId, adminUser);

      expect(file).toEqual(
        expect.objectContaining({
          format: 'bloom-content-transfer',
          version: 1,
          jurisdictionName: 'Bloomington',
          translations: [translationRow],
          content: [englishContent, spanishContent],
          brand: {
            brand: { primary: { base: '#773E98' } },
            logoFileId: 'brand-logo',
            faviconFileId: null,
          },
        }),
      );
      expect(prisma.translationStrings.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { jurisdictionId } }),
      );
    });

    it('includes each referenced file once, read from its original url', async () => {
      mockJurisdiction();

      const file = await service.exportJurisdiction(randomUUID(), adminUser);

      expect(file.assets).toEqual([
        {
          fileId: 'brand-logo',
          contentType: 'image/png',
          data: Buffer.from('bytes of brand-logo').toString('base64'),
        },
        {
          fileId: 'footer-logo',
          contentType: 'image/png',
          data: Buffer.from('bytes of footer-logo').toString('base64'),
        },
      ]);
      expect(httpServiceMock.get).toHaveBeenCalledWith(
        'https://res.cloudinary.com/exygy/image/upload/brand-logo',
        expect.objectContaining({ responseType: 'arraybuffer' }),
      );
    });

    it('fails when a file cannot be read from storage', async () => {
      mockJurisdiction();
      httpServiceMock.get.mockReturnValue(
        throwError(() => new Error('not found')),
      );

      await expect(
        service.exportJurisdiction(randomUUID(), adminUser),
      ).rejects.toThrow(BadGatewayException);
    });

    it('throws a 404 for an unknown jurisdiction', async () => {
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.exportJurisdiction(randomUUID(), adminUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('checks translation and content access before reading', async () => {
      const jurisdictionId = randomUUID();
      prisma.jurisdictions.findFirst = jest.fn();
      permissionServiceMock.canOrThrow.mockRejectedValueOnce(new Error('nope'));

      await expect(
        service.exportJurisdiction(jurisdictionId, adminUser),
      ).rejects.toThrow('nope');
      expect(permissionServiceMock.canOrThrow).toHaveBeenCalledWith(
        adminUser,
        'translation',
        'read',
        { jurisdictionId },
      );
      expect(prisma.jurisdictions.findFirst).not.toHaveBeenCalled();
    });
  });

  describe('exportGlobal', () => {
    it('exports only the global partners and email strings', async () => {
      prisma.translationStrings.findMany = jest
        .fn()
        .mockResolvedValue([{ ...translationRow, site: SiteEnum.partners }]);

      const file = await service.exportGlobal(adminUser);

      expect(file).toEqual(
        expect.objectContaining({
          jurisdictionName: null,
          translations: [{ ...translationRow, site: SiteEnum.partners }],
          assets: [],
        }),
      );
      expect(file.content).toBeUndefined();
      expect(prisma.translationStrings.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            jurisdictionId: null,
            site: { in: [SiteEnum.partners, SiteEnum.email] },
          },
        }),
      );
    });
  });
});
