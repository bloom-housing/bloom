import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UnitAccessibilityPriorityTypeService } from '../../../src/services/unit-accessibility-priority-type.service';
import { UnitAccessibilityPriorityTypeCreate } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create';
import { UnitAccessibilityPriorityType } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-get.dto';

describe('Testing unit accessibility priority type service', () => {
  let service: UnitAccessibilityPriorityTypeService;
  let prisma: PrismaService;

  const mockUnitAccessibilityPriorityType = (position: number, date: Date) => {
    return {
      id: `unit accessibility priority type id ${position}`,
      name: `unit accessibility priority type name ${position}`,
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

  beforeEach(async () => {
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
    prisma.unitAccessibilityPriorityTypes.findMany = jest
      .fn()
      .mockResolvedValue(mockUnitAccessibilityPriorityTypeSet(3, date));

    expect(await service.list()).toEqual([
      {
        id: 'unit accessibility priority type id 0',
        name: 'unit accessibility priority type name 0',
        createdAt: date,
        updatedAt: date,
      },
      {
        id: 'unit accessibility priority type id 1',
        name: 'unit accessibility priority type name 1',
        createdAt: date,
        updatedAt: date,
      },
      {
        id: 'unit accessibility priority type id 2',
        name: 'unit accessibility priority type name 2',
        createdAt: date,
        updatedAt: date,
      },
    ]);

    expect(prisma.unitAccessibilityPriorityTypes.findMany).toHaveBeenCalled();
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();

    prisma.unitAccessibilityPriorityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(mockUnitAccessibilityPriorityType(3, date));

    expect(await service.findOne('example Id')).toEqual({
      id: 'unit accessibility priority type id 3',
      name: 'unit accessibility priority type name 3',
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

    prisma.unitAccessibilityPriorityTypes.create = jest
      .fn()
      .mockResolvedValue(mockUnitAccessibilityPriorityType(3, date));

    const params: UnitAccessibilityPriorityTypeCreate = {
      name: 'unit accessibility priority type name 3',
    };

    expect(await service.create(params)).toEqual({
      id: 'unit accessibility priority type id 3',
      name: 'unit accessibility priority type name 3',
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitAccessibilityPriorityTypes.create).toHaveBeenCalledWith({
      data: {
        name: 'unit accessibility priority type name 3',
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
      name: 'unit accessibility priority type name 4',
    });

    const params: UnitAccessibilityPriorityType = {
      name: 'unit accessibility priority type name 4',
      id: 'unit accessibility priority type id 3',
      createdAt: date,
      updatedAt: date,
    };

    expect(await service.update(params)).toEqual({
      id: 'unit accessibility priority type id 3',
      name: 'unit accessibility priority type name 4',
      createdAt: date,
      updatedAt: date,
    });

    expect(
      prisma.unitAccessibilityPriorityTypes.findFirst,
    ).toHaveBeenCalledWith({
      where: {
        id: 'unit accessibility priority type id 3',
      },
    });

    expect(prisma.unitAccessibilityPriorityTypes.update).toHaveBeenCalledWith({
      data: {
        name: 'unit accessibility priority type name 4',
      },
      where: {
        id: 'unit accessibility priority type id 3',
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
      name: 'unit accessibility priority type name 4',
      id: 'unit accessibility priority type Id 3',
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
        id: 'unit accessibility priority type Id 3',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
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
});
