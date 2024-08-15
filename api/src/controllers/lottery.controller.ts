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
import { Request as ExpressRequest, Response } from 'express';
import { LotteryService } from '../services/lottery.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { ExportLogInterceptor } from '../interceptors/export-log.interceptor';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { LotteryActivityLogItem } from '../dtos/lottery/lottery-activity-log-item.dto';
import { ActivityLogMetadata } from '../../src/decorators/activity-log-metadata.decorator';
import { ListingLotteryStatus } from '../../src/dtos/listings/listing-lottery-status.dto';
import { mapTo } from '../../src/utilities/mapTo';
import { User } from '../../src/dtos/users/user.dto';
import { LotteryStatusEnum } from '@prisma/client';
import { PermissionAction } from '../../src/decorators/permission-action.decorator';
import { permissionActions } from '../../src/enums/permissions/permission-actions-enum';
import { AdminOrJurisdictionalAdminGuard } from '../../src/guards/admin-or-jurisdiction-admin.guard';

@Controller('lottery')
@ApiTags('lottery')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@PermissionTypeDecorator('lottery')
@UseGuards(ApiKeyGuard, OptionalAuthGuard)
@UseInterceptors(ActivityLogInterceptor)
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

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
    return await this.lotteryService.lotteryExport(req, res, queryParams);
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
  @UseGuards(ApiKeyGuard)
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

  @Put('expireLotteries')
  @ApiOperation({
    summary: 'Trigger the lottery process job',
    operationId: 'expireLotteries',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @PermissionAction(permissionActions.update)
  @UseInterceptors(ActivityLogInterceptor)
  @UseGuards(OptionalAuthGuard, AdminOrJurisdictionalAdminGuard)
  async expireLotteries(): Promise<SuccessDTO> {
    return await this.lotteryService.expireLotteries();
  }
}
