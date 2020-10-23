import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ApplicationMethodsService } from "./application-method.service"
import {
  ApplicationMethodCreateDto,
  ApplicationMethodDto,
  ApplicationMethodUpdateDto,
} from "./application-method.dto"
import { DefaultAuthGuard } from "../auth/default.guard"
import { AuthzGuard } from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { mapTo } from "../shared/mapTo"

@Controller("/applicationMethods")
@ApiTags("applicationMethods")
@ApiBearerAuth()
@ResourceType("applicationMethod")
@UseGuards(DefaultAuthGuard, AuthzGuard)
export class ApplicationMethodsController {
  constructor(private readonly applicationMethodsService: ApplicationMethodsService) {}

  @Get()
  @ApiOperation({ summary: "List applicationMethods", operationId: "list" })
  async list(): Promise<ApplicationMethodDto[]> {
    return mapTo(ApplicationMethodDto, await this.applicationMethodsService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create applicationMethod", operationId: "create" })
  async create(
    @Body() applicationMethod: ApplicationMethodCreateDto
  ): Promise<ApplicationMethodDto> {
    return mapTo(
      ApplicationMethodDto,
      await this.applicationMethodsService.create(applicationMethod)
    )
  }

  @Put(`:applicationMethodId`)
  @ApiOperation({ summary: "Update applicationMethod", operationId: "update" })
  async update(
    @Body() applicationMethod: ApplicationMethodUpdateDto
  ): Promise<ApplicationMethodDto> {
    return mapTo(
      ApplicationMethodDto,
      await this.applicationMethodsService.update(applicationMethod)
    )
  }

  @Get(`:applicationMethodId`)
  @ApiOperation({ summary: "Get applicationMethod by id", operationId: "retrieve" })
  async retrieve(
    @Param("applicationMethodId") applicationMethodId: string
  ): Promise<ApplicationMethodDto> {
    return mapTo(
      ApplicationMethodDto,
      await this.applicationMethodsService.findOne({ where: { id: applicationMethodId } })
    )
  }

  @Delete(`:applicationMethodId`)
  @ApiOperation({ summary: "Delete applicationMethod by id", operationId: "delete" })
  async delete(@Param("applicationMethodId") applicationMethodId: string): Promise<void> {
    return await this.applicationMethodsService.delete(applicationMethodId)
  }
}
