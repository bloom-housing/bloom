import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { PreferencesService } from "../preferences/preferences.service"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { TransformResponseInterceptor } from "../interceptors/transform-response-interceptor.service"
import { PreferenceDto } from "../preferences/preference.dto"
import { PreferenceCreateDto } from "../preferences/preference.create.dto"
import { PreferenceUpdateDto } from "../preferences/preference.update.dto"
import { DefaultAuthGuard } from "../auth/default.guard"
import AuthzGuard from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"

@Controller("/preferences")
@ApiTags("preferences")
@ApiBearerAuth()
@ResourceType("preference")
@UseInterceptors(new TransformResponseInterceptor(PreferenceDto))
@UseGuards(DefaultAuthGuard, AuthzGuard)
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: "List preferences", operationId: "list" })
  @ApiResponse({ status: 200, type: PreferenceDto, description: "Lists preferences" })
  async list() {
    return await this.preferencesService.list()
  }

  @Post()
  @ApiOperation({ summary: "Create preference", operationId: "create" })
  async create(@Body() preference: PreferenceCreateDto) {
    return this.preferencesService.create(preference)
  }

  @Put(`:preferenceId`)
  @ApiOperation({ summary: "Update preference", operationId: "update" })
  async update(@Body() preference: PreferenceUpdateDto) {
    return this.preferencesService.update(preference)
  }

  @Get(`:preferenceId`)
  @ApiOperation({ summary: "Get preference by id", operationId: "retrieve" })
  async retrieve(@Param("preferenceId") preferenceId: string) {
    return await this.preferencesService.findOne(preferenceId)
  }

  @Delete(`:preferenceId`)
  @ApiOperation({ summary: "Delete preference by id", operationId: "delete" })
  async delete(@Param("preferenceId") preferenceId: string) {
    await this.preferencesService.delete(preferenceId)
  }
}
