import {
  ForbiddenException,
  Injectable,
  StreamableFile,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApplicationStatusEnum } from '@prisma/client';
import fs, { createReadStream } from 'fs';
import dayjs from 'dayjs';
import { join } from 'path';
import { PrismaService } from './prisma.service';
import { CsvHeader } from '../types/CsvExportInterface';
import { formatLocalDate } from '../utilities/format-local-date';
import { Application } from '../dtos/applications/application.dto';
import { mapTo } from '../utilities/mapTo';
import { zipExport } from '../utilities/zip-export';
import { User } from '../dtos/users/user.dto';
import { ListingService } from './listing.service';
import { PermissionService } from './permission.service';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { convertApplicationDeclineReasonToReadable } from '../utilities/application-export-helpers';
import { ApplicationBulkUpload } from '../dtos/applications/application-bulk-upload.dto';
import { doJurisdictionHaveFeatureFlagSet } from 'src/utilities/feature-flag-utilities';
import { FeatureFlagEnum } from 'src/enums/feature-flags/feature-flags-enum';
import { Jurisdiction } from 'src/dtos/jurisdictions/jurisdiction.dto';

const NUMBER_TO_PAGINATE_BY = 500;

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const BULK_UPLOAD_KEY_PATTERN = new RegExp(
  `^bulk-application-updates-(${UUID})-(${UUID})-(.+)\\.csv$`,
  'i',
);

@Injectable()
export class ApplicationBulkUploadService {
  private dateFormat = 'MM-DD-YYYY hh:mm:ssA z';

  constructor(
    private prisma: PrismaService,
    private listingService: ListingService,
    private permissionService: PermissionService,
  ) {}

  private formatApplicationStatus(statusEnum: ApplicationStatusEnum): string {
    switch (statusEnum) {
      case ApplicationStatusEnum.declined:
        return 'Declined';
      case ApplicationStatusEnum.receivedUnit:
        return 'Received a Unit';
      case ApplicationStatusEnum.submitted:
        return 'Submitted';
      case ApplicationStatusEnum.waitlist:
        return 'Wait list';
      case ApplicationStatusEnum.waitlistDeclined:
        return 'Wait list - Declined';
      default:
        return statusEnum;
    }
  }

  private getBulkUploadHeaders(timeZone?: string): CsvHeader[] {
    const headers: CsvHeader[] = [
      {
        path: 'id',
        label: 'Application Id',
      },
      {
        path: 'applicant.firstName',
        label: 'Applicant First Name',
      },
      {
        path: 'applicant.lastName',
        label: 'Applicant Last Name',
      },
      {
        path: 'submissionDate',
        label: 'Application Submission Date',
        format: (val: string): string =>
          formatLocalDate(
            val,
            this.dateFormat,
            timeZone ?? process.env.TIME_ZONE,
          ),
      },
      {
        path: 'manualLotteryPositionNumber',
        label: 'Lottery Position Number',
      },
      {
        path: 'status',
        label: 'Application Status',
        format: (val) => this.formatApplicationStatus(val),
      },
      {
        path: 'applicationDeclineReason',
        label: 'Application Decline Reason',
        format: (val) => convertApplicationDeclineReasonToReadable(val),
      },
      {
        path: 'applicationDeclineReasonAdditionalDetails',
        label: 'Application Decline Reason Additional Details',
      },
      {
        path: 'accessibleUnitWaitlistNumber',
        label: 'Waitlist Position (Accessible Unit)',
      },
      {
        path: 'conventionalUnitWaitlistNumber',
        label: 'Waitlist Position (Conventional Unit)',
      },
    ];

    return headers;
  }

  async downloadBulkUpdateTemplate(
    listingId: string,
    user: User,
  ): Promise<StreamableFile> {
    await this.authorizeExport(user, listingId);

    const applications = await this.prisma.applications.findMany({
      select: {
        id: true,
      },
      where: {
        listingId: listingId,
        markedAsDuplicate: false,
        deletedAt: null,
      },
    });

    if (applications.length === 0) {
      throw new NotFoundException(
        `Listing with id: ${listingId} does not contain valid applications`,
      );
    }

    const now = new Date();
    const dateString = dayjs(now).format('YYYY-MM-DD_HH-mm');

    const zipFilename = `listing-${listingId}-applications-${
      user.id
    }-${now.getTime()}`;

    const filename = join(process.cwd(), `src/temp/${zipFilename}.csv`);

    await this.csvExportHelper(
      filename,
      listingId,
      mapTo(Application, applications),
    );
    const readStream = createReadStream(filename);

    return await zipExport(
      readStream,
      zipFilename,
      `applications-${listingId}-${dateString}`,
      false,
    );
  }

