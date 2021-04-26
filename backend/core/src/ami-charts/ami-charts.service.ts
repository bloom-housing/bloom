import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { AmiChart } from "./entities/ami-chart.entity"
import { AmiChartCreateDto, AmiChartUpdateDto } from "./dto/ami-chart.dto"

export class AmiChartsService extends AbstractServiceFactory<
  AmiChart,
  AmiChartCreateDto,
  AmiChartUpdateDto
>(AmiChart) {}
