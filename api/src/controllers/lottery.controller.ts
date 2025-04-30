import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  Request,
  Res,
  StreamableFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LotteryStatusEnum } from '@prisma/client';
import { Request as ExpressRequest, Response } from 'express';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { ActivityLogMetadata } from '../../src/decorators/activity-log-metadata.decorator';
import { AdminOrJurisdictionalAdminGuard } from '../../src/guards/admin-or-jurisdiction-admin.guard';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { ApplicationExporterService } from '../services/application-exporter.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { ExportLogInterceptor } from '../interceptors/export-log.interceptor';
import { ListingLotteryStatus } from '../../src/dtos/listings/listing-lottery-status.dto';
import { LotteryActivityLogItem } from '../dtos/lottery/lottery-activity-log-item.dto';
import { LotteryService } from '../services/lottery.service';
import { mapTo } from '../../src/utilities/mapTo';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { PermissionAction } from '../../src/decorators/permission-action.decorator';
import { permissionActions } from '../../src/enums/permissions/permission-actions-enum';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { PublicLotteryResult } from '../../src/dtos/lottery/lottery-public-result.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../../src/dtos/users/user.dto';
import { PublicLotteryTotal } from '../../src/dtos/lottery/lottery-public-total.dto';

@Controller('lottery')
@ApiTags('lottery')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@PermissionTypeDecorator('lottery')
@UseGuards(ApiKeyGuard, OptionalAuthGuard)
@UseInterceptors(ActivityLogInterceptor)
export class LotteryController {
  constructor(
    private readonly lotteryService: LotteryService,
    private readonly applicationExporterService: ApplicationExporterService,
  ) {}

  @Put(`generateLotteryResults`)
  @ApiOperation({
    summary: 'Generate the lottery results for a listing',
    operationId: 'lotteryGenerate',
  })
  @ActivityLogMetadata([
    {
      targetPropertyName: 'lotteryStatus',
      defaultValue: LotteryStatusEnum.ran,
    },
  ])
  @UseInterceptors(ExportLogInterceptor)
  async lotteryGenerate(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
    @Body() queryParams: ApplicationCsvQueryParams,
  ): Promise<SuccessDTO> {
    return await this.lotteryService.lotteryGenerate(req, res, queryParams);
  }

  @Get(`getLotteryResults`)
  @ApiOperation({
    summary: 'Get applications lottery results',
    operationId: 'lotteryResults',
  })
  @Header('Content-Type', 'application/zip')
  @UseInterceptors(ExportLogInterceptor)
  async lotteryExport(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
    @Query(new ValidationPipe(defaultValidationPipeOptions))
    queryParams: ApplicationCsvQueryParams,
  ): Promise<StreamableFile> {
    return await this.applicationExporterService.exporter(
      req,
      queryParams,
      true,
      true,
    );
  }

  @Get(`getLotteryResultsSecure`)
  @ApiOperation({
    summary: 'Get applications lottery results',
    operationId: 'lotteryResultsSecure',
  })
  @UseInterceptors(ExportLogInterceptor)
  @ApiOkResponse({ type: String })
  async lotteryExportSecure(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
    @Query(new ValidationPipe(defaultValidationPipeOptions))
    queryParams: ApplicationCsvQueryParams,
  ): Promise<string> {
    return await this.applicationExporterService.exporterSecure(
      req,
      queryParams,
      true,
      true,
    );
  }

  @Put('lotteryStatus')
  @ApiOperation({
    summary: 'Change the listing lottery status',
    operationId: 'lotteryStatus',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @ActivityLogMetadata([
    { targetPropertyName: 'lotteryStatus', propertyPath: 'lotteryStatus' },
  ])
  async lotteryStatus(
    @Request() req: ExpressRequest,
    @Body() dto: ListingLotteryStatus,
  ): Promise<SuccessDTO> {
    return await this.lotteryService.lotteryStatus(
      dto,
      mapTo(User, req['user']),
    );
  }

  @Get('lotteryActivityLog/:id')
  @ApiOkResponse({ type: LotteryActivityLogItem, isArray: true })
  @ApiOperation({
    summary: 'Get a lottery activity log',
    operationId: 'lotteryActivityLog',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  async lotteryActivityLog(
    @Request() req: ExpressRequest,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<LotteryActivityLogItem[]> {
    return await this.lotteryService.lotteryActivityLog(
      id,
      mapTo(User, req['user']),
    );
  }

  @Put('autoPublishResults')
  @ApiOperation({
    summary: 'Trigger the lottery auto publish process job',
    operationId: 'autoPublishResults',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @PermissionAction(permissionActions.update)
  @UseInterceptors(ActivityLogInterceptor)
  @UseGuards(OptionalAuthGuard, AdminOrJurisdictionalAdminGuard)
  async autoPublishResults(): Promise<SuccessDTO> {
    return await this.lotteryService.autoPublishResults();
  }

  @Put('expireLotteries')
  @ApiOperation({
    summary: 'Trigger the lottery expiration process job',
    operationId: 'expireLotteries',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @PermissionAction(permissionActions.update)
  @UseInterceptors(ActivityLogInterceptor)
  @UseGuards(OptionalAuthGuard, AdminOrJurisdictionalAdminGuard)
  async expireLotteries(): Promise<SuccessDTO> {
    return await this.lotteryService.expireLotteries();
  }

  @Get(`publicLotteryResults/:id`)
  @ApiOkResponse({
    type: PublicLotteryResult,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get lottery results by application id',
    operationId: 'publicLotteryResults',
  })
  async publicLotteryResults(
    @Request() req: ExpressRequest,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<PublicLotteryResult[]> {
    return this.lotteryService.publicLotteryResults(
      id,
      mapTo(User, req['user']),
    );
  }

  @Get(`lotteryTotals/:id`)
  @ApiOkResponse({
    type: PublicLotteryTotal,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Get lottery totals by listing id',
    operationId: 'lotteryTotals',
  })
  async lotteryTotals(
    @Request() req: ExpressRequest,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<PublicLotteryTotal[]> {
    return this.lotteryService.lotteryTotals(id, mapTo(User, req['user']));
  }
}
