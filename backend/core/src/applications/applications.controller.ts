import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { ApplicationDto, ApplicationsListQueryParams } from "./applications.dto"
import { ApplicationsService } from "./applications.service"
import { ApiBearerAuth } from "@nestjs/swagger"
import { DefaultAuthGuard } from "../auth/default.guard"
import { ApplicationCreateDto } from "./application.create.dto"
import { ApplicationUpdateDto } from "./application.update.dto"
import { TransformInterceptor } from "../interceptors/transform.interceptor"

@Controller("applications")
@UseGuards(DefaultAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async list(@Query() params: ApplicationsListQueryParams): Promise<ApplicationDto[]> {
    return await this.applicationsService.list(params)
  }

  @Post()
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async create(@Body() applicationCreateDto: ApplicationCreateDto): Promise<ApplicationDto> {
    return await this.applicationsService.create(applicationCreateDto)
  }

  @Get(`:applicationId`)
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async retrieve(@Param("applicationId") applicationId: string): Promise<ApplicationDto> {
    return await this.applicationsService.findOne(applicationId)
  }

  @Put(`:applicationId`)
  @UseInterceptors(new TransformInterceptor(ApplicationDto))
  async update(
    @Param("applicationId") applicationId: string,
    @Body() applicationUpdateDto: ApplicationUpdateDto
  ): Promise<ApplicationDto> {
    return await this.applicationsService.update(applicationUpdateDto)
  }

  @Delete(`:applicationId`)
  async delete(@Param("applicationId") applicationId: string) {
    await this.applicationsService.delete(applicationId)
  }
}
