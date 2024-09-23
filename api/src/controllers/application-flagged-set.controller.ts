import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { ApplicationFlaggedSetService } from '../services/application-flagged-set.service';
import { IdDTO } from '../dtos/shared/id.dto';
import { PaginatedAfsDto } from '../dtos/application-flagged-sets/paginated-afs.dto';
import { ApplicationFlaggedSet } from '../dtos/application-flagged-sets/application-flagged-set.dto';
import { AfsResolve } from '../dtos/application-flagged-sets/afs-resolve.dto';
import { AfsMeta } from '../dtos/application-flagged-sets/afs-meta.dto';
import { AfsProcessQueryParams } from '../dtos/application-flagged-sets/afs-process-query-params.dto';
import { AfsQueryParams } from '../dtos/application-flagged-sets/afs-query-params.dto';
import { User } from '../dtos/users/user.dto';
import { mapTo } from '../utilities/mapTo';
import { OptionalAuthGuard } from '../guards/optional.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('/applicationFlaggedSets')
@ApiExtraModels(SuccessDTO)
@ApiTags('applicationFlaggedSets')
@UseGuards(ApiKeyGuard, OptionalAuthGuard, PermissionGuard)
@PermissionTypeDecorator('applicationFlaggedSet')
@UsePipes(
  new ValidationPipe({
    ...defaultValidationPipeOptions,
  }),
)
export class ApplicationFlaggedSetController {
  constructor(
    private readonly applicationFlaggedSetService: ApplicationFlaggedSetService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List application flagged sets',
    operationId: 'list',
  })
  @ApiOkResponse({ type: PaginatedAfsDto })
  async list(@Query() params: AfsQueryParams): Promise<PaginatedAfsDto> {
    return await this.applicationFlaggedSetService.list(params);
  }

  @Get('meta')
  @ApiOperation({
    summary: 'Meta information for application flagged sets',
    operationId: 'meta',
  })
  @ApiOkResponse({ type: AfsMeta })
  async meta(@Query() params: AfsQueryParams): Promise<AfsMeta> {
    return await this.applicationFlaggedSetService.meta(params);
  }

  @Get(`:afsId`)
  @ApiOperation({
    summary: 'Retrieve application flagged set by id',
    operationId: 'retrieve',
  })
  @ApiOkResponse({ type: ApplicationFlaggedSet })
  async retrieve(@Param('afsId') id: string): Promise<ApplicationFlaggedSet> {
    return await this.applicationFlaggedSetService.findOne(id);
  }

  @Post('resolve')
  @ApiOperation({
    summary: 'Resolve application flagged set',
    operationId: 'resolve',
  })
  @ApiOkResponse({ type: ApplicationFlaggedSet })
  async resolve(
    @Body() dto: AfsResolve,
    @Request() req: ExpressRequest,
  ): Promise<ApplicationFlaggedSet> {
    return await this.applicationFlaggedSetService.resolve(
      dto,
      mapTo(User, req['user']),
    );
  }

  @Put('process')
  @ApiOperation({
    summary: 'Trigger the duplicate check process',
    operationId: 'process',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async process(): Promise<SuccessDTO> {
    return await this.applicationFlaggedSetService.process();
  }

  @Put('process_duplicates')
  @ApiOperation({
    summary: 'Trigger the duplicate check process',
    operationId: 'processDuplicates',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async processDuplicates(
    @Query() params: AfsProcessQueryParams,
  ): Promise<SuccessDTO> {
    return await this.applicationFlaggedSetService.processDuplicates(
      params?.listingId,
      params?.force,
    );
  }

  @Put(':afsId')
  @ApiOperation({
    summary: 'Reset flagged set confirmation alert',
    operationId: 'resetConfirmationAlert',
  })
  @ApiOkResponse({ type: SuccessDTO })
  async resetConfirmationAlert(@Body() dto: IdDTO): Promise<SuccessDTO> {
    return await this.applicationFlaggedSetService.resetConfirmationAlert(
      dto.id,
    );
  }
}
