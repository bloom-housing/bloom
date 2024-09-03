import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  StreamableFile,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import {
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  Prisma,
  ReviewOrderTypeEnum,
  UserRoleEnum,
} from '@prisma/client';
import archiver from 'archiver';
import Excel, { Column, Row } from 'exceljs';
import dayjs from 'dayjs';
import { Request as ExpressRequest, Response } from 'express';
import fs, { createReadStream } from 'fs';
import { join } from 'path';
import { view } from './application.service';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
import { ApplicationMultiselectQuestion } from '../dtos/applications/application-multiselect-question.dto';
import { Application } from '../dtos/applications/application.dto';
import Listing from '../dtos/listings/listing.dto';
import MultiselectQuestion from '../dtos/multiselect-questions/multiselect-question.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { OrderByEnum } from '../enums/shared/order-by-enum';
import { ListingService } from './listing.service';
import { MultiselectQuestionService } from './multiselect-question.service';
import { PermissionService } from './permission.service';
import { PrismaService } from './prisma.service';
import { CsvHeader } from '../types/CsvExportInterface';
import { getExportHeaders } from '../utilities/application-export-helpers';
import { mapTo } from '../utilities/mapTo';
import { IdDTO } from '../dtos/shared/id.dto';
import { LotteryActivityLogItem } from '../dtos/lottery/lottery-activity-log-item.dto';
import { ListingLotteryStatus } from '../../src/dtos/listings/listing-lottery-status.dto';
import { ListingViews } from '../../src/enums/listings/view-enum';
import { startCronJob } from '../utilities/cron-job-starter';
import { EmailService } from './email.service';
import { PublicLotteryResult } from '../../src/dtos/lottery/lottery-public-result.dto';

view.csv = {
  ...view.details,
  applicationFlaggedSet: {
    select: {
      id: true,
    },
  },
  listings: false,
};
const NUMBER_TO_PAGINATE_BY = 500;
const LOTTERY_CRON_JOB_NAME = 'LOTTERY_CRON_JOB';
const LOTTERY_PUBLISH_CRON_JOB_NAME = 'LOTTERY_PUBLISH_CRON_JOB';

export type LotteryActivityLogStatus =
  | LotteryStatusEnum
  | 'rerun'
  | 'retracted'
  | 'closed';

@Injectable()
export class LotteryService {
  readonly dateFormat: string = 'MM-DD-YYYY hh:mm:ssA z';
  constructor(
    private prisma: PrismaService,
    private multiselectQuestionService: MultiselectQuestionService,
    private listingService: ListingService,
    private emailService: EmailService,
    private configService: ConfigService,
    @Inject(Logger)
    private logger = new Logger(LotteryService.name),
    private schedulerRegistry: SchedulerRegistry,
    private permissionService: PermissionService,
  ) {}

  onModuleInit() {
    startCronJob(
      this.prisma,
      LOTTERY_CRON_JOB_NAME,
      process.env.LOTTERY_PROCESSING_CRON_STRING,
      this.expireLotteries.bind(this),
      this.logger,
      this.schedulerRegistry,
    );
    startCronJob(
      this.prisma,
      LOTTERY_PUBLISH_CRON_JOB_NAME,
      process.env.LOTTERY_PUBLISH_PROCESSING_CRON_STRING,
      this.expireLotteries.bind(this),
      this.logger,
      this.schedulerRegistry,
    );
  }

