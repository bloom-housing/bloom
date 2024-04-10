import {
  Controller,
  Get,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { PermissionAction } from '../decorators/permission-action.decorator';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { AdminOrJurisdictionalAdminGuard } from '../guards/admin-or-jurisdiction-admin.guard';
import { AppService } from '../services/app.service';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller()
@ApiExtraModels(SuccessDTO)
@ApiTags('root')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    operationId: 'healthCheck',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async healthCheck(): Promise<SuccessDTO> {
    return await this.appService.healthCheck();
  }

  @Put('clearTempFiles')
  @ApiOperation({
    summary: 'Trigger the removal of CSVs job',
    operationId: 'clearTempFiles',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @PermissionAction(permissionActions.submit)
  @UseInterceptors(ActivityLogInterceptor)
  @UseGuards(ApiKeyGuard, OptionalAuthGuard, AdminOrJurisdictionalAdminGuard)
  async clearTempFiles(): Promise<SuccessDTO> {
    return await this.appService.clearTempFiles();
  }
}
