import { InjectRepository } from "@nestjs/typeorm"
import { AbstractService } from "../shared/abstract-service"
import { Unit } from "../entity/unit.entity"
import { UnitCreateDto } from "./unit.create.dto"
import { UnitUpdateDto } from "./unit.update.dto"
import { Repository } from "typeorm"

export class UnitsService extends AbstractService<Unit, UnitCreateDto, UnitUpdateDto> {
  constructor(@InjectRepository(Unit) protected readonly repository: Repository<Unit>) {
    super(repository)
  }
}
