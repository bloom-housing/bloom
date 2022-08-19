import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { DefaultAuthGuard } from "../auth/guards/default.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { ApplicationMethodsService } from "./application-methods.service"
import {
  ApplicationMethodCreateDto,
  ApplicationMethodDto,
  ApplicationMethodUpdateDto,
} from "./dto/application-method.dto"
import { IdDto } from "../shared/dto/id.dto"

@Controller("applicationMethods")
@ApiTags("applicationMethods")
@ApiBearerAuth()
@ResourceType("applicationMethod")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
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

  @Delete()
  @ApiOperation({ summary: "Delete applicationMethod by id", operationId: "delete" })
  async delete(@Body() dto: IdDto): Promise<void> {
    return await this.applicationMethodsService.delete(dto.id)
  }
}
