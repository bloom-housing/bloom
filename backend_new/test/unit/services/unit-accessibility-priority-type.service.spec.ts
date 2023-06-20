import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UnitAccessibilityPriorityTypeService } from '../../../src/services/unit-accessibility-priority-type.service';
import { UnitAccessibilityPriorityTypeCreate } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create.dto';
import { UnitAccessibilityPriorityTypeUpdate } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-update.dto';
import { UnitAccessibilityPriorityType } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type.dto';
import { randomUUID } from 'crypto';

describe('Testing unit accessibility priority type service', () => {
  let service: UnitAccessibilityPriorityTypeService;
  let prisma: PrismaService;

  const mockUnitAccessibilityPriorityType = (position: number, date: Date) => {
    return {
      id: randomUUID(),
      name: `unit accessibility priority type ${position}`,
      createdAt: date,
      updatedAt: date,
    };
  };

  const mockUnitAccessibilityPriorityTypeSet = (
    numberToCreate: number,
    date: Date,
  ) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockUnitAccessibilityPriorityType(i, date));
    }
    return toReturn;
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
        name: 'unit accessibility priority type 0',
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[1].id,
        name: 'unit accessibility priority type 1',
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[2].id,
        name: 'unit accessibility priority type 2',
        createdAt: date,
        updatedAt: date,
      },
    ]);

    expect(prisma.unitAccessibilityPriorityTypes.findMany).toHaveBeenCalled();
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();
    const mockedValue = mockUnitAccessibilityPriorityType(3, date);
    prisma.unitAccessibilityPriorityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual({
      id: mockedValue.id,
      name: 'unit accessibility priority type 3',
      createdAt: date,
      updatedAt: date,
    });

    expect(
      prisma.unitAccessibilityPriorityTypes.findFirst,
    ).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.unitAccessibilityPriorityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError();

    expect(
      prisma.unitAccessibilityPriorityTypes.findFirst,
    ).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();
    const mockedValue = mockUnitAccessibilityPriorityType(3, date);
    prisma.unitAccessibilityPriorityTypes.create = jest
      .fn()
      .mockResolvedValue(mockedValue);

    const params: UnitAccessibilityPriorityTypeCreate = {
      name: 'unit accessibility priority type 3',
    };

    expect(await service.create(params)).toEqual({
      id: mockedValue.id,
      name: 'unit accessibility priority type 3',
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitAccessibilityPriorityTypes.create).toHaveBeenCalledWith({
      data: {
        name: 'unit accessibility priority type 3',
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();

    const mockedUnitType = mockUnitAccessibilityPriorityType(3, date);

    prisma.unitAccessibilityPriorityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(mockedUnitType);
    prisma.unitAccessibilityPriorityTypes.update = jest.fn().mockResolvedValue({
      ...mockedUnitType,
      name: 'updated unit accessibility priority type 3',
    });

    const params: UnitAccessibilityPriorityTypeUpdate = {
      name: 'updated unit accessibility priority type 3',
      id: mockedUnitType.id,
    };

    expect(await service.update(params)).toEqual({
      id: mockedUnitType.id,
      name: 'updated unit accessibility priority type 3',
      createdAt: date,
      updatedAt: date,
    });

    expect(
      prisma.unitAccessibilityPriorityTypes.findFirst,
    ).toHaveBeenCalledWith({
      where: {
        id: mockedUnitType.id,
      },
    });

    expect(prisma.unitAccessibilityPriorityTypes.update).toHaveBeenCalledWith({
      data: {
        name: 'updated unit accessibility priority type 3',
      },
      where: {
        id: mockedUnitType.id,
      },
    });
  });

  it('testing update() existing record not found', async () => {
    const date = new Date();

    prisma.unitAccessibilityPriorityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(null);
    prisma.unitAccessibilityPriorityTypes.update = jest
      .fn()
      .mockResolvedValue(null);

    const params: UnitAccessibilityPriorityType = {
      name: 'updated unit accessibility priority type 3',
      id: 'example id',
      createdAt: date,
      updatedAt: date,
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(
      prisma.unitAccessibilityPriorityTypes.findFirst,
    ).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();

    const mockedUnitType = mockUnitAccessibilityPriorityType(3, date);

    prisma.unitAccessibilityPriorityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(mockedUnitType);
    prisma.unitAccessibilityPriorityTypes.delete = jest
      .fn()
      .mockResolvedValue(mockUnitAccessibilityPriorityType(3, date));

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
    prisma.unitAccessibilityPriorityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(null);

    await expect(
      async () => await service.findOrThrow('example id'),
    ).rejects.toThrowError();

    expect(
      prisma.unitAccessibilityPriorityTypes.findFirst,
    ).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing findOrThrow() record not found', async () => {
    const date = new Date();
    const mockedAmi = mockUnitAccessibilityPriorityType(3, date);
    prisma.unitAccessibilityPriorityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(mockedAmi);

    expect(await service.findOrThrow('example id')).toEqual(true);

    expect(
      prisma.unitAccessibilityPriorityTypes.findFirst,
    ).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });
});
