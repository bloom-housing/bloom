import { AbstractService } from "../shared/abstract-service"
import { Asset } from "../entity/asset.entity"
import { AssetCreateDto } from "./asset.create.dto"
import { AssetUpdateDto } from "./asset.update.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

export class AssetsService extends AbstractService<Asset, AssetCreateDto, AssetUpdateDto> {
  constructor(@InjectRepository(Asset) protected readonly repository: Repository<Asset>) {
    super(repository)
  }
}
