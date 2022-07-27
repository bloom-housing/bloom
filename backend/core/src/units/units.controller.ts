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
import { UnitsService } from "./units.service"
import { UnitDto } from "./dto/unit.dto"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { UnitCreateDto } from "./dto/unit-create.dto"
import { UnitUpdateDto } from "./dto/unit-update.dto"
import { IdDto } from "../shared/dto/id.dto"

@Controller("/units")
@ApiTags("units")
@ApiBearerAuth()
@ResourceType("unit")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  @ApiOperation({ summary: "List units", operationId: "list" })
  async list(): Promise<UnitDto[]> {
    return mapTo(UnitDto, await this.unitsService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create unit", operationId: "create" })
  async create(@Body() unit: UnitCreateDto): Promise<UnitDto> {
    return mapTo(UnitDto, await this.unitsService.create(unit))
  }

  @Put(`:unitId`)
  @ApiOperation({ summary: "Update unit", operationId: "update" })
  async update(@Body() unit: UnitUpdateDto): Promise<UnitDto> {
    return mapTo(UnitDto, await this.unitsService.update(unit))
  }

  @Get(`:unitId`)
  @ApiOperation({ summary: "Get unit by id", operationId: "retrieve" })
  async retrieve(@Param("unitId") unitId: string): Promise<UnitDto> {
    return mapTo(UnitDto, await this.unitsService.findOne({ where: { id: unitId } }))
  }

  @Delete()
  @ApiOperation({ summary: "Delete unit by id", operationId: "delete" })
  async delete(@Body() dto: IdDto): Promise<void> {
    return await this.unitsService.delete(dto.id)
  }
}
