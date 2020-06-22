import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from "@nestjs/common"
import { ApplicationsListQueryParams } from "./applications.dto"
import { ApplicationsService } from "./applications.service"
import { plainToClass } from "class-transformer"
import { Application } from "../entity/application.entity"

@Controller("applications")
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async list(@Query() params?: ApplicationsListQueryParams): Promise<Application[]> {
    return plainToClass(
      Application,
      await this.applicationService.find(params.listingId, params.userId)
    )
  }
}
