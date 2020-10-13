import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { TransformInterceptor } from "../interceptors/transform.interceptor"
import { AssetsService } from "./assets.service"
import { AssetCreateDto } from "./asset.create.dto"
import { AssetUpdateDto } from "./asset.update.dto"
import { AssetDto } from "./asset.dto"
import { AuthzGuard } from "../auth/authz.guard"
import { DefaultAuthGuard } from "../auth/default.guard"
import { ResourceType } from "../auth/resource_type.decorator"

@Controller("assets")
@ApiTags("assets")
@ApiBearerAuth()
@ResourceType("asset")
@UseGuards(DefaultAuthGuard, AuthzGuard)
@UseInterceptors(new TransformInterceptor(AssetDto))
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: "List assets", operationId: "list" })
  async list(): Promise<AssetDto[]> {
    return await this.assetsService.list()
  }

  @Post()
  @ApiOperation({ summary: "Create asset", operationId: "create" })
  async create(@Body() asset: AssetCreateDto): Promise<AssetDto> {
    return this.assetsService.create(asset)
  }

  @Put(`:assetId`)
  @ApiOperation({ summary: "Update asset", operationId: "update" })
  async update(@Body() asset: AssetUpdateDto): Promise<AssetDto> {
    return this.assetsService.update(asset)
  }

  @Get(`:assetId`)
  @ApiOperation({ summary: "Get asset by id", operationId: "retrieve" })
  async retrieve(@Param("assetId") assetId: string): Promise<AssetDto> {
    return await this.assetsService.findOne({ where: { id: assetId } })
  }
  @Delete(`:assetId`)
  @ApiOperation({ summary: "Delete asset by id", operationId: "delete" })
  async delete(@Param("assetId") assetId: string): Promise<void> {
    await this.assetsService.delete(assetId)
  }
}
