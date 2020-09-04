import { OmitType } from "@nestjs/swagger"
import { Unit } from "../entity/unit.entity"

export class UnitDto extends OmitType(Unit, ["listing"] as const) {}
