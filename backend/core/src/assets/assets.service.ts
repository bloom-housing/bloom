import { Injectable } from "@nestjs/common"
import { Asset } from "../entity/asset.entity"
import { AssetCreateDto } from "./asset.create.dto"
import { plainToClass } from "class-transformer"
import { AssetUpdateDto } from "./asset.update.dto"

@Injectable()
export class AssetsService {
  async list(): Promise<Asset[]> {
    return Asset.find()
  }

  async create(assetDto: AssetCreateDto): Promise<Asset> {
    const asset = plainToClass(Asset, assetDto)
    await asset.save()
    return asset
  }

  async findOne(assetId: string): Promise<Asset> {
    return Asset.findOneOrFail({
      where: {
        id: assetId,
      },
      relations: ["listing"],
    })
  }

  async delete(assetId: string) {
    return Asset.delete(assetId)
  }

  async update(assetDto: AssetUpdateDto) {
    const asset = await Asset.findOneOrFail({
      where: {
        id: assetDto.id,
      },
      relations: ["listing"],
    })
    Object.assign(asset, assetDto)
    await asset.save()
    return asset
  }
}
