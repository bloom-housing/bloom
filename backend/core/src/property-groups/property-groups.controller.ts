import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { DefaultAuthGuard } from "../auth/guards/default.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import { PropertyGroupsService } from "./property-groups.service"
import {
  PropertyGroupCreateDto,
  PropertyGroupDto,
  PropertyGroupUpdateDto,
} from "./dto/property-group.dto"
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

@Controller("propertyGroups")
@ApiTags("propertyGroups")
@ApiBearerAuth()
@ResourceType("propertyGroup")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class PropertyGroupsController {
  constructor(private readonly propertyGroupsService: PropertyGroupsService) {}

  @Get()
  @ApiOperation({ summary: "List propertyGroups", operationId: "list" })
  async list(): Promise<PropertyGroupDto[]> {
    return mapTo(PropertyGroupDto, await this.propertyGroupsService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create propertyGroup", operationId: "create" })
  async create(@Body() propertyGroup: PropertyGroupCreateDto): Promise<PropertyGroupDto> {
    return mapTo(PropertyGroupDto, await this.propertyGroupsService.create(propertyGroup))
  }

  @Put(`:propertyGroupId`)
  @ApiOperation({ summary: "Update propertyGroup", operationId: "update" })
  async update(@Body() propertyGroup: PropertyGroupUpdateDto): Promise<PropertyGroupDto> {
    return mapTo(PropertyGroupDto, await this.propertyGroupsService.update(propertyGroup))
  }

  @Get(`:propertyGroupId`)
  @ApiOperation({ summary: "Get propertyGroup by id", operationId: "retrieve" })
  async retrieve(@Param("propertyGroupId") propertyGroupId: string): Promise<PropertyGroupDto> {
    return mapTo(
      PropertyGroupDto,
      await this.propertyGroupsService.findOne({ where: { id: propertyGroupId } })
    )
  }

  @Delete(`:propertyGroupId`)
  @ApiOperation({ summary: "Delete propertyGroup by id", operationId: "delete" })
  async delete(@Param("propertyGroupId") propertyGroupId: string): Promise<void> {
    return await this.propertyGroupsService.delete(propertyGroupId)
  }
}
