import { Injectable } from "@nestjs/common"
import { Asset } from "../entity/asset.entity"
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class AssetsService extends TypeOrmCrudService<Asset> {
  constructor(@InjectRepository(Asset) repo) {
    super(repo)
  }
}
