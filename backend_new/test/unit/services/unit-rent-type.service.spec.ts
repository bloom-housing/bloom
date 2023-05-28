import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UnitRentTypeService } from '../../../src/services/unit-rent-type.service';
import { UnitRentTypeCreate } from '../../../src/dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentType } from '../../../src/dtos/unit-rent-types/unit-rent-type-get.dto';

describe('Testing unit rent type service', () => {
  let service: UnitRentTypeService;
  let prisma: PrismaService;

  const mockUnitRentType = (position: number, date: Date) => {
    return {
      id: `unit rent type id ${position}`,
      name: `unit rent type name ${position}`,
      createdAt: date,
      updatedAt: date,
    };
  };

  const mockUnitRentTypeSet = (numberToCreate: number, date: Date) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockUnitRentType(i, date));
    }
    return toReturn;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitRentTypeService, PrismaService],
    }).compile();

    service = module.get<UnitRentTypeService>(UnitRentTypeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing list()', async () => {
    const date = new Date();
    prisma.unitRentTypes.findMany = jest
      .fn()
      .mockResolvedValue(mockUnitRentTypeSet(3, date));

    expect(await service.list()).toEqual([
      {
        id: 'unit rent type id 0',
        name: 'unit rent type name 0',
        createdAt: date,
        updatedAt: date,
      },
      {
        id: 'unit rent type id 1',
        name: 'unit rent type name 1',
        createdAt: date,
        updatedAt: date,
      },
      {
        id: 'unit rent type id 2',
        name: 'unit rent type name 2',
        createdAt: date,
        updatedAt: date,
      },
    ]);

    expect(prisma.unitRentTypes.findMany).toHaveBeenCalled();
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();

    prisma.unitRentTypes.findFirst = jest
      .fn()
      .mockResolvedValue(mockUnitRentType(3, date));

    expect(await service.findOne('example Id')).toEqual({
      id: 'unit rent type id 3',
      name: 'unit rent type name 3',
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitRentTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.unitRentTypes.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError();

    expect(prisma.unitRentTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();

    prisma.unitRentTypes.create = jest
      .fn()
      .mockResolvedValue(mockUnitRentType(3, date));

    const params: UnitRentTypeCreate = {
      name: 'unit rent type name 3',
    };

    expect(await service.create(params)).toEqual({
      id: 'unit rent type id 3',
      name: 'unit rent type name 3',
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitRentTypes.create).toHaveBeenCalledWith({
      data: {
        name: 'unit rent type name 3',
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();

    const mockedUnitRentType = mockUnitRentType(3, date);

    prisma.unitRentTypes.findFirst = jest
      .fn()
      .mockResolvedValue(mockedUnitRentType);
    prisma.unitRentTypes.update = jest.fn().mockResolvedValue({
      ...mockedUnitRentType,
      name: 'unit rent type name 4',
    });

    const params: UnitRentType = {
      name: 'unit rent type name 4',
      id: 'unit rent type id 3',
      createdAt: date,
      updatedAt: date,
    };

    expect(await service.update(params)).toEqual({
      id: 'unit rent type id 3',
      name: 'unit rent type name 4',
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitRentTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'unit rent type id 3',
      },
    });

    expect(prisma.unitRentTypes.update).toHaveBeenCalledWith({
      data: {
        name: 'unit rent type name 4',
      },
      where: {
        id: 'unit rent type id 3',
      },
    });
  });

  it('testing update() existing record not found', async () => {
    const date = new Date();

    prisma.unitRentTypes.findFirst = jest.fn().mockResolvedValue(null);
    prisma.unitRentTypes.update = jest.fn().mockResolvedValue(null);

    const params: UnitRentType = {
      name: 'unit rent type name 4',
      id: 'unit rent type Id 3',
      createdAt: date,
      updatedAt: date,
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(prisma.unitRentTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'unit rent type Id 3',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    prisma.unitRentTypes.delete = jest
      .fn()
      .mockResolvedValue(mockUnitRentType(3, date));

    expect(await service.delete('example Id')).toEqual({
      success: true,
    });

    expect(prisma.unitRentTypes.delete).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });
});
