import { AbstractServiceFactory } from "../shared/abstract-service"
import { Asset } from "./entities/asset.entity"
import { AssetCreateDto, AssetUpdateDto } from "./dto/asset.dto"

export class AssetsService extends AbstractServiceFactory<Asset, AssetCreateDto, AssetUpdateDto>(
  Asset
) {}
