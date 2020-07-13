import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, Query,
  UseGuards,
  UseInterceptors
} from "@nestjs/common"
import { ApplicationDto, ApplicationsListQueryParams } from "./applications.dto"
import { ApplicationsService } from "./applications.service"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { DefaultAuthGuard } from "../auth/default.guard"
import { ApplicationCreateDto } from "./application.create.dto"
import { ApplicationUpdateDto } from "./application.update.dto"
import { TransformInterceptor } from "../interceptors/transform.interceptor"

@Controller("applications")
@ApiTags("applications")
@UseGuards(DefaultAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @ApiOperation({ summary: "List applications", operationId: "list" })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async list(@Query() params: ApplicationsListQueryParams): Promise<ApplicationDto[]> {
    return await this.applicationsService.list(params)
  }

  @Post()
  @ApiOperation({ summary: "Create application", operationId: "create" })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async create(@Body() applicationCreateDto: ApplicationCreateDto): Promise<ApplicationDto> {
    return await this.applicationsService.create(applicationCreateDto)
  }

  @Get(`:applicationId`)
  @ApiOperation({ summary: "Get application by id", operationId: "retrieve" })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async retrieve(@Param("applicationId") applicationId: string): Promise<ApplicationDto> {
    return await this.applicationsService.findOne(applicationId)
  }

  @Put(`:applicationId`)
  @ApiOperation({ summary: "Update application by id", operationId: "update" })
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async update(
    @Param("applicationId") applicationId: string,
    @Body() applicationUpdateDto: ApplicationUpdateDto
  ): Promise<ApplicationDto> {
    return await this.applicationsService.update(applicationUpdateDto)
  }

  @Delete(`:applicationId`)
  @ApiOperation({ summary: "Delete application by id", operationId: "delete" })
  async delete(@Param("applicationId") applicationId: string) {
    await this.applicationsService.delete(applicationId)
  }
}
