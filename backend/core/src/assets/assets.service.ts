import { AbstractServiceFactory } from "../shared/abstract-service"
import { Asset } from "../entity/asset.entity"
import { AssetCreateDto } from "./asset.create.dto"
import { AssetUpdateDto } from "./asset.update.dto"

export class AssetsService extends AbstractServiceFactory<Asset, AssetCreateDto, AssetUpdateDto>(
  Asset
) {}
