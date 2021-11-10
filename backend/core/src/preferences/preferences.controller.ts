import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { PreferencesService } from "../preferences/preferences.service"
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { PreferenceDto } from "./dto/preference.dto"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { PreferenceCreateDto } from "./dto/preference-create.dto"
import { PreferenceUpdateDto } from "./dto/preference-update.dto"
import { PreferencesListQueryParams } from "./dto/preferences-list-query-params"
import { PreferencesFilterParams } from "./dto/preferences-filter-params"

@Controller("/preferences")
@ApiTags("preferences")
@ApiBearerAuth()
@ResourceType("preference")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @ApiOperation({ summary: "List preferences", operationId: "list" })
  @ApiExtraModels(PreferencesFilterParams)
  async list(@Query() queryParams: PreferencesListQueryParams): Promise<PreferenceDto[]> {
    return mapTo(PreferenceDto, await this.preferencesService.list(queryParams))
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
