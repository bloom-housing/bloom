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
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { MultiselectQuestionsService } from "./multiselect-question.service"
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { MultiselectQuestionDto } from "../multiselect-question/dto/multiselect-question.dto"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { mapTo } from "../shared/mapTo"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { AdminOrJurisdictionalAdminGuard } from "../auth/guards/admin-or-jurisidictional-admin.guard"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { MultiselectQuestionCreateDto } from "../multiselect-question/dto/multiselect-question-create.dto"
import { MultiselectQuestionUpdateDto } from "../multiselect-question/dto/multiselect-question-update.dto"
import { MultiselectQuestionsListQueryParams } from "../multiselect-question/dto/multiselect-question-list-query-params"
import { MultiselectQuestionsFilterParams } from "../multiselect-question/dto/multiselect-question-filter-params"
import { IdDto } from "../shared/dto/id.dto"
import { ListingDto } from "../listings/dto/listing.dto"
import { ActivityLogInterceptor } from "../activity-log/interceptors/activity-log.interceptor"

@Controller("/multiselectQuestions")
@ApiTags("multiselectQuestions")
@ApiBearerAuth()
@ResourceType("multiselectQuestion")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class MultiselectQuestionsController {
  constructor(private readonly multiselectQuestionsService: MultiselectQuestionsService) {}

  @Get()
  @ApiOperation({ summary: "List multiselect questions", operationId: "list" })
  @ApiExtraModels(MultiselectQuestionsFilterParams)
  async list(
    @Query() queryParams: MultiselectQuestionsListQueryParams
  ): Promise<MultiselectQuestionDto[]> {
    return mapTo(MultiselectQuestionDto, await this.multiselectQuestionsService.list(queryParams))
  }

  @Post()
  @ApiOperation({ summary: "Create multiselect question", operationId: "create" })
  @UseGuards(OptionalAuthGuard, AdminOrJurisdictionalAdminGuard)
  async create(
    @Body() multiselectQuestion: MultiselectQuestionCreateDto
  ): Promise<MultiselectQuestionDto> {
    return mapTo(
      MultiselectQuestionDto,
      await this.multiselectQuestionsService.create(multiselectQuestion)
    )
  }

  @Put(`:multiselectQuestionId`)
  @ApiOperation({ summary: "Update multiselect question", operationId: "update" })
  @UseGuards(OptionalAuthGuard, AdminOrJurisdictionalAdminGuard)
  async update(
    @Body() multiselectQuestion: MultiselectQuestionUpdateDto
  ): Promise<MultiselectQuestionDto> {
    return mapTo(
      MultiselectQuestionDto,
      await this.multiselectQuestionsService.update(multiselectQuestion)
    )
  }

  @Get(`:multiselectQuestionId`)
  @ApiOperation({ summary: "Get multiselect question by id", operationId: "retrieve" })
  async retrieve(
    @Param("multiselectQuestionId") multiselectQuestionId: string
  ): Promise<MultiselectQuestionDto> {
    return mapTo(
      MultiselectQuestionDto,
      await this.multiselectQuestionsService.findOne({ where: { id: multiselectQuestionId } })
    )
  }

  @Get(`listings/:multiselectQuestionId`)
  @ApiOperation({ summary: "Get multiselect question by id", operationId: "retrieveListings" })
  async retrieveListings(
    @Param("multiselectQuestionId") multiselectQuestionId: string
  ): Promise<ListingDto[]> {
    const results = await this.multiselectQuestionsService.findListingsWithMultiSelectQuestion(
      multiselectQuestionId
    )
    return mapTo(ListingDto, results)
  }

  @Delete()
  @ApiOperation({ summary: "Delete multiselect question by id", operationId: "delete" })
  @UseGuards(OptionalAuthGuard, AdminOrJurisdictionalAdminGuard)
  @UseInterceptors(ActivityLogInterceptor)
  async delete(@Body() dto: IdDto): Promise<void> {
    await this.multiselectQuestionsService.delete(dto.id)
  }
}