  /**
   *
   * @param queryParams
   * @param req
   * @returns generates the lottery results for a listing
   */
  async lotteryGenerate<QueryParams extends ApplicationCsvQueryParams>(
    req: ExpressRequest,
    res: Response,
    queryParams: QueryParams,
  ): Promise<SuccessDTO> {
    const user = mapTo(User, req['user']);
    if (!user?.userRoles?.isAdmin) {
      throw new ForbiddenException();
    }
    const listingId = queryParams.id;
    const listing = await this.prisma.listings.findUnique({
      select: {
        id: true,
        lotteryLastRunAt: true,
        lotteryStatus: true,
      },
      where: {
        id: listingId,
      },
    });

    try {
      const applications = await this.prisma.applications.findMany({
        select: {
          id: true,
          preferences: true,
          householdMember: {
            select: {
              id: true,
            },
          },
          applicationLotteryPositions: {
            select: {
              ordinal: true,
              multiselectQuestionId: true,
            },
            where: {
              multiselectQuestionId: null,
            },
            orderBy: {
              ordinal: OrderByEnum.DESC,
            },
          },
        },
        where: {
          listingId,
          deletedAt: null,
          markedAsDuplicate: false,
        },
      });

      // get all multiselect questions for a listing to build csv headers
      const multiSelectQuestions =
        await this.multiselectQuestionService.findByListingId(listingId);

      await this.lotteryRandomizer(
        listingId,
        mapTo(Application, applications),
        multiSelectQuestions.filter(
          (multiselectQuestion) =>
            multiselectQuestion.applicationSection ===
            MultiselectQuestionsApplicationSectionEnum.preferences,
        ),
      );

      await this.lotteryStatus(
        {
          id: listingId,
          lotteryStatus: LotteryStatusEnum.ran,
        },
        user,
      );
    } catch (e) {
      console.error(e);
      await this.lotteryStatus(
        {
          id: listingId,
          lotteryStatus: LotteryStatusEnum.errored,
        },
        user,
      );
      return { success: false };
    }
    return { success: true };
  }

  /**
   * @param listingId listing id we are going to randomize
   * @param applications set of applications to generate lottery ranks for
   * @param preferencesOnListing the set of preferences on the listing
   * @description creates a random rank for the applications on this lottery as well as the preference specific ranks
   */
  async lotteryRandomizer(
    listingId: string,
    applications: Application[],
    preferencesOnListing: MultiselectQuestion[],
  ): Promise<void> {
    // remove duplicates
    let filteredApplications = applications;
    // prep our supporting array
    const ordinalArray = this.lotteryRandomizerHelper(filteredApplications);

    // attach ordinal info to filteredApplications
    ordinalArray.forEach((value, i) => {
      filteredApplications[i].applicationLotteryPositions = [
        {
          listingId,
          applicationId: filteredApplications[i].id,
          ordinal: value,
          multiselectQuestionId: null,
        },
      ];
    });

    // store raw positional score in db
    await this.prisma.applicationLotteryPositions.createMany({
      data: filteredApplications.map((app, index) => ({
        listingId,
        applicationId: app.id,
        ordinal: ordinalArray[index],
        multiselectQuestionId: null,
      })),
    });

    // order by ordinal
    filteredApplications = filteredApplications.sort(
      (a, b) =>
        a.applicationLotteryPositions[0].ordinal -
        b.applicationLotteryPositions[0].ordinal,
    );

    // loop over each preference on the listing and store the relative position of the applications
    for (let i = 0; i < preferencesOnListing.length; i++) {
      const { id, text } = preferencesOnListing[i];

      const applicationsWithThisPreference: Application[] = [];
      const ordinalArrayWithThisPreference: number[] = [];

      // filter down to only the applications that have this particular preference
      let preferenceOrdinal = 1;
      for (let j = 0; j < filteredApplications.length; j++) {
        if (
          filteredApplications[j].preferences.some(
            (preference) => preference.key === text && preference.claimed,
          )
        ) {
          applicationsWithThisPreference.push(filteredApplications[j]);
          ordinalArrayWithThisPreference.push(preferenceOrdinal);
          preferenceOrdinal++;
        }
      }

      if (applicationsWithThisPreference.length) {
        // store these values in the db
        await this.prisma.applicationLotteryPositions.createMany({
          data: applicationsWithThisPreference.map((app, index) => ({
            listingId,
            applicationId: app.id,
            ordinal: ordinalArrayWithThisPreference[index],
            multiselectQuestionId: id,
          })),
        });
      }
    }
  }

  /**
   * @param filterApplicationsArray the filtered applications we generate the random ordering for
   * @returns ranked array
   */
  lotteryRandomizerHelper(filterApplicationsArray: Application[]): number[] {
    // prep our supporting array
    const ordinalArray: number[] = [];

    const indexArray: number[] = [];
    filterApplicationsArray.forEach((_, index) => {
      indexArray.push(index + 1);
    });

    // fill array with random values
    filterApplicationsArray.forEach(() => {
      // get random value
      const randomPosition = Math.floor(Math.random() * indexArray.length);

      // remove selected value from indexArray
      const randomValue = indexArray.splice(randomPosition, 1);

      // push unique random value into array
      ordinalArray.push(randomValue[0]);
    });

    return ordinalArray;
  }

