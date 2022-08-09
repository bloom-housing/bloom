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
import {
  UnitRentTypeCreateDto,
  UnitRentTypeDto,
  UnitRentTypeUpdateDto,
} from "./dto/unit-rent-type.dto"
import { UnitRentTypesService } from "./unit-rent-types.service"
import { IdDto } from "../shared/dto/id.dto"

@Controller("unitRentTypes")
@ApiTags("unitRentTypes")
@ApiBearerAuth()
@ResourceType("unitRentType")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class UnitRentTypesController {
  constructor(private readonly unitRentTypesService: UnitRentTypesService) {}

  @Get()
  @ApiOperation({ summary: "List unitRentTypes", operationId: "list" })
  async list(): Promise<UnitRentTypeDto[]> {
    return mapTo(UnitRentTypeDto, await this.unitRentTypesService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create unitRentType", operationId: "create" })
  async create(@Body() unitRentType: UnitRentTypeCreateDto): Promise<UnitRentTypeDto> {
    return mapTo(UnitRentTypeDto, await this.unitRentTypesService.create(unitRentType))
  }

  @Put(`:unitRentTypeId`)
  @ApiOperation({ summary: "Update unitRentType", operationId: "update" })
  async update(@Body() unitRentType: UnitRentTypeUpdateDto): Promise<UnitRentTypeDto> {
    return mapTo(UnitRentTypeDto, await this.unitRentTypesService.update(unitRentType))
  }

  @Get(`:unitRentTypeId`)
  @ApiOperation({ summary: "Get unitRentType by id", operationId: "retrieve" })
  async retrieve(@Param("unitRentTypeId") unitRentTypeId: string): Promise<UnitRentTypeDto> {
    return mapTo(
      UnitRentTypeDto,
      await this.unitRentTypesService.findOne({ where: { id: unitRentTypeId } })
    )
  }

  @Delete()
  @ApiOperation({ summary: "Delete unitRentType by id", operationId: "delete" })
  async delete(@Body() dto: IdDto): Promise<void> {
    return await this.unitRentTypesService.delete(dto.id)
  }
}
