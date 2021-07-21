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
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { JurisdictionsService } from "./jurisdictions.service"
import {
  JurisdictionCreateDto,
  JurisdictionDto,
  JurisdictionUpdateDto,
} from "./dto/jurisdiction.dto"

@Controller("jurisdictions")
@ApiTags("jurisdictions")
@ApiBearerAuth()
@ResourceType("jurisdiction")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class JurisdictionsController {
  constructor(private readonly jurisdictionsService: JurisdictionsService) {}

  @Get()
  @ApiOperation({ summary: "List jurisdictions", operationId: "list" })
  async list(): Promise<JurisdictionDto[]> {
    return mapTo(JurisdictionDto, await this.jurisdictionsService.list())
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

  @Delete(`:jurisdictionId`)
  @ApiOperation({ summary: "Delete jurisdiction by id", operationId: "delete" })
  async delete(@Param("jurisdictionId") jurisdictionId: string): Promise<void> {
    return await this.jurisdictionsService.delete(jurisdictionId)
  }
}
