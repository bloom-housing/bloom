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
import { UnitTypesService } from "./unit-types.service"
import { UnitTypeCreateDto, UnitTypeDto, UnitTypeUpdateDto } from "./dto/unit-type.dto"

@Controller("unitTypes")
@ApiTags("unitTypes")
@ApiBearerAuth()
@ResourceType("unitType")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class UnitTypesController {
  constructor(private readonly unitTypesService: UnitTypesService) {}

  @Get()
  @ApiOperation({ summary: "List unitTypes", operationId: "list" })
  async list(): Promise<UnitTypeDto[]> {
    return mapTo(UnitTypeDto, await this.unitTypesService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create unitType", operationId: "create" })
  async create(@Body() unitType: UnitTypeCreateDto): Promise<UnitTypeDto> {
    return mapTo(UnitTypeDto, await this.unitTypesService.create(unitType))
  }

  @Put(`:unitTypeId`)
  @ApiOperation({ summary: "Update unitType", operationId: "update" })
  async update(@Body() unitType: UnitTypeUpdateDto): Promise<UnitTypeDto> {
    return mapTo(UnitTypeDto, await this.unitTypesService.update(unitType))
  }

  @Get(`:unitTypeId`)
  @ApiOperation({ summary: "Get unitType by id", operationId: "retrieve" })
  async retrieve(@Param("unitTypeId") unitTypeId: string): Promise<UnitTypeDto> {
    return mapTo(UnitTypeDto, await this.unitTypesService.findOne({ where: { id: unitTypeId } }))
  }

  @Delete(`:unitTypeId`)
  @ApiOperation({ summary: "Delete unitType by id", operationId: "delete" })
  async delete(@Param("unitTypeId") unitTypeId: string): Promise<void> {
    return await this.unitTypesService.delete(unitTypeId)
  }
}
