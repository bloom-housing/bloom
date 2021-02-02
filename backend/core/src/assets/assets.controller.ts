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
import { AssetsService } from "./assets.service"
import { AssetCreateDto, AssetDto, AssetUpdateDto } from "./dto/asset.dto"
import { AuthzGuard } from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { mapTo } from "../shared/mapTo"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"

@Controller("assets")
@ApiTags("assets")
@ApiBearerAuth()
@ResourceType("asset")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: "List assets", operationId: "list" })
  async list(): Promise<AssetDto[]> {
    return mapTo(AssetDto, await this.assetsService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create asset", operationId: "create" })
  async create(@Body() asset: AssetCreateDto): Promise<AssetDto> {
    return mapTo(AssetDto, await this.assetsService.create(asset))
  }

  @Put(`:assetId`)
  @ApiOperation({ summary: "Update asset", operationId: "update" })
  async update(@Body() asset: AssetUpdateDto): Promise<AssetDto> {
    return mapTo(AssetDto, await this.assetsService.update(asset))
  }

  @Get(`:assetId`)
  @ApiOperation({ summary: "Get asset by id", operationId: "retrieve" })
  async retrieve(@Param("assetId") assetId: string): Promise<AssetDto> {
    return mapTo(AssetDto, await this.assetsService.findOne({ where: { id: assetId } }))
  }
  @Delete(`:assetId`)
  @ApiOperation({ summary: "Delete asset by id", operationId: "delete" })
  async delete(@Param("assetId") assetId: string): Promise<void> {
    await this.assetsService.delete(assetId)
  }
}
