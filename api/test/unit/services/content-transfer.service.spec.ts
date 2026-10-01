import { HttpService } from '@nestjs/axios';
import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  LanguagesEnum,
  Prisma,
  SiteEnum,
  TranslationOrigin,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { of, throwError } from 'rxjs';
import { ContentTransferService } from '../../../src/services/content-transfer.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { User } from '../../../src/dtos/users/user.dto';
import { ContentTransferImport } from '../../../src/dtos/content-transfer/content-transfer-file.dto';
import { sourceHash } from '../../../src/utilities/translation-source-hash';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';

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
      for (const type of ['translation', 'jurisdictionContent']) {
        expect(permissionServiceMock.canOrThrow).toHaveBeenCalledWith(
          adminUser,
          type,
          'read',
          { jurisdictionId },
        );
      }
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
      expect(permissionServiceMock.canOrThrow).toHaveBeenCalledWith(
        adminUser,
        'translation',
        'read',
        { jurisdictionId: undefined },
      );
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
              ? {
                  id: 'target-id',
                  brand: { primary: { base: '#000000' }, fontFamily: 'Inter' },
                  brandLogo: { fileId: 'old-logo' },
                  brandFavicon: { fileId: 'old-favicon' },
                }
              : null,
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

    it.each([
      ['format', { format: 'another-format' }],
      ['version', { version: 2 }],
    ])('refuses a file of another %s', async (_label, extra) => {
      mockTarget();

      await expect(
        service.previewImport(importFile(extra), adminUser),
      ).rejects.toThrow(
        'the file is not a version 1 bloom-content-transfer export',
      );
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
          {
            jurisdictionId: 'target-id',
            language: LanguagesEnum.en,
            footer: {
              logo: { logoFileId: 'new-footer-logo', logoAltText: 'Seal' },
            },
            faq: Prisma.DbNull,
            resources: Prisma.DbNull,
            disclaimers: { privacyHtml: '<p>Privacy</p>' },
            contact: Prisma.DbNull,
          },
          {
            jurisdictionId: 'target-id',
            language: LanguagesEnum.es,
            footer: Prisma.DbNull,
            faq: Prisma.DbNull,
            resources: Prisma.DbNull,
            disclaimers: {
              privacyHtml: '<p>Privacidad</p>',
              _sourceHashes: { privacyHtml: hash },
            },
            contact: Prisma.DbNull,
          },
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

    it('counts a string whose origin or source hash differs as changed', async () => {
      mockTarget();
      prisma.translationStrings.findMany = jest
        .fn()
        .mockResolvedValue([
          { ...translationRow, origin: TranslationOrigin.human },
        ]);

      const preview = await service.previewImport(
        importFile({ translations: [translationRow] }),
        adminUser,
      );

      expect(preview.translations).toEqual([
        expect.objectContaining({ added: 0, changed: 1, removed: 0 }),
      ]);
    });

    it('leaves a footer whose only difference is its logo key unchanged', async () => {
      mockTarget();
      prisma.jurisdictionContent.findMany = jest.fn().mockResolvedValue([
        {
          language: LanguagesEnum.en,
          footer: { logo: { logoFileId: 'target-logo', logoAltText: 'Seal' } },
          disclaimers: { privacyHtml: '<p>Privacy</p>' },
        },
      ]);

      const preview = await service.previewImport(
        importFile({ content: [importFile().content[0]] }),
        adminUser,
      );

      expect(preview.content).toEqual([]);
    });

    it('refuses source hashes for a field the document does not have', async () => {
      mockTarget();

      await expect(
        service.previewImport(
          importFile({
            content: [
              {
                language: LanguagesEnum.es,
                disclaimers: {
                  privacyHtml: '<p>Privacidad</p>',
                  _sourceHashes: { disclaimerHtml: hash },
                },
              },
            ],
          }),
          adminUser,
        ),
      ).rejects.toThrow('has malformed source hashes');
    });

    it('refuses an uploaded key the footer logo editor would not accept', async () => {
      mockTarget();
      mockWrites();

      await expect(
        service.applyImport(
          importFile({
            fileIds: {
              'brand-logo': 'new-brand-logo',
              'footer-logo': 'k'.repeat(257),
            },
          }),
          adminUser,
        ),
      ).rejects.toThrow('file footer-logo was not uploaded');
    });

    it('drops the image address a footer logo with an upload derives', async () => {
      mockTarget();
      mockWrites();
      const file = importFile({
        fileIds: {
          'brand-logo': 'new-brand-logo',
          'footer-logo': 'new-footer-logo',
        },
      });
      file.content[0].footer = {
        logo: {
          logoFileId: 'footer-logo',
          logoSrc: 'https://example.test/footer-logo.png',
        },
      };

      await service.applyImport(file, adminUser);

      const rows = (prisma.jurisdictionContent.createMany as jest.Mock).mock
        .calls[0][0].data;
      expect(rows[0].footer).toEqual({
        logo: { logoFileId: 'new-footer-logo' },
      });
    });

    it("keeps a translated logo current when the English logo's key changes", async () => {
      mockTarget();
      mockWrites();
      const file = importFile({
        fileIds: {
          'brand-logo': 'new-brand-logo',
          'footer-logo': 'new-footer-logo',
          'spanish-logo': 'new-spanish-logo',
          'older-logo': 'new-older-logo',
        },
      });
      file.content[1].footer = {
        logo: {
          logoFileId: 'spanish-logo',
          _sourceHashes: { logoFileId: sourceHash('footer-logo') },
        },
      };
      file.content.push({
        language: LanguagesEnum.vi,
        footer: {
          logo: {
            logoFileId: 'older-logo',
            _sourceHashes: { logoFileId: sourceHash('older-english-logo') },
          },
        },
      });

      await service.applyImport(file, adminUser);

      const rows = (prisma.jurisdictionContent.createMany as jest.Mock).mock
        .calls[0][0].data;
      expect(rows[1].footer.logo).toEqual({
        logoFileId: 'new-spanish-logo',
        _sourceHashes: { logoFileId: sourceHash('new-footer-logo') },
      });
      // A translation that was already out of date stays out of date.
      expect(rows[2].footer.logo._sourceHashes).toEqual({
        logoFileId: sourceHash('older-english-logo'),
      });
    });

    it.each([
      [
        'a string that appears twice',
        { translations: [translationRow, translationRow] },
        'translation public|es|nav.listings appears twice',
      ],
      [
        'a language that appears twice',
        {
          content: [
            { language: LanguagesEnum.en },
            { language: LanguagesEnum.en },
          ],
        },
        'content for en appears twice',
      ],
      [
        'a footer logo key that is not a storage key',
        {
          content: [
            {
              language: LanguagesEnum.en,
              footer: { logo: { logoFileId: '../logo' } },
            },
          ],
        },
        'file ids ../logo are not usable storage keys',
      ],
      [
        'a brand logo key that is not a storage key',
        {
          brand: { brand: null, logoFileId: 'logo?x=1', faviconFileId: null },
        },
        'file ids logo?x=1 are not usable storage keys',
      ],
      [
        'a brand the branding editor would refuse',
        {
          brand: {
            brand: { primary: { base: 'purple' } },
            logoFileId: null,
            faviconFileId: null,
          },
        },
        'the brand is not valid',
      ],
      [
        'a font the font url does not serve',
        {
          brand: {
            brand: {
              primary: { base: '#773E98' },
              fontFamily: 'Inter',
              fontUrl: 'https://fonts.googleapis.com/css2?family=Inter',
            },
            logoFileId: null,
            faviconFileId: null,
          },
        },
        'does not serve the font family Inter',
      ],
    ])('refuses %s', async (_label, extra, message) => {
      mockTarget();

      await expect(
        service.previewImport(importFile(extra), adminUser),
      ).rejects.toThrow(message);
    });

    it('refuses an uploaded key that is not a storage key', async () => {
      mockTarget();
      mockWrites();

      await expect(
        service.applyImport(
          importFile({
            fileIds: { 'brand-logo': 'new-brand-logo', 'footer-logo': '../x' },
          }),
          adminUser,
        ),
      ).rejects.toThrow('file footer-logo was not uploaded');
    });

    it('groups string changes by site and language, leaving identical rows out', async () => {
      mockTarget();
      prisma.translationStrings.findMany = jest
        .fn()
        .mockResolvedValue([
          translationRow,
          { ...translationRow, site: SiteEnum.email, key: 'email.gone' },
        ]);

      const preview = await service.previewImport(
        importFile({
          translations: [
            translationRow,
            { ...translationRow, language: LanguagesEnum.en, key: 'nav.new' },
          ],
        }),
        adminUser,
      );

      expect(preview.translations).toEqual([
        {
          site: SiteEnum.email,
          language: LanguagesEnum.es,
          added: 0,
          changed: 0,
          removed: 1,
        },
        {
          site: SiteEnum.public,
          language: LanguagesEnum.en,
          added: 1,
          changed: 0,
          removed: 0,
        },
      ]);
    });

    it('leaves content and branding alone when the file has neither', async () => {
      mockTarget();
      mockWrites();
      const file = importFile();
      delete file.content;
      delete file.brand;

      const preview = await service.previewImport(file, adminUser);
      await service.applyImport(file, adminUser);

      expect(preview.content).toEqual([]);
      expect(preview).not.toHaveProperty('brand');
      expect(prisma.jurisdictionContent.deleteMany).not.toHaveBeenCalled();
      expect(prisma.jurisdictions.update).not.toHaveBeenCalled();
    });

    it('reports a logo the target does not have yet as added', async () => {
      mockTarget();
      (prisma.jurisdictions.findFirst as jest.Mock).mockResolvedValue({
        id: 'target-id',
        brand: null,
        brandLogo: null,
        brandFavicon: null,
      });

      const preview = await service.previewImport(importFile(), adminUser);

      expect(preview.brand).toEqual({
        fields: ['primary'],
        logo: 'added',
        favicon: null,
      });
    });

    it('checks only update access to translations for a global file', async () => {
      mockTarget();

      await service.previewImport(
        importFile({
          jurisdictionName: null,
          translations: [{ ...translationRow, site: SiteEnum.partners }],
        }),
        adminUser,
      );

      expect(permissionServiceMock.canOrThrow.mock.calls).toEqual([
        [adminUser, 'translation', 'update', { jurisdictionId: undefined }],
      ]);
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

  describe('file validation', () => {
    // The same options the controller's validation pipe uses.
    const errorsFor = async (body: Record<string, unknown>) =>
      validate(
        plainToClass(ContentTransferImport, body, {
          excludeExtraneousValues: true,
        }),
        {
          groups: [ValidationsGroupsEnum.default],
          forbidUnknownValues: true,
          skipMissingProperties: true,
        },
      );

    const validFile = {
      format: 'bloom-content-transfer',
      version: 1,
      jurisdictionName: 'Bloomington',
      translations: [translationRow],
    };

    const translationErrors = async (row: Record<string, unknown>) => {
      const errors = await errorsFor({ ...validFile, translations: [row] });
      return errors.flatMap((error) =>
        (error.children ?? []).flatMap((child) =>
          (child.children ?? []).map((field) => field.property),
        ),
      );
    };

    it('accepts an exported file', async () => {
      expect(await errorsFor(validFile)).toEqual([]);
    });

    it('requires the format, version and translations', async () => {
      const errors = await errorsFor({ jurisdictionName: 'Bloomington' });

      expect(errors.map((error) => error.property).sort()).toEqual([
        'format',
        'translations',
        'version',
      ]);
    });

    it.each([
      ['a missing value', { ...translationRow, value: null }, 'value'],
      ['a missing key', { ...translationRow, key: undefined }, 'key'],
      ['a missing language', { ...translationRow, language: null }, 'language'],
      [
        'an over-length key',
        { ...translationRow, key: 'k'.repeat(256) },
        'key',
      ],
      [
        'an over-length value',
        { ...translationRow, value: 'v'.repeat(5001) },
        'value',
      ],
      [
        'executable markup',
        { ...translationRow, value: '<script>alert(1)</script>' },
        'value',
      ],
      [
        'a malformed source hash',
        { ...translationRow, sourceHash: 'not-a-hash' },
        'sourceHash',
      ],
    ])('refuses a translation with %s', async (_label, row, field) => {
      expect(await translationErrors(row)).toEqual([field]);
    });
  });
});
