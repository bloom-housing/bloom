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
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
// The linter struggles with this import. It flags it as not being used despite its usage
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AmiChartService } from '../services/ami-chart.service';
import { AmiChart } from '../dtos/ami-charts/ami-chart.dto';
import { AmiChartCreate } from '../dtos/ami-charts/ami-chart-create.dto';
import { AmiChartUpdate } from '../dtos/ami-charts/ami-chart-update.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { AmiChartQueryParams } from '../dtos/ami-charts/ami-chart-query-params.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('/amiCharts')
@ApiTags('amiCharts')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@PermissionTypeDecorator('amiChart')
@UseGuards(ApiKeyGuard, JwtAuthGuard, PermissionGuard)
@ApiExtraModels(AmiChartQueryParams)
export class AmiChartController {
  constructor(private readonly AmiChartService: AmiChartService) {}

  @Get()
  @ApiOperation({ summary: 'List amiCharts', operationId: 'list' })
  @ApiOkResponse({ type: AmiChart, isArray: true })
  async list(@Query() queryParams: AmiChartQueryParams): Promise<AmiChart[]> {
    return await this.AmiChartService.list(queryParams);
  }

  @Get(`:amiChartId`)
  @ApiOperation({ summary: 'Get amiChart by id', operationId: 'retrieve' })
  @ApiOkResponse({ type: AmiChart })
  async retrieve(@Param('amiChartId') amiChartId: string): Promise<AmiChart> {
    return this.AmiChartService.findOne(amiChartId);
  }

  @Post()
  @ApiOperation({ summary: 'Create amiChart', operationId: 'create' })
  @ApiOkResponse({ type: AmiChart })
  async create(@Body() amiChart: AmiChartCreate): Promise<AmiChart> {
    return await this.AmiChartService.create(amiChart);
  }

  @Put(`:amiChartId`)
  @ApiOperation({ summary: 'Update amiChart', operationId: 'update' })
  @ApiOkResponse({ type: AmiChart })
  async update(@Body() amiChart: AmiChartUpdate): Promise<AmiChart> {
    return await this.AmiChartService.update(amiChart);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete amiChart by id', operationId: 'delete' })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO): Promise<SuccessDTO> {
    return await this.AmiChartService.delete(dto.id);
  }
}
