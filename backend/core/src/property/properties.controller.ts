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
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { DefaultAuthGuard } from "../auth/guards/default.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import { PropertiesService } from "./properties.service"
import { PropertyCreateDto, PropertyDto, PropertyUpdateDto } from "./dto/property.dto"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"

@Controller("properties")
@ApiTags("properties")
@ApiBearerAuth()
@ResourceType("property")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiOperation({ summary: "List properties", operationId: "list" })
  async list(): Promise<PropertyDto[]> {
    return mapTo(PropertyDto, await this.propertiesService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create property", operationId: "create" })
  async create(@Body() property: PropertyCreateDto): Promise<PropertyDto> {
    return mapTo(PropertyDto, await this.propertiesService.create(property))
  }

  @Put(`:propertyId`)
  @ApiOperation({ summary: "Update property", operationId: "update" })
  async update(@Body() property: PropertyUpdateDto): Promise<PropertyDto> {
    return mapTo(PropertyDto, await this.propertiesService.update(property))
  }

  @Get(`:propertyId`)
  @ApiOperation({ summary: "Get property by id", operationId: "retrieve" })
  async retrieve(@Param("propertyId") propertyId: string): Promise<PropertyDto> {
    return mapTo(PropertyDto, await this.propertiesService.findOne({ where: { id: propertyId } }))
  }

  @Delete(`:propertyId`)
  @ApiOperation({ summary: "Delete property by id", operationId: "delete" })
  async delete(@Param("propertyId") propertyId: string): Promise<void> {
    return await this.propertiesService.delete(propertyId)
  }
}
