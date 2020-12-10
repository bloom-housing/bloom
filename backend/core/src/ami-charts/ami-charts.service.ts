import { AbstractServiceFactory } from "../shared/abstract-service"
import { AmiChart } from "../entity/ami-chart.entity"
import { AmiChartCreateDto, AmiChartUpdateDto } from "./ami-chart.dto"

export class AmiChartsService extends AbstractServiceFactory<
  AmiChart,
  AmiChartCreateDto,
  AmiChartUpdateDto
>(AmiChart) {}
