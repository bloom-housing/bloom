import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { AmiChart } from '../dtos/ami-charts/ami-chart.dto';
import { AmiChartCreate } from '../dtos/ami-charts/ami-chart-create.dto';
import { AmiChartUpdate } from '../dtos/ami-charts/ami-chart-update.dto';
import { AmiChartQueryParams } from '../dtos/ami-charts/ami-chart-query-params.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { AmiChartItem } from '../dtos/units/ami-chart-item-get.dto';

/*
  this is the service for ami charts
  it handles all the backend's business logic for reading/writing/deleting ami chart data
*/

const view: Prisma.AmiChartInclude = {
  jurisdictions: true,
};

@Injectable()
export class AmiChartService {
  constructor(private prisma: PrismaService) {}

  /*
    this will get a set of ami charts given the params passed in
  */
  async list(params: AmiChartQueryParams): Promise<AmiChart[]> {
    const rawAmiCharts = await this.prisma.amiChart.findMany({
      include: view,
      where: this.buildWhereClause(params),
    });
    return mapTo(AmiChart, rawAmiCharts);
  }

  /*
    this helps build the where clause for the list()
  */
  buildWhereClause(params: AmiChartQueryParams): Prisma.AmiChartWhereInput {
    const filters: Prisma.AmiChartWhereInput[] = [];
    if (params && 'jurisdictionId' in params && params.jurisdictionId) {
      filters.push({
        jurisdictions: {
          id: params.jurisdictionId,
        },
      });
    }
    return {
      AND: filters,
    };
  }

  /*
    this will return 1 ami chart or error
  */
  async findOne(amiChartId: string): Promise<AmiChart> {
    const amiChartRaw = await this.prisma.amiChart.findUnique({
      include: view,
      where: {
        id: amiChartId,
      },
    });

    if (!amiChartRaw) {
      throw new NotFoundException(
        `amiChartId ${amiChartId} was requested but not found`,
      );
    }

    return mapTo(AmiChart, amiChartRaw);
  }

  /*
    this will create an ami chart
  */
  async create(incomingData: AmiChartCreate): Promise<AmiChart> {
    const rawResult = await this.prisma.amiChart.create({
      data: {
        ...incomingData,
        items: this.reconstructItems(incomingData.items),
        jurisdictions: {
          connect: {
            id: incomingData.jurisdictions.id,
          },
        },
      },
      include: view,
    });

    return mapTo(AmiChart, rawResult);
  }

  /*
    this will update an ami chart's name or items field
    if no ami chart has the id of the incoming argument an error is thrown
  */
  async update(incomingData: AmiChartUpdate): Promise<AmiChart> {
    await this.findOrThrow(incomingData.id);
    const rawResults = await this.prisma.amiChart.update({
      include: view,
      data: {
        ...incomingData,
        items: this.reconstructItems(incomingData.items),
        jurisdictions: undefined,
        id: undefined,
      },
      where: {
        id: incomingData.id,
      },
    });
    return mapTo(AmiChart, rawResults);
  }

  /*
    this will delete an ami chart
  */
  async delete(amiChartId: string): Promise<SuccessDTO> {
    await this.findOrThrow(amiChartId);
    await this.prisma.amiChart.delete({
      where: {
        id: amiChartId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }

  reconstructItems(items: AmiChartItem[]): Prisma.JsonArray {
    return items.map((item) => ({
      percentOfAmi: item.percentOfAmi,
      householdSize: item.householdSize,
      income: item.income,
    })) as Prisma.JsonArray;
  }

  async findOrThrow(amiChartId: string): Promise<boolean> {
    const amiChart = await this.prisma.amiChart.findUnique({
      where: {
        id: amiChartId,
      },
    });

    if (!amiChart) {
      throw new NotFoundException(
        `amiChartId ${amiChartId} was requested but not found`,
      );
    }
    return true;
  }
}
