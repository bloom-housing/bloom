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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ApplicationsService } from "./applications.service"
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import {
  ApplicationCreateDto,
  ApplicationDto,
  ApplicationUpdateDto,
  PaginatedApplicationDto,
} from "./dto/application.dto"
import { Expose, Transform } from "class-transformer"
import { IsBoolean, IsOptional, IsString, IsIn } from "class-validator"
import { PaginationQueryParams } from "../shared/dto/pagination.dto"
import { ValidationsGroupsEnum } from "../shared/types/validations-groups-enum"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { ApplicationCsvExporter } from "../csv/application-csv-exporter"
import { applicationPreferenceApiExtraModels } from "./application-preference-api-extra-models"
import { ListingsService } from "../listings/listings.service"

enum OrderByParam {
  firstName = "applicant.firstName",
  lastName = "applicant.lastName",
  submissionDate = "application.submissionDate",
  createdAt = "application.createdAt",
}

enum OrderParam {
  ASC = "ASC",
  DESC = "DESC",
}

export class PaginatedApplicationListQueryParams extends PaginationQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  listingId?: string

  @Expose()
  @ApiProperty({
    type: String,
    example: "search",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  search?: string

  @Expose()
  @ApiProperty({
    type: String,
    example: "userId",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  userId?: string

  @Expose()
  @ApiProperty({
    enum: Object.keys(OrderByParam),
    example: "createdAt",
    default: "createdAt",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsIn(Object.values(OrderByParam), { groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) =>
    value ? (OrderByParam[value] ? OrderByParam[value] : value) : OrderByParam.createdAt
  )
  orderBy?: OrderByParam

  @Expose()
  @ApiProperty({
    enum: OrderParam,
    example: "DESC",
    default: "DESC",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsIn(Object.keys(OrderParam), { groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => (value ? value : OrderParam.DESC))
  order?: OrderParam

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value: string | undefined) => {
      switch (value) {
        case "true":
          return true
        case "false":
          return false
        default:
          return undefined
      }
    },
    { toClassOnly: true }
  )
  markedAsDuplicate?: boolean
}

export class ApplicationsCsvListQueryParams extends PaginatedApplicationListQueryParams {
  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => value === "true", { toClassOnly: true })
  includeHeaders?: boolean

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform((value: string | undefined) => value === "true", { toClassOnly: true })
  includeDemographics?: boolean
}

@Controller("applications")
@ApiTags("applications")
@ApiBearerAuth()
@ResourceType("application")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
    groups: [ValidationsGroupsEnum.default, ValidationsGroupsEnum.partners],
  })
)
@ApiExtraModels(...applicationPreferenceApiExtraModels)
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly listingsService: ListingsService,
    private readonly applicationCsvExporter: ApplicationCsvExporter
  ) {}

  @Get()
  @ApiOperation({ summary: "List applications", operationId: "list" })
  async list(
    @Query() queryParams: PaginatedApplicationListQueryParams
  ): Promise<PaginatedApplicationDto> {
    return mapTo(PaginatedApplicationDto, await this.applicationsService.listPaginated(queryParams))
  }

  @Get(`csv`)
  @ApiOperation({ summary: "List applications as csv", operationId: "listAsCsv" })
  @Header("Content-Type", "text/csv")
  async listAsCsv(@Query() queryParams: ApplicationsCsvListQueryParams): Promise<string> {
    const applications = await this.applicationsService.list(queryParams)
    const listing = await this.listingsService.findOne(queryParams.listingId)
    return this.applicationCsvExporter.export(
      applications,
      listing.CSVFormattingType,
      queryParams.includeHeaders,
      queryParams.includeDemographics
    )
  }

  @Post()
  @ApiOperation({ summary: "Create application", operationId: "create" })
  async create(@Body() applicationCreateDto: ApplicationCreateDto): Promise<ApplicationDto> {
    const application = await this.applicationsService.create(applicationCreateDto)
    return mapTo(ApplicationDto, application)
  }

  @Get(`:applicationId`)
  @ApiOperation({ summary: "Get application by id", operationId: "retrieve" })
  async retrieve(@Param("applicationId") applicationId: string): Promise<ApplicationDto> {
    const app = await this.applicationsService.findOne(applicationId)
    return mapTo(ApplicationDto, app)
  }

  @Put(`:applicationId`)
  @ApiOperation({ summary: "Update application by id", operationId: "update" })
  async update(
    @Param("applicationId") applicationId: string,
    @Body() applicationUpdateDto: ApplicationUpdateDto
  ): Promise<ApplicationDto> {
    return mapTo(ApplicationDto, await this.applicationsService.update(applicationUpdateDto))
  }

  @Delete(`:applicationId`)
  @ApiOperation({ summary: "Delete application by id", operationId: "delete" })
  async delete(@Param("applicationId") applicationId: string) {
    await this.applicationsService.delete(applicationId)
  }
}
