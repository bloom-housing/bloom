import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common"
import { PreferencesService } from "../preferences/preferences.service"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import {
  PreferenceCreateDto,
  PreferenceDto,
  PreferenceUpdateDto,
} from "../preferences/preference.dto"
import { DefaultAuthGuard } from "../auth/default.guard"
import { AuthzGuard } from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { mapTo } from "../shared/mapTo"

@Controller("/preferences")
@ApiTags("preferences")
@ApiBearerAuth()
@ResourceType("preference")
@UseGuards(DefaultAuthGuard, AuthzGuard)
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: "List preferences", operationId: "list" })
  async list(): Promise<PreferenceDto[]> {
    return mapTo(PreferenceDto, await this.preferencesService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create preference", operationId: "create" })
  async create(@Body() preference: PreferenceCreateDto): Promise<PreferenceDto> {
    return mapTo(PreferenceDto, await this.preferencesService.create(preference))
  }

  @Put(`:preferenceId`)
  @ApiOperation({ summary: "Update preference", operationId: "update" })
  async update(@Body() preference: PreferenceUpdateDto): Promise<PreferenceDto> {
    return mapTo(PreferenceDto, await this.preferencesService.update(preference))
  }

  @Get(`:preferenceId`)
  @ApiOperation({ summary: "Get preference by id", operationId: "retrieve" })
  async retrieve(@Param("preferenceId") preferenceId: string): Promise<PreferenceDto> {
    return mapTo(
      PreferenceDto,
      await this.preferencesService.findOne({ where: { id: preferenceId } })
    )
  }

  @Delete(`:preferenceId`)
  @ApiOperation({ summary: "Delete preference by id", operationId: "delete" })
  async delete(@Param("preferenceId") preferenceId: string): Promise<void> {
    await this.preferencesService.delete(preferenceId)
  }
}
