import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../shared/validations-groups.enum"
import { PaginationQueryParams } from "../shared/dto/pagination.dto"
import { ApplicationFlaggedSetService } from "./application-flagged-set.service"
import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ResourceType } from "../auth/resource_type.decorator"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { Request as ExpressRequest } from "express"
import { mapTo } from "../shared/mapTo"
import {
  ApplicationFlaggedSetDto,
  PaginatedApplicationFlaggedSetDto,
} from "./dto/application-flagged-set.dto"
import { AuthzGuard } from "../auth/authz.guard"
import { ApplicationsCsvListQueryParams } from "../applications/applications.controller"
import { authzActions, AuthzService } from "../auth/authz.service"
import { CsvBuilder } from "../csv/csv-builder.service"
import {
  applicationFormattingMetadataAggregateFactory,
  CSVFormattingType,
} from "../csv/formatting/application-formatting-metadata-factory"

export class ApplicationFlaggedSetListQueryParams extends PaginationQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  listingId?: string
}

@Controller("applicationFlaggedSets")
@ApiTags("applicationFlaggedSets")
@ApiBearerAuth()
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
    groups: [ValidationsGroupsEnum.default],
  })
)
export class ApplicationFlaggedSetController {
  constructor(
    private readonly applicationFlaggedSetsService: ApplicationFlaggedSetService,
    private readonly authzService: AuthzService,
    private readonly csvBuilder: CsvBuilder
  ) {}

  @Get()
  @ApiOperation({ summary: "List application flagged sets", operationId: "list" })
  async list(
    @Request() req: ExpressRequest,
    @Query() queryParams: ApplicationFlaggedSetListQueryParams
  ): Promise<PaginatedApplicationFlaggedSetDto> {
    const response = await this.applicationFlaggedSetsService.list(queryParams)
    return mapTo(PaginatedApplicationFlaggedSetDto, response)
  }

  @Get(`:afsId`)
  @ApiOperation({ summary: "Get application by id", operationId: "unresolvedList" })
  async unresolvedList(
    @Request() req: ExpressRequest,
    @Param("afsId") afsId: string
  ): Promise<ApplicationFlaggedSetDto> {
    const app = await this.applicationFlaggedSetsService.unresolvedList(afsId)
    return mapTo(ApplicationFlaggedSetDto, app)
  }

  private authorizeUserAction(user, app, action) {
    return this.authzService.canOrThrow(user, "application", action, {
      ...app,
      user_id: app.user?.id,
      listing_id: app.listing?.id,
    })
  }

  @Get(`csv`)
  @ApiOperation({ summary: "List duplicate applications as csv", operationId: "listAsCsv" })
  @Header("Content-Type", "text/csv")
  async listAsCsv(
    @Request() req: ExpressRequest,
    @Query() queryParams: ApplicationsCsvListQueryParams
  ): Promise<string> {
    const applications = await this.applicationFlaggedSetsService.listCsv(
      queryParams.listingId,
      null
    )
    console.log("Netra dup csv apps", applications)
    await Promise.all(
      applications.map(async (application) => {
        await this.authorizeUserAction(req.user, application, authzActions.read)
      })
    )
    return this.csvBuilder.build(
      applications,
      applicationFormattingMetadataAggregateFactory,
      // Every application points to the same listing
      applications.length ? applications[0].listing.CSVFormattingType : CSVFormattingType.basic,
      queryParams.includeHeaders
    )
  }
}
