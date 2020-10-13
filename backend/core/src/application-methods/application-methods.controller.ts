import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { TransformInterceptor } from "../interceptors/transform.interceptor"
import { ApplicationMethod } from "../entity/application-method.entity"
import { ApplicationMethodsService } from "./application-method.service"
import { ApplicationMethodDto } from "./application-method.dto"
import { ApplicationMethodCreateDto } from "./application-method.create.dto"
import { ApplicationMethodUpdateDto } from "./application-method.update.dto"
import { DefaultAuthGuard } from "../auth/default.guard"
import { AuthzGuard } from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"

@Controller("/applicationMethods")
@ApiTags("applicationMethods")
@ApiBearerAuth()
@ResourceType("applicationMethod")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UseInterceptors(new TransformInterceptor(ApplicationMethodDto))
export class ApplicationMethodsController {
  constructor(private readonly applicationMethodsService: ApplicationMethodsService) {}

  @Get()
  @ApiOperation({ summary: "List applicationMethods", operationId: "list" })
  async list(): Promise<ApplicationMethodDto[]> {
    return await this.applicationMethodsService.list()
  }

  @Post()
  @ApiOperation({ summary: "Create applicationMethod", operationId: "create" })
  async create(
    @Body() applicationMethod: ApplicationMethodCreateDto
  ): Promise<ApplicationMethodDto> {
    return this.applicationMethodsService.create(applicationMethod)
  }

  @Put(`:applicationMethodId`)
  @ApiOperation({ summary: "Update applicationMethod", operationId: "update" })
  async update(
    @Body() applicationMethod: ApplicationMethodUpdateDto
  ): Promise<ApplicationMethodDto> {
    return this.applicationMethodsService.update(applicationMethod)
  }

  @Get(`:applicationMethodId`)
  @ApiOperation({ summary: "Get applicationMethod by id", operationId: "retrieve" })
  async retrieve(
    @Param("applicationMethodId") applicationMethodId: string
  ): Promise<ApplicationMethod> {
    return await this.applicationMethodsService.findOne({ where: { id: applicationMethodId } })
  }

  @Delete(`:applicationMethodId`)
  @ApiOperation({ summary: "Delete applicationMethod by id", operationId: "delete" })
  async delete(@Param("applicationMethodId") applicationMethodId: string): Promise<void> {
    await this.applicationMethodsService.delete(applicationMethodId)
  }
}
