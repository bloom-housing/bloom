import { Unit } from "./entities/unit.entity"
import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { UnitCreateDto } from "./dto/unit-create.dto"
import { UnitUpdateDto } from "./dto/unit-update.dto"

export class UnitsService extends AbstractServiceFactory<Unit, UnitCreateDto, UnitUpdateDto>(
  Unit
) {}
