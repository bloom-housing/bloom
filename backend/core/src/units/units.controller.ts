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
import { TransformResponseInterceptor } from "../interceptors/transform-response-interceptor.service"
import { UnitsService } from "./units.service"
import { UnitDto } from "./unit.dto"
import { UnitCreateDto } from "./unit.create.dto"
import { UnitUpdateDto } from "./unit.update.dto"
import { DefaultAuthGuard } from "../auth/default.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import AuthzGuard from "../auth/authz.guard"

@Controller("/units")
@ApiTags("units")
@ApiBearerAuth()
@ResourceType("unit")
@UseInterceptors(new TransformResponseInterceptor(UnitDto))
@UseGuards(DefaultAuthGuard, AuthzGuard)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: "List units", operationId: "list" })
  async list() {
    return await this.unitsService.list()
  }

  @Post()
  @ApiOperation({ summary: "Create unit", operationId: "create" })
  async create(@Body() unit: UnitCreateDto) {
    return this.unitsService.create(unit)
  }

  @Put(`:unitId`)
  @ApiOperation({ summary: "Update unit", operationId: "update" })
  async update(@Body() unit: UnitUpdateDto) {
    return this.unitsService.update(unit)
  }

  @Get(`:unitId`)
  @ApiOperation({ summary: "Get unit by id", operationId: "retrieve" })
  async retrieve(@Param("unitId") unitId: string) {
    return await this.unitsService.findOne(unitId)
  }

  @Delete(`:unitId`)
  @ApiOperation({ summary: "Delete unit by id", operationId: "delete" })
  async delete(@Param("unitId") unitId: string) {
    await this.unitsService.delete(unitId)
  }
}
