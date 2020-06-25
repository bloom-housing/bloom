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
import { OwnerGuard } from "../auth/owner.guard"
import { ApiBearerAuth } from "@nestjs/swagger"

@Controller("user")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class UserApplicationsController {
  constructor(private readonly userApplicationsService: UserApplicationsService) {}

  @Get(":userId/applications")
  @UseGuards(OwnerGuard)
  async list(@Param("userId") userId: string): Promise<ApplicationDto[]> {
    return await this.userApplicationsService.list(userId)
  }

  @Post(":userId/applications")
  @UseGuards(OwnerGuard)
  async create(@Param("userId") userId, @Body() applicationCreateDto: ApplicationCreateDto) {
    await this.userApplicationsService.create(userId, applicationCreateDto)
  }

  @Get(":userId/applications/:applicationId")
  @UseGuards(OwnerGuard)
  async findOne(
    @Param("userId") userId: string,
    @Param("applicationId") applicationId: string
  ): Promise<ApplicationDto> {
    return await this.userApplicationsService.findOne(userId, applicationId)
  }

  @Put(`:userId/applications/:applicationId`)
  @UseGuards(OwnerGuard)
  async update(
    @Param("userId") userId: string,
    @Param("applicationId") applicationId: string,
    @Body() applicationUpdateDto: ApplicationUpdateDto
  ) {
    await this.userApplicationsService.update(applicationUpdateDto)
  }

  @Delete(`:userId/applications/:applicationId`)
  @UseGuards(OwnerGuard)
  async delete(@Param("userId") userId: string, @Param("applicationId") applicationId: string) {
    await this.userApplicationsService.delete(userId, applicationId)
  }
}
