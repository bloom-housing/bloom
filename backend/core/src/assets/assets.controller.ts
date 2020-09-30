import { Controller, UseGuards } from "@nestjs/common"
import { AssetsService } from "./assets.service"
import { Asset } from "../entity/asset.entity"
import { Crud } from "@nestjsx/crud"
import { ResourceType } from "../auth/resource_type.decorator"
import { AssetCreateDto } from "./asset.create.dto"
import AuthzGuard from "../auth/authz.guard"
import { DefaultAuthGuard } from "../auth/default.guard"

@Crud({
  model: {
    type: Asset,
  },
  dto: {
    create: AssetCreateDto,
  },
  params: {
    id: {
      field: "id",
      type: "uuid",
      primary: true,
    },
  },
})
@Controller("assets")
@ResourceType("asset")
@UseGuards(DefaultAuthGuard, AuthzGuard)
export class AssetsController {
  constructor(public service: AssetsService) {}
}
