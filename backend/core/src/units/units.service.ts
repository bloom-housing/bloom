import { Unit } from "../entity/unit.entity"
import { plainToClass } from "class-transformer"
import { UnitCreateDto } from "./unit.create.dto"
import { UnitUpdateDto } from "./unit.update.dto"

export class UnitsService {
  async list(): Promise<Unit[]> {
    return Unit.find()
  }

  async create(unitDto: UnitCreateDto): Promise<Unit> {
    const unit = plainToClass(Unit, unitDto)
    await unit.save()
    return unit
  }

  async findOne(unitId: string): Promise<Unit> {
    return Unit.findOneOrFail({
      where: {
        id: unitId,
      },
    })
  }

  async delete(unitId: string) {
    await Unit.delete(unitId)
  }

  async update(unitDto: UnitUpdateDto) {
    const unit = await Unit.findOneOrFail({
      where: {
        id: unitDto.id,
      },
    })
    Object.assign(unit, unitDto)
    await unit.save()
    return unit
  }
}
