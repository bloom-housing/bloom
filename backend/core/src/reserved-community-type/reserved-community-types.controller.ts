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
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import {
  ReservedCommunityTypeCreateDto,
  ReservedCommunityTypeDto,
  ReservedCommunityTypeUpdateDto,
} from "./dto/reserved-community-type.dto"
import { ReservedCommunityTypesService } from "./reserved-community-types.service"
import { ReservedCommunityTypeListQueryParams } from "./dto/reserved-community-type-list-query-params"
import { IdDto } from "../shared/dto/id.dto"

@Controller("reservedCommunityTypes")
@ApiTags("reservedCommunityTypes")
@ApiBearerAuth()
@ResourceType("reservedCommunityType")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class ReservedCommunityTypesController {
  constructor(private readonly reservedCommunityTypesService: ReservedCommunityTypesService) {}

  @Get()
  @ApiOperation({ summary: "List reservedCommunityTypes", operationId: "list" })
  async list(
    @Query() queryParams: ReservedCommunityTypeListQueryParams
  ): Promise<ReservedCommunityTypeDto[]> {
    return mapTo(
      ReservedCommunityTypeDto,
      await this.reservedCommunityTypesService.list(queryParams)
    )
  }

  @Post()
  @ApiOperation({ summary: "Create reservedCommunityType", operationId: "create" })
  async create(
    @Body() reservedCommunityType: ReservedCommunityTypeCreateDto
  ): Promise<ReservedCommunityTypeDto> {
    return mapTo(
      ReservedCommunityTypeDto,
      await this.reservedCommunityTypesService.create(reservedCommunityType)
    )
  }

  @Put(`:reservedCommunityTypeId`)
  @ApiOperation({ summary: "Update reservedCommunityType", operationId: "update" })
  async update(
    @Body() reservedCommunityType: ReservedCommunityTypeUpdateDto
  ): Promise<ReservedCommunityTypeDto> {
    return mapTo(
      ReservedCommunityTypeDto,
      await this.reservedCommunityTypesService.update(reservedCommunityType)
    )
  }

  @Get(`:reservedCommunityTypeId`)
  @ApiOperation({ summary: "Get reservedCommunityType by id", operationId: "retrieve" })
  async retrieve(
    @Param("reservedCommunityTypeId") reservedCommunityTypeId: string
  ): Promise<ReservedCommunityTypeDto> {
    return mapTo(
      ReservedCommunityTypeDto,
      await this.reservedCommunityTypesService.findOne({ where: { id: reservedCommunityTypeId } })
    )
  }

  @Delete()
  @ApiOperation({ summary: "Delete reservedCommunityType by id", operationId: "delete" })
  async delete(@Body() dto: IdDto): Promise<void> {
    return await this.reservedCommunityTypesService.delete(dto.id)
  }
}