  csvExportHelper(
    filename: string,
    listingId: string,
    applications: Pick<Application, 'id'>[],
  ): Promise<void> {
    const csvHeaders = this.getBulkUploadHeaders();

    return new Promise(async (resolve, reject) => {
      // create stream
      const writableStream = fs.createWriteStream(`${filename}`);
      writableStream
        .on('error', (err) => {
          console.log('csv writestream error');
          console.log(err);
          reject(err);
        })
        .on('close', () => {
          resolve();
        })
        .on('open', async () => {
          try {
            writableStream.write(
              csvHeaders
                .map((header) => `"${header.label.replace(/"/g, `""`)}"`)
                .join(',') + '\n',
            );

            const promiseArray: Promise<string>[] = [];
            for (
              let i = 0;
              i < applications.length;
              i += NUMBER_TO_PAGINATE_BY
            ) {
              promiseArray.push(
                (async () => {
                  const paginatedApplications =
                    await this.prisma.applications.findMany({
                      select: {
                        id: true,
                        applicant: {
                          select: {
                            firstName: true,
                            lastName: true,
                          },
                        },
                        submissionDate: true,
                        manualLotteryPositionNumber: true,
                        status: true,
                        applicationDeclineReason: true,
                        applicationDeclineReasonAdditionalDetails: true,
                        accessibleUnitWaitlistNumber: true,
                        conventionalUnitWaitlistNumber: true,
                      },
                      where: {
                        listingId: listingId,
                        markedAsDuplicate: false,
                        deletedAt: null,
                        id: {
                          in: applications
                            .slice(i, i + NUMBER_TO_PAGINATE_BY)
                            .map((app) => app.id),
                        },
                      },
                    });

                  let data = '';
                  paginatedApplications.forEach((app) => {
                    const stringData = this.populateDataForEachHeader(
                      csvHeaders,
                      app,
                      { stringData: data },
                    );
                    data = stringData + '\n';
                  });
                  return data;
                })(),
              );
            }
            const resolvedArray = await Promise.all(promiseArray);
            // now loop over batched row data and write them to file
            resolvedArray.forEach((row) => {
              try {
                writableStream.write(row);
              } catch (e) {
                console.log('writeStream write error = ', e);
                writableStream.once('drain', () => {
                  console.log('drain buffer');
                  writableStream.write(row + '\n');
                });
              }
            });
            writableStream.end();
          } catch (e) {
            reject(e);
          }
        });
    });
  }

  populateDataForEachHeader(
    csvHeaders: CsvHeader[],
    application,
    optionalParams?: {
      stringData?: string;
    },
  ): string {
    let stringData = optionalParams?.stringData ?? '';

    csvHeaders.forEach((header, index) => {
      let value;
      value = header.path.split('.').reduce((acc, curr) => {
        if (acc === null || acc === undefined) {
          return '';
        }

        if (!isNaN(Number(curr))) {
          const index = Number(curr);
          return acc[index];
        }

        return acc[curr];
      }, application);

      if (value === undefined) {
        value = '';
      } else if (value === null) {
        value = '';
      }

      if (header.format) {
        value = header.format(value);
      }

      if (stringData !== undefined) {
        stringData +=
          value !== '' ? `"${value.toString().replace(/"/g, `""`)}"` : '';
        if (index < csvHeaders.length - 1) {
          stringData += ',';
        }
      }
    });
    return stringData;
  }

  async uploadUrl(dto: ApplicationBulkUpload) {
    const { s3Key, uploadUrl } = dto;

    const match = BULK_UPLOAD_KEY_PATTERN.exec(s3Key);
    if (!match) {
      throw new BadRequestException(
        's3Key must match format: bulk-application-updates-{listingId}-{userId}-{time-generated}.csv',
      );
    }

    const [, listingId, userId] = match;

    const listingData = await this.prisma.listings.findUnique({
      select: {
        jurisdictionId: true,
        jurisdictions: {
          select: {
            featureFlags: true,
          },
        },
      },
      where: {
        id: listingId,
      },
    });

    if (!listingData) {
      throw new NotFoundException(
        `Listing with id: ${listingId} can not be found`,
      );
    }

    const requestingUser = await this.prisma.userAccounts.findFirst({
      where: {
        id: userId,
      },
    });

    await this.permissionService.canOrThrow(
      mapTo(User, requestingUser),
      'listing',
      permissionActions.update,
      {
        id: listingId,
        jurisdictionId: listingData.jurisdictionId,
      },
    );

    if (
      !doJurisdictionHaveFeatureFlagSet(
        mapTo(Jurisdiction, listingData.jurisdictions),
        FeatureFlagEnum.enableApplicationStatus,
      )
    ) {
      throw new ForbiddenException(
        `Jurisdiction with id: ${listingData.jurisdictionId} does not have the enableApplicationStatus flag enabled`,
      );
    }

    return true;
  }

  async authorizeExport(user, listingId): Promise<void> {
    /**
     * Checking authorization for each application is very expensive.
     * By making listingId required, we can check if the user has update permissions for the listing, since right now if a user has that
     * they also can run the export for that listing
     */
    if (user?.userRoles?.isLimitedJurisdictionalAdmin)
      throw new ForbiddenException();

    const jurisdictionId =
      await this.listingService.getJurisdictionIdByListingId(listingId);

    await this.permissionService.canOrThrow(
      user,
      'listing',
      permissionActions.update,
      {
        id: listingId,
        jurisdictionId,
      },
    );
  }
}
