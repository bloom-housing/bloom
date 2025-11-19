import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { ValidationsGroupsEnum } from '../enums/shared/validation-groups-enum';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { DataExplorerService } from '../services/data-explorer.service';
import { DataExplorerParams } from '../dtos/applications/data-explorer/params/data-explorer-params.dto';
import { DataExplorerReport } from '../dtos/applications/data-explorer/products/data-explorer-report.dto';

@Controller('generate-report')
@ApiTags('data-explorer')
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
    groups: [ValidationsGroupsEnum.default, ValidationsGroupsEnum.partners],
  }),
)
@UseGuards(ApiKeyGuard, JwtAuthGuard)
@PermissionTypeDecorator('application')
@UseInterceptors(ActivityLogInterceptor)
export class DataExplorerController {
  constructor(private readonly dataExplorerService: DataExplorerService) {}

  @Post()
  @ApiOperation({
    summary: 'Generate a report',
    operationId: 'generateReport',
  })
  @ApiOkResponse({ type: DataExplorerReport })
  async generateReport(
    @Request() req: ExpressRequest,
    @Query() queryParams: DataExplorerParams,
  ) {
    return await this.dataExplorerService.generateReport(queryParams, req);
  }
}
