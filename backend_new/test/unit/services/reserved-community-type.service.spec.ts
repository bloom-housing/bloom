import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { ReservedCommunityTypeService } from '../../../src/services/reserved-community-type.service';
import { ReservedCommunityTypeQueryParams } from '../../../src/dtos/reserved-community-types/reserved-community-type-query-params.dto';
import { ReservedCommunityTypeCreate } from '../../../src/dtos/reserved-community-types/reserved-community-type-create.dto';
import { ReservedCommunityTypeUpdate } from '../../../src/dtos/reserved-community-types/reserved-community-type-update.dto';
import { randomUUID } from 'crypto';

describe('Testing reserved community type service', () => {
  let service: ReservedCommunityTypeService;
  let prisma: PrismaService;

  const mockReservedCommunityTypeChart = (
    position: number,
    date: Date,
    jurisdictionData: any,
  ) => {
    return {
      id: randomUUID(),
      name: `reserved community type ${position}`,
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      description: `description ${position}`,
    };
  };

  const mockReservedCommunityTypeSet = (
    numberToCreate: number,
    date: Date,
    jurisdictionData: any,
  ) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockReservedCommunityTypeChart(i, date, jurisdictionData));
    }
    return toReturn;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservedCommunityTypeService, PrismaService],
    }).compile();

    service = module.get<ReservedCommunityTypeService>(
      ReservedCommunityTypeService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing buildWhereClause() no params', () => {
    const params: ReservedCommunityTypeQueryParams = {};
    expect(service.buildWhereClause(params)).toEqual({
      AND: [],
    });
  });

  it('testing buildWhereClause() jurisdictionId param present', () => {
    const params: ReservedCommunityTypeQueryParams = {
      jurisdictionId: 'test name',
    };
    expect(service.buildWhereClause(params)).toEqual({
      AND: [
        {
          jurisdictions: {
            id: 'test name',
          },
        },
      ],
    });
  });

  it('testing list() with jurisdictionName param present', async () => {
    const date = new Date();
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    const mockedValue = mockReservedCommunityTypeSet(3, date, jurisdictionData);
    prisma.reservedCommunityTypes.findMany = jest
      .fn()
      .mockResolvedValue(mockedValue);

    const params: ReservedCommunityTypeQueryParams = {
      jurisdictionId: 'test name',
    };

    expect(await service.list(params)).toEqual([
      {
        id: mockedValue[0].id,
        name: 'reserved community type 0',
        jurisdictions: jurisdictionData,
        createdAt: date,
        updatedAt: date,
        description: 'description 0',
      },
      {
        id: mockedValue[1].id,
        name: 'reserved community type 1',
        jurisdictions: jurisdictionData,
        createdAt: date,
        updatedAt: date,
        description: 'description 1',
      },
      {
        id: mockedValue[2].id,
        name: 'reserved community type 2',
        jurisdictions: jurisdictionData,
        createdAt: date,
        updatedAt: date,
        description: 'description 2',
      },
    ]);

    expect(prisma.reservedCommunityTypes.findMany).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      where: {
        AND: [
          {
            jurisdictions: {
              id: 'test name',
            },
          },
        ],
      },
    });
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    const mockedValue = mockReservedCommunityTypeChart(
      3,
      date,
      jurisdictionData,
    );
    prisma.reservedCommunityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual({
      id: mockedValue.id,
      name: 'reserved community type 3',
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      description: 'description 3',
    });

    expect(prisma.reservedCommunityTypes.findFirst).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.reservedCommunityTypes.findFirst = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError();

    expect(prisma.reservedCommunityTypes.findFirst).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      where: {
        id: {
          equals: 'example Id',
        },
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    const mockedValue = mockReservedCommunityTypeChart(
      3,
      date,
      jurisdictionData,
    );
    prisma.reservedCommunityTypes.create = jest
      .fn()
      .mockResolvedValue(mockedValue);

    const params: ReservedCommunityTypeCreate = {
      jurisdictions: jurisdictionData,
      description: 'description 3',
      name: 'reserved community type 3',
    };

    expect(await service.create(params)).toEqual({
      id: mockedValue.id,
      name: 'reserved community type 3',
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      description: 'description 3',
    });

    expect(prisma.reservedCommunityTypes.create).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      data: {
        name: 'reserved community type 3',
        jurisdictions: {
          connect: {
            id: 'example Id',
          },
        },
        description: 'description 3',
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    const mockedReservedCommunityType = mockReservedCommunityTypeChart(
      3,
      date,
      jurisdictionData,
    );

    prisma.reservedCommunityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(mockedReservedCommunityType);
    prisma.reservedCommunityTypes.update = jest.fn().mockResolvedValue({
      ...mockedReservedCommunityType,
      name: 'updated reserved community type 3',
      description: 'updated description 3',
    });

    const params: ReservedCommunityTypeUpdate = {
      description: 'updated description 3',
      name: 'updated reserved community type 3',
      id: mockedReservedCommunityType.id,
    };

    expect(await service.update(params)).toEqual({
      id: mockedReservedCommunityType.id,
      name: 'updated reserved community type 3',
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      description: 'updated description 3',
    });

    expect(prisma.reservedCommunityTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockedReservedCommunityType.id,
      },
    });

    expect(prisma.reservedCommunityTypes.update).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      data: {
        name: 'updated reserved community type 3',
        description: 'updated description 3',
      },
      where: {
        id: mockedReservedCommunityType.id,
      },
    });
  });

  it('testing update() existing record not found', async () => {
    prisma.reservedCommunityTypes.findFirst = jest.fn().mockResolvedValue(null);
    prisma.reservedCommunityTypes.update = jest.fn().mockResolvedValue(null);

    const params: ReservedCommunityTypeUpdate = {
      description: 'updated description 3',
      name: 'updated name 3',
      id: 'example id',
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(prisma.reservedCommunityTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    const jurisdictionData = undefined;
    prisma.reservedCommunityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(
        mockReservedCommunityTypeChart(3, date, jurisdictionData),
      );
    prisma.reservedCommunityTypes.delete = jest
      .fn()
      .mockResolvedValue(
        mockReservedCommunityTypeChart(3, date, jurisdictionData),
      );

    expect(await service.delete('example Id')).toEqual({
      success: true,
    });

    expect(prisma.reservedCommunityTypes.delete).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });
});
