import {
  Controller,
  UseGuards,
} from "@nestjs/common"

import { DefaultAuthGuard } from "../auth/default.guard"
import { Crud } from "@nestjsx/crud"
import { ResourceType } from "../auth/resource_type.decorator"
import AuthzGuard from "../auth/authz.guard"
import { ApplicationMethod } from "../entity/application-method.entity"
import { ApplicationMethodCreateDto } from "./application-method.create.dto"
import { ApplicationMethodsService } from "./application-method.service"

@Crud({
  model: {
    type: ApplicationMethod,
  },
  dto: {
    create: ApplicationMethodCreateDto,
  },
  params: {
    id: {
      field: "id",
      type: "uuid",
      primary: true,
    },
  },
})
@Controller("applicationMethods")
@ResourceType("application-method")
@UseGuards(DefaultAuthGuard, AuthzGuard)
export class ApplicationMethodsController {
  constructor(public service: ApplicationMethodsService) {}
}
