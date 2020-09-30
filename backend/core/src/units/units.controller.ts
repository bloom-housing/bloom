import { Controller, UseGuards } from "@nestjs/common"

import { Crud } from "@nestjsx/crud"
import { ResourceType } from "../auth/resource_type.decorator"
import AuthzGuard from "../auth/authz.guard"
import { Unit } from "../entity/unit.entity"
import { UnitCreateDto } from "./unit.create.dto"
import { UnitsService } from "./units.service"
import { DefaultAuthGuard } from "../auth/default.guard"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"

@Crud({
  model: {
    type: Unit,
  },
  dto: {
    create: UnitCreateDto,
  },
  params: {
    id: {
      field: "id",
      type: "uuid",
      primary: true,
    },
  },
})
@Controller("units")
@ResourceType("unit")
@ApiTags("units")
@ApiBearerAuth()
@UseGuards(DefaultAuthGuard, AuthzGuard)
export class UnitsController {
  constructor(public service: UnitsService) {}
}
