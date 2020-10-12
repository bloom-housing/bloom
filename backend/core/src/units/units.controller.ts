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
import { Unit } from "../entity/unit.entity"
import { UnitsService } from "./units.service"
import { UnitDto } from "./unit.dto"
import { UnitCreateDto } from "./unit.create.dto"
import { UnitUpdateDto } from "./unit.update.dto"
import { DefaultAuthGuard } from "../auth/default.guard"

// TODO Add Admin role check

@Controller("/units")
@ApiTags("units")
@ApiBearerAuth()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "List units", operationId: "list" })
  @UseInterceptors(new TransformInterceptor(UnitDto))
  async list(): Promise<Unit[]> {
    return await this.unitsService.list()
  }

  @Post()
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Create unit", operationId: "create" })
  @UseInterceptors(new TransformInterceptor(UnitDto))
  async create(@Body() unit: UnitCreateDto): Promise<Unit> {
    return this.unitsService.create(unit)
  }

  @Put(`:unitId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Update unit", operationId: "update" })
  @UseInterceptors(new TransformInterceptor(UnitDto))
  async update(@Body() unit: UnitUpdateDto): Promise<Unit> {
    return this.unitsService.update(unit)
  }

  @Get(`:unitId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Get unit by id", operationId: "retrieve" })
  @UseInterceptors(new TransformInterceptor(UnitDto))
  async retrieve(@Param("unitId") unitId: string): Promise<Unit> {
    return await this.unitsService.findOne({ where: { id: unitId } })
  }

  @Delete(`:unitId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Delete unit by id", operationId: "delete" })
  async delete(@Param("unitId") unitId: string): Promise<void> {
    await this.unitsService.delete(unitId)
  }
}
