import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UnitAccessibilityPriorityTypeService } from '../../../src/services/unit-accessibility-priority-type.service';
import { UnitAccessibilityPriorityTypeCreate } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create.dto';
import { UnitAccessibilityPriorityTypeUpdate } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-update.dto';
import { UnitAccessibilityPriorityType } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type.dto';
import { randomUUID } from 'crypto';
import { unitAccesibilityPriorityTypeAsArray } from '../../../prisma/seed-helpers/unit-accessibility-priority-type-factory';
import { UnitAccessibilityPriorityTypeEnum } from '@prisma/client';

describe('Testing unit accessibility priority type service', () => {
  let service: UnitAccessibilityPriorityTypeService;
  let prisma: PrismaService;

  const mockUnitAccessibilityPriorityType = (
    date: Date,
    uapType?: UnitAccessibilityPriorityTypeEnum,
  ) => {
    return {
      id: randomUUID(),
      name: uapType,
      createdAt: date,
      updatedAt: date,
    };
  };

  const mockUnitAccessibilityPriorityTypeSet = (
    numberToCreate: number,
    date: Date,
  ) => {
    return [...new Array(numberToCreate)].map((_, index) => {
      return mockUnitAccessibilityPriorityType(
        date,
        unitAccesibilityPriorityTypeAsArray[index],
      );
    });
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitAccessibilityPriorityTypeService, PrismaService],
    }).compile();

    service = module.get<UnitAccessibilityPriorityTypeService>(
      UnitAccessibilityPriorityTypeService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing list()', async () => {
    const date = new Date();
    const mockedValue = mockUnitAccessibilityPriorityTypeSet(3, date);
    prisma.unitAccessibilityPriorityTypes.findMany = jest
      .fn()
      .mockResolvedValue(mockedValue);

    expect(await service.list()).toEqual([
      {
        id: mockedValue[0].id,
        name: unitAccesibilityPriorityTypeAsArray[0],
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[1].id,
        name: unitAccesibilityPriorityTypeAsArray[1],
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[2].id,
        name: unitAccesibilityPriorityTypeAsArray[2],
        createdAt: date,
        updatedAt: date,
      },
    ]);

    expect(prisma.unitAccessibilityPriorityTypes.findMany).toHaveBeenCalled();
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();
    const mockedValue = mockUnitAccessibilityPriorityType(
      date,
      UnitAccessibilityPriorityTypeEnum.hearing,
    );
    prisma.unitAccessibilityPriorityTypes.findUnique = jest
      .fn()
      .mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual({
      id: mockedValue.id,
      name: UnitAccessibilityPriorityTypeEnum.hearing,
      createdAt: date,
      updatedAt: date,
    });

    expect(
      prisma.unitAccessibilityPriorityTypes.findUnique,
    ).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.unitAccessibilityPriorityTypes.findUnique = jest
      .fn()
      .mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError();

    expect(
      prisma.unitAccessibilityPriorityTypes.findUnique,
    ).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();
    const mockedValue = mockUnitAccessibilityPriorityType(
      date,
      UnitAccessibilityPriorityTypeEnum.mobilityAndHearing,
    );
    prisma.unitAccessibilityPriorityTypes.create = jest
      .fn()
      .mockResolvedValue(mockedValue);

    const params: UnitAccessibilityPriorityTypeCreate = {
      name: UnitAccessibilityPriorityTypeEnum.mobilityAndHearing,
    };

    expect(await service.create(params)).toEqual({
      id: mockedValue.id,
      name: UnitAccessibilityPriorityTypeEnum.mobilityAndHearing,
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitAccessibilityPriorityTypes.create).toHaveBeenCalledWith({
      data: {
        name: UnitAccessibilityPriorityTypeEnum.mobilityAndHearing,
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();

    const mockedUnitType = mockUnitAccessibilityPriorityType(
      date,
      UnitAccessibilityPriorityTypeEnum.mobilityAndHearing,
    );

    prisma.unitAccessibilityPriorityTypes.findUnique = jest
      .fn()
      .mockResolvedValue(mockedUnitType);
    prisma.unitAccessibilityPriorityTypes.update = jest.fn().mockResolvedValue({
      ...mockedUnitType,
      name: UnitAccessibilityPriorityTypeEnum.mobilityAndVisual,
    });

    const params: UnitAccessibilityPriorityTypeUpdate = {
      name: UnitAccessibilityPriorityTypeEnum.mobilityAndVisual,
      id: mockedUnitType.id,
    };

    expect(await service.update(params)).toEqual({
      id: mockedUnitType.id,
      name: UnitAccessibilityPriorityTypeEnum.mobilityAndVisual,
      createdAt: date,
      updatedAt: date,
    });

    expect(
      prisma.unitAccessibilityPriorityTypes.findUnique,
    ).toHaveBeenCalledWith({
      where: {
        id: mockedUnitType.id,
      },
    });

    expect(prisma.unitAccessibilityPriorityTypes.update).toHaveBeenCalledWith({
      data: {
        name: UnitAccessibilityPriorityTypeEnum.mobilityAndVisual,
      },
      where: {
        id: mockedUnitType.id,
      },
    });
  });

  it('testing update() existing record not found', async () => {
    const date = new Date();

    prisma.unitAccessibilityPriorityTypes.findUnique = jest
      .fn()
      .mockResolvedValue(null);
    prisma.unitAccessibilityPriorityTypes.update = jest
      .fn()
      .mockResolvedValue(null);

    const params: UnitAccessibilityPriorityType = {
      name: UnitAccessibilityPriorityTypeEnum.mobilityAndVisual,
      id: 'example id',
      createdAt: date,
      updatedAt: date,
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(
      prisma.unitAccessibilityPriorityTypes.findUnique,
    ).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();

    const mockedValue = mockUnitAccessibilityPriorityType(
      date,
      UnitAccessibilityPriorityTypeEnum.hearing,
    );

    prisma.unitAccessibilityPriorityTypes.findUnique = jest
      .fn()
      .mockResolvedValue(mockedValue);
    prisma.unitAccessibilityPriorityTypes.delete = jest
      .fn()
      .mockResolvedValue(
        mockUnitAccessibilityPriorityType(
          date,
          UnitAccessibilityPriorityTypeEnum.mobility,
        ),
      );

    expect(await service.delete('example Id')).toEqual({
      success: true,
    });

    expect(prisma.unitAccessibilityPriorityTypes.delete).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });

  it('testing findOrThrow() record found', async () => {
    prisma.unitAccessibilityPriorityTypes.findUnique = jest
      .fn()
      .mockResolvedValue(null);

    await expect(
      async () => await service.findOrThrow('example id'),
    ).rejects.toThrowError();

    expect(
      prisma.unitAccessibilityPriorityTypes.findUnique,
    ).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing findOrThrow() record not found', async () => {
    const date = new Date();
    const mockedValue = mockUnitAccessibilityPriorityType(
      date,
      UnitAccessibilityPriorityTypeEnum.hearing,
    );
    prisma.unitAccessibilityPriorityTypes.findUnique = jest
      .fn()
      .mockResolvedValue(mockedValue);

    expect(await service.findOrThrow('example id')).toEqual(true);

    expect(
      prisma.unitAccessibilityPriorityTypes.findUnique,
    ).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });
});
