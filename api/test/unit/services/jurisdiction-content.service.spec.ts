import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LanguagesEnum, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { JurisdictionContentService } from '../../../src/services/jurisdiction-content.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { User } from '../../../src/dtos/users/user.dto';

describe('Testing jurisdiction content service', () => {
  let service: JurisdictionContentService;
  let prisma: PrismaService;
  let permissionServiceMock;
  let mockConsoleWarn;
  const adminUser = { id: 'admin-user' } as User;

  beforeEach(async () => {
    permissionServiceMock = { canOrThrow: jest.fn() };
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JurisdictionContentService,
        PrismaService,
        { provide: PermissionService, useValue: permissionServiceMock },
      ],
    }).compile();

    service = module.get<JurisdictionContentService>(
      JurisdictionContentService,
    );
    prisma = module.get<PrismaService>(PrismaService);
    // Every read/write asserts the jurisdiction exists; default it to found.
    prisma.jurisdictions.findFirst = jest
      .fn()
      .mockResolvedValue({ id: 'jurisdiction' });
  });

  afterEach(() => {
    mockConsoleWarn.mockRestore();
  });

  describe('getMergedContent', () => {
    it('folds the language row over the English default field by field', async () => {
      const jurisdictionId = randomUUID();
      prisma.jurisdictionContent.findMany = jest.fn().mockResolvedValueOnce([
        {
          language: LanguagesEnum.en,
          contact: { phone: '555-0100', email: 'help@bloom.gov' },
          faq: {
            categories: [
              {
                id: 'general',
                title: 'General',
                items: [
                  { id: 'a', question: 'What?', answerHtml: '<p>EN A</p>' },
                ],
              },
            ],
          },
        },
        {
          language: LanguagesEnum.es,
          contact: { email: 'ayuda@bloom.gov' },
          faq: {
            categories: [
              {
                id: 'general',
                items: [{ id: 'a', answerHtml: '<p>ES A</p>' }],
              },
            ],
          },
        },
      ]);

      const merged = await service.getMergedContent(
        jurisdictionId,
        LanguagesEnum.es,
      );

      expect(merged.contact).toEqual({
        phone: '555-0100',
        email: 'ayuda@bloom.gov',
        // The reused sanitizer normalizes an absent optional HTML field to null on read.
        addressHtml: null,
      });
      expect(merged.faq).toEqual({
        categories: [
          {
            id: 'general',
            title: 'General',
            items: [{ id: 'a', question: 'What?', answerHtml: '<p>ES A</p>' }],
          },
        ],
      });
      // English-only read reads a single language.
      expect(prisma.jurisdictionContent.findMany).toHaveBeenCalledWith({
        where: {
          jurisdictionId,
          language: { in: [LanguagesEnum.en, LanguagesEnum.es] },
        },
        select: {
          language: true,
          footer: true,
          faq: true,
          resources: true,
          disclaimers: true,
          contact: true,
        },
      });
      expect(mockConsoleWarn).not.toHaveBeenCalled();
    });

    it('reads only English when the requested language is en', async () => {
      prisma.jurisdictionContent.findMany = jest
        .fn()
        .mockResolvedValueOnce([
          { language: LanguagesEnum.en, contact: { phone: '555-0100' } },
        ]);

      await service.getMergedContent(randomUUID(), LanguagesEnum.en);

      expect(prisma.jurisdictionContent.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            language: { in: [LanguagesEnum.en] },
          }),
        }),
      );
    });

    it('returns null when the jurisdiction has no content row at all', async () => {
      prisma.jurisdictionContent.findMany = jest.fn().mockResolvedValueOnce([]);

      expect(
        await service.getMergedContent(randomUUID(), LanguagesEnum.es),
      ).toBeNull();
    });

    it('throws a 404 for an unknown jurisdiction before reading content', async () => {
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValueOnce(null);
      prisma.jurisdictionContent.findMany = jest.fn();

      await expect(
        service.getMergedContent(randomUUID(), LanguagesEnum.en),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.jurisdictionContent.findMany).not.toHaveBeenCalled();
    });

    it('sanitizes stored html on read, whatever wrote the row', async () => {
      prisma.jurisdictionContent.findMany = jest.fn().mockResolvedValueOnce([
        {
          language: LanguagesEnum.en,
          disclaimers: {
            disclaimerHtml:
              '<p onclick="alert(1)">Notice</p><script>alert(2)</script>',
          },
          footer: {
            textSectionsHtml: ['<a href="javascript:alert(3)">Link</a>'],
          },
          faq: {
            categories: [
              {
                id: 'general',
                items: [
                  {
                    id: 'a',
                    question: 'What?',
                    answerHtml: '<img src="x" onerror="alert(4)"><b>Answer</b>',
                  },
                ],
              },
            ],
          },
        },
      ]);

      const merged = await service.getMergedContent(
        randomUUID(),
        LanguagesEnum.en,
      );

      expect(merged.disclaimers.disclaimerHtml).toEqual('<p>Notice</p>');
      expect(merged.footer.textSectionsHtml).toEqual(['<a>Link</a>']);
      expect(merged.faq.categories[0].items[0].answerHtml).toEqual(
        '<b>Answer</b>',
      );
    });
    it('logs a warning without throwing when a stored row is malformed', async () => {
      prisma.jurisdictionContent.findMany = jest.fn().mockResolvedValueOnce([
        {
          language: LanguagesEnum.en,
          // answerHtml missing -> read-time shape guard warns
          faq: { categories: [{ id: 'general', items: [{ id: 'a' }] }] },
        },
      ]);

      const merged = await service.getMergedContent(
        randomUUID(),
        LanguagesEnum.en,
      );

      expect(merged).not.toBeNull();
      expect(mockConsoleWarn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMergedContentByName', () => {
    it('resolves the jurisdiction by name and returns its merged content', async () => {
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue({ id: 'jurisdiction' });
      prisma.jurisdictionContent.findMany = jest
        .fn()
        .mockResolvedValueOnce([
          { language: LanguagesEnum.en, contact: { phone: '555-0100' } },
        ]);

      const merged = await service.getMergedContentByName(
        'Bloomington',
        LanguagesEnum.en,
      );

      expect(merged.contact).toEqual(
        expect.objectContaining({ phone: '555-0100' }),
      );
      expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
        where: { name: 'Bloomington' },
        select: { id: true },
      });
    });

    it('throws a 404 for an unknown jurisdiction name', async () => {
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValueOnce(null);
      prisma.jurisdictionContent.findMany = jest.fn();

      await expect(
        service.getMergedContentByName('Nowhere', LanguagesEnum.en),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.jurisdictionContent.findMany).not.toHaveBeenCalled();
    });
  });

  describe('getContent', () => {
    it('returns the row after a permission check', async () => {
      const jurisdictionId = randomUUID();
      prisma.jurisdictionContent.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ id: 'row', jurisdictionId, language: 'en' });

      const row = await service.getContent(
        jurisdictionId,
        LanguagesEnum.en,
        adminUser,
      );

      expect(row.id).toEqual('row');
      expect(permissionServiceMock.canOrThrow).toHaveBeenCalledWith(
        adminUser,
        'jurisdictionContent',
        'read',
        { jurisdictionId },
      );
    });

    it('sanitizes stored html on read', async () => {
      prisma.jurisdictionContent.findFirst = jest.fn().mockResolvedValueOnce({
        id: 'row',
        jurisdictionId: 'jurisdiction',
        language: 'en',
        disclaimers: { privacyHtml: '<p onclick="alert(1)">Privacy</p>' },
      });

      const row = await service.getContent(
        randomUUID(),
        LanguagesEnum.en,
        adminUser,
      );

      expect(row.disclaimers.privacyHtml).toEqual('<p>Privacy</p>');
    });

    it('returns null when no row exists for that language', async () => {
      prisma.jurisdictionContent.findFirst = jest
        .fn()
        .mockResolvedValueOnce(null);

      expect(
        await service.getContent(randomUUID(), LanguagesEnum.es, adminUser),
      ).toBeNull();
    });

    it('propagates a permission rejection', async () => {
      permissionServiceMock.canOrThrow.mockRejectedValueOnce(new Error('nope'));

      await expect(
        service.getContent(randomUUID(), LanguagesEnum.en, adminUser),
      ).rejects.toThrow('nope');
    });
  });

  describe('updateContent', () => {
    it('creates the row when there is no prior version (no lock sent)', async () => {
      const jurisdictionId = randomUUID();
      prisma.jurisdictionContent.create = jest.fn().mockResolvedValueOnce({});
      prisma.jurisdictionContent.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ id: 'row', jurisdictionId, language: 'en' });

      const row = await service.updateContent(
        jurisdictionId,
        LanguagesEnum.en,
        { contact: { phone: '555-0100' } },
        adminUser,
      );

      expect(row.id).toEqual('row');
      expect(prisma.jurisdictionContent.create).toHaveBeenCalledTimes(1);
      expect(permissionServiceMock.canOrThrow).toHaveBeenCalledWith(
        adminUser,
        'jurisdictionContent',
        'update',
        { jurisdictionId },
      );
    });

    it('updates the row when the optimistic lock matches', async () => {
      const lastUpdatedAt = new Date('2026-01-01');
      prisma.jurisdictionContent.updateMany = jest
        .fn()
        .mockResolvedValueOnce({ count: 1 });
      prisma.jurisdictionContent.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ id: 'row' });
      prisma.jurisdictionContent.create = jest.fn();

      await service.updateContent(
        randomUUID(),
        LanguagesEnum.es,
        { lastUpdatedAt, contact: { phone: '555-0199' } },
        adminUser,
      );

      expect(prisma.jurisdictionContent.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ updatedAt: lastUpdatedAt }),
        }),
      );
      expect(prisma.jurisdictionContent.create).not.toHaveBeenCalled();
    });

    it('throws a 409 when the lock is stale and the row still exists', async () => {
      prisma.jurisdictionContent.updateMany = jest
        .fn()
        .mockResolvedValueOnce({ count: 0 });
      prisma.jurisdictionContent.findFirst = jest
        .fn()
        .mockResolvedValueOnce({ id: 'row' });
      prisma.jurisdictionContent.create = jest.fn();

      await expect(
        service.updateContent(
          randomUUID(),
          LanguagesEnum.es,
          { lastUpdatedAt: new Date('2000-01-01'), contact: {} },
          adminUser,
        ),
      ).rejects.toThrow(ConflictException);
      expect(prisma.jurisdictionContent.create).not.toHaveBeenCalled();
    });

    it('throws a 409 when no lock is sent but a row was created concurrently', async () => {
      prisma.jurisdictionContent.create = jest.fn().mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError('duplicate', {
          code: 'P2002',
          clientVersion: 'test',
        }),
      );

      await expect(
        service.updateContent(
          randomUUID(),
          LanguagesEnum.en,
          { contact: {} },
          adminUser,
        ),
      ).rejects.toThrow(ConflictException);
    });

    it('throws a 409 when the row is deleted between the write and the re-read', async () => {
      const lastUpdatedAt = new Date('2026-01-01');
      prisma.jurisdictionContent.updateMany = jest
        .fn()
        .mockResolvedValueOnce({ count: 1 });
      // The post-write re-read finds nothing: a concurrent delete landed in between.
      prisma.jurisdictionContent.findFirst = jest
        .fn()
        .mockResolvedValueOnce(null);

      await expect(
        service.updateContent(
          randomUUID(),
          LanguagesEnum.es,
          { lastUpdatedAt, contact: { phone: '555-0000' } },
          adminUser,
        ),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('listContent', () => {
    it('lists the jurisdiction rows after a permission check', async () => {
      const jurisdictionId = randomUUID();
      prisma.jurisdictionContent.findMany = jest.fn().mockResolvedValueOnce([
        { id: 'row-en', jurisdictionId, language: 'en' },
        { id: 'row-es', jurisdictionId, language: 'es' },
      ]);

      const rows = await service.listContent(jurisdictionId, adminUser);

      expect(rows).toHaveLength(2);
      expect(permissionServiceMock.canOrThrow).toHaveBeenCalledWith(
        adminUser,
        'jurisdictionContent',
        'read',
        { jurisdictionId },
      );
      expect(prisma.jurisdictionContent.findMany).toHaveBeenCalledWith({
        where: { jurisdictionId },
        orderBy: { language: 'asc' },
      });
    });
  });
});
