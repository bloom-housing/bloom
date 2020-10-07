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
import { TransformResponseInterceptor } from "../interceptors/transform-response-interceptor.service"
import { AssetsService } from "./assets.service"
import { AssetCreateDto } from "./asset.create.dto"
import { AssetUpdateDto } from "./asset.update.dto"
import { AssetDto } from "./asset.dto"
import { ResourceType } from "../auth/resource_type.decorator"
import { DefaultAuthGuard } from "../auth/default.guard"
import AuthzGuard from "../auth/authz.guard"

@Controller("assets")
@ApiTags("assets")
@ApiBearerAuth()
@ResourceType("asset")
@UseInterceptors(new TransformResponseInterceptor(AssetDto))
@UseGuards(DefaultAuthGuard, AuthzGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: "List assets", operationId: "list" })
  async list() {
    return await this.assetsService.list()
  }

  @Post()
  @ApiOperation({ summary: "Create asset", operationId: "create" })
  async create(@Body() asset: AssetCreateDto) {
    return this.assetsService.create(asset)
  }

  @Put(`:assetId`)
  @ApiOperation({ summary: "Update asset", operationId: "update" })
  async update(@Body() asset: AssetUpdateDto) {
    return this.assetsService.update(asset)
  }

  @Get(`:assetId`)
  @ApiOperation({ summary: "Get asset by id", operationId: "retrieve" })
  async retrieve(@Param("assetId") assetId: string) {
    return await this.assetsService.findOne(assetId)
  }
  @Delete(`:assetId`)
  @ApiOperation({ summary: "Delete asset by id", operationId: "delete" })
  async delete(@Param("assetId") assetId: string) {
    await this.assetsService.delete(assetId)
  }
}
