import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import { ApplicationDto } from "./dto/application.dto"
import { ValidationsGroupsEnum } from "../shared/types/validations-groups-enum"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { applicationMultiselectQuestionApiExtraModels } from "./types/application-multiselect-question-api-extra-models"
import { ApplicationsService } from "./services/applications.service"
import { ActivityLogInterceptor } from "../activity-log/interceptors/activity-log.interceptor"
import { PaginatedApplicationListQueryParams } from "./dto/paginated-application-list-query-params"
import {
  ApplicationsCsvListQueryParams,
  RawApplicationsListQueryParams,
} from "./dto/applications-csv-list-query-params"
import { ApplicationsApiExtraModel } from "./types/applications-api-extra-model"
import { PaginatedApplicationDto } from "./dto/paginated-application.dto"
import { ApplicationCreateDto } from "./dto/application-create.dto"
import { ApplicationUpdateDto } from "./dto/application-update.dto"
import { IdDto } from "../shared/dto/id.dto"
import { StatusDto } from "../shared/dto/status.dto"

@Controller("applications")
@ApiTags("applications")
@ApiBearerAuth()
@ResourceType("application")
@UseGuards(OptionalAuthGuard)
@UseInterceptors(ActivityLogInterceptor)
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
    groups: [ValidationsGroupsEnum.default, ValidationsGroupsEnum.partners],
  })
)
@ApiExtraModels(...applicationMultiselectQuestionApiExtraModels, ApplicationsApiExtraModel)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @ApiOperation({ summary: "List applications", operationId: "list" })
  async list(
    @Query() queryParams: PaginatedApplicationListQueryParams
  ): Promise<PaginatedApplicationDto> {
    return mapTo(PaginatedApplicationDto, await this.applicationsService.listPaginated(queryParams))
  }

  @Get(`csv`)
  @ApiOperation({ summary: "List applications as csv", operationId: "listAsCsv" })
  listAsCsv(
    @Query(new ValidationPipe(defaultValidationPipeOptions))
    queryParams: ApplicationsCsvListQueryParams
  ): StatusDto {
    return this.applicationsService.sendExport(queryParams)
  }

  @Get(`rawApplicationsList`)
  @ApiOperation({ summary: "Raw list of applications", operationId: "rawApplicationsList" })
  async rawApplicationsList(
    @Query(new ValidationPipe(defaultValidationPipeOptions))
    queryParams: RawApplicationsListQueryParams
  ): Promise<any[]> {
    queryParams.includeDemographics = true
    return await this.applicationsService.rawListWithFlagged(queryParams)
  }

  @Post()
  @ApiOperation({ summary: "Create application", operationId: "create" })
  async create(@Body() applicationCreateDto: ApplicationCreateDto): Promise<ApplicationDto> {
    const application = await this.applicationsService.create(applicationCreateDto)
    return mapTo(ApplicationDto, application)
  }

  @Get(`:id`)
  @ApiOperation({ summary: "Get application by id", operationId: "retrieve" })
  async retrieve(
    @Param("id", new ParseUUIDPipe({ version: "4" })) applicationId: string
  ): Promise<ApplicationDto> {
    const app = await this.applicationsService.findOne(applicationId)
    return mapTo(ApplicationDto, app)
  }

  @Put(`:id`)
  @ApiOperation({ summary: "Update application by id", operationId: "update" })
  async update(
    @Param("id") applicationId: string,
    @Body() applicationUpdateDto: ApplicationUpdateDto
  ): Promise<ApplicationDto> {
    return mapTo(ApplicationDto, await this.applicationsService.update(applicationUpdateDto))
  }

  // codegen generate unusable code for this, if we don't have a body
  @Delete()
  @ApiOperation({ summary: "Delete application by id", operationId: "delete" })
  async delete(@Body() dto: IdDto) {
    await this.applicationsService.delete(dto.id)
  }
}
