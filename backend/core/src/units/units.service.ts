import { Unit } from "../entity/unit.entity"
import { UnitCreateDto } from "./unit.create.dto"
import { UnitUpdateDto } from "./unit.update.dto"
import { AbstractServiceFactory } from "../shared/abstract-service"

export class UnitsService extends AbstractServiceFactory<Unit, UnitCreateDto, UnitUpdateDto>(
  Unit
) {}
