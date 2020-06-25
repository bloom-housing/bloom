import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { ApplicationsListQueryParams } from "./applications.dto"
import { ApplicationsService } from "./applications.service"
import { Application } from "../entity/application.entity"
import { JwtAuthGuard } from "../auth/jwt.guard"
import { ApiBearerAuth } from "@nestjs/swagger"
import { RolesGuard } from "../auth/roles.guard"
import { Roles } from "../auth/roles.decorator"

@Controller("applications")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Get()
  @Roles("admin")
  @UseGuards(RolesGuard)
  async list(@Query() params?: ApplicationsListQueryParams): Promise<Application[]> {
    return this.applicationService.find(params.listingId, params.userId)
  }
}
