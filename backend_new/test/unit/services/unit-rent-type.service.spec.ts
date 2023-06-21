import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UnitRentTypeService } from '../../../src/services/unit-rent-type.service';
import { UnitRentTypeCreate } from '../../../src/dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentTypeUpdate } from '../../../src/dtos/unit-rent-types/unit-rent-type-update.dto';
import { randomUUID } from 'crypto';

describe('Testing unit rent type service', () => {
  let service: UnitRentTypeService;
  let prisma: PrismaService;

  const mockUnitRentType = (position: number, date: Date) => {
    return {
      id: randomUUID(),
      name: `unit rent type ${position}`,
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

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnitRentTypeService, PrismaService],
    }).compile();

    service = module.get<UnitRentTypeService>(UnitRentTypeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing list()', async () => {
    const date = new Date();
    const mockedValue = mockUnitRentTypeSet(3, date);
    prisma.unitRentTypes.findMany = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.list()).toEqual([
      {
        id: mockedValue[0].id,
        name: 'unit rent type 0',
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[1].id,
        name: 'unit rent type 1',
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[2].id,
        name: 'unit rent type 2',
        createdAt: date,
        updatedAt: date,
      },
    ]);

    expect(prisma.unitRentTypes.findMany).toHaveBeenCalled();
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();
    const mockedValue = mockUnitRentType(3, date);
    prisma.unitRentTypes.findFirst = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual({
      id: mockedValue.id,
      name: 'unit rent type 3',
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
    const mockedValue = mockUnitRentType(3, date);
    prisma.unitRentTypes.create = jest.fn().mockResolvedValue(mockedValue);

    const params: UnitRentTypeCreate = {
      name: 'unit rent type 3',
    };

    expect(await service.create(params)).toEqual({
      id: mockedValue.id,
      name: 'unit rent type 3',
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitRentTypes.create).toHaveBeenCalledWith({
      data: {
        name: 'unit rent type 3',
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
      name: 'updated unit rent type 3',
    });

    const params: UnitRentTypeUpdate = {
      name: 'updated unit rent type 3',
      id: mockedUnitRentType.id,
    };

    expect(await service.update(params)).toEqual({
      id: mockedUnitRentType.id,
      name: 'updated unit rent type 3',
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitRentTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockedUnitRentType.id,
      },
    });

    expect(prisma.unitRentTypes.update).toHaveBeenCalledWith({
      data: {
        name: 'updated unit rent type 3',
      },
      where: {
        id: mockedUnitRentType.id,
      },
    });
  });

  it('testing update() existing record not found', async () => {
    prisma.unitRentTypes.findFirst = jest.fn().mockResolvedValue(null);
    prisma.unitRentTypes.update = jest.fn().mockResolvedValue(null);

    const params: UnitRentTypeUpdate = {
      name: 'updated unit rent type 3',
      id: 'example id',
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(prisma.unitRentTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    const mockedValue = mockUnitRentType(3, date);
    prisma.unitRentTypes.findFirst = jest.fn().mockResolvedValue(mockedValue);
    prisma.unitRentTypes.delete = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.delete('example Id')).toEqual({
      success: true,
    });

    expect(prisma.unitRentTypes.delete).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });

  it('testing findOrThrow() record found', async () => {
    prisma.unitRentTypes.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOrThrow('example id'),
    ).rejects.toThrowError();

    expect(prisma.unitRentTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing findOrThrow() record not found', async () => {
    const date = new Date();
    const mockedAmi = mockUnitRentType(3, date);
    prisma.unitRentTypes.findFirst = jest.fn().mockResolvedValue(mockedAmi);

    expect(await service.findOrThrow('example id')).toEqual(true);

    expect(prisma.unitRentTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });
});
