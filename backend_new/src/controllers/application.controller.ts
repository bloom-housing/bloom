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
  StreamableFile,
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
import { Request as ExpressRequest } from 'express';
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
import { mapTo } from '../utilities/mapTo';
import { User } from '../dtos/users/user.dto';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { ApplicationCsvExporterService } from '../services/application-csv-export.service';

@Controller('applications')
@ApiTags('applications')
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
    groups: [ValidationsGroupsEnum.default, ValidationsGroupsEnum.partners],
  }),
)
@ApiExtraModels(IdDTO, AddressInput, BooleanInput, TextInput)
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
  async list(@Query() queryParams: ApplicationQueryParams) {
    return await this.applicationService.list(queryParams);
  }

  @Get(`csv`)
  @ApiOperation({
    summary: 'Get applications as csv',
    operationId: 'listAsCsv',
  })
  @Header('Content-Type', 'application/json')
  async listAsCsv(
    @Request() req: ExpressRequest,
    @Query(new ValidationPipe(defaultValidationPipeOptions))
    queryParams: ApplicationCsvQueryParams,
  ): Promise<StreamableFile> {
    return await this.applicationCsvExportService.export(queryParams, req);
  }

  @Get(`:applicationId`)
  @ApiOperation({
    summary: 'Get application by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: Application })
  async retrieve(@Param('applicationId') applicationId: string) {
    return this.applicationService.findOne(applicationId);
  }

  @Post()
  @ApiOperation({
    summary:
      'Create application (used by partners to hand create an application)',
    operationId: 'create',
  })
  @ApiOkResponse({ type: Application })
  async create(@Body() dto: ApplicationCreate): Promise<Application> {
    return await this.applicationService.create(dto, false);
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submissionValidation(@Body() dto: ApplicationCreate): SuccessDTO {
    // if we succeeded then the record is good to submit
    return {
      success: true,
    };
  }

  @Put(`:id`)
  @ApiOperation({ summary: 'Update application by id', operationId: 'update' })
  @ApiOkResponse({ type: Application })
  async update(
    @Param('id') applicationId: string,
    @Body() dto: ApplicationUpdate,
  ): Promise<Application> {
    return await this.applicationService.update(dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete application by id', operationId: 'delete' })
  @ApiOkResponse({ type: SuccessDTO })
  async delete(@Body() dto: IdDTO) {
    return await this.applicationService.delete(dto.id);
  }
}
