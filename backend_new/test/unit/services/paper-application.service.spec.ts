import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { PaperApplicationService } from '../../../src/services/paper-application.service';
import { PaperApplicationCreate } from '../../../src/dtos/paper-applications/paper-application-create.dto';
import { LanguagesEnum } from '@prisma/client';

describe('Testing paper application service', () => {
  let service: PaperApplicationService;
  let prisma: PrismaService;

  const mockPaperApplication = (position: number, date: Date) => {
    return {
      id: `paper application id ${position}`,
      language: LanguagesEnum.en,
      assets: {
        id: `paper application ${position} assets`,
        createdAt: date,
        updatedAt: date,
        fileId: `paper application ${position} assets fileId`,
        label: `paper application ${position} assets label`,
      },
      createdAt: date,
      updatedAt: date,
    };
  };

  const mockPaperApplicationSet = (numberToCreate: number, date: Date) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockPaperApplication(i, date));
    }
    return toReturn;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaperApplicationService, PrismaService],
    }).compile();

    service = module.get<PaperApplicationService>(PaperApplicationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing list()', async () => {
    const date = new Date();
    prisma.paperApplications.findMany = jest
      .fn()
      .mockResolvedValue(mockPaperApplicationSet(3, date));

    expect(await service.list()).toEqual([
      {
        id: `paper application id 0`,
        language: LanguagesEnum.en,
        assets: {
          id: 'paper application 0 assets',
          createdAt: date,
          updatedAt: date,
          fileId: 'paper application 0 assets fileId',
          label: 'paper application 0 assets label',
        },
        createdAt: date,
        updatedAt: date,
      },
      {
        id: 'paper application id 1',
        language: LanguagesEnum.en,
        assets: {
          id: 'paper application 1 assets',
          createdAt: date,
          updatedAt: date,
          fileId: 'paper application 1 assets fileId',
          label: 'paper application 1 assets label',
        },
        createdAt: date,
        updatedAt: date,
      },
      {
        id: 'paper application id 2',
        language: LanguagesEnum.en,
        assets: {
          id: 'paper application 2 assets',
          createdAt: date,
          updatedAt: date,
          fileId: 'paper application 2 assets fileId',
          label: 'paper application 2 assets label',
        },
        createdAt: date,
        updatedAt: date,
      },
    ]);

    expect(prisma.paperApplications.findMany).toHaveBeenCalledWith({
      include: { assets: true },
    });
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();

    prisma.paperApplications.findFirst = jest
      .fn()
      .mockResolvedValue(mockPaperApplication(3, date));

    expect(await service.findOne('example Id')).toEqual({
      id: `paper application id 3`,
      language: LanguagesEnum.en,
      assets: {
        id: 'paper application 3 assets',
        createdAt: date,
        updatedAt: date,
        fileId: 'paper application 3 assets fileId',
        label: 'paper application 3 assets label',
      },
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.paperApplications.findFirst).toHaveBeenCalledWith({
      include: { assets: true },
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.paperApplications.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError();

    expect(prisma.paperApplications.findFirst).toHaveBeenCalledWith({
      include: { assets: true },
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();

    prisma.paperApplications.create = jest
      .fn()
      .mockResolvedValue(mockPaperApplication(3, date));

    const params: PaperApplicationCreate = {
      assets: {
        fileId: 'paper application 3 assets fileId',
        label: 'paper application 3 assets label',
      },
      language: LanguagesEnum.en,
    };

    expect(await service.create(params)).toEqual({
      id: `paper application id 3`,
      language: LanguagesEnum.en,
      assets: {
        id: 'paper application 3 assets',
        createdAt: date,
        updatedAt: date,
        fileId: 'paper application 3 assets fileId',
        label: 'paper application 3 assets label',
      },
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.paperApplications.create).toHaveBeenCalledWith({
      include: { assets: true },
      data: {
        assets: {
          create: {
            fileId: 'paper application 3 assets fileId',
            label: 'paper application 3 assets label',
          },
        },
        language: LanguagesEnum.en,
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();

    const mockedPaperApplication = mockPaperApplication(3, date);

    prisma.paperApplications.findFirst = jest
      .fn()
      .mockResolvedValue(mockedPaperApplication);
    prisma.paperApplications.update = jest.fn().mockResolvedValue({
      ...mockedPaperApplication,
      assets: {
        ...mockedPaperApplication.assets,
        fileId: 'paper application 4 assets fileId',
        label: 'paper application 4 assets label',
        id: 'paper application 4 assets',
      },
      language: LanguagesEnum.es,
    });
    prisma.assets.delete = jest.fn().mockResolvedValue(true);

    const params: PaperApplicationCreate = {
      id: `paper application id 3`,
      assets: {
        fileId: 'paper application 4 assets fileId',
        label: 'paper application 4 assets label',
      },
      language: LanguagesEnum.es,
    };

    expect(await service.update(params)).toEqual({
      id: `paper application id 3`,
      language: LanguagesEnum.es,
      assets: {
        id: 'paper application 4 assets',
        createdAt: date,
        updatedAt: date,
        fileId: 'paper application 4 assets fileId',
        label: 'paper application 4 assets label',
      },
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.paperApplications.findFirst).toHaveBeenCalledWith({
      include: { assets: true },
      where: {
        id: 'paper application id 3',
      },
    });

    expect(prisma.paperApplications.update).toHaveBeenCalledWith({
      include: { assets: true },
      data: {
        assets: {
          create: {
            fileId: 'paper application 4 assets fileId',
            label: 'paper application 4 assets label',
          },
        },
        language: LanguagesEnum.es,
      },
      where: {
        id: 'paper application id 3',
      },
    });

    expect(prisma.assets.delete).toHaveBeenCalledWith({
      where: {
        id: 'paper application 3 assets',
      },
    });
  });

  it('testing update() existing record not found', async () => {
    prisma.paperApplications.findFirst = jest.fn().mockResolvedValue(null);
    prisma.paperApplications.update = jest.fn().mockResolvedValue(null);

    const params: PaperApplicationCreate = {
      id: 'paper application id 3',
      assets: {
        fileId: 'paper application 4 assets fileId',
        label: 'paper application 4 assets label',
      },
      language: LanguagesEnum.es,
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(prisma.paperApplications.findFirst).toHaveBeenCalledWith({
      include: { assets: true },
      where: {
        id: 'paper application id 3',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    prisma.paperApplications.delete = jest
      .fn()
      .mockResolvedValue(mockPaperApplication(3, date));

    prisma.assets.delete = jest.fn().mockResolvedValue(true);

    expect(await service.delete('example Id')).toEqual({
      success: true,
    });

    expect(prisma.paperApplications.delete).toHaveBeenCalledWith({
      include: { assets: true },
      where: {
        id: 'example Id',
      },
    });

    expect(prisma.assets.delete).toHaveBeenCalledWith({
      where: {
        id: 'paper application 3 assets',
      },
    });
  });
});
