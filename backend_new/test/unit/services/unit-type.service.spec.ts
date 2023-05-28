import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UnitTypeService } from '../../../src/services/unit-type.service';
import { UnitTypeCreate } from '../../../src/dtos/unit-types/unit-type-create.dto';
import { UnitType } from '../../../src/dtos/unit-types/unit-type-get.dto';

describe('Testing unit type service', () => {
  let service: UnitTypeService;
  let prisma: PrismaService;

  const mockUnitType = (position: number, date: Date) => {
    return {
      id: `unit type id ${position}`,
      name: `unit type name ${position}`,
      createdAt: date,
      updatedAt: date,
      numBedrooms: position,
    };
  };

  const mockUnitTypeSet = (numberToCreate: number, date: Date) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockUnitType(i, date));
    }
    return toReturn;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitTypeService, PrismaService],
    }).compile();

    service = module.get<UnitTypeService>(UnitTypeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing list()', async () => {
    const date = new Date();
    prisma.unitTypes.findMany = jest
      .fn()
      .mockResolvedValue(mockUnitTypeSet(3, date));

    expect(await service.list()).toEqual([
      {
        id: 'unit type id 0',
        name: 'unit type name 0',
        createdAt: date,
        updatedAt: date,
        numBedrooms: 0,
      },
      {
        id: 'unit type id 1',
        name: 'unit type name 1',
        createdAt: date,
        updatedAt: date,
        numBedrooms: 1,
      },
      {
        id: 'unit type id 2',
        name: 'unit type name 2',
        createdAt: date,
        updatedAt: date,
        numBedrooms: 2,
      },
    ]);

    expect(prisma.unitTypes.findMany).toHaveBeenCalled();
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();

    prisma.unitTypes.findFirst = jest
      .fn()
      .mockResolvedValue(mockUnitType(3, date));

    expect(await service.findOne('example Id')).toEqual({
      id: 'unit type id 3',
      name: 'unit type name 3',
      createdAt: date,
      updatedAt: date,
      numBedrooms: 3,
    });

    expect(prisma.unitTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.unitTypes.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError();

    expect(prisma.unitTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();

    prisma.unitTypes.create = jest
      .fn()
      .mockResolvedValue(mockUnitType(3, date));

    const params: UnitTypeCreate = {
      numBedrooms: 3,
      name: 'unit type name 3',
    };

    expect(await service.create(params)).toEqual({
      id: 'unit type id 3',
      name: 'unit type name 3',
      createdAt: date,
      updatedAt: date,
      numBedrooms: 3,
    });

    expect(prisma.unitTypes.create).toHaveBeenCalledWith({
      data: {
        name: 'unit type name 3',
        numBedrooms: 3,
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();

    const mockedUnitType = mockUnitType(3, date);

    prisma.unitTypes.findFirst = jest.fn().mockResolvedValue(mockedUnitType);
    prisma.unitTypes.update = jest.fn().mockResolvedValue({
      ...mockedUnitType,
      name: 'unit type name 4',
      numBedrooms: 4,
    });

    const params: UnitType = {
      numBedrooms: 4,
      name: 'unit type name 4',
      id: 'unit type id 3',
      createdAt: date,
      updatedAt: date,
    };

    expect(await service.update(params)).toEqual({
      id: 'unit type id 3',
      name: 'unit type name 4',
      createdAt: date,
      updatedAt: date,
      numBedrooms: 4,
    });

    expect(prisma.unitTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'unit type id 3',
      },
    });

    expect(prisma.unitTypes.update).toHaveBeenCalledWith({
      data: {
        name: 'unit type name 4',
        numBedrooms: 4,
      },
      where: {
        id: 'unit type id 3',
      },
    });
  });

  it('testing update() existing record not found', async () => {
    const date = new Date();

    prisma.unitTypes.findFirst = jest.fn().mockResolvedValue(null);
    prisma.unitTypes.update = jest.fn().mockResolvedValue(null);

    const params: UnitType = {
      numBedrooms: 4,
      name: 'unit type name 4',
      id: 'unit type Id 3',
      createdAt: date,
      updatedAt: date,
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(prisma.unitTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'unit type Id 3',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    prisma.unitTypes.delete = jest
      .fn()
      .mockResolvedValue(mockUnitType(3, date));

    expect(await service.delete('example Id')).toEqual({
      success: true,
    });

    expect(prisma.unitTypes.delete).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });
});
