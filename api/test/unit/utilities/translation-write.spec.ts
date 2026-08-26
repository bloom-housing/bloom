import { LanguagesEnum, Prisma } from '@prisma/client';
import {
  emailTranslationScope,
  hasMigratedTranslations,
  writeTranslationRows,
} from '../../../src/utilities/translation-write';

const conflict = () =>
  new Prisma.PrismaClientKnownRequestError('unique constraint', {
    code: 'P2002',
    clientVersion: 'test',
  });

const prismaMock = (overrides = {}) => ({
  translationStrings: {
    count: jest.fn().mockResolvedValue(0),
    updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    create: jest.fn().mockResolvedValue({}),
    ...overrides,
  },
});

describe('emailTranslationScope', () => {
  it('writes at the generic scope, which every jurisdiction reads through', () => {
    expect(emailTranslationScope(LanguagesEnum.es)).toEqual({
      jurisdictionId: null,
      language: LanguagesEnum.es,
      site: null,
    });
  });
});

describe('hasMigratedTranslations', () => {
  it('is false while only the blob holds the base strings', async () => {
    const prisma = prismaMock();

    expect(await hasMigratedTranslations(prisma)).toBe(false);
  });

  it('is true once the English base rows exist', async () => {
    const prisma = prismaMock({ count: jest.fn().mockResolvedValue(1) });

    expect(await hasMigratedTranslations(prisma)).toBe(true);
    expect(prisma.translationStrings.count).toHaveBeenCalledWith({
      where: { jurisdictionId: null, language: LanguagesEnum.en, site: null },
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

  it('raises anything that is not a duplicate key', async () => {
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