  /**
   *
   * @param queryParams
   * @param req
   * @returns generates the lottery export file via helper function and returns the streamable file
   */
  async lotteryExport<QueryParams extends ApplicationCsvQueryParams>(
    req: ExpressRequest,
    res: Response,
    queryParams: QueryParams,
  ): Promise<StreamableFile> {
    const user = mapTo(User, req['user']);
    await this.authorizeLotteryExport(user, queryParams.id);

    const workbook = new Excel.Workbook();

    const filename = join(
      process.cwd(),
      `src/temp/lottery-listing-${queryParams.id}-applications-${
        user.id
      }-${new Date().getTime()}.xlsx`,
    );

    const zipFilePath = join(
      process.cwd(),
      `src/temp/lottery-listing-${queryParams.id}-applications-${
        user.id
      }-${new Date().getTime()}.zip`,
    );

    await this.createLotterySheets(workbook, {
      ...queryParams,
    });

    await workbook.xlsx.writeFile(filename);

    const readStream = createReadStream(filename);

    return new Promise((resolve) => {
      // Create a writable stream to the zip file
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });
      output.on('close', () => {
        const zipFile = createReadStream(zipFilePath);
        resolve(new StreamableFile(zipFile));
      });

      archive.pipe(output);
      archive.append(readStream, {
        name: `lottery-${queryParams.id}-${new Date().getTime()}.xlsx`,
      });
      archive.finalize();
    });
  }

  async updateLotteryStatus(
    listingId: string,
    status: LotteryStatusEnum,
  ): Promise<SuccessDTO> {
    let updateData: any;
    if (status === LotteryStatusEnum.ran) {
      updateData = { lotteryStatus: status, lotteryLastRunAt: new Date() };
    } else if (status === LotteryStatusEnum.publishedToPublic) {
      updateData = {
        lotteryStatus: status,
        lotteryLastPublishedAt: new Date(),
      };
    } else {
      updateData = { lotteryStatus: status };
    }

    const res = await this.prisma.listings.update({
      data: updateData,
      where: {
        id: listingId,
      },
    });

    if (!res) {
      throw new HttpException('Listing lottery status failed to save.', 500);
    }

    return {
      success: true,
    };
  }

  async publishLottery(listing: Listing): Promise<SuccessDTO> {
    const partnerUserEmailInfo = await this.listingService.getUserEmailInfo(
      [
        UserRoleEnum.admin,
        UserRoleEnum.jurisdictionAdmin,
        UserRoleEnum.partner,
      ],
      listing.id,
      listing.jurisdictions?.id,
    );

    const publicUserEmailInfo =
      await this.listingService.getPublicUserEmailInfo(listing.id);

    await this.updateLotteryStatus(
      listing.id,
      LotteryStatusEnum.publishedToPublic,
    );

    await this.emailService.lotteryPublishedAdmin(
      {
        id: listing.id,
        name: listing.name,
        juris: listing.jurisdictions?.id,
      },
      partnerUserEmailInfo.emails,
      this.configService.get('PARTNERS_PORTAL_URL'),
    );

    await this.emailService.lotteryPublishedApplicant(
      {
        id: listing.id,
        name: listing.name,
        juris: listing.jurisdictions?.id,
      },
      publicUserEmailInfo,
    );

    return {
      success: true,
    };
  }

  async lotteryStatus(
    dto: ListingLotteryStatus,
    requestingUser: User,
  ): Promise<SuccessDTO> {
    const storedListing = await this.listingService.findOrThrow(
      dto.id,
      ListingViews.details,
    );

    await this.permissionService.canOrThrow(
      requestingUser,
      'listing',
      permissionActions.update,
      {
        id: storedListing.id,
        jurisdictionId: storedListing.jurisdictionId,
      },
    );

    if (storedListing.status !== ListingsStatusEnum.closed) {
      console.log('throwing bc not closed');
      throw new BadRequestException(
        'Lottery status cannot be changed until listing is closed.',
      );
    }

    const isAdmin = requestingUser.userRoles?.isAdmin;
    const isJurisdictionalAdmin =
      requestingUser.userRoles?.isJurisdictionalAdmin;
    const isPartner = requestingUser.userRoles?.isPartner;
    const currentStatus = storedListing.lotteryStatus;

    switch (dto?.lotteryStatus) {
      case LotteryStatusEnum.ran: {
        if (!isAdmin) {
          throw new ForbiddenException();
        }
        await this.updateLotteryStatus(dto.id, dto?.lotteryStatus);
        break;
      }
      case LotteryStatusEnum.errored: {
        // TODO
        break;
      }
      case LotteryStatusEnum.releasedToPartners: {
        if (!isAdmin) {
          throw new ForbiddenException();
        }
        if (currentStatus !== LotteryStatusEnum.ran) {
          throw new BadRequestException(
            'Lottery cannot be released to partners without being in run state.',
          );
        }
        if (
          storedListing.lotteryLastRunAt < storedListing.lastApplicationUpdateAt
        ) {
          throw new BadRequestException(
            'Lottery cannot be released due to paper applications that are not included in the last run.',
          );
        }
        await this.updateLotteryStatus(dto.id, dto?.lotteryStatus);

        const partnerUserEmailInfo = await this.listingService.getUserEmailInfo(
          [
            UserRoleEnum.admin,
            UserRoleEnum.jurisdictionAdmin,
            UserRoleEnum.partner,
          ],
          storedListing.id,
          storedListing.jurisdictionId,
        );

        await this.emailService.lotteryReleased(
          {
            id: storedListing.id,
            name: storedListing.name,
            juris: storedListing.jurisdictionId,
          },
          partnerUserEmailInfo.emails,
          this.configService.get('PARTNERS_PORTAL_URL'),
        );
        break;
      }
      case LotteryStatusEnum.publishedToPublic: {
        if (!isPartner && !isAdmin && !isJurisdictionalAdmin) {
          throw new ForbiddenException();
        }
        if (currentStatus !== LotteryStatusEnum.releasedToPartners) {
          throw new BadRequestException(
            'Lottery cannot be published to public without being in released to partners state.',
          );
        }
        const storedListingMapped = mapTo(Listing, storedListing);
        await this.publishLottery(storedListingMapped);
        break;
      }
      default: {
        throw new BadRequestException(
          `${dto?.lotteryStatus} is not an allowed lottery status.`,
        );
      }
    }

    return {
      success: true,
    };
  }

  /**
   *
   * @param filename
   * @param queryParams
   * @returns generates the lottery sheets
   */
  async createLotterySheets<QueryParams extends ApplicationCsvQueryParams>(
    workbook: Excel.Workbook,
    queryParams: QueryParams,
  ): Promise<void> {
    let applications = await this.prisma.applications.findMany({
      select: {
        id: true,
        preferences: true,
        householdMember: {
          select: {
            id: true,
          },
        },
        applicationLotteryPositions: {
          select: {
            ordinal: true,
            multiselectQuestionId: true,
          },
          where: {
            multiselectQuestionId: null,
          },
          orderBy: {
            ordinal: OrderByEnum.DESC,
          },
        },
      },
      where: {
        listingId: queryParams.id,
        deletedAt: null,
        markedAsDuplicate: false,
      },
    });

    // get all multiselect questions for a listing to build csv headers
    const multiSelectQuestions =
      await this.multiselectQuestionService.findByListingId(queryParams.id);

    // get maxHouseholdMembers associated to the selected applications
    let maxHouseholdMembers = 0;
    applications.forEach((app) => {
      if (app.householdMember?.length > maxHouseholdMembers) {
        maxHouseholdMembers = app.householdMember.length;
      }
    });

    const columns = getExportHeaders(
      maxHouseholdMembers,
      multiSelectQuestions,
      queryParams.timeZone,
      queryParams.includeDemographics,
      true,
    );

    applications = applications.filter(
      (elem) => !!elem.applicationLotteryPositions?.length,
    );

    applications = applications.sort(
      (a, b) =>
        a.applicationLotteryPositions[0].ordinal -
        b.applicationLotteryPositions[0].ordinal,
    );

    const mappedApps = mapTo(Application, applications);
    await this.generateSpreadsheetData(
      workbook,
      mappedApps,
      columns,
      queryParams,
      true,
    );

    const preferences = multiSelectQuestions.filter(
      (question) =>
        question.applicationSection ===
        MultiselectQuestionsApplicationSectionEnum.preferences,
    );
    for (const preference of preferences) {
      await this.generateSpreadsheetData(
        workbook,
        mappedApps,
        columns,
        queryParams,
        true,
        {
          id: preference.id,
          name: preference.text,
        },
      );
    }
  }

  /**
   * @param user the user attempting to get the lottery export
   * @param listingId the listing we are trying the export is for
   */
  async authorizeLotteryExport(user, listingId): Promise<void> {
    /**
     * Checking authorization for each application is very expensive.
     * By making listingId required, we can check if the user has update permissions for the listing, since right now if a user has that
     * they also can run the export for that listing
     */
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

  /**
   *
   * @param workbook the spreadsheet we'll be adding data too
   * @param applications the full list of partial applications
   * @param csvHeaders the headers and renderers of the export
   * @param queryParams the incoming param args
   * @param forLottery whether we are getting the lottery results or not
   * @param preference if present, then builds the preference specific spreadsheet page
   * @returns void but writes the output to a file
   */
  async generateSpreadsheetData(
    workbook: Excel.Workbook,
    applications: Application[],
    csvHeaders: CsvHeader[],
    queryParams: ApplicationCsvQueryParams,
    forLottery = false,
    preference?: IdDTO,
  ): Promise<void> {
    // create a spreadsheet. If the preference is passed in use that as a title otherwise 'raw'
    const spreadsheet = workbook.addWorksheet(
      preference ? preference.name : 'Raw Lottery Rank',
    );
    spreadsheet.columns = this.buildExportColumns(csvHeaders, preference);

    const filteredApplications = preference
      ? applications.filter((app) =>
          app.preferences.some(
            (pref) =>
              (pref.multiselectQuestionId === preference.id ||
                pref.key === preference.name) &&
              pref.claimed,
          ),
        )
      : applications;

    // build row data
    const promiseArray: Promise<Partial<Row>[]>[] = [];
    for (
      let i = 0;
      i < filteredApplications.length;
      i += NUMBER_TO_PAGINATE_BY
    ) {
      const slicedApplications = filteredApplications.slice(
        i,
        i + NUMBER_TO_PAGINATE_BY,
      );

      promiseArray.push(
        new Promise(async (resolve) => {
          // grab applications NUMBER_TO_PAGINATE_BY at a time
          let paginatedApplications = await this.prisma.applications.findMany({
            include: {
              ...view.csv,
              demographics: queryParams.includeDemographics
                ? {
                    select: {
                      id: true,
                      createdAt: true,
                      updatedAt: true,
                      ethnicity: true,
                      gender: true,
                      sexualOrientation: true,
                      howDidYouHear: true,
                      race: true,
                    },
                  }
                : false,
              applicationLotteryPositions: forLottery
                ? {
                    select: {
                      ordinal: true,
                    },
                    where: {
                      multiselectQuestionId: preference ? preference.id : null,
                    },
                  }
                : false,
            },
            where: {
              listingId: queryParams.id,
              deletedAt: null,
              markedAsDuplicate: forLottery ? false : undefined,
              id: {
                in: slicedApplications.map((app) => app.id),
              },
            },
          });
          if (forLottery) {
            paginatedApplications = paginatedApplications.sort(
              (a, b) =>
                a.applicationLotteryPositions[0].ordinal -
                b.applicationLotteryPositions[0].ordinal,
            );
          }
          const rows: Partial<Row>[] = [];
          paginatedApplications.forEach((app) => {
            const row: Partial<Row> = {};
            let preferences: ApplicationMultiselectQuestion[];
            let programs: ApplicationMultiselectQuestion[];

            if (preference) {
              row['Raw Lottery Rank'] = slicedApplications.find(
                (slicedApp) => slicedApp.id === app.id,
              ).applicationLotteryPositions[0].ordinal;
            }
            csvHeaders.forEach((header) => {
              let multiselectQuestionValue = false;
              let parsePreference = false;
              let parseProgram = false;
              let value = header.path.split('.').reduce((acc, curr) => {
                // return preference/program as value for the format function to accept
                if (multiselectQuestionValue) {
                  return acc;
                }

                if (parsePreference) {
                  // curr should equal the preference id we're pulling from
                  if (!preferences) {
                    preferences =
                      (app.preferences as unknown as ApplicationMultiselectQuestion[]) ||
                      [];
                  }
                  parsePreference = false;
                  // there aren't typically many preferences, but if there, then a object map should be created and used
                  const preference = preferences.find(
                    (preference) => preference.key === curr,
                  );
                  multiselectQuestionValue = true;
                  return preference;
                } else if (parseProgram) {
                  // curr should equal the preference id we're pulling from
                  if (!programs) {
                    programs =
                      (app.programs as unknown as ApplicationMultiselectQuestion[]) ||
                      [];
                  }
                  parsePreference = false;
                  // there aren't typically many programs, but if there, then a object map should be created and used
                  const program = programs.find(
                    (preference) => preference.key === curr,
                  );
                  multiselectQuestionValue = true;
                  return program;
                }

                // sets parsePreference to true, for the next iteration
                if (curr === 'preferences') {
                  parsePreference = true;
                } else if (curr === 'programs') {
                  parseProgram = true;
                }

                if (acc === null || acc === undefined) {
                  return '';
                }

                // handles working with arrays, e.g. householdMember.0.firstName
                if (!isNaN(Number(curr))) {
                  const index = Number(curr);
                  return acc[index];
                }

                return acc[curr];
              }, app);
              value = value === undefined ? '' : value === null ? '' : value;
              if (header.format) {
                value = header.format(value);
              }

              row[`${header.path}`] = value ? value.toString() : '';
            });
            rows.push(row);
          });
          resolve(rows);
        }),
      );
    }
    const res = await Promise.all(promiseArray);

    // add rows to spreadsheet
    res.forEach((elem) => {
      spreadsheet.addRows(elem);
    });
  }

  buildExportColumns(
    csvHeaders: CsvHeader[],
    preference?: IdDTO,
  ): Partial<Column>[] {
    const res: Partial<Column>[] = csvHeaders.map((header) => ({
      key: header.path,
      header: header.label,
    }));

    if (preference) {
      const indx = res.findIndex(
        (header) => header.header === 'Raw Lottery Rank',
      );

      res[indx].header = `${preference.name} Rank`;

      res.splice(indx, 0, {
        key: 'Raw Lottery Rank',
        header: 'Raw Lottery Rank',
      });
    }
    return res;
  }

  getActivityLogKey = (logData: Prisma.JsonValue | null) => {
    if (!logData) return null;
    return logData[Object.keys(logData)[0]];
  };

  getLotteryStatusFromActivityLogMetadata = (
    status: LotteryActivityLogStatus,
    index: number,
    previousStatus: LotteryActivityLogStatus | null,
  ): LotteryActivityLogStatus => {
    if (!status) return;
    if (index === 0) return status;

    if (
      status === LotteryStatusEnum.ran &&
      (previousStatus === LotteryStatusEnum.releasedToPartners ||
        previousStatus === LotteryStatusEnum.publishedToPublic)
    ) {
      return 'retracted';
    }
    if (
      status === LotteryStatusEnum.ran &&
      previousStatus === LotteryStatusEnum.ran
    ) {
      return 'rerun';
    }
    return status;
  };

  /*
   * @param listingId
   * @returns a list of activity log entries and the name of the user who did the action for lotteries
   */
  public async lotteryActivityLog(
    listingId: string,
    requestingUser: User,
  ): Promise<LotteryActivityLogItem[]> {
    const activityLogs = await this.prisma.activityLog.findMany({
      select: {
        metadata: true,
        updatedAt: true,
        userAccounts: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      where: {
        AND: {
          OR: [{ module: 'listing', action: 'update' }, { module: 'lottery' }],
          AND: [{ recordId: listingId }, { recordId: { not: null } }],
        },
      },
      orderBy: {
        updatedAt: OrderByEnum.ASC,
      },
    });
    const filteredActivityLogs = activityLogs.filter((log) => {
      const logString = JSON.stringify(log.metadata);
      // only return closed listing status updates
      if (logString.includes('status')) {
        if (logString.includes(ListingsStatusEnum.closed)) {
          return true;
        } else return false;
      }
      return true;
    });

    const formattedActivityLogs: LotteryActivityLogItem[] = [];
    filteredActivityLogs.forEach((logItem, index) => {
      const lotteryStatus = this.getLotteryStatusFromActivityLogMetadata(
        this.getActivityLogKey(logItem.metadata),
        index,
        index > 0
          ? this.getActivityLogKey(filteredActivityLogs[index - 1].metadata)
          : null,
      );

      const adminOnlyStatuses: LotteryActivityLogStatus[] = ['rerun', 'ran'];

      if (
        requestingUser?.userRoles.isAdmin ||
        adminOnlyStatuses.indexOf(lotteryStatus) < 0
      ) {
        formattedActivityLogs.push({
          logDate: logItem.updatedAt,
          name:
            logItem.userAccounts?.firstName && logItem.userAccounts?.lastName
              ? `${logItem.userAccounts.firstName} ${logItem.userAccounts.lastName}`
              : undefined,
          status: lotteryStatus,
        });
      }
    });

    return formattedActivityLogs;
  }

  /**
    runs the job to auto expire lotteries that are passed their due date
    will call the the cache purge to purge all listings as long as updates had to be made
  */
  async autoPublishResults(): Promise<SuccessDTO> {
    this.logger.warn('autoPublishLotteryResults job running');
    await this.listingService.markCronJobAsStarted(
      LOTTERY_PUBLISH_CRON_JOB_NAME,
    );
    const tomorrow = dayjs(
      `${new Date().toISOString().split('T')[0]}T00:00:00.000Z`,
    )
      .add(1, 'days')
      .toDate();
    const releasedListings = await this.prisma.listings.findMany({
      select: {
        id: true,
        name: true,
        jurisdictions: true,
      },
      where: {
        status: ListingsStatusEnum.closed,
        reviewOrderType: ReviewOrderTypeEnum.lottery,
        lotteryOptIn: true,
        lotteryStatus: LotteryStatusEnum.releasedToPartners,
        listingEvents: {
          some: {
            type: ListingEventsTypeEnum.publicLottery,
            startDate: { lt: tomorrow },
          },
        },
      },
    });

    await Promise.all(
      releasedListings.map(async (listingRaw) => {
        const listing = mapTo(Listing, listingRaw);
        try {
          await this.prisma.activityLog.create({
            data: {
              module: 'lottery',
              recordId: listing.id,
              action: 'update',
              metadata: { lotteryStatus: LotteryStatusEnum.publishedToPublic },
            },
          });

          await this.publishLottery(listing);
        } catch (error) {
          console.error(error);
        }
      }),
    );

    this.logger.warn(
      `Changed the status of ${releasedListings.length} lotteries`,
    );
    return {
      success: true,
    };
  }

  /**
    runs the job to auto expire lotteries that are passed their due date
    will call the the cache purge to purge all listings as long as updates had to be made
  */
  async expireLotteries(): Promise<SuccessDTO> {
    if (process.env.LOTTERY_DAYS_TILL_EXPIRY) {
      this.logger.warn('changeExpiredLotteryStatusCron job running');
      await this.listingService.markCronJobAsStarted(LOTTERY_CRON_JOB_NAME);
      const expiration_date = dayjs(new Date())
        .subtract(Number(process.env.LOTTERY_DAYS_TILL_EXPIRY), 'days')
        .toDate();

      const listings = await this.prisma.listings.findMany({
        select: {
          id: true,
        },
        where: {
          status: ListingsStatusEnum.closed,
          reviewOrderType: ReviewOrderTypeEnum.lottery,
          closedAt: {
            lte: expiration_date,
          },
          OR: [
            {
              lotteryStatus: {
                not: LotteryStatusEnum.expired,
              },
            },
            {
              lotteryStatus: null,
            },
          ],
        },
      });
      const listingIds = listings.map((listing) => listing.id);

      const res = await this.prisma.listings.updateMany({
        data: {
          lotteryStatus: LotteryStatusEnum.expired,
        },
        where: {
          id: { in: listingIds },
        },
      });

      const activityLogData = listingIds.map((id) => {
        return {
          module: 'lottery',
          recordId: id,
          action: 'update',
          metadata: { lotteryStatus: LotteryStatusEnum.expired },
        };
      });
      await this.prisma.activityLog.createMany({
        data: activityLogData,
      });

      this.logger.warn(`Changed the status of ${res?.count} lotteries`);
    }
    return {
      success: true,
    };
  }

  /*
   * @param id - application id
   * @returns a public lottery results object
   */
  public async publicLotteryResults(
    applicationId: string,
    user: User,
  ): Promise<PublicLotteryResult[]> {
    if (!user) {
      throw new ForbiddenException();
    }

    const applicationUserId = await this.prisma.applications.findFirstOrThrow({
      select: {
        userId: true,
      },
      where: {
        id: applicationId,
      },
    });

    await this.permissionService.canOrThrow(
      user,
      'application',
      permissionActions.read,
      {
        userId: applicationUserId.userId,
      },
    );

    const results = await this.prisma.applicationLotteryPositions.findMany({
      select: {
        ordinal: true,
        multiselectQuestionId: true,
      },
      where: {
        applicationId,
      },
    });

    return results;
  }
}
