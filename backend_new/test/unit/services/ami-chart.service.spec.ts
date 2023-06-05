import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { AmiChartService } from '../../../src/services/ami-chart.service';
import { AmiChartQueryParams } from '../../../src/dtos/ami-charts/ami-chart-query-params.dto';
import { AmiChartCreate } from '../../../src/dtos/ami-charts/ami-chart-create.dto';
import { AmiChartUpdate } from '../../../src/dtos/ami-charts/ami-chart-update.dto';

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
      id: `ami Id ${position}`,
      name: `ami name ${position}`,
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

  beforeEach(async () => {
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

  it('testing buildWhereClause() jurisdictionName param present', () => {
    const params: AmiChartQueryParams = {
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

  it('testing list() with jurisdictionName param present', async () => {
    const date = new Date();
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    prisma.amiChart.findMany = jest
      .fn()
      .mockResolvedValue(mockAmiChartSet(3, date, jurisdictionData));

    const params: AmiChartQueryParams = {
      jurisdictionName: 'test name',
    };

    expect(await service.list(params)).toEqual([
      {
        id: 'ami Id 0',
        name: 'ami name 0',
        jurisdictions: jurisdictionData,
        createdAt: date,
        updatedAt: date,
        items: [],
      },
      {
        id: 'ami Id 1',
        name: 'ami name 1',
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
        id: 'ami Id 2',
        name: 'ami name 2',
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
    prisma.amiChart.findUnique = jest
      .fn()
      .mockResolvedValue(mockAmiChart(3, date, jurisdictionData));

    expect(await service.findOne('example Id')).toEqual({
      id: 'ami Id 3',
      name: 'ami name 3',
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
    prisma.amiChart.create = jest
      .fn()
      .mockResolvedValue(mockAmiChart(3, date, jurisdictionData));

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
      name: 'ami name 3',
    };

    expect(await service.create(params)).toEqual({
      id: 'ami Id 3',
      name: 'ami name 3',
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
        name: 'ami name 3',
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
      name: 'ami name 4',
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
        {
          percentOfAmi: 3,
          householdSize: 3,
          income: 3,
        },
      ],
      name: 'ami name 4',
      id: 'ami Id 3',
    };

    expect(await service.update(params)).toEqual({
      id: 'ami Id 3',
      name: 'ami name 4',
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
        id: 'ami Id 3',
      },
    });

    expect(prisma.amiChart.update).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      data: {
        name: 'ami name 4',
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
        id: 'ami Id 3',
      },
    });
  });

  it('testing update() existing record not found', async () => {
    const jurisdictionData = {
      id: 'example Id',
      name: 'example name',
    };
    prisma.amiChart.findUnique = jest.fn().mockResolvedValue(null);
    prisma.amiChart.update = jest.fn().mockResolvedValue(null);

    const params: AmiChartUpdate = {
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
        {
          percentOfAmi: 3,
          householdSize: 3,
          income: 3,
        },
      ],
      name: 'ami name 4',
      id: 'ami Id 3',
    };

    await expect(
      async () => await service.update(params),
    ).rejects.toThrowError();

    expect(prisma.amiChart.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'ami Id 3',
      },
    });
  });

  it('testing delete()', async () => {
    const date = new Date();
    const jurisdictionData = undefined;
    prisma.amiChart.delete = jest
      .fn()
      .mockResolvedValue(mockAmiChart(3, date, jurisdictionData));

    expect(await service.delete('example Id')).toEqual({
      success: true,
    });

    expect(prisma.amiChart.delete).toHaveBeenCalledWith({
      where: {
        id: 'example Id',
      },
    });
  });
});
