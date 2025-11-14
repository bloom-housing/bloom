import { Request as ExpressRequest } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
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
import { PermissionAction } from '../decorators/permission-action.decorator';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { MultiselectQuestion } from '../dtos/multiselect-questions/multiselect-question.dto';
import { MultiselectQuestionCreate } from '../dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionFilterParams } from '../dtos/multiselect-questions/multiselect-question-filter-params.dto';
import { MultiselectQuestionUpdate } from '../dtos/multiselect-questions/multiselect-question-update.dto';
import { MultiselectQuestionQueryParams } from '../dtos/multiselect-questions/multiselect-question-query-params.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { PaginationMeta } from '../dtos/shared/pagination.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { AdminOrJurisdictionalAdminGuard } from '../guards/admin-or-jurisdiction-admin.guard';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { ActivityLogInterceptor } from '../interceptors/activity-log.interceptor';
import { MultiselectQuestionService } from '../services/multiselect-question.service';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { mapTo } from '../utilities/mapTo';

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
@UseGuards(ApiKeyGuard, OptionalAuthGuard)
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

  @Post()
  @ApiOperation({
    summary: 'Create multiselect question',
    operationId: 'create',
  })
  @ApiOkResponse({ type: MultiselectQuestion })
  @UseGuards(AdminOrJurisdictionalAdminGuard)
  async create(
    @Body() multiselectQuestion: MultiselectQuestionCreate,
    @Request() req: ExpressRequest,
  ): Promise<MultiselectQuestion> {
    return await this.multiselectQuestionService.create(
      multiselectQuestion,
      mapTo(User, req['user']),
    );
  }

  @Put()
  @ApiOperation({
    summary: 'Update multiselect question',
    operationId: 'update',
  })
  @ApiOkResponse({ type: MultiselectQuestion })
  @UseGuards(AdminOrJurisdictionalAdminGuard)
  async update(
    @Body() multiselectQuestion: MultiselectQuestionUpdate,
    @Request() req: ExpressRequest,
  ): Promise<MultiselectQuestion> {
    return await this.multiselectQuestionService.update(
      multiselectQuestion,
      mapTo(User, req['user']),
    );
  }

  @Delete()
  @ApiOperation({
    summary: 'Delete multiselect question by id',
    operationId: 'delete',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @UseGuards(AdminOrJurisdictionalAdminGuard)
  @UseInterceptors(ActivityLogInterceptor)
  async delete(
    @Body() dto: IdDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.multiselectQuestionService.delete(
      dto.id,
      mapTo(User, req['user']),
    );
  }

  @Put('reActivate')
  @ApiOperation({
    summary: 'Re-activate a multiselect question',
    operationId: 'reActivate',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @UseGuards(AdminOrJurisdictionalAdminGuard)
  async reActivate(
    @Body() dto: IdDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.multiselectQuestionService.reActivate(
      dto.id,
      mapTo(User, req['user']),
    );
  }

  @Put('retire')
  @ApiOperation({
    summary: 'Retire a multiselect question',
    operationId: 'retire',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @UseGuards(AdminOrJurisdictionalAdminGuard)
  async retire(
    @Body() dto: IdDTO,
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return await this.multiselectQuestionService.retire(
      dto.id,
      mapTo(User, req['user']),
    );
  }

  @Put('retireMultiselectQuestions')
  @ApiOperation({
    summary: 'Trigger the retirement of multiselect questions cron job',
    operationId: 'retireMultiselectQuestions',
  })
  @ApiOkResponse({ type: SuccessDTO })
  @PermissionAction(permissionActions.submit)
  @UseInterceptors(ActivityLogInterceptor)
  @UseGuards(ApiKeyGuard, AdminOrJurisdictionalAdminGuard)
  async retireMultiselectQuestions(): Promise<SuccessDTO> {
    return await this.multiselectQuestionService.retireMultiselectQuestions();
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
}
