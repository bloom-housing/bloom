import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { AmiChartService } from '../../../src/services/ami-chart.service';
import { AmiChartQueryParams } from '../../../src/dtos/ami-charts/ami-chart-query-params.dto';
import { AmiChartCreate } from '../../../src/dtos/ami-charts/ami-chart-create.dto';
import { AmiChartUpdate } from '../../../src/dtos/ami-charts/ami-chart-update.dto';
import { randomUUID } from 'crypto';

describe('Testing ami chart service', () => {
  let service: AmiChartService;
  let prisma: PrismaService;

  const mockAmiChart = (
    position: number,
    date: Date,
    jurisdictionData: any,
  ) => {
    const items = [];
    for (let i = 0; i < position; i++) {
      items.push({
        percentOfAmi: i,
        householdSize: i,
        income: i,
      });
    }

    return {
      id: randomUUID(),
      name: `ami ${position}`,
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      items: items,
    };
  };

  const mockAmiChartSet = (
    numberToCreate: number,
    date: Date,
    jurisdictionData: any,
  ) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockAmiChart(i, date, jurisdictionData));
    }
    return toReturn;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmiChartService, PrismaService],
    }).compile();

    service = module.get<AmiChartService>(AmiChartService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('testing buildWhereClause() no params', () => {
    const params: AmiChartQueryParams = {};
    expect(service.buildWhereClause(params)).toEqual({
      AND: [],
    });
  });

  it('testing buildWhereClause() jurisdictionId param present', () => {
    const params: AmiChartQueryParams = {
      jurisdictionId: 'test id',
    };
    expect(service.buildWhereClause(params)).toEqual({
      AND: [
        {
          jurisdictions: {
            id: 'test id',
          },
        },
      ],
    });
  });

  it('testing list() with jurisdictionId param present', async () => {
    const date = new Date();
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    const mockedValue = mockAmiChartSet(3, date, jurisdictionData);

    prisma.amiChart.findMany = jest.fn().mockResolvedValue(mockedValue);

    const params: AmiChartQueryParams = {
      jurisdictionId: 'test name',
    };

    expect(await service.list(params)).toEqual([
      {
        id: mockedValue[0].id,
        name: 'ami 0',
        jurisdictions: jurisdictionData,
        createdAt: date,
        updatedAt: date,
        items: [],
      },
      {
        id: mockedValue[1].id,
        name: 'ami 1',
        jurisdictions: jurisdictionData,
        createdAt: date,
        updatedAt: date,
        items: [
          {
            percentOfAmi: 0,
            householdSize: 0,
            income: 0,
          },
        ],
      },
      {
        id: mockedValue[2].id,
        name: 'ami 2',
        jurisdictions: jurisdictionData,
        createdAt: date,
        updatedAt: date,
        items: [
          {
            percentOfAmi: 0,
            householdSize: 0,
            income: 0,
          },
          {
            percentOfAmi: 1,
            householdSize: 1,
            income: 1,
          },
        ],
      },
    ]);

    expect(prisma.amiChart.findMany).toHaveBeenCalledWith({
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
    const mockedValue = mockAmiChart(3, date, jurisdictionData);

    prisma.amiChart.findUnique = jest.fn().mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual({
      id: mockedValue.id,
      name: 'ami 3',
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      items: [
        {
          percentOfAmi: 0,
          householdSize: 0,
          income: 0,
        },
        {
          percentOfAmi: 1,
          householdSize: 1,
          income: 1,
        },
        {
          percentOfAmi: 2,
          householdSize: 2,
          income: 2,
        },
      ],
    });

    expect(prisma.amiChart.findUnique).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      where: {
        id: 'example Id',
      },
    });
  });

  it('testing findOne() with id not present', async () => {
    prisma.amiChart.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOne('example Id'),
    ).rejects.toThrowError();

    expect(prisma.amiChart.findUnique).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      where: {
        id: 'example Id',
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    const mockedValue = mockAmiChart(3, date, jurisdictionData);
    prisma.amiChart.create = jest.fn().mockResolvedValue(mockedValue);

    const params: AmiChartCreate = {
      jurisdictions: jurisdictionData,
      items: [
        {
          percentOfAmi: 0,
          householdSize: 0,
          income: 0,
        },
        {
          percentOfAmi: 1,
          householdSize: 1,
          income: 1,
        },
        {
          percentOfAmi: 2,
          householdSize: 2,
          income: 2,
        },
      ],
      name: 'ami 3',
    };

    expect(await service.create(params)).toEqual({
      id: mockedValue.id,
      name: 'ami 3',
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      items: [
        {
          percentOfAmi: 0,
          householdSize: 0,
          income: 0,
        },
        {
          percentOfAmi: 1,
          householdSize: 1,
          income: 1,
        },
        {
          percentOfAmi: 2,
          householdSize: 2,
          income: 2,
        },
      ],
    });

    expect(prisma.amiChart.create).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      data: {
        name: 'ami 3',
        jurisdictions: {
          connect: {
            id: 'example Id',
          },
        },
        items: [
          {
            percentOfAmi: 0,
            householdSize: 0,
            income: 0,
          },
          {
            percentOfAmi: 1,
            householdSize: 1,
            income: 1,
          },
          {
            percentOfAmi: 2,
            householdSize: 2,
            income: 2,
          },
        ],
      },
    });
  });

  it('testing update() existing record found', async () => {
    const date = new Date();
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    const mockedAmi = mockAmiChart(3, date, jurisdictionData);

    prisma.amiChart.findUnique = jest.fn().mockResolvedValue(mockedAmi);
    prisma.amiChart.update = jest.fn().mockResolvedValue({
      ...mockedAmi,
      name: 'updated ami 3',
      items: [
        {
          percentOfAmi: 0,
          householdSize: 0,
          income: 0,
        },
        {
          percentOfAmi: 1,
          householdSize: 1,
          income: 1,
        },
        {
          percentOfAmi: 2,
          householdSize: 2,
          income: 2,
        },
        {
          percentOfAmi: 3,
          householdSize: 3,
          income: 3,
        },
      ],
    });

    const params: AmiChartUpdate = {
      items: [
        {
          percentOfAmi: 0,
          householdSize: 0,
          income: 0,
        },
        {
          percentOfAmi: 1,
          householdSize: 1,
          income: 1,
        },
        {
          percentOfAmi: 2,
          householdSize: 2,
          income: 2,
        },
        {
          percentOfAmi: 3,
          householdSize: 3,
          income: 3,
        },
      ],
      name: 'updated ami 3',
      id: mockedAmi.id,
    };

    expect(await service.update(params)).toEqual({
      id: mockedAmi.id,
      name: 'updated ami 3',
      jurisdictions: jurisdictionData,
      createdAt: date,
      updatedAt: date,
      items: [
        {
          percentOfAmi: 0,
          householdSize: 0,
          income: 0,
        },
        {
          percentOfAmi: 1,
          householdSize: 1,
          income: 1,
        },
        {
          percentOfAmi: 2,
          householdSize: 2,
          income: 2,
        },
        {
          percentOfAmi: 3,
          householdSize: 3,
          income: 3,
        },
      ],
    });

    expect(prisma.amiChart.findUnique).toHaveBeenCalledWith({
      where: {
        id: mockedAmi.id,
      },
    });

    expect(prisma.amiChart.update).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      data: {
        name: 'updated ami 3',
        items: [
          {
            percentOfAmi: 0,
            householdSize: 0,
            income: 0,
          },
          {
            percentOfAmi: 1,
            householdSize: 1,
            income: 1,
          },
          {
            percentOfAmi: 2,
            householdSize: 2,
            income: 2,
          },
          {
            percentOfAmi: 3,
            householdSize: 3,
            income: 3,
          },
        ],
      },
      where: {
        id: mockedAmi.id,
      },
    });
  });

  it('testing update() existing record not found', async () => {
    prisma.amiChart.findUnique = jest.fn().mockResolvedValue(null);
    prisma.amiChart.update = jest.fn().mockResolvedValue(null);

    const params: AmiChartUpdate = {
      items: [
        {
          percentOfAmi: 0,
          householdSize: 0,
          income: 0,
        },
        {
          percentOfAmi: 1,
          householdSize: 1,
          income: 1,
        },
        {
          percentOfAmi: 2,
          householdSize: 2,
          income: 2,
        },
        {
          percentOfAmi: 3,
          householdSize: 3,
          income: 3,
        },
      ],
      name: 'updated ami 3',
      id: 'example ami id',
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(prisma.amiChart.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example ami id',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    const jurisdictionData = undefined;
    prisma.amiChart.findUnique = jest
      .fn()
      .mockResolvedValue(mockAmiChart(3, date, jurisdictionData));

    prisma.amiChart.delete = jest
      .fn()
      .mockResolvedValue(mockAmiChart(3, date, jurisdictionData));

    expect(await service.delete('example Id')).toEqual({
      success: true,
    });

    expect(prisma.amiChart.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });

    expect(prisma.amiChart.delete).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });

  it('testing findOrThrow() record found', async () => {
    prisma.amiChart.findUnique = jest.fn().mockResolvedValue(null);

    await expect(
      async () => await service.findOrThrow('example id'),
    ).rejects.toThrowError();

    expect(prisma.amiChart.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });

  it('testing findOrThrow() record not found', async () => {
    const date = new Date();
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    const mockedAmi = mockAmiChart(3, date, jurisdictionData);
    prisma.amiChart.findUnique = jest.fn().mockResolvedValue(mockedAmi);

    expect(await service.findOrThrow('example id')).toEqual(true);

    expect(prisma.amiChart.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'example id',
      },
    });
  });
});
