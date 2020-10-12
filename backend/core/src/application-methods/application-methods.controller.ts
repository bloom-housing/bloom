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

// TODO Add Admin role check

@Controller("/applicationMethods")
@ApiTags("applicationMethods")
@ApiBearerAuth()
export class ApplicationMethodsController {
  constructor(private readonly applicationMethodsService: ApplicationMethodsService) {}

  @Get()
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "List applicationMethods", operationId: "list" })
  @UseInterceptors(new TransformInterceptor(ApplicationMethodDto))
  async list(): Promise<ApplicationMethod[]> {
    return await this.applicationMethodsService.list()
  }

  @Post()
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Create applicationMethod", operationId: "create" })
  @UseInterceptors(new TransformInterceptor(ApplicationMethodDto))
  async create(@Body() applicationMethod: ApplicationMethodCreateDto): Promise<ApplicationMethod> {
    return this.applicationMethodsService.create(applicationMethod)
  }

  @Put(`:applicationMethodId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Update applicationMethod", operationId: "update" })
  @UseInterceptors(new TransformInterceptor(ApplicationMethodDto))
  async update(@Body() applicationMethod: ApplicationMethodUpdateDto): Promise<ApplicationMethod> {
    return this.applicationMethodsService.update(applicationMethod)
  }

  @Get(`:applicationMethodId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Get applicationMethod by id", operationId: "retrieve" })
  @UseInterceptors(new TransformInterceptor(ApplicationMethodDto))
  async retrieve(
    @Param("applicationMethodId") applicationMethodId: string
  ): Promise<ApplicationMethod> {
    return await this.applicationMethodsService.findOne({ where: { id: applicationMethodId } })
  }

  @Delete(`:applicationMethodId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Delete applicationMethod by id", operationId: "delete" })
  async delete(@Param("applicationMethodId") applicationMethodId: string): Promise<void> {
    await this.applicationMethodsService.delete(applicationMethodId)
  }
}
