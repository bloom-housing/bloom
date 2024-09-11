import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
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
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request as ExpressRequest, Response } from 'express';
import { ApplicationService } from '../services/application.service';
import { Application } from '../dtos/applications/application.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { PaginatedApplicationDto } from '../dtos/applications/paginated-application.dto';
import { ApplicationQueryParams } from '../dtos/applications/application-query-params.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { ApplicationUpdate } from '../dtos/applications/application-update.dto';
import { ApplicationCreate } from '../dtos/applications/application-create.dto';
import {
  AddressInput,
  BooleanInput,
  TextInput,
} from '../dtos/applications/application-multiselect-question-option.dto';
import { ValidationsGroupsEnum } from '../enums/shared/validation-groups-enum';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { mapTo } from '../utilities/mapTo';
import { User } from '../dtos/users/user.dto';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { PermissionAction } from '../decorators/permission-action.decorator';
import { ApplicationCsvExporterService } from '../services/application-csv-export.service';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { MostRecentApplicationQueryParams } from '../dtos/applications/most-recent-application-query-params.dto';
import { ExportLogInterceptor } from '../interceptors/export-log.interceptor';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { PublicAppsViewQueryParams } from '../dtos/applications/public-apps-view-params.dto';
import { PublicAppsViewResponse } from '../dtos/applications/public-apps-view-response.dto';

@Controller('applications')
@ApiTags('applications')
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
    groups: [ValidationsGroupsEnum.default, ValidationsGroupsEnum.partners],
  }),
)
@ApiExtraModels(IdDTO, AddressInput, BooleanInput, TextInput)
@UseGuards(ApiKeyGuard, OptionalAuthGuard)
@PermissionTypeDecorator('application')
@UseInterceptors(ActivityLogInterceptor)
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly applicationCsvExportService: ApplicationCsvExporterService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get a paginated set of applications',
    operationId: 'list',
  })
  @ApiOkResponse({ type: PaginatedApplicationDto })
  async list(
    @Request() req: ExpressRequest,
    @Query() queryParams: ApplicationQueryParams,
  ) {
    return await this.applicationService.list(queryParams, req);
  }

  @Get(`mostRecentlyCreated`)
  @ApiOperation({
    summary: 'Get the most recent application submitted by the user',
    operationId: 'mostRecentlyCreated',
  })
  @ApiOkResponse({ type: Application })
  async mostRecentlyCreated(
    @Request() req: ExpressRequest,
    @Query() queryParams: MostRecentApplicationQueryParams,
  ): Promise<Application> {
    return await this.applicationService.mostRecentlyCreated(queryParams, req);
  }

  @Get('publicAppsView')
  @ApiOperation({
    summary: 'Get public applications info',
    operationId: 'publicAppsView',
  })
  @ApiOkResponse({ type: PublicAppsViewResponse })
  async publicAppsView(
    @Request() req: ExpressRequest,
    @Query() queryParams: PublicAppsViewQueryParams,
  ): Promise<PublicAppsViewResponse> {
    return await this.applicationService.publicAppsView(queryParams, req);
  }

  @Get(`csv`)
  @ApiOperation({
    summary: 'Get applications as csv',
    operationId: 'listAsCsv',
  })
  @Header('Content-Type', 'text/csv')
  @UseInterceptors(ExportLogInterceptor)
  async listAsCsv(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
    @Query(new ValidationPipe(defaultValidationPipeOptions))
    queryParams: ApplicationCsvQueryParams,
  ): Promise<StreamableFile> {
    return await this.applicationCsvExportService.exportFile(
      req,
      res,
      queryParams,
    );
  }

  @Get(`:applicationId`)
  @ApiOperation({
    summary: 'Get application by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: Application })
  async retrieve(
    @Request() req: ExpressRequest,
    @Param('applicationId') applicationId: string,
  ) {
    return this.applicationService.findOne(applicationId, req);
  }

  @Post()
  @ApiOperation({
    summary:
      'Create application (used by partners to hand create an application)',
    operationId: 'create',
  })
  @ApiOkResponse({ type: Application })
  async create(
    @Body() dto: ApplicationCreate,
    @Request() req: ExpressRequest,
  ): Promise<Application> {
    return await this.applicationService.create(
      dto,
      false,
      mapTo(User, req['user']),
    );
  }

  @Post(`submit`)
  @ApiOperation({
    summary: 'Submit application (used by applicants applying to a listing)',
    operationId: 'submit',
  })
  @ApiOkResponse({ type: Application })
  @UsePipes(
    new ValidationPipe({
      ...defaultValidationPipeOptions,
      groups: [ValidationsGroupsEnum.default, ValidationsGroupsEnum.applicants],
    }),
  )
  @UseGuards(OptionalAuthGuard)
  @PermissionAction(permissionActions.submit)
  @UseInterceptors(ActivityLogInterceptor)
  async submit(
    @Request() req: ExpressRequest,
    @Body() dto: ApplicationCreate,
  ): Promise<Application> {
    const user = mapTo(User, req['user']);
    return await this.applicationService.create(dto, true, user);
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify application can be saved',
    operationId: 'submissionValidation',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @UsePipes(
    new ValidationPipe({
      ...defaultValidationPipeOptions,
      groups: [ValidationsGroupsEnum.default, ValidationsGroupsEnum.applicants],
    }),
  )
  @PermissionAction(permissionActions.submit)
  @UseInterceptors(ActivityLogInterceptor)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submissionValidation(@Body() dto: ApplicationCreate): SuccessDTO {
    // if we succeeded then the record is good to submit
    return {
      success: true,
    };
  }

  @Put(`:applicationId`)
  @ApiOperation({ summary: 'Update application by id', operationId: 'update' })
  @ApiOkResponse({ type: Application })
  async update(
    @Param('id') applicationId: string,
    @Body() dto: ApplicationUpdate,
    @Request() req: ExpressRequest,
  ): Promise<Application> {
    return await this.applicationService.update(dto, mapTo(User, req['user']));
  }

  @Delete()
  @ApiOperation({ summary: 'Delete application by id', operationId: 'delete' })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO, @Request() req: ExpressRequest) {
    return await this.applicationService.delete(
      dto.id,
      mapTo(User, req['user']),
    );
  }
}
