import {
  Body,
  ClassSerializerInterceptor,
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
  UseInterceptors,
} from "@nestjs/common"
import type { Request as ExpressRequest } from "express"
import { ApplicationDto } from "./applications.dto"
import { ApplicationsService } from "./applications.service"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ApplicationCreateDto } from "./application.create.dto"
import { ApplicationUpdateDto } from "./application.update.dto"
import { TransformInterceptor } from "../interceptors/transform.interceptor"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"
import { AuthzGuard } from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { authzActions, AuthzService } from "../auth/authz.service"
import { EmailService } from "../shared/email.service"
import { ListingsService } from "../listings/listings.service"
import { CsvBuilder } from "../services/csv-builder.service"
import { applicationFormattingMetadataAggregateFactory } from "../services/application-formatting-metadata"
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from "@nestjsx/crud"
import { Preference } from "../entity/preference.entity"
import { PreferenceCreateDto } from "../preferences/preference.create.dto"
import { DefaultAuthGuard } from "../auth/default.guard"
import { Application } from "../entity/application.entity"
import { IsBoolean } from "class-validator"
import { Expose } from "class-transformer"

export class ApplicationsListAsCsvOptions {
  @Expose()
  @IsBoolean()
  includeHeaders: boolean
}

@Crud({
  model: {
    type: Application,
  },
  dto: {
    create: ApplicationCreateDto,
  },
  params: {
    id: {
      field: "id",
      type: "uuid",
      primary: true,
    },
  },
  query: {
    join: {
      user: {
        eager: false,
      },
    },
  },
})
@Controller("applications")
@ResourceType("application")
@ApiTags("applications")
@ApiBearerAuth()
@UseGuards(DefaultAuthGuard, AuthzGuard)
export class ApplicationsController {
  constructor(
    public readonly service: ApplicationsService,
    private readonly emailService: EmailService,
    private readonly listingsService: ListingsService,
    private readonly authzService: AuthzService,
    private readonly csvBuilder: CsvBuilder
  ) {}

  get base(): CrudController<Application> {
    return this
  }

  @Post(`csv`)
  @ApiOperation({ summary: "List applications as csv", operationId: "listAsCsv" })
  @Header("Content-Type", "text/csv")
  async listAsCsv(
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() options: ApplicationsListAsCsvOptions
  ): Promise<string> {
    const response = await this.base.getManyBase(crudRequest)
    const applications = Array.isArray(response) ? response : response.data
    return this.csvBuilder.build(
      applications,
      applicationFormattingMetadataAggregateFactory,
      options.includeHeaders
    )
  }

  @Override()
  async createOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() dto: ApplicationCreateDto
  ) {
    const application = await this.base.createOneBase(crudRequest, dto as Application)
    const listing = await this.listingsService.findOne(application.listing.id)
    if (application.application.applicant.emailAddress) {
      await this.emailService.confirmation(listing, application, dto.appUrl)
    }
    return application
  }
}
