import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, UseGuards,
  UseInterceptors
} from "@nestjs/common"
import { UserApplicationsService } from "./user-applications.service"
import { ApplicationCreateDto } from "./application.create.dto"
import { ApplicationUpdateDto } from "./application.update.dto"
import { ApplicationDto } from "../applications/applications.dto"
import { JwtAuthGuard } from "../auth/jwt.guard"
import { OwnerGuard } from "../guards/owner.guard"

@Controller("user")
@UseGuards(JwtAuthGuard)
@UseGuards(OwnerGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UserApplicationsController {
  constructor(private readonly userApplicationsService: UserApplicationsService) {}

  @Get(":userId/applications")
  async list(@Param("userId") userId: string): Promise<ApplicationDto[]> {
    return await this.userApplicationsService.list(userId)
  }

  @Post(":userId/applications")
  async create(@Param("userId") userId, @Body() applicationCreateDto: ApplicationCreateDto) {
    return this.userApplicationsService.create(userId, applicationCreateDto)
  }

  @Get(":userId/applications/:applicationId")
  async findOne(
    @Param("userId") userId: string,
    @Param("applicationId") applicationId: string
  ): Promise<ApplicationDto> {
    return await this.userApplicationsService.findOne(userId, applicationId)
  }

  @Put(`:userId/applications/:applicationId`)
  async update(
    @Param("userId") userId: string,
    @Param("applicationId") applicationId: string,
    @Body() applicationUpdateDto: ApplicationUpdateDto
  ) {
    return this.userApplicationsService.update(applicationUpdateDto)
  }

  @Delete(`:userId/applications/:applicationId`)
  async delete(@Param("userId") userId: string, @Param("applicationId") applicationId: string) {
    return this.userApplicationsService.delete(userId, applicationId)
  }
}
