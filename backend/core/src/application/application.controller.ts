import { ClassSerializerInterceptor, Controller, Get, Query, UseInterceptors } from "@nestjs/common"
import { ApplicationListQueryParams } from "./application.dto"
import { ApplicationService } from "./application.service"
import { plainToClass } from "class-transformer"
import { Application } from "../entity/application.entity"

@Controller("application")
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async list(@Query() params?: ApplicationListQueryParams): Promise<Application[]> {
    return plainToClass(
      Application,
      await this.applicationService.find(params.listingId, params.userId)
    )
  }
}
