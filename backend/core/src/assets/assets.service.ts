import { AbstractServiceFactory } from "../shared/abstract-service"
import { Asset } from "../entity/asset.entity"
import { AssetCreateDto, AssetUpdateDto } from "./asset.dto"

export class AssetsService extends AbstractServiceFactory<Asset, AssetCreateDto, AssetUpdateDto>(
  Asset
) {}
