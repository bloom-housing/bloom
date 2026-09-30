import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguagesEnum, SiteEnum, TranslationOrigin } from '@prisma/client';
import { randomUUID } from 'crypto';
import { of, throwError } from 'rxjs';
import { ContentTransferService } from '../../../src/services/content-transfer.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { User } from '../../../src/dtos/users/user.dto';
import { ContentTransferImport } from '../../../src/dtos/content-transfer/content-transfer-file.dto';
import { sourceHash } from '../../../src/utilities/translation-source-hash';

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
    sourceHash: sourceHash('Listings'),
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

  describe('import', () => {
    const hash = sourceHash('Privacy');

    const importFile = (extra = {}) =>
      ({
        format: 'bloom-content-transfer',
        version: 1,
        jurisdictionName: 'Bloomington',
        translations: [
          translationRow,
          { ...translationRow, key: 'nav.new', value: 'Nuevo' },
        ],
        content: [
          {
            language: LanguagesEnum.en,
            footer: {
              logo: { logoFileId: 'footer-logo', logoAltText: 'Seal' },
            },
            disclaimers: { privacyHtml: '<p>Privacy</p>' },
          },
          {
            language: LanguagesEnum.es,
            disclaimers: {
              privacyHtml: '<p>Privacidad</p>',
              _sourceHashes: { privacyHtml: hash },
            },
          },
        ],
        brand: {
          brand: { primary: { base: '#773E98' } },
          logoFileId: 'brand-logo',
          faviconFileId: null,
        },
        ...extra,
      } as ContentTransferImport);

    const mockTarget = () => {
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockImplementation(({ where }) =>
          Promise.resolve(
            where.name === 'Bloomington'
              ? { id: 'target-id' }
              : where.name
              ? null
              : {
                  brand: { primary: { base: '#000000' }, fontFamily: 'Inter' },
                  brandLogo: { fileId: 'old-logo' },
                  brandFavicon: { fileId: 'old-favicon' },
                },
          ),
        );
      prisma.translationStrings.findMany = jest.fn().mockResolvedValue([
        { ...translationRow, value: 'Listas' },
        { ...translationRow, key: 'nav.old', value: 'Viejo' },
      ]);
      prisma.jurisdictionContent.findMany = jest.fn().mockResolvedValue([
        {
          language: LanguagesEnum.en,
          disclaimers: { privacyHtml: '<p>Old</p>' },
        },
        { language: LanguagesEnum.vi, disclaimers: null },
      ]);
    };

    const mockWrites = () => {
      prisma.$transaction = jest.fn().mockResolvedValue([]);
      prisma.translationStrings.deleteMany = jest.fn().mockReturnValue('op');
      prisma.translationStrings.createMany = jest.fn().mockReturnValue('op');
      prisma.jurisdictionContent.deleteMany = jest.fn().mockReturnValue('op');
      prisma.jurisdictionContent.createMany = jest.fn().mockReturnValue('op');
      prisma.jurisdictions.update = jest.fn().mockReturnValue('op');
    };

    it('previews what the import adds, changes and removes', async () => {
      mockTarget();

      const preview = await service.previewImport(importFile(), adminUser);

      expect(preview).toEqual({
        jurisdictionName: 'Bloomington',
        translations: [
          {
            site: SiteEnum.public,
            language: LanguagesEnum.es,
            added: 1,
            changed: 1,
            removed: 1,
          },
        ],
        content: [
          { language: LanguagesEnum.en, change: 'changed' },
          { language: LanguagesEnum.es, change: 'added' },
          { language: LanguagesEnum.vi, change: 'removed' },
        ],
        brand: {
          fields: ['fontFamily', 'primary'],
          logo: 'changed',
          favicon: 'removed',
        },
      });
    });

    it('checks update access to translations, content and the jurisdiction', async () => {
      mockTarget();

      await service.previewImport(importFile(), adminUser);

      for (const type of [
        'translation',
        'jurisdictionContent',
        'jurisdiction',
      ]) {
        expect(permissionServiceMock.canOrThrow).toHaveBeenCalledWith(
          adminUser,
          type,
          'update',
          { jurisdictionId: 'target-id' },
        );
      }
    });

    it('refuses a file of another format or version', async () => {
      mockTarget();

      await expect(
        service.previewImport(importFile({ version: 2 }), adminUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('refuses a jurisdiction this environment does not have', async () => {
      mockTarget();

      await expect(
        service.previewImport(
          importFile({ jurisdictionName: 'Lakeview' }),
          adminUser,
        ),
      ).rejects.toThrow('jurisdiction Lakeview does not exist');
    });

    it('refuses a global file with a string for the public site', async () => {
      mockTarget();

      await expect(
        service.previewImport(
          importFile({ jurisdictionName: null }),
          adminUser,
        ),
      ).rejects.toThrow('is not for the partners or email site');
    });

    it('refuses a translation with executable markup', async () => {
      mockTarget();

      await expect(
        service.previewImport(
          importFile({
            translations: [
              { ...translationRow, value: '<script>alert(1)</script>' },
            ],
          }),
          adminUser,
        ),
      ).rejects.toThrow('contains executable markup');
    });

    it('refuses content the editor would store differently', async () => {
      mockTarget();

      await expect(
        service.previewImport(
          importFile({
            content: [
              {
                language: LanguagesEnum.en,
                disclaimers: { privacyHtml: '<p onclick="x()">Privacy</p>' },
              },
            ],
          }),
          adminUser,
        ),
      ).rejects.toThrow('content en.disclaimers does not match');
    });

    it('refuses malformed source hashes', async () => {
      mockTarget();

      await expect(
        service.previewImport(
          importFile({
            content: [
              {
                language: LanguagesEnum.es,
                disclaimers: {
                  privacyHtml: '<p>Privacidad</p>',
                  _sourceHashes: { privacyHtml: 'not-a-hash' },
                },
              },
            ],
          }),
          adminUser,
        ),
      ).rejects.toThrow('has malformed source hashes');
    });

    it('refuses to apply before every referenced file is uploaded', async () => {
      mockTarget();
      mockWrites();

      await expect(
        service.applyImport(
          importFile({ fileIds: { 'brand-logo': 'new-brand-logo' } }),
          adminUser,
        ),
      ).rejects.toThrow('file footer-logo was not uploaded');
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('replaces everything the file covers in one transaction', async () => {
      mockTarget();
      mockWrites();

      await service.applyImport(
        importFile({
          fileIds: {
            'brand-logo': 'new-brand-logo',
            'footer-logo': 'new-footer-logo',
          },
        }),
        adminUser,
      );

      expect(prisma.$transaction).toHaveBeenCalledWith([
        'op',
        'op',
        'op',
        'op',
        'op',
      ]);
      expect(prisma.translationStrings.deleteMany).toHaveBeenCalledWith({
        where: { jurisdictionId: 'target-id' },
      });
      expect(prisma.translationStrings.createMany).toHaveBeenCalledWith({
        data: [
          { ...translationRow, jurisdictionId: 'target-id' },
          {
            ...translationRow,
            key: 'nav.new',
            value: 'Nuevo',
            jurisdictionId: 'target-id',
          },
        ],
      });
      expect(prisma.jurisdictionContent.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            jurisdictionId: 'target-id',
            language: LanguagesEnum.en,
            footer: {
              logo: { logoFileId: 'new-footer-logo', logoAltText: 'Seal' },
            },
          }),
          expect.objectContaining({
            language: LanguagesEnum.es,
            disclaimers: {
              privacyHtml: '<p>Privacidad</p>',
              _sourceHashes: { privacyHtml: hash },
            },
          }),
        ],
      });
      expect(prisma.jurisdictions.update).toHaveBeenCalledWith({
        where: { id: 'target-id' },
        data: {
          brand: { primary: { base: '#773E98' } },
          brandLogo: {
            create: { fileId: 'new-brand-logo', label: 'brandLogo' },
          },
          brandFavicon: { disconnect: true },
        },
      });
    });

    it('replaces only the global partners and email strings for a global file', async () => {
      mockTarget();
      mockWrites();

      await service.applyImport(
        importFile({
          jurisdictionName: null,
          translations: [{ ...translationRow, site: SiteEnum.partners }],
        }),
        adminUser,
      );

      expect(prisma.translationStrings.deleteMany).toHaveBeenCalledWith({
        where: {
          jurisdictionId: null,
          site: { in: [SiteEnum.partners, SiteEnum.email] },
        },
      });
      expect(prisma.jurisdictionContent.deleteMany).not.toHaveBeenCalled();
      expect(prisma.jurisdictions.update).not.toHaveBeenCalled();
    });
  });
});
