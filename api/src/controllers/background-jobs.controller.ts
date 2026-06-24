import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { BackgroundJobsService } from '../services/background-jobs.service';
import { BackgroundJobCreate } from '../dtos/background-jobs/background-job-create.dto';
import { mapTo } from '../utilities/mapTo';
import { User } from '../dtos/users/user.dto';
import { BackgroundJob } from '../dtos/background-jobs/background-job.dto';
import { PermissionTypeDecorator } from '../decorators/permission-type.decorator';
import { JwtAuthGuard } from '../guards/jwt.guard';

@Controller('jobs')
@ApiTags('jobs')
@PermissionTypeDecorator('jobs')
@UseGuards(ApiKeyGuard, JwtAuthGuard)
export class BackgroundJobsController {
  constructor(private readonly backgroundJobsService: BackgroundJobsService) {}

  @Post()
  @ApiOperation({
    summary: 'Creates a new background job record in the database',
    operationId: 'createBackgroundJob',
  })
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

  @Get()
  @ApiOperation({
    summary: 'Get an active background job for a listing',
    operationId: 'findActiveJobForListing',
  })
  @ApiOkResponse({ type: BackgroundJob })
  public async getListingActiveJob(
    @Query('listingId') listingId: string,
  ): Promise<BackgroundJob> {
    return await this.backgroundJobsService.findActiveForListing(listingId);
  }

  @Get(':jobId')
  @ApiOperation({
    summary: 'Get a background job data by its ID',
    operationId: 'getBackgroundJob',
  })
  @UseGuards(ApiKeyGuard)
  @ApiOkResponse({ type: BackgroundJob })
  public async getJobById(
    @Param('jobId') jobId: string,
  ): Promise<BackgroundJob> {
    return await this.backgroundJobsService.getById(jobId);
  }
}
