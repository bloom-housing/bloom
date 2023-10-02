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
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { JurisdictionsService } from "./services/jurisdictions.service"
import { JurisdictionDto } from "./dto/jurisdiction.dto"
import { JurisdictionCreateDto } from "./dto/jurisdiction-create.dto"
import { JurisdictionUpdateDto } from "./dto/jurisdiction-update.dto"
import { IdDto } from "../shared/dto/id.dto"
import { JurisdictionsListParams } from "./dto/jurisdictions-list-query-params"

@Controller("jurisdictions")
@ApiTags("jurisdictions")
@ApiBearerAuth()
@ResourceType("jurisdiction")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class JurisdictionsController {
  constructor(private readonly jurisdictionsService: JurisdictionsService) {}

  @Get()
  @ApiOperation({ summary: "List jurisdictions", operationId: "list" })
  async list(
    @Query()
    queryParams: JurisdictionsListParams
  ): Promise<JurisdictionDto[]> {
    return mapTo(JurisdictionDto, await this.jurisdictionsService.list(queryParams))
  }

  @Post()
  @ApiOperation({ summary: "Create jurisdiction", operationId: "create" })
  async create(@Body() jurisdiction: JurisdictionCreateDto): Promise<JurisdictionDto> {
    return mapTo(JurisdictionDto, await this.jurisdictionsService.create(jurisdiction))
  }

  @Put(`:jurisdictionId`)
  @ApiOperation({ summary: "Update jurisdiction", operationId: "update" })
  async update(@Body() jurisdiction: JurisdictionUpdateDto): Promise<JurisdictionDto> {
    return mapTo(JurisdictionDto, await this.jurisdictionsService.update(jurisdiction))
  }

  @Get(`:jurisdictionId`)
  @ApiOperation({ summary: "Get jurisdiction by id", operationId: "retrieve" })
  async retrieve(@Param("jurisdictionId") jurisdictionId: string): Promise<JurisdictionDto> {
    return mapTo(
      JurisdictionDto,
      await this.jurisdictionsService.findOne({ where: { id: jurisdictionId } })
    )
  }

  @Get(`byName/:jurisdictionName`)
  @ApiOperation({ summary: "Get jurisdiction by name", operationId: "retrieveByName" })
  async retrieveByName(
    @Param("jurisdictionName") jurisdictionName: string
  ): Promise<JurisdictionDto> {
    return mapTo(
      JurisdictionDto,
      await this.jurisdictionsService.findOne({ where: { name: jurisdictionName } })
    )
  }

  @Delete()
  @ApiOperation({ summary: "Delete jurisdiction by id", operationId: "delete" })
  async delete(@Body() dto: IdDto): Promise<void> {
    return await this.jurisdictionsService.delete(dto.id)
  }
}
