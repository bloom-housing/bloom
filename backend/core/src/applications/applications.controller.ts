import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from "@nestjs/common"
import { ApplicationsListQueryParams } from "./applications.dto"
import { ApplicationsService } from "./applications.service"
import { Application } from "../entity/application.entity"

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}
  @Get()
  async list(@Query() params?: ApplicationsListQueryParams): Promise<Application[]> {
    return this.applicationService.find(params.listingId, params.userId)
  }
}
