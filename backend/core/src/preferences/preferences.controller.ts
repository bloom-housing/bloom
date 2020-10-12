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
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { TransformInterceptor } from "../interceptors/transform.interceptor"
import { PreferenceDto } from "../preferences/preference.dto"
import { Preference } from "../entity/preference.entity"
import { PreferenceCreateDto } from "../preferences/preference.create.dto"
import { PreferenceUpdateDto } from "../preferences/preference.update.dto"
import { DefaultAuthGuard } from "../auth/default.guard"

// TODO Add Admin role check

@Controller("/preferences")
@ApiTags("preferences")
@ApiBearerAuth()
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "List preferences", operationId: "list" })
  @UseInterceptors(new TransformInterceptor(PreferenceDto))
  async list(): Promise<Preference[]> {
    return await this.preferencesService.list()
  }

  @Post()
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Create preference", operationId: "create" })
  @UseInterceptors(new TransformInterceptor(PreferenceDto))
  async create(@Body() preference: PreferenceCreateDto): Promise<Preference> {
    return this.preferencesService.create(preference)
  }

  @Put(`:preferenceId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Update preference", operationId: "update" })
  @UseInterceptors(new TransformInterceptor(PreferenceDto))
  async update(@Body() preference: PreferenceUpdateDto): Promise<Preference> {
    return this.preferencesService.update(preference)
  }

  @Get(`:preferenceId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Get preference by id", operationId: "retrieve" })
  @UseInterceptors(new TransformInterceptor(PreferenceDto))
  async retrieve(@Param("preferenceId") preferenceId: string): Promise<Preference> {
    return await this.preferencesService.findOne({ where: { id: preferenceId } })
  }

  @Delete(`:preferenceId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Delete preference by id", operationId: "delete" })
  async delete(@Param("preferenceId") preferenceId: string): Promise<void> {
    await this.preferencesService.delete(preferenceId)
  }
}
