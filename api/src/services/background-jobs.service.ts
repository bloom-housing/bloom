import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BackgroundJobStatusEnum } from '@prisma/client';
import { mapTo } from '../utilities/mapTo';
import { BackgroundJob } from '../dtos/background-jobs/background-job.dto';
import { S3Service } from './s3.service';
import { User } from '../dtos/users/user.dto';
import { BackgroundJobCreate } from '../dtos/background-jobs/background-job-create.dto';
import { PermissionService } from './permission.service';
import { permissionActions } from '../enums/permissions/permission-actions-enum';

@Injectable()
export class BackgroundJobsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    private readonly permissionService: PermissionService,
  ) {}

  /**
   * Creates an instance of a background job runner for a listing
   * @param dto - background job creation DTO
   * @param requestingUser - Data on requesting user
   * @returns The newly created background job
   */
  async create(
    dto: BackgroundJobCreate,
    requestingUser: User,
  ): Promise<BackgroundJob> {
    const { listingId, inputS3Key } = dto;
    const requestedByUserId = requestingUser.id;

    await this.permissionService.canOrThrow(
      requestingUser,
      'jobs',
      permissionActions.create,
    );

    const hasActiveListing =
      !!(await this.prismaService.backgroundJob.findFirst({
        select: {
          id: true,
        },
        where: {
          listingId: listingId,
          status: BackgroundJobStatusEnum.processing,
        },
      }));

    if (hasActiveListing) {
      throw new ConflictException(
        `Listing with ID: ${listingId} has a currently running job assigned`,
      );
    }

    // TODO: Integrate the connection with the S3 service

    const backgroundJob = await this.prismaService.backgroundJob.create({
      data: {
        listingId,
        requestedByUserId,
        inputS3Key,
        status: BackgroundJobStatusEnum.processing,
      },
    });

    return mapTo(BackgroundJob, backgroundJob);
  }

  /**
   * Finds an instance of a job  by its ID
   * @param jobId - Id of the job to return data on
   * @returns Details on the requested job
   */
  async getById(jobId: string, requestingUser: User): Promise<BackgroundJob> {
    await this.permissionService.canOrThrow(
      requestingUser,
      'jobs',
      permissionActions.read,
    );

    const jobData = await this.prismaService.backgroundJob.findFirst({
      where: {
        id: jobId,
      },
    });

    if (!jobData) {
      throw new NotFoundException(`Job with id: ${jobId} was not found`);
    }

    return mapTo(BackgroundJob, jobData);
  }

  /**
   * Return latest job with a processing status else null
   * @param listingId - Id of the listing for which the job should be retrieved
   * @returns Details on the currently processed job for the desired listing
   */
  async findActiveForListing(
    listingId: string,
    requestingUser: User,
  ): Promise<BackgroundJob | null> {
    await this.permissionService.canOrThrow(
      requestingUser,
      'jobs',
      permissionActions.read,
    );

    const activeJob = await this.prismaService.backgroundJob.findFirst({
      where: {
        listingId: listingId,
        status: BackgroundJobStatusEnum.processing,
      },
    });

    return activeJob ? mapTo(BackgroundJob, activeJob) : null;
  }

  /**
   * Returns true if there is any job running (i.e. in status other than completed or failed)
   * @returns True if any active job exists (false otherwise)
   */
  async findActiveJob(requestingUser: User): Promise<boolean> {
    await this.permissionService.canOrThrow(
      requestingUser,
      'jobs',
      permissionActions.read,
    );

    const activeJob = await this.prismaService.backgroundJob.findFirst({
      select: { id: true },
      where: {
        status: BackgroundJobStatusEnum.processing,
      },
    });

    return !!activeJob;
  }
}
