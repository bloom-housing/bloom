import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { DefaultAuthGuard } from "../auth/guards/default.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import { AmiChartsService } from "./ami-charts.service"
import { AmiChartCreateDto, AmiChartDto, AmiChartUpdateDto } from "./dto/ami-chart.dto"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { AmiChartListQueryParams } from "./dto/ami-chart-list-query-params"
import { IdDto } from "../shared/dto/id.dto"

@Controller("/amiCharts")
@ApiTags("amiCharts")
@ApiBearerAuth()
@ResourceType("amiChart")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class AmiChartsController {
  constructor(private readonly amiChartsService: AmiChartsService) {}

  @Get()
  @ApiOperation({ summary: "List amiCharts", operationId: "list" })
  async list(@Query() queryParams: AmiChartListQueryParams): Promise<AmiChartDto[]> {
    return mapTo(AmiChartDto, await this.amiChartsService.list(queryParams))
  }

  @Post()
  @ApiOperation({ summary: "Create amiChart", operationId: "create" })
  async create(@Body() amiChart: AmiChartCreateDto): Promise<AmiChartDto> {
    return mapTo(AmiChartDto, await this.amiChartsService.create(amiChart))
  }

  @Put(`:amiChartId`)
  @ApiOperation({ summary: "Update amiChart", operationId: "update" })
  async update(@Body() amiChart: AmiChartUpdateDto): Promise<AmiChartDto> {
    return mapTo(AmiChartDto, await this.amiChartsService.update(amiChart))
  }

  @Get(`:amiChartId`)
  @ApiOperation({ summary: "Get amiChart by id", operationId: "retrieve" })
  async retrieve(@Param("amiChartId") amiChartId: string): Promise<AmiChartDto> {
    return mapTo(AmiChartDto, await this.amiChartsService.findOne({ where: { id: amiChartId } }))
  }

  @Delete()
  @ApiOperation({ summary: "Delete amiChart by id", operationId: "delete" })
  async delete(@Body() dto: IdDto): Promise<void> {
    return await this.amiChartsService.delete(dto.id)
  }
}
