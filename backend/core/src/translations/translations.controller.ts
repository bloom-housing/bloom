import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { TranslationCreateDto, TranslationDto, TranslationUpdateDto } from "./dto/translation.dto"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { TranslationsService } from "./services/translations.service"

@Controller("/translations")
@ApiTags("translations")
@ApiBearerAuth()
@ResourceType("translation")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get()
  @ApiOperation({ summary: "List translations", operationId: "list" })
  async list(): Promise<TranslationDto[]> {
    return mapTo(TranslationDto, await this.translationsService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create translation", operationId: "create" })
  async create(@Body() translation: TranslationCreateDto): Promise<TranslationDto> {
    return mapTo(TranslationDto, await this.translationsService.create(translation))
  }

  @Put(`:translationId`)
  @ApiOperation({ summary: "Update translation", operationId: "update" })
  async update(@Body() translation: TranslationUpdateDto): Promise<TranslationDto> {
    return mapTo(TranslationDto, await this.translationsService.update(translation))
  }

  @Get(`:translationId`)
  @ApiOperation({ summary: "Get translation by id", operationId: "retrieve" })
  async retrieve(@Param("translationId") translationId: string): Promise<TranslationDto> {
    return mapTo(
      TranslationDto,
      await this.translationsService.findOne({ where: { id: translationId } })
    )
  }

  @Delete(`:translationId`)
  @ApiOperation({ summary: "Delete translation by id", operationId: "delete" })
  async delete(@Param("translationId") translationId: string): Promise<void> {
    return await this.translationsService.delete(translationId)
  }
}
