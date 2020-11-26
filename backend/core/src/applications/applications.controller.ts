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
  UseGuards,
} from "@nestjs/common"
import { Request as ExpressRequest } from "express"
import { ApplicationsService } from "./applications.service"
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"
import { AuthzGuard } from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { authzActions, AuthzService } from "../auth/authz.service"
import { EmailService } from "../shared/email.service"
import { ListingsService } from "../listings/listings.service"
import { mapTo } from "../shared/mapTo"
import {
  ApplicationCreateDto,
  ApplicationDto,
  ApplicationUpdateDto,
  PaginatedApplicationDto,
} from "./dto/application.dto"
import { Expose, Transform } from "class-transformer"
import { IsBoolean, IsOptional, IsString } from "class-validator"
import { Pagination, PaginationQueryParams } from "../utils/pagination.dto"
import { Application } from "./entities/application.entity"

export class ApplicationsListQueryParams extends PaginationQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: false,
  })
  @IsOptional()
  @IsString()
  listingId?: string

  @Expose()
  @ApiProperty({
    type: String,
    example: "search",
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string
}

export class ApplicationsCsvListQueryParams {
  @Expose()
  @ApiProperty({
    type: String,
    example: "listingId",
    required: false,
  })
  @IsOptional()
  @IsString()
  listingId?: string

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform((value: string | undefined) => value === "true", { toClassOnly: true })
  includeHeaders?: boolean
}

@Controller("applications")
@ApiTags("applications")
@ApiBearerAuth()
@ResourceType("application")
@UseGuards(OptionalAuthGuard, AuthzGuard)
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly emailService: EmailService,
    private readonly listingsService: ListingsService,
    private readonly authzService: AuthzService
  ) {}

  @Get()
  @ApiOperation({ summary: "List applications", operationId: "list" })
  async list(
    @Request() req: ExpressRequest,
    @Query() queryParams: ApplicationsListQueryParams
  ): Promise<PaginatedApplicationDto> {
    let response: Pagination<Application>
    if (await this.authzService.can(req.user, "application", authzActions.listAll)) {
      response = await this.applicationsService.listPaginated(queryParams)
    } else {
      response = await this.applicationsService.listPaginated(queryParams, req.user)
    }
    return mapTo(PaginatedApplicationDto, response)
  }

  @Get(`csv`)
  @ApiOperation({ summary: "List applications as csv", operationId: "listAsCsv" })
  @Header("Content-Type", "text/csv")
  async listAsCsv(@Query() queryParams: ApplicationsCsvListQueryParams): Promise<string> {
    return await this.applicationsService.listAsCsv(
      queryParams.listingId,
      queryParams.includeHeaders,
      null
    )
  }

  @Post()
  @ApiOperation({ summary: "Create application", operationId: "create" })
  async create(
    @Request() req: ExpressRequest,
    @Body() applicationCreateDto: ApplicationCreateDto
  ): Promise<ApplicationDto> {
    const application = await this.applicationsService.create(applicationCreateDto, req.user)
    const listing = await this.listingsService.findOne(application.listing.id)
    if (application.applicant.emailAddress) {
      await this.emailService.confirmation(listing, application, applicationCreateDto.appUrl)
    }
    return mapTo(ApplicationDto, application)
  }

  @Get(`:applicationId`)
  @ApiOperation({ summary: "Get application by id", operationId: "retrieve" })
  async retrieve(
    @Request() req: ExpressRequest,
    @Param("applicationId") applicationId: string
  ): Promise<ApplicationDto> {
    const app = await this.applicationsService.findOne(applicationId)
    await this.authorizeUserAction(req.user, app, authzActions.read)
    return mapTo(ApplicationDto, app)
  }

  @Put(`:applicationId`)
  @ApiOperation({ summary: "Update application by id", operationId: "update" })
  async update(
    @Request() req: ExpressRequest,
    @Param("applicationId") applicationId: string,
    @Body() applicationUpdateDto: ApplicationUpdateDto
  ): Promise<ApplicationDto> {
    const app = await this.applicationsService.findOne(applicationId)
    await this.authorizeUserAction(req.user, app, authzActions.update)
    return mapTo(ApplicationDto, await this.applicationsService.update(applicationUpdateDto, app))
  }

  @Delete(`:applicationId`)
  @ApiOperation({ summary: "Delete application by id", operationId: "delete" })
  async delete(@Request() req: ExpressRequest, @Param("applicationId") applicationId: string) {
    const app = await this.applicationsService.findOne(applicationId)
    await this.authorizeUserAction(req.user, app, authzActions.delete)
    await this.applicationsService.delete(applicationId)
  }

  private authorizeUserAction(user, app, action) {
    return this.authzService.canOrThrow(user, "application", action, {
      ...app,
      user_id: app.user?.id,
    })
  }
}
