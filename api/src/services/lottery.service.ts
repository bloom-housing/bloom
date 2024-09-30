import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import {
  ApplicationLotteryTotal,
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  Prisma,
  ReviewOrderTypeEnum,
  UserRoleEnum,
} from '@prisma/client';
import dayjs from 'dayjs';
import { Request as ExpressRequest, Response } from 'express';
import { ApplicationCsvQueryParams } from '../dtos/applications/application-csv-query-params.dto';
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
import { mapTo } from '../utilities/mapTo';
import { LotteryActivityLogItem } from '../dtos/lottery/lottery-activity-log-item.dto';
import { ListingLotteryStatus } from '../../src/dtos/listings/listing-lottery-status.dto';
import { ListingViews } from '../../src/enums/listings/view-enum';
import { startCronJob } from '../utilities/cron-job-starter';
import { EmailService } from './email.service';
import { PublicLotteryResult } from '../../src/dtos/lottery/lottery-public-result.dto';
import { PublicLotteryTotal } from '../../src/dtos/lottery/lottery-public-total.dto';

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
      this.autoPublishResults.bind(this),
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
        lotteryStatus: true,
      },
      where: {
        id: listingId,
      },
    });

    if (listing?.lotteryStatus) {
      // If a lottery has already been run we should delete all of the existing lottery values so that we start from fresh.
      // This is needed for two scenarios:
      //     1. The lottery generation fails halfway through and the data is corrupted (some values from first run and some from re-reun) - this is very unlikely
      //     2. During the regeneration there are now less applications but they are still in the applicationLotteryPositions table
      await this.prisma.applicationLotteryPositions.deleteMany({
        where: { listingId: listingId },
      });
      await this.prisma.applicationLotteryTotal.deleteMany({
        where: { listingId: listingId },
      });
    }

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

    await this.prisma.applicationLotteryTotal.create({
      data: {
        listingId,
        total: filteredApplications.length,
        multiselectQuestionId: null,
      },
    });

    // order by ordinal
    filteredApplications = filteredApplications.sort(
      (a, b) =>
        a.applicationLotteryPositions[0].ordinal -
        b.applicationLotteryPositions[0].ordinal,
    );

    // loop over each preference on the listing and store the relative position of the applications
    for (const preferenceOnListing of preferencesOnListing) {
      const { id, text, optOutText } = preferenceOnListing;

      const applicationsWithThisPreference: Application[] = [];
      const ordinalArrayWithThisPreference: number[] = [];

      // filter down to only the applications that have this particular preference
      let preferenceOrdinal = 1;
      for (const filteredApplication of filteredApplications) {
        const foundPreference = filteredApplication.preferences.find(
          (preference) => preference.key === text && preference.claimed,
        );
        if (
          foundPreference?.claimed &&
          // if at least one option is checked it should not be the same as the opt out text
          (!foundPreference.options?.length ||
            foundPreference.options.some(
              (preference) =>
                preference.checked === true && preference.key !== optOutText,
            ))
        ) {
          applicationsWithThisPreference.push(filteredApplication);
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
        await this.prisma.applicationLotteryTotal.create({
          data: {
            listingId,
            total: applicationsWithThisPreference.length,
            multiselectQuestionId: id,
          },
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

    if (!user.userRoles?.isAdmin) {
      const applicationUserId = await this.prisma.applications.findFirst({
        select: {
          userId: true,
        },
        where: {
          id: applicationId,
        },
      });

      if (!applicationUserId) {
        throw new BadRequestException(
          `User requesting lottery results did not submit an application to this listing`,
        );
      }

      await this.permissionService.canOrThrow(
        user,
        'application',
        permissionActions.read,
        {
          userId: applicationUserId.userId,
        },
      );
    }

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

  /*
   * @param id - listing id
   * @returns an array of totals
   */
  public async lotteryTotals(
    listingId: string,
    user: User,
  ): Promise<PublicLotteryTotal[]> {
    if (!user) {
      throw new ForbiddenException();
    }

    if (!user.userRoles?.isAdmin) {
      const application = await this.prisma.applications.findFirst({
        where: {
          listingId,
          userId: user.id,
        },
      });
      if (!application) {
        throw new BadRequestException(
          `User requesting lottery totals did not submit an application to this listing`,
        );
      }
    }

    const results = await this.prisma.applicationLotteryTotal.findMany({
      select: {
        total: true,
        multiselectQuestionId: true,
      },
      where: {
        listingId,
      },
    });

    return results;
  }
}
