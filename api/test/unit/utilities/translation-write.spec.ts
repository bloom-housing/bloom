import { LanguagesEnum, Prisma } from '@prisma/client';
import { PrismaService } from '../../../src/services/prisma.service';
import {
  emailTranslationScope,
  flattenTranslationTree,
  hasMigratedTranslations,
  TRANSLATION_BACKFILL_MARKER_KEY,
  writeTranslationRows,
} from '../../../src/utilities/translation-write';

const conflict = () =>
  new Prisma.PrismaClientKnownRequestError('unique constraint', {
    code: 'P2002',
    clientVersion: 'test',
  });

const prismaMock = (overrides = {}) =>
  ({
    translationStrings: {
      count: jest.fn().mockResolvedValue(0),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      create: jest.fn().mockResolvedValue({}),
      ...overrides,
    },
  } as unknown as PrismaService);

describe('emailTranslationScope', () => {
  it('writes with no jurisdiction, so every jurisdiction gets the value', () => {
    expect(emailTranslationScope(LanguagesEnum.es)).toEqual({
      jurisdictionId: null,
      language: LanguagesEnum.es,
      site: null,
    });
  });
});

describe('flattenTranslationTree', () => {
  it('joins nested keys into the dotted path polyglot addresses', () => {
    expect(
      flattenTranslationTree({
        footer: { line1: 'Bloom', nested: { deep: 'Deep' } },
        top: 'Top',
      }),
    ).toEqual({
      'footer.line1': 'Bloom',
      'footer.nested.deep': 'Deep',
      top: 'Top',
    });
  });

  it('keeps an empty string, which is a value rather than an absence', () => {
    expect(flattenTranslationTree({ footer: { line1: '' } })).toEqual({
      'footer.line1': '',
    });
  });

  it('returns nothing for an empty tree', () => {
    expect(flattenTranslationTree({})).toEqual({});
  });

  // Payloads are strings and nested objects; anything else is a caller mistake.
  it.each([
    ['an array', { a: ['x', 'y'] }],
    ['a number', { a: 1 }],
    ['a boolean', { a: true }],
    ['null', { a: null }],
    ['undefined', { a: undefined }],
  ])('rejects %s, rather than storing it stringified', (_name, tree) => {
    expect(() => flattenTranslationTree(tree)).toThrow(/a/);
  });
});

describe('hasMigratedTranslations', () => {
  it('is false before the backfill has run', async () => {
    const prisma = prismaMock();

    expect(await hasMigratedTranslations(prisma)).toBe(false);
  });

  // Only the backfill writes the marker, so a script's own rows cannot make this true.
  it('is true once the backfill has left its marker', async () => {
    const prisma = prismaMock({ count: jest.fn().mockResolvedValue(1) });

    expect(await hasMigratedTranslations(prisma)).toBe(true);
    expect(prisma.translationStrings.count).toHaveBeenCalledWith({
      where: {
        jurisdictionId: null,
        language: LanguagesEnum.en,
        site: null,
        key: TRANSLATION_BACKFILL_MARKER_KEY,
      },
    });
  });
});

describe('writeTranslationRows', () => {
  const scope = emailTranslationScope(LanguagesEnum.en);

  it('updates a key that already has a row', async () => {
    const prisma = prismaMock({
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    });

    expect(
      await writeTranslationRows(prisma, scope, {
        'confirmation.header': 'Hi',
      }),
    ).toEqual(1);
    expect(prisma.translationStrings.updateMany).toHaveBeenCalledWith({
      where: { ...scope, key: 'confirmation.header' },
      data: { value: 'Hi' },
    });
    expect(prisma.translationStrings.create).not.toHaveBeenCalled();
  });

  it('creates a key that has no row yet', async () => {
    const prisma = prismaMock();

    expect(
      await writeTranslationRows(prisma, scope, {
        'confirmation.header': 'Hi',
      }),
    ).toEqual(1);
    expect(prisma.translationStrings.create).toHaveBeenCalledWith({
      data: { ...scope, key: 'confirmation.header', value: 'Hi' },
    });
  });

  it('retries as an update when a concurrent create won', async () => {
    const updateMany = jest
      .fn()
      .mockResolvedValueOnce({ count: 0 })
      .mockResolvedValueOnce({ count: 1 });
    const prisma = prismaMock({
      updateMany,
      create: jest.fn().mockRejectedValue(conflict()),
    });

    expect(
      await writeTranslationRows(prisma, scope, {
        'confirmation.header': 'Hi',
      }),
    ).toEqual(1);
    expect(updateMany).toHaveBeenCalledTimes(2);
  });

  it('rethrows an error that is not a duplicate key', async () => {
    const prisma = prismaMock({
      create: jest.fn().mockRejectedValue(new Error('connection lost')),
    });

    await expect(
      writeTranslationRows(prisma, scope, { 'confirmation.header': 'Hi' }),
    ).rejects.toThrow('connection lost');
  });

  it('writes every key it is given', async () => {
    const prisma = prismaMock();

    expect(
      await writeTranslationRows(prisma, scope, {
        'confirmation.header': 'Hi',
        'confirmation.body': 'Thanks',
      }),
    ).toEqual(2);
    expect(prisma.translationStrings.create).toHaveBeenCalledTimes(2);
  });

  it('does nothing when there is nothing to write', async () => {
    const prisma = prismaMock();

    expect(await writeTranslationRows(prisma, scope, {})).toEqual(0);
    expect(prisma.translationStrings.updateMany).not.toHaveBeenCalled();
  });
});
