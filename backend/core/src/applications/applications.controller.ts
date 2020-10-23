import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common"
import type { Request as ExpressRequest } from "express"
import { ApplicationDto } from "./application.dto"
import { ApplicationsService } from "./applications.service"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"
import { AuthzGuard } from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { authzActions, AuthzService } from "../auth/authz.service"
import { EmailService } from "../shared/email.service"
import { ListingsService } from "../listings/listings.service"
import { CsvBuilder } from "../services/csv-builder.service"
import { applicationFormattingMetadataAggregateFactory } from "../services/application-formatting-metadata"
import { mapTo } from "../shared/mapTo"
import { ApplicationCreateDto, ApplicationUpdateDto } from "./application.dto"

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
    private readonly authzService: AuthzService,
    private readonly csvBuilder: CsvBuilder
  ) {}

  @Get()
  @ApiOperation({ summary: "List applications", operationId: "list" })
  async list(
    @Request() req: ExpressRequest,
    @Query("listingId") listingId: string
  ): Promise<ApplicationDto[]> {
    let response: ApplicationDto[] = []
    if (await this.authzService.can(req.user, "application", authzActions.listAll)) {
      response = await this.applicationsService.list({ listingId })
    } else {
      response = await this.applicationsService.list({ listingId }, req.user)
    }
    return mapTo(ApplicationDto, response)
  }

  @Get(`csv`)
  @ApiOperation({ summary: "List applications as csv", operationId: "listAsCsv" })
  @Header("Content-Type", "text/csv")
  async listAsCsv(
    @Query("listingId") listingId: string,
    @Query("includeHeaders", ParseBoolPipe) includeHeaders: boolean
  ): Promise<string> {
    const applications = await this.applicationsService.list({ listingId }, null)
    return this.csvBuilder.build(
      applications,
      applicationFormattingMetadataAggregateFactory,
      includeHeaders
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
    if (application.application.applicant.emailAddress) {
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
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_id: app.user?.id,
    })
  }
}
