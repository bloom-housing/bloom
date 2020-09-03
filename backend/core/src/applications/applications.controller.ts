import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { ApplicationDto, ApplicationsListQueryParams } from "./applications.dto"
import { ApplicationsService } from "./applications.service"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ApplicationCreateDto } from "./application.create.dto"
import { ApplicationUpdateDto } from "./application.update.dto"
import { TransformInterceptor } from "../interceptors/transform.interceptor"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"
import AuthzGuard from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { AuthzService } from "../auth/authz.service"

@Controller("applications")
@ApiTags("applications")
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@ResourceType("application")
@UseGuards(OptionalAuthGuard, AuthzGuard)
export class ApplicationsController {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly authzService: AuthzService
  ) {}

  @Get()
  @ApiOperation({ summary: "List applications", operationId: "list" })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async list(
    @Request() req,
    @Query() params: ApplicationsListQueryParams
  ): Promise<ApplicationDto[]> {
    // TODO: Do we want to return all applications for admin users?
    return await this.applicationsService.list(params, req.user)
  }

  @Post()
  @ApiOperation({ summary: "Create application", operationId: "create" })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async create(
    @Request() req,
    @Body() applicationCreateDto: ApplicationCreateDto
  ): Promise<ApplicationDto> {
    return await this.applicationsService.create({ ...applicationCreateDto, user: req.user })
  }

  @Get(`:applicationId`)
  @ApiOperation({ summary: "Get application by id", operationId: "retrieve" })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async retrieve(
    @Request() req,
    @Param("applicationId") applicationId: string
  ): Promise<ApplicationDto> {
    const app = await this.applicationsService.findOne(applicationId)
    await this.authorizeUserAction(req.user, app, "read")
    return app
  }

  @Put(`:applicationId`)
  @ApiOperation({ summary: "Update application by id", operationId: "update" })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async update(
    @Request() req,
    @Param("applicationId") applicationId: string,
    @Body() applicationUpdateDto: ApplicationUpdateDto
  ): Promise<ApplicationDto> {
    const app = await this.applicationsService.findOne(applicationId)
    await this.authorizeUserAction(req.user, app, "edit")
    return this.applicationsService.update(applicationUpdateDto, app)
  }

  @Delete(`:applicationId`)
  @ApiOperation({ summary: "Delete application by id", operationId: "delete" })
  async delete(@Request() req, @Param("applicationId") applicationId: string) {
    const app = await this.applicationsService.findOne(applicationId)
    await this.authorizeUserAction(req.user, app, "delete")
    return this.applicationsService.delete(applicationId)
  }

  private authorizeUserAction(user, app, action) {
    return this.authzService.canOrThrow(user, "application", action, {
      ...app,
      // eslint-disable-next-line @typescript-eslint/camelcase
      user_id: app.user.id,
    })
  }
}
