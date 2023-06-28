import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UnitRentTypeService } from '../../../src/services/unit-rent-type.service';
import { UnitRentTypeCreate } from '../../../src/dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentTypeUpdate } from '../../../src/dtos/unit-rent-types/unit-rent-type-update.dto';
import { randomUUID } from 'crypto';
import { unitRentTypeFactory } from '../../../prisma/seed-helpers/unit-rent-type-factory';

describe('Testing unit rent type service', () => {
  let service: UnitRentTypeService;
  let prisma: PrismaService;

  const mockUnitRentType = (position: number, date: Date) => {
    return {
      id: randomUUID(),
      name: unitRentTypeFactory(position).name,
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
        name: unitRentTypeFactory(0).name,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[1].id,
        name: unitRentTypeFactory(1).name,
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[2].id,
        name: unitRentTypeFactory(2).name,
        createdAt: date,
        updatedAt: date,
      },
    ]);

    expect(prisma.unitRentTypes.findMany).toHaveBeenCalled();
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();
    const mockedValue = mockUnitRentType(3, date);
    prisma.unitRentTypes.findUnique = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual({
      id: mockedValue.id,
      name: unitRentTypeFactory(3).name,
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitRentTypes.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.unitRentTypes.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError();

    expect(prisma.unitRentTypes.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();
    const mockedValue = mockUnitRentType(3, date);
    prisma.unitRentTypes.create = jest.fn().mockResolvedValue(mockedValue);

    const params: UnitRentTypeCreate = {
      name: unitRentTypeFactory(3).name,
    };

    expect(await service.create(params)).toEqual({
      id: mockedValue.id,
      name: unitRentTypeFactory(3).name,
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitRentTypes.create).toHaveBeenCalledWith({
      data: {
        name: unitRentTypeFactory(3).name,
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();
    const mockedUnitRentType = mockUnitRentType(3, date);

    prisma.unitRentTypes.findUnique = jest
      .fn()
      .mockResolvedValue(mockedUnitRentType);
    prisma.unitRentTypes.update = jest.fn().mockResolvedValue({
      ...mockedUnitRentType,
      name: unitRentTypeFactory(4).name,
    });

    const params: UnitRentTypeUpdate = {
      name: unitRentTypeFactory(4).name,
      id: mockedUnitRentType.id,
    };

    expect(await service.update(params)).toEqual({
      id: mockedUnitRentType.id,
      name: unitRentTypeFactory(4).name,
      createdAt: date,
      updatedAt: date,
    });

    expect(prisma.unitRentTypes.findUnique).toHaveBeenCalledWith({
      where: {
        id: mockedUnitRentType.id,
      },
    });

    expect(prisma.unitRentTypes.update).toHaveBeenCalledWith({
      data: {
        name: unitRentTypeFactory(4).name,
      },
      where: {
        id: mockedUnitRentType.id,
      },
    });
  });

  it('testing update() existing record not found', async () => {
    prisma.unitRentTypes.findUnique = jest.fn().mockResolvedValue(null);
    prisma.unitRentTypes.update = jest.fn().mockResolvedValue(null);

    const params: UnitRentTypeUpdate = {
      name: unitRentTypeFactory(4).name,
      id: 'example id',
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(prisma.unitRentTypes.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    const mockedValue = mockUnitRentType(3, date);
    prisma.unitRentTypes.findUnique = jest.fn().mockResolvedValue(mockedValue);
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

  it('testing findOrThrow() record not found', async () => {
    prisma.unitRentTypes.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOrThrow('example id'),
    ).rejects.toThrowError();

    expect(prisma.unitRentTypes.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing findOrThrow() record found', async () => {
    const date = new Date();
    const mockedValue = mockUnitRentType(3, date);
    prisma.unitRentTypes.findUnique = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOrThrow('example id')).toEqual(mockedValue);

    expect(prisma.unitRentTypes.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });
});
