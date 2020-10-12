import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { TransformInterceptor } from "../interceptors/transform.interceptor"
import { AssetsService } from "./assets.service"
import { Asset } from "../entity/asset.entity"
import { AssetCreateDto } from "./asset.create.dto"
import { AssetUpdateDto } from "./asset.update.dto"
import { AssetDto } from "./asset.dto"

// TODO Add Admin role check

@Controller("assets")
@ApiTags("assets")
@ApiBearerAuth()
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: "List assets", operationId: "list" })
  @UseInterceptors(new TransformInterceptor(AssetDto))
  async list(): Promise<Asset[]> {
    return await this.assetsService.list()
  }

  @Post()
  @ApiOperation({ summary: "Create asset", operationId: "create" })
  @UseInterceptors(new TransformInterceptor(AssetDto))
  async create(@Body() asset: AssetCreateDto): Promise<AssetDto> {
    return this.assetsService.create(asset)
  }

  @Put(`:assetId`)
  @ApiOperation({ summary: "Update asset", operationId: "update" })
  @UseInterceptors(new TransformInterceptor(AssetDto))
  async update(@Body() asset: AssetUpdateDto): Promise<AssetDto> {
    return this.assetsService.update(asset)
  }

  @Get(`:assetId`)
  @ApiOperation({ summary: "Get asset by id", operationId: "retrieve" })
  @UseInterceptors(new TransformInterceptor(AssetDto))
  async retrieve(@Param("assetId") assetId: string): Promise<AssetDto> {
    return await this.assetsService.findOne({ where: { id: assetId } })
  }
  @Delete(`:assetId`)
  @ApiOperation({ summary: "Delete asset by id", operationId: "delete" })
  async delete(@Param("assetId") assetId: string): Promise<void> {
    await this.assetsService.delete(assetId)
  }
}
