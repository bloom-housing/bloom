import {
  Controller,
  Get,
  Header,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiProduces,
} from '@nestjs/swagger';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { PermissionAction } from '../decorators/permission-action.decorator';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { AdminOrJurisdictionalAdminGuard } from '../guards/admin-or-jurisdiction-admin.guard';
import { AppService } from '../services/app.service';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { PrismaService } from '../services/prisma.service';

@Controller()
@ApiExtraModels(SuccessDTO)
@ApiTags('root')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    operationId: 'healthCheck',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async healthCheck(): Promise<SuccessDTO> {
    return await this.appService.healthCheck();
  }

  @Get('teapot')
  @ApiOperation({
    summary: 'Tip me over and pour me out',
    operationId: 'teapot',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async teapot(): Promise<SuccessDTO> {
    return await this.appService.teapot();
  }

  @Get('prisma_metrics')
  @ApiOperation({
    summary: 'Prisma database metrics in Prometheus format',
    operationId: 'prisma_metrics',
  })
  @ApiProduces('text/plain')
  @Header('Content-Type', 'text/plain')
  async prismaMetrics(): Promise<string> {
    if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
      return await this.prisma.$metrics.prometheus();
    }
    return 'Not enabled';
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
