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
import { UnitAccessibilityPriorityTypesService } from "./unit-accessibility-priority-types.service"
import {
  UnitAccessibilityPriorityTypeCreateDto,
  UnitAccessibilityPriorityTypeDto,
  UnitAccessibilityPriorityTypeUpdateDto,
} from "./dto/unit-accessibility-priority-type.dto"
import { IdDto } from "../shared/dto/id.dto"

@Controller("unitAccessibilityPriorityTypes")
@ApiTags("unitAccessibilityPriorityTypes")
@ApiBearerAuth()
@ResourceType("unitAccessibilityPriorityType")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class UnitAccessibilityPriorityTypesController {
  constructor(
    private readonly unitAccessibilityPriorityTypesService: UnitAccessibilityPriorityTypesService
  ) {}

  @Get()
  @ApiOperation({ summary: "List unitAccessibilityPriorityTypes", operationId: "list" })
  async list(): Promise<UnitAccessibilityPriorityTypeDto[]> {
    return mapTo(
      UnitAccessibilityPriorityTypeDto,
      await this.unitAccessibilityPriorityTypesService.list()
    )
  }

  @Post()
  @ApiOperation({ summary: "Create unitAccessibilityPriorityType", operationId: "create" })
  async create(
    @Body() unitAccessibilityPriorityType: UnitAccessibilityPriorityTypeCreateDto
  ): Promise<UnitAccessibilityPriorityTypeDto> {
    return mapTo(
      UnitAccessibilityPriorityTypeDto,
      await this.unitAccessibilityPriorityTypesService.create(unitAccessibilityPriorityType)
    )
  }

  @Put(`:unitAccessibilityPriorityTypeId`)
  @ApiOperation({ summary: "Update unitAccessibilityPriorityType", operationId: "update" })
  async update(
    @Body() unitAccessibilityPriorityType: UnitAccessibilityPriorityTypeUpdateDto
  ): Promise<UnitAccessibilityPriorityTypeDto> {
    return mapTo(
      UnitAccessibilityPriorityTypeDto,
      await this.unitAccessibilityPriorityTypesService.update(unitAccessibilityPriorityType)
    )
  }

  @Get(`:unitAccessibilityPriorityTypeId`)
  @ApiOperation({ summary: "Get unitAccessibilityPriorityType by id", operationId: "retrieve" })
  async retrieve(
    @Param("unitAccessibilityPriorityTypeId") unitAccessibilityPriorityTypeId: string
  ): Promise<UnitAccessibilityPriorityTypeDto> {
    return mapTo(
      UnitAccessibilityPriorityTypeDto,
      await this.unitAccessibilityPriorityTypesService.findOne({
        where: { id: unitAccessibilityPriorityTypeId },
      })
    )
  }

  @Delete()
  @ApiOperation({ summary: "Delete unitAccessibilityPriorityType by id", operationId: "delete" })
  async delete(@Body() dto: IdDto): Promise<void> {
    return await this.unitAccessibilityPriorityTypesService.delete(dto.id)
  }
}
