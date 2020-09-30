import { Controller, UseGuards } from "@nestjs/common"
import { Crud } from "@nestjsx/crud"
import { Preference } from "../entity/preference.entity"
import { PreferenceCreateDto } from "./preference.create.dto"
import { ResourceType } from "../auth/resource_type.decorator"
import AuthzGuard from "../auth/authz.guard"
import { PreferencesService } from "./preferences.service"
import { DefaultAuthGuard } from "../auth/default.guard"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"

@Crud({
  model: {
    type: Preference,
  },
  dto: {
    create: PreferenceCreateDto,
  },
  params: {
    id: {
      field: "id",
      type: "uuid",
      primary: true,
    },
  },
})
@Controller("preferences")
@ResourceType("preference")
@ApiTags("preferences")
@ApiBearerAuth()
@UseGuards(DefaultAuthGuard, AuthzGuard)
export class PreferencesController {
  constructor(public service: PreferencesService) {}
}
