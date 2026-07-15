import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import { Applicant, ApplicationStatusEnum } from '@prisma/client';
import { parse } from 'csv-parse';
import fs, { createReadStream } from 'fs';
import { Readable } from 'stream';
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
  APPLICATION_DECLINE_REASON_MAP,
  convertReadableToApplicationDeclineReason,
} from '../utilities/application-export-helpers';
import { ApplicationBulkValidate } from '../dtos/applications/application-bulk-validate.dto';
import { S3Service } from './s3.service';
import { SuccessDTO } from '../dtos/shared/success.dto';

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

type CsvRow = Record<string, string>;

type ApplicationContextFields = Pick<Application, 'submissionDate' | 'id'> & {
  applicant: Pick<Applicant, 'firstName' | 'lastName'>;
};

const EXPECTED_HEADERS = Object.values(bulkUploadHeaderNames);

const WAITLIST_STATUSES = [
  APPLICATION_STATUS_MAP[ApplicationStatusEnum.waitlist],
  APPLICATION_STATUS_MAP[ApplicationStatusEnum.waitlistDeclined],
];

const NUMERIC_COLUMNS = [
  bulkUploadHeaderNames.lotteryPositionNumber,
  bulkUploadHeaderNames.waitlistPositionAccessibleUnit,
  bulkUploadHeaderNames.waitlistPositionConventionalUnit,
];

const DECLINE_REASONS_REQUIRING_DETAILS = [
  APPLICATION_DECLINE_REASON_MAP.attemptedToContactNoResponse,
  APPLICATION_DECLINE_REASON_MAP.applicantDeclinedUnit,
  APPLICATION_DECLINE_REASON_MAP.other,
];

@Injectable()
export class ApplicationBulkUploadService {
  private dateFormat = 'MM-DD-YYYY hh:mm:ssA z';

  constructor(
    private prisma: PrismaService,
    private listingService: ListingService,
    private permissionService: PermissionService,
    private s3Service: S3Service,
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

  private validateFileFormat(s3Key: string): void {
    if (!s3Key.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException('Upload Failed: file must be a CSV format');
    }
  }

  private validateHeaders(actualHeaders: string[]): void {
    const expected = new Set(EXPECTED_HEADERS);
    const actual = new Set(actualHeaders);
    const sameSize = expected.size === actual.size;
    const allPresent = EXPECTED_HEADERS.every((h) => actual.has(h));
    if (!sameSize || !allPresent) {
      throw new BadRequestException(
        'Upload Failed: CSV has additional or missing columns',
      );
    }
  }

  private validateHasDataRows(rows: CsvRow[]): void {
    if (rows.length === 0) {
      throw new BadRequestException(
        'Upload Failed: CSV contains no application records',
      );
    }
  }

  private validateNoDuplicateIds(rows: CsvRow[]): void {
    const seen = new Set<string>();
    for (let i = 0; i < rows.length; i++) {
      const id = rows[i][bulkUploadHeaderNames.applicationId];
      if (seen.has(id)) {
        throw new BadRequestException(
          `Upload Failed: One or more rows beginning on row ${
            i + 2
          } contain duplicate application IDs`,
        );
      }
      seen.add(id);
    }
  }

  private async validateApplicationIds(
    rows: CsvRow[],
    listingId: string,
  ): Promise<ApplicationContextFields[]> {
    const ids = rows.map((r) => r[bulkUploadHeaderNames.applicationId]);

    const dbApps = await this.prisma.applications.findMany({
      where: { id: { in: ids }, listingId },
      select: {
        id: true,
        applicant: { select: { firstName: true, lastName: true } },
        submissionDate: true,
      },
    });

    const foundIds = new Set(dbApps.map((a) => a.id));

    ids.forEach((originalId, index) => {
      if (!foundIds.has(originalId)) {
        throw new BadRequestException(
          `Upload Failed: One or more rows beginning on row ${
            index + 2
          } have incorrect application identification numbers`,
        );
      }
    });

    return dbApps;
  }

  private validateContextFields(
    rows: CsvRow[],
    dbApps: ApplicationContextFields[],
  ): void {
    const dbMap = new Map(dbApps.map((a) => [a.id, a]));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const dbApp = dbMap.get(row[bulkUploadHeaderNames.applicationId]);
      if (!dbApp) continue;

      const expectedDate = dbApp.submissionDate
        ? formatLocalDate(
            dbApp.submissionDate.toISOString(),
            this.dateFormat,
            process.env.TIME_ZONE,
          )
        : '';

      const firstNameMatch =
        row[bulkUploadHeaderNames.applicantFirstName] ===
        (dbApp.applicant?.firstName ?? '');
      const lastNameMatch =
        row[bulkUploadHeaderNames.applicantLastName] ===
        (dbApp.applicant?.lastName ?? '');
      const dateMatch =
        row[bulkUploadHeaderNames.applicationSubmissionDate] === expectedDate;

      if (!firstNameMatch || !lastNameMatch || !dateMatch) {
        throw new BadRequestException(
          `Upload Failed: One or more rows beginning on row ${
            i + 2
          } have incorrect application identification numbers`,
        );
      }
    }
  }

  async validateCSV(dto: ApplicationBulkValidate): Promise<SuccessDTO> {
    this.validateFileFormat(dto.s3Key);

    let csvStream: ReadableStream;
    try {
      csvStream = await this.s3Service.downloadFromPrivate(dto.s3Key);
    } catch {
      throw new NotFoundException(
        'The CSV file could not be retrieved from the S3 bucket',
      );
    }

    const nodeStream = Readable.fromWeb(csvStream as any);
    const records: string[][] = await new Promise((resolve, reject) => {
      const results: string[][] = [];
      nodeStream
        .pipe(parse({ skip_empty_lines: true }))
        .on('data', (row: string[]) => results.push(row))
        .on('error', reject)
        .on('end', () => resolve(results));
    });

    const [headerRow, ...dataRows] = records;
    const headers: string[] = headerRow ?? [];
    const rows: CsvRow[] = dataRows.map((cells) =>
      Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ''])),
    );

    this.validateHeaders(headers);
    this.validateHasDataRows(rows);

    this.validateNoDuplicateIds(rows);
    const dbApps = await this.validateApplicationIds(rows, dto.listingId);
    this.validateContextFields(rows, dbApps);

    // TODO: Implement Validation pipeline

    return { success: true };
  }
}
