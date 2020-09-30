import { Unit } from "../entity/unit.entity"
import { Injectable } from "@nestjs/common"
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm"
import { InjectRepository } from "@nestjs/typeorm"

@Injectable()
export class UnitsService extends TypeOrmCrudService<Unit> {
  constructor(@InjectRepository(Unit) repo) {
    super(repo)
  }
}
