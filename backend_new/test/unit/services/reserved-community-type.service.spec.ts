import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { ReservedCommunityTypeService } from '../../../src/services/reserved-community-type.service';
import { ReservedCommunityTypeQueryParams } from '../../../src/dtos/reserved-community-types/reserved-community-type-query-params.dto';
import { ReservedCommunitTypeCreate } from '../../../src/dtos/reserved-community-types/reserved-community-type-create.dto';
import { ReservedCommunityType } from '../../../src/dtos/reserved-community-types/reserved-community-type-get.dto';

describe('Testing reserved community type service', () => {
  let service: ReservedCommunityTypeService;
  let prisma: PrismaService;

  const mockReservedCommunityTypeChart = (
    position: number,
    date: Date,
    jurisdictionData: any,
  ) => {
    return {
      id: `reserved community type id ${position}`,
      name: `reserved community type name ${position}`,
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      description: `reserved community type description ${position}`,
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

  beforeEach(async () => {
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

  it('testing buildWhereClause() jurisdictionName param present', () => {
    const params: ReservedCommunityTypeQueryParams = {
      jurisdictionName: 'test name',
    };
    expect(service.buildWhereClause(params)).toEqual({
      AND: [
        {
          jurisdictions: {
            name: 'test name',
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
    prisma.reservedCommunityTypes.findMany = jest
      .fn()
      .mockResolvedValue(
        mockReservedCommunityTypeSet(3, date, jurisdictionData),
      );

    const params: ReservedCommunityTypeQueryParams = {
      jurisdictionName: 'test name',
    };

    expect(await service.list(params)).toEqual([
      {
        id: 'reserved community type id 0',
        name: 'reserved community type name 0',
        jurisdictions: jurisdictionData,
        createdAt: date,
        updatedAt: date,
        description: 'reserved community type description 0',
      },
      {
        id: 'reserved community type id 1',
        name: 'reserved community type name 1',
        jurisdictions: jurisdictionData,
        createdAt: date,
        updatedAt: date,
        description: 'reserved community type description 1',
      },
      {
        id: 'reserved community type id 2',
        name: 'reserved community type name 2',
        jurisdictions: jurisdictionData,
        createdAt: date,
        updatedAt: date,
        description: 'reserved community type description 2',
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
              name: 'test name',
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
    prisma.reservedCommunityTypes.findFirst = jest
      .fn()
      .mockResolvedValue(
        mockReservedCommunityTypeChart(3, date, jurisdictionData),
      );

    expect(await service.findOne('example Id')).toEqual({
      id: 'reserved community type id 3',
      name: 'reserved community type name 3',
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      description: 'reserved community type description 3',
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
    prisma.reservedCommunityTypes.create = jest
      .fn()
      .mockResolvedValue(
        mockReservedCommunityTypeChart(3, date, jurisdictionData),
      );

    const params: ReservedCommunitTypeCreate = {
      jurisdictions: jurisdictionData,
      description: 'reserved community type description 3',
      name: 'reserved community type name 3',
    };

    expect(await service.create(params)).toEqual({
      id: 'reserved community type id 3',
      name: 'reserved community type name 3',
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      description: 'reserved community type description 3',
    });

    expect(prisma.reservedCommunityTypes.create).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      data: {
        name: 'reserved community type name 3',
        jurisdictions: {
          connect: {
            id: 'example Id',
          },
        },
        description: 'reserved community type description 3',
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
      name: 'reserved community type name 4',
      description: 'reserved community type description 4',
    });

    const params: ReservedCommunityType = {
      jurisdictions: jurisdictionData,
      description: 'reserved community type description 4',
      name: 'reserved community type name 4',
      id: 'reserved community type id 3',
      createdAt: date,
      updatedAt: date,
    };

    expect(await service.update(params)).toEqual({
      id: 'reserved community type id 3',
      name: 'reserved community type name 4',
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      description: 'reserved community type description 4',
    });

    expect(prisma.reservedCommunityTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'reserved community type id 3',
      },
    });

    expect(prisma.reservedCommunityTypes.update).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      data: {
        name: 'reserved community type name 4',
        description: 'reserved community type description 4',
      },
      where: {
        id: 'reserved community type id 3',
      },
    });
  });

  it('testing update() existing record not found', async () => {
    const date = new Date();
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    prisma.reservedCommunityTypes.findFirst = jest.fn().mockResolvedValue(null);
    prisma.reservedCommunityTypes.update = jest.fn().mockResolvedValue(null);

    const params: ReservedCommunityType = {
      jurisdictions: jurisdictionData,
      description: 'reserved community type name 4',
      name: 'reserved community type name 4',
      id: 'reserved community type Id 3',
      createdAt: date,
      updatedAt: date,
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(prisma.reservedCommunityTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'reserved community type Id 3',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    const jurisdictionData = undefined;
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
