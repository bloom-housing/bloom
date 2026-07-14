import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
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
import { ApiKeyGuard } from '../guards/api-key.guard';
import { BackgroundJobsService } from '../services/background-jobs.service';
import { BackgroundJobCreate } from '../dtos/background-jobs/background-job-create.dto';
import { mapTo } from '../utilities/mapTo';
import { User } from '../dtos/users/user.dto';
import { BackgroundJob } from '../dtos/background-jobs/background-job.dto';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { defaultValidationPipeOptions } from '../utilities/default-validation-pipe-options';
import { SuccessDTO } from '../dtos/shared/success.dto';

@Controller('jobs')
@ApiTags('jobs')
@ApiExtraModels(BackgroundJob, BackgroundJobCreate)
@PermissionTypeDecorator('jobs')
@UseGuards(ApiKeyGuard, JwtAuthGuard)
export class BackgroundJobsController {
  constructor(private readonly backgroundJobsService: BackgroundJobsService) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a new background job record in the database',
    operationId: 'createBackgroundJob',
  })
  @UsePipes(new ValidationPipe(defaultValidationPipeOptions))
  @UseGuards(ApiKeyGuard)
  @ApiOkResponse({ type: BackgroundJob })
  public async createBackgroundJob(
    @Request() req: ExpressRequest,
    @Body() dto: BackgroundJobCreate,
  ): Promise<BackgroundJob> {
    return await this.backgroundJobsService.create(
      dto,
      mapTo(User, req['user']),
    );
  }
  @Get('active')
  @ApiOperation({
    summary: 'Get info if any jobs are currently running',
    operationId: 'activeJobStatus',
  })
  @ApiOkResponse({ type: SuccessDTO })
  public async activeJobStatus(
    @Request() req: ExpressRequest,
  ): Promise<SuccessDTO> {
    return this.backgroundJobsService.findActiveJob(mapTo(User, req['user']));
  }

  @Get(':jobId')
  @ApiOperation({
    summary: 'Get a background job data by its ID',
    operationId: 'getBackgroundJob',
  })
  @ApiOkResponse({ type: BackgroundJob })
  public async getJobById(
    @Request() req: ExpressRequest,
    @Param('jobId', new ParseUUIDPipe({ version: '4' })) jobId: string,
  ): Promise<BackgroundJob> {
    return await this.backgroundJobsService.getById(
      jobId,
      mapTo(User, req['user']),
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get an active background job for a listing',
    operationId: 'findActiveJobForListing',
  })
  @ApiOkResponse({ type: Array<BackgroundJob> })
  public async getListingActiveJob(
    @Request() req: ExpressRequest,
    @Query('listingId', new ParseUUIDPipe({ version: '4' })) listingId: string,
  ): Promise<BackgroundJob[]> {
    return await this.backgroundJobsService.findActiveForListing(
      listingId,
      mapTo(User, req['user']),
    );
  }
}
