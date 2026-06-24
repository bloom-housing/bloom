import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class BackgroundJobsService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Creates an instance of a background job runner for a listing
   * @param listingId - Id for the listing on which data the runner will be working on
   * @param inputS3Key - S3 key for accessing data store in the AWS bucket
   * @param requestedByUserId - Id of the uer who requested the process creation
   */
  create() {
    return;
  }

  /**
   * Finds an instance of a job  by its ID
   * @param jobId - Id of the job to return data on
   * @returns Details on the requested job
   */
  getById() {
    return;
  }

  /**
   * Return latest job with a processing status else null
   * @param listingId - Id of the listing for which the job should be retrieved
   * @returns Details on the currently processed job for the desired listing
   */
  findActiveForListing() {
    return;
  }

  /**
   * Returns true if there is any job running (i.e. in status other than completed or failed)
   * @returns True if any active job exists (false otherwise)
   */
  findActiveJob() {
    return;
  }
}
