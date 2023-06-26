import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UnitAccessibilityPriorityTypeService } from '../../../src/services/unit-accessibility-priority-type.service';
import { UnitAccessibilityPriorityTypeCreate } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create.dto';
import { UnitAccessibilityPriorityTypeUpdate } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-update.dto';
import { UnitAccessibilityPriorityType } from '../../../src/dtos/unit-accessibility-priority-types/unit-accessibility-priority-type.dto';
import { randomUUID } from 'crypto';
import { unitPriorityTypeArray } from '../../../prisma/seed-helpers/unit-accessibility-priority-type-factory';

describe('Testing unit accessibility priority type service', () => {
  let service: UnitAccessibilityPriorityTypeService;
  let prisma: PrismaService;

  const mockUnitAccessibilityPriorityType = (position: number, date: Date) => {
    return {
      id: randomUUID(),
      name: unitPriorityTypeArray[position].name,
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
        name: unitPriorityTypeArray[0].name,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[1].id,
        name: unitPriorityTypeArray[1].name,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[2].id,
        name: unitPriorityTypeArray[2].name,
        createdAt: date,
        updatedAt: date,
      },
    ]);

    expect(prisma.unitAccessibilityPriorityTypes.findMany).toHaveBeenCalled();
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();
    const mockedValue = mockUnitAccessibilityPriorityType(3, date);
    prisma.unitAccessibilityPriorityTypes.findUnique = jest
      .fn()
      .mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual({
      id: mockedValue.id,
      name: unitPriorityTypeArray[3].name,
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
    const mockedValue = mockUnitAccessibilityPriorityType(3, date);
    prisma.unitAccessibilityPriorityTypes.create = jest
      .fn()
      .mockResolvedValue(mockedValue);

    const params: UnitAccessibilityPriorityTypeCreate = {
      name: unitPriorityTypeArray[3].name,
    };

    expect(await service.create(params)).toEqual({
      id: mockedValue.id,
      name: unitPriorityTypeArray[3].name,
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitAccessibilityPriorityTypes.create).toHaveBeenCalledWith({
      data: {
        name: unitPriorityTypeArray[3].name,
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();

    const mockedUnitType = mockUnitAccessibilityPriorityType(3, date);

    prisma.unitAccessibilityPriorityTypes.findUnique = jest
      .fn()
      .mockResolvedValue(mockedUnitType);
    prisma.unitAccessibilityPriorityTypes.update = jest.fn().mockResolvedValue({
      ...mockedUnitType,
      name: unitPriorityTypeArray[4].name,
    });

    const params: UnitAccessibilityPriorityTypeUpdate = {
      name: unitPriorityTypeArray[4].name,
      id: mockedUnitType.id,
    };

    expect(await service.update(params)).toEqual({
      id: mockedUnitType.id,
      name: unitPriorityTypeArray[4].name,
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
        name: unitPriorityTypeArray[4].name,
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
      name: unitPriorityTypeArray[4].name,
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

    const mockedUnitType = mockUnitAccessibilityPriorityType(3, date);

    prisma.unitAccessibilityPriorityTypes.findUnique = jest
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
    const mockedAmi = mockUnitAccessibilityPriorityType(3, date);
    prisma.unitAccessibilityPriorityTypes.findUnique = jest
      .fn()
      .mockResolvedValue(mockedAmi);

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
