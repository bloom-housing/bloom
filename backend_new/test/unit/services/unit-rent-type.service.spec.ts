import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { UnitRentTypeService } from '../../../src/services/unit-rent-type.service';
import { UnitRentTypeCreate } from '../../../src/dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentTypeUpdate } from '../../../src/dtos/unit-rent-types/unit-rent-type-update.dto';
import { randomUUID } from 'crypto';
import {
  unitRentTypeArray,
  unitRentTypeFactory,
} from '../../../prisma/seed-helpers/unit-rent-type-factory';
import { UnitRentTypeEnum } from '@prisma/client';

describe('Testing unit rent type service', () => {
  let service: UnitRentTypeService;
  let prisma: PrismaService;

  const mockUnitRentType = (type: UnitRentTypeEnum, date: Date) => {
    return {
      id: randomUUID(),
      name: type,
      createdAt: date,
      updatedAt: date,
    };
  };

  const mockUnitRentTypeSet = (numberToCreate: number, date: Date) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(
        mockUnitRentType(unitRentTypeArray[i % unitRentTypeArray.length], date),
      );
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
        name: unitRentTypeArray[0],
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[1].id,
        name: unitRentTypeArray[1],
        createdAt: date,
        updatedAt: date,
      },
      {
        id: mockedValue[2].id,
        name: unitRentTypeArray[0],
        createdAt: date,
        updatedAt: date,
      },
    ]);

    expect(prisma.unitRentTypes.findMany).toHaveBeenCalled();
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();
    const mockedValue = mockUnitRentType(UnitRentTypeEnum.fixed, date);
    prisma.unitRentTypes.findUnique = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual(mockedValue);

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
    const mockedValue = mockUnitRentType(
      UnitRentTypeEnum.percentageOfIncome,
      date,
    );
    prisma.unitRentTypes.create = jest.fn().mockResolvedValue(mockedValue);

    const params: UnitRentTypeCreate = {
      name: UnitRentTypeEnum.percentageOfIncome,
    };

    expect(await service.create(params)).toEqual(mockedValue);

    expect(prisma.unitRentTypes.create).toHaveBeenCalledWith({
      data: {
        name: UnitRentTypeEnum.percentageOfIncome,
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();
    const mockedUnitRentType = mockUnitRentType(UnitRentTypeEnum.fixed, date);

    prisma.unitRentTypes.findUnique = jest
      .fn()
      .mockResolvedValue(mockedUnitRentType);
    prisma.unitRentTypes.update = jest.fn().mockResolvedValue({
      ...mockedUnitRentType,
      name: UnitRentTypeEnum.percentageOfIncome,
    });

    const params: UnitRentTypeUpdate = {
      name: UnitRentTypeEnum.percentageOfIncome,
      id: mockedUnitRentType.id,
    };

    expect(await service.update(params)).toEqual({
      id: mockedUnitRentType.id,
      name: UnitRentTypeEnum.percentageOfIncome,
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
        name: UnitRentTypeEnum.percentageOfIncome,
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
      name: UnitRentTypeEnum.percentageOfIncome,
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
    const mockedValue = mockUnitRentType(UnitRentTypeEnum.fixed, date);
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
    const mockedValue = mockUnitRentType(
      UnitRentTypeEnum.percentageOfIncome,
      date,
    );
    prisma.unitRentTypes.findUnique = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOrThrow('example id')).toEqual(mockedValue);

    expect(prisma.unitRentTypes.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });
});
