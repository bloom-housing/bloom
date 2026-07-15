import {
  ForbiddenException,
  Injectable,
  StreamableFile,
  NotFoundException,
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
import {
  convertApplicationDeclineReasonToReadable,
  convertReadableToApplicationDeclineReason,
} from '../utilities/application-export-helpers';

const NUMBER_TO_PAGINATE_BY = 500;

export const bulkUploadHeaderNames = {
  applicationId: 'Application Id',
  applicantFirstName: 'Applicant First Name',
  applicantLastName: 'Applicant Last Name',
  applicationSubmissionDate: 'Application Submission Date',
  lotteryPositionNumber: 'Lottery Position Number',
  applicationStatus: 'Application Status',
  applicationDeclineReason: 'Application Decline Reason',
  applicationDeclineReasonAdditionalDetails:
    'Application Decline Reason Additional Details',
  waitlistPositionAccessibleUnit: 'Waitlist Position (Accessible Unit)',
  waitlistPositionConventionalUnit: 'Waitlist Position (Conventional Unit)',
};

const APPLICATION_STATUS_MAP: Record<ApplicationStatusEnum, string> = {
  [ApplicationStatusEnum.declined]: 'Declined',
  [ApplicationStatusEnum.receivedUnit]: 'Received a Unit',
  [ApplicationStatusEnum.submitted]: 'Submitted',
  [ApplicationStatusEnum.waitlist]: 'Wait list',
  [ApplicationStatusEnum.waitlistDeclined]: 'Wait list - Declined',
};
@Injectable()
export class ApplicationBulkUploadService {
  private dateFormat = 'MM-DD-YYYY hh:mm:ssA z';

  constructor(
    private prisma: PrismaService,
    private listingService: ListingService,
    private permissionService: PermissionService,
  ) {}

  private convertApplicationStatusToReadable(
    statusEnum: ApplicationStatusEnum,
  ): string {
    return APPLICATION_STATUS_MAP[statusEnum] ?? statusEnum;
  }

  private convertReadableToApplicationStatus = (
    readable: string,
  ): ApplicationStatusEnum | undefined =>
    (Object.keys(APPLICATION_STATUS_MAP) as ApplicationStatusEnum[]).find(
      (key) => APPLICATION_STATUS_MAP[key] === readable,
    );

  private getBulkUploadHeaders(timeZone?: string): CsvHeader[] {
    const headers: CsvHeader[] = [
      {
        path: 'id',
        label: bulkUploadHeaderNames.applicationId,
      },
      {
        path: 'applicant.firstName',
        label: bulkUploadHeaderNames.applicantFirstName,
      },
      {
        path: 'applicant.lastName',
        label: bulkUploadHeaderNames.applicantLastName,
      },
      {
        path: 'submissionDate',
        label: bulkUploadHeaderNames.applicationSubmissionDate,
        format: (val: string): string =>
          formatLocalDate(
            val,
            this.dateFormat,
            timeZone ?? process.env.TIME_ZONE,
          ),
      },
      {
        path: 'manualLotteryPositionNumber',
        label: bulkUploadHeaderNames.lotteryPositionNumber,
      },
      {
        path: 'status',
        label: bulkUploadHeaderNames.applicationStatus,
        format: (val) => this.convertApplicationStatusToReadable(val),
      },
      {
        path: 'applicationDeclineReason',
        label: bulkUploadHeaderNames.applicationDeclineReason,
        format: (val) => convertApplicationDeclineReasonToReadable(val),
      },
      {
        path: 'applicationDeclineReasonAdditionalDetails',
        label: bulkUploadHeaderNames.applicationDeclineReasonAdditionalDetails,
      },
      {
        path: 'accessibleUnitWaitlistNumber',
        label: bulkUploadHeaderNames.waitlistPositionAccessibleUnit,
      },
      {
        path: 'conventionalUnitWaitlistNumber',
        label: bulkUploadHeaderNames.waitlistPositionConventionalUnit,
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
