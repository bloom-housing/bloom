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
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MultiselectQuestionService } from '../services/multiselect-question.service';
import { MultiselectQuestion } from '../dtos/multiselect-questions/multiselect-question.dto';
import { MultiselectQuestionCreate } from '../dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionUpdate } from '../dtos/multiselect-questions/multiselect-question-update.dto';
import { MultiselectQuestionQueryParams } from '../dtos/multiselect-questions/multiselect-question-query-params.dto';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { IdDTO } from '../dtos/shared/id.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { MultiselectQuestionFilterParams } from '../dtos/multiselect-questions/multiselect-question-filter-params.dto';
import { PaginationMeta } from '../dtos/shared/pagination.dto';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { AnyAdminGuard } from '../guards/any-admin.guard';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('multiselectQuestions')
@ApiTags('multiselectQuestions')
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
@ApiExtraModels(
  MultiselectQuestionCreate,
  MultiselectQuestionUpdate,
  MultiselectQuestionQueryParams,
  MultiselectQuestionFilterParams,
  PaginationMeta,
  IdDTO,
)
@PermissionTypeDecorator('multiselectQuestion')
@UseGuards(ApiKeyGuard, OptionalAuthGuard, PermissionGuard)
export class MultiselectQuestionController {
  constructor(
    private readonly multiselectQuestionService: MultiselectQuestionService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List multiselect questions', operationId: 'list' })
  @ApiOkResponse({ type: MultiselectQuestion, isArray: true })
  async list(
    @Query() queryParams: MultiselectQuestionQueryParams,
  ): Promise<MultiselectQuestion[]> {
    return await this.multiselectQuestionService.list(queryParams);
  }

  @Get(`:multiselectQuestionId`)
  @ApiOperation({
    summary: 'Get multiselect question by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: MultiselectQuestion })
  async retrieve(
    @Param('multiselectQuestionId') multiselectQuestionId: string,
  ): Promise<MultiselectQuestion> {
    return this.multiselectQuestionService.findOne(multiselectQuestionId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create multiselect question',
    operationId: 'create',
  })
  @ApiOkResponse({ type: MultiselectQuestion })
  @UseGuards(OptionalAuthGuard, AnyAdminGuard)
  async create(
    @Body() multiselectQuestion: MultiselectQuestionCreate,
  ): Promise<MultiselectQuestion> {
    return await this.multiselectQuestionService.create(multiselectQuestion);
  }

  @Put(`:multiselectQuestionId`)
  @ApiOperation({
    summary: 'Update multiselect question',
    operationId: 'update',
  })
  @ApiOkResponse({ type: MultiselectQuestion })
  @UseGuards(OptionalAuthGuard, AnyAdminGuard)
  async update(
    @Body() multiselectQuestion: MultiselectQuestionUpdate,
  ): Promise<MultiselectQuestion> {
    return await this.multiselectQuestionService.update(multiselectQuestion);
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete multiselect question by id',
    operationId: 'delete',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @UseGuards(OptionalAuthGuard, AnyAdminGuard)
  @UseInterceptors(ActivityLogInterceptor)
  async delete(@Body() dto: IdDTO): Promise<SuccessDTO> {
    return await this.multiselectQuestionService.delete(dto.id);
  }
}
