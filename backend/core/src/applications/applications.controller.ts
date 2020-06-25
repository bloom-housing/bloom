import { ClassSerializerInterceptor, Controller, Get, Query, UseGuards, UseInterceptors } from "@nestjs/common"
import { ApplicationsListQueryParams } from "./applications.dto"
import { ApplicationsService } from "./applications.service"
import { Application } from "../entity/application.entity"
import { JwtAuthGuard } from "../auth/jwt.guard"

@Controller("applications")
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}
  @Get()
  async list(@Query() params?: ApplicationsListQueryParams): Promise<Application[]> {
    return this.applicationService.find(params.listingId, params.userId)
  }
}
