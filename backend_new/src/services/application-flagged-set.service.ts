import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import dayjs from 'dayjs';
import {
  ApplicationReviewStatusEnum,
  ApplicationStatusEnum,
  FlaggedSetStatusEnum,
  ListingsStatusEnum,
  Prisma,
  RuleEnum,
} from '@prisma/client';
import { PrismaService } from './prisma.service';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { ApplicationFlaggedSet } from '../dtos/application-flagged-sets/application-flagged-set.dto';
import { PaginatedAfsDto } from '../dtos/application-flagged-sets/paginated-afs.dto';
import { AfsQueryParams } from '../dtos/application-flagged-sets/afs-query-params.dto';
import { AfsMeta } from '../dtos/application-flagged-sets/afs-meta.dto';
import { OrderByEnum } from '../enums/shared/order-by-enum';
import { View } from '../enums/application-flagged-sets/view';
import { buildPaginationMetaInfo } from '../utilities/pagination-helpers';
import { AfsResolve } from '../dtos/application-flagged-sets/afs-resolve.dto';
import { User } from '../dtos/users/user.dto';
import { Application } from '../dtos/applications/application.dto';
import { IdDTO } from 'src/dtos/shared/id.dto';

/*
  this is the service for unit types
  it handles all the backend's business logic for reading/writing/deleting unit type data
*/

const CRON_JOB_NAME = 'AFS_CRON_JOB';
@Injectable()
export class ApplicationFlaggedSetService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @Inject(Logger)
    private logger = new Logger(ApplicationFlaggedSetService.name),
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    // Take the cron job frequency from .env and add a random seconds to it.
    // That way when there are multiple instances running they won't run at the exact same time.
    const repeatCron = process.env.AFS_PROCESSING_CRON_STRING;
    const randomSecond = Math.floor(Math.random() * 60);
    const newCron = `${randomSecond} ${repeatCron}`;
    const job = new CronJob(newCron, () => {
      void (async () => {
        const currentCronJob = await this.prisma.cronJob.findFirst({
          where: {
            name: CRON_JOB_NAME,
          },
        });
        // To prevent multiple overlapped jobs only run if one hasn't started in the last 5 minutes
        if (
          !currentCronJob ||
          currentCronJob.lastRunDate <
            dayjs(new Date()).subtract(5, 'minutes').toDate()
        ) {
          try {
            await this.process();
          } catch (e) {
            this.logger.error(`${CRON_JOB_NAME} failed to run`);
          }
        }
      })();
    });
    this.schedulerRegistry.addCronJob(CRON_JOB_NAME, job);
    job.start();
  }

  /**
    this will get a set of application flagged sets given the params passed in
  */
  async list(params: AfsQueryParams): Promise<PaginatedAfsDto> {
    const whereClause = this.buildWhere(params);

    const count = await this.prisma.applicationFlaggedSet.count({
      where: whereClause,
    });

    const rawAfs = await this.prisma.applicationFlaggedSet.findMany({
      include: {
        listings: true,
        applications: {
          include: {
            applicant: true,
          },
        },
      },
      where: whereClause,
      orderBy: {
        id: OrderByEnum.DESC,
      },
    });

    const totalFlagged = await this.prisma.applicationFlaggedSet.count({
      where: {
        listingId: params.listingId,
        status: FlaggedSetStatusEnum.pending,
      },
    });

    const afs = mapTo(ApplicationFlaggedSet, rawAfs);

    const paginationInfo = buildPaginationMetaInfo(params, count, afs.length);

    return {
      items: afs,
      meta: {
        ...paginationInfo,
        totalFlagged: totalFlagged,
      },
    };
  }

  /**
    builds where clause for list function
  */
  buildWhere(params: AfsQueryParams): Prisma.ApplicationFlaggedSetWhereInput {
    const filters: Prisma.ApplicationFlaggedSetWhereInput[] = [];

    if (params.listingId) {
      filters.push({
        listingId: params.listingId,
      });
    }

    if (params.view) {
      if (params.view === View.pending) {
        filters.push({
          status: FlaggedSetStatusEnum.pending,
        });
      } else if (params.view === View.pendingNameAndDoB) {
        filters.push({
          status: FlaggedSetStatusEnum.pending,
          rule: RuleEnum.nameAndDOB,
        });
      } else if (params.view === View.pendingEmail) {
        filters.push({
          status: FlaggedSetStatusEnum.pending,
          rule: RuleEnum.email,
        });
      } else if (params.view === View.resolved) {
        filters.push({
          status: FlaggedSetStatusEnum.resolved,
        });
      }
    }

    return {
      AND: filters,
    };
  }

  /**
    this will return 1 application flagged set or error
  */
  async findOne(afsId: string): Promise<ApplicationFlaggedSet> {
    const rawAfs = await this.prisma.applicationFlaggedSet.findUnique({
      where: {
        id: afsId,
      },
      include: {
        applications: {
          include: {
            applicant: true,
          },
        },
        listings: true,
      },
    });

    if (!rawAfs) {
      throw new NotFoundException(
        `applicationFlaggedSetId ${afsId} was requested but not found`,
      );
    }

    return mapTo(ApplicationFlaggedSet, rawAfs);
  }

  /**
    this resets the showConfirmationAlert on the application flagged set
  */
  async resetConfirmationAlert(afsId: string): Promise<SuccessDTO> {
    await this.findOrThrow(afsId);
    await this.prisma.applicationFlaggedSet.update({
      data: {
        showConfirmationAlert: false,
      },
      where: {
        id: afsId,
      },
    });
    return {
      success: true,
    };
  }

  /**
    this will return meta info for a set of application flagged sets
  */
  async meta(params: AfsQueryParams): Promise<AfsMeta> {
    const [
      totalCount,
      totalResolvedCount,
      totalPendingCount,
      totalNamePendingCount,
      totalEmailPendingCount,
    ] = await Promise.all([
      this.metaHelper(params.listingId),
      this.metaHelper(params.listingId, FlaggedSetStatusEnum.resolved),
      this.metaHelper(params.listingId, FlaggedSetStatusEnum.pending),
      this.metaHelper(
        params.listingId,
        FlaggedSetStatusEnum.pending,
        RuleEnum.nameAndDOB,
      ),
      this.metaHelper(
        params.listingId,
        FlaggedSetStatusEnum.pending,
        RuleEnum.email,
      ),
    ]);

    return {
      totalCount,
      totalResolvedCount,
      totalPendingCount,
      totalNamePendingCount,
      totalEmailPendingCount,
    };
  }

  /**
    helper that builds the meta functions queries
  */
  metaHelper(
    listingId: string,
    status?: FlaggedSetStatusEnum,
    rule?: RuleEnum,
  ): Promise<number> {
    return this.prisma.applicationFlaggedSet.count({
      where: {
        listingId,
        status,
        rule,
      },
    });
  }

  /**
    resolves an application flagged set
  */
  async resolve(dto: AfsResolve, user: User): Promise<ApplicationFlaggedSet> {
    const filter: Prisma.ApplicationFlaggedSetWhereInput[] = [
      {
        id: dto.afsId,
      },
    ];
    if (dto.applications?.length) {
      filter.push({
        applications: {
          some: {
            id: {
              in: dto.applications.map((application) => application.id),
            },
          },
        },
      });
    }
    const afs = await this.prisma.applicationFlaggedSet.findFirst({
      where: {
        AND: filter,
      },
      include: {
        listings: true,
        applications: {
          where: {
            id: {
              in: dto.applications.map((application) => application.id),
            },
          },
        },
      },
    });

    if (afs.listings.status !== ListingsStatusEnum.closed) {
      throw new BadRequestException(
        `Listing ${afs.listings.id} must be closed before resolving any duplicates`,
      );
    }

    const selectedApps = dto.applications?.length
      ? afs.applications.map((app) => app.id)
      : [];

    if (dto.status === FlaggedSetStatusEnum.pending) {
      if (selectedApps.length) {
        // mark selected as pendingAndValid
        await this.prisma.applications.updateMany({
          data: {
            reviewStatus: ApplicationReviewStatusEnum.pendingAndValid,
            markedAsDuplicate: false,
          },
          where: {
            id: {
              in: selectedApps,
            },
          },
        });
      }

      // mark unselected as pending
      await this.prisma.applications.updateMany({
        data: {
          reviewStatus: ApplicationReviewStatusEnum.pending,
          markedAsDuplicate: false,
        },
        where: {
          applicationFlaggedSet: {
            some: {
              id: dto.afsId,
            },
          },
          id: selectedApps.length
            ? {
                notIn: selectedApps,
              }
            : undefined,
        },
      });

      // mark the flagged set as pending
      await this.prisma.applicationFlaggedSet.update({
        where: {
          id: dto.afsId,
        },
        data: {
          resolvedTime: new Date(),
          status: FlaggedSetStatusEnum.pending,
          showConfirmationAlert: false,
          userAccounts: user
            ? {
                connect: {
                  id: user.id,
                },
              }
            : undefined,
        },
      });
    } else if (dto.status === FlaggedSetStatusEnum.resolved) {
      if (selectedApps.length) {
        // mark selected as valid
        await this.prisma.applications.updateMany({
          data: {
            reviewStatus: ApplicationReviewStatusEnum.valid,
            markedAsDuplicate: false,
          },
          where: {
            id: {
              in: selectedApps,
            },
          },
        });
      }
      // mark unselected as duplicate
      await this.prisma.applications.updateMany({
        data: {
          reviewStatus: ApplicationReviewStatusEnum.duplicate,
          markedAsDuplicate: true,
        },
        where: {
          applicationFlaggedSet: {
            some: {
              id: dto.afsId,
            },
          },
          id: selectedApps.length
            ? {
                notIn: selectedApps,
              }
            : undefined,
        },
      });

      // mark flagged set as resolved
      await this.prisma.applicationFlaggedSet.update({
        data: {
          resolvedTime: new Date(),
          status: FlaggedSetStatusEnum.resolved,
          showConfirmationAlert: true,
          userAccounts: user
            ? {
                connect: {
                  id: user.id,
                },
              }
            : undefined,
        },
        where: {
          id: dto.afsId,
        },
      });
    }

    return mapTo(ApplicationFlaggedSet, afs);
  }

  /**
    this will either find a record or throw a customized error
  */
  async findOrThrow(afsId: string): Promise<boolean> {
    const rawAfs = await this.prisma.applicationFlaggedSet.findFirst({
      where: {
        id: afsId,
      },
    });

    if (!rawAfs) {
      throw new NotFoundException(
        `applicationFlaggedSet ${afsId} was requested but not found`,
      );
    }

    return true;
  }

  /**
    this goes through listings that have had an application added since the last cronjob run
    it calls a series of helpers to add to or build a flagged set if duplicates are found
  */
  async process(): Promise<SuccessDTO> {
    this.logger.warn('running the Application flagged sets cron job');
    await this.markCronJobAsStarted();
    const outOfDateListings = await this.prisma.listings.findMany({
      select: {
        id: true,
        afsLastRunAt: true,
      },
      where: {
        lastApplicationUpdateAt: {
          not: null,
        },
        AND: [
          {
            OR: [
              {
                afsLastRunAt: {
                  equals: null,
                },
              },
              {
                afsLastRunAt: {
                  lte: this.prisma.listings.fields.lastApplicationUpdateAt,
                },
              },
            ],
          },
        ],
      },
    });
    this.logger.warn(
      `updating the flagged sets for ${outOfDateListings.length} listings`,
    );

    for (const listing of outOfDateListings) {
      const newApplications = await this.prisma.applications.findMany({
        where: {
          listingId: listing.id,
          updatedAt: {
            gte: listing.afsLastRunAt,
          },
        },
        include: {
          applicant: true,
          householdMember: true,
        },
      });

      for (const application of newApplications) {
        await this.testApplication(
          mapTo(Application, application),
          application.listingId,
        );
      }
      await this.prisma.listings.update({
        where: {
          id: listing.id,
        },
        data: {
          afsLastRunAt: new Date(),
        },
      });
    }

    return {
      success: true,
    };
  }

  /**
    marks the db record for this cronjob as begun or creates a cronjob that
    is marked as begun if one does not already exist 
  */
  async markCronJobAsStarted(): Promise<void> {
    const job = await this.prisma.cronJob.findFirst({
      where: {
        name: CRON_JOB_NAME,
      },
    });
    if (job) {
      // if a job exists then we update db entry
      await this.prisma.cronJob.update({
        data: {
          lastRunDate: new Date(),
        },
        where: {
          id: job.id,
        },
      });
    } else {
      // if no job we create a new entry
      await this.prisma.cronJob.create({
        data: {
          lastRunDate: new Date(),
          name: CRON_JOB_NAME,
        },
      });
    }
  }

  /**
    tests application to see if its a duplicate
    if it is then its either added to a flagged set or a new flagged set is created
  */
  async testApplication(
    application: Application,
    listingId: string,
  ): Promise<void> {
    let alreadyFoundMatch = false;
    for (const rule of [RuleEnum.email, RuleEnum.nameAndDOB]) {
      // get list of applications that the application matches on. Compared via the RuleEnum
      const applicationsThatMatched = await this.checkForMatchesAgainstRule(
        application,
        rule,
        listingId,
      );

      // get list of flagged sets this application is part of
      const flagSetsThisAppBelongsTo =
        await this.prisma.applicationFlaggedSet.findMany({
          include: {
            applications: true,
          },
          where: {
            listingId,
            applications: {
              some: {
                id: application.id,
              },
            },
            rule,
          },
        });

      const builtRuleKey = this.buildRuleKey(application, rule, listingId);
      if (!alreadyFoundMatch && applicationsThatMatched.length) {
        // if there were duplicates (application could be a part of a flagged set)
        if (flagSetsThisAppBelongsTo.length) {
          // if application is part of a flagged set already
          let wasInTheCorrectFlaggedSet = false;
          for (const flaggedSet of flagSetsThisAppBelongsTo) {
            if (flaggedSet.ruleKey === builtRuleKey) {
              // if application belongs in this flagged set
              wasInTheCorrectFlaggedSet = true;
            } else {
              // application doesn't belong in this flagged set
              await this.disconnectApplicationFromFlaggedSet(
                flaggedSet.id,
                flaggedSet.applications.length,
                application.id,
              );
            }
          }
          if (!wasInTheCorrectFlaggedSet) {
            // if application didn't belong to any of its previous flagged sets
            await this.createOrConnectToFlaggedSet(
              rule,
              builtRuleKey,
              listingId,
              [...applicationsThatMatched, application],
            );
          }
        } else {
          // if application is not yet part of a flagged set
          await this.createOrConnectToFlaggedSet(
            rule,
            builtRuleKey,
            listingId,
            [...applicationsThatMatched, application],
          );
        }
        alreadyFoundMatch = true;
      } else if (flagSetsThisAppBelongsTo.length) {
        // if application had no duplicates (application should not be part of a flagged set)
        // and application is part of a flagged set
        for (const flaggedSet of flagSetsThisAppBelongsTo) {
          await this.disconnectApplicationFromFlaggedSet(
            flaggedSet.id,
            flaggedSet.applications.length,
            application.id,
          );
        }
      }
    }
  }

  /**
    builds the ruleKey field given an application, the rule, and the listingId
  */
  buildRuleKey(
    application: Application,
    rule: RuleEnum,
    listingId: string,
  ): string {
    if (rule == RuleEnum.email) {
      return `${listingId}-email-${application.applicant.emailAddress}`;
    } else {
      return (
        `${listingId}-nameAndDOB-${application.applicant.firstName}-${application.applicant.lastName}-${application.applicant.birthMonth}-` +
        `${application.applicant.birthDay}-${application.applicant.birthYear}`
      );
    }
  }

  /**
    gathers a set of applications that match the passed in application based on the rule
  */
  async checkForMatchesAgainstRule(
    application: Application,
    rule: RuleEnum,
    listingId: string,
  ): Promise<Application[]> {
    if (rule === RuleEnum.email) {
      return await this.checkAgainstEmail(application, listingId);
    } else if (rule === RuleEnum.nameAndDOB) {
      return await this.checkAgainstNameAndDOB(application, listingId);
    }
  }

  /**
    gets a list of applications that matches based on email
  */
  async checkAgainstEmail(
    application: Application,
    listingId: string,
  ): Promise<Application[]> {
    if (!application?.applicant?.emailAddress) {
      return [];
    }

    const apps = await this.prisma.applications.findMany({
      select: {
        id: true,
      },
      where: {
        id: {
          not: application.id,
        },
        status: ApplicationStatusEnum.submitted,
        listingId: listingId,
        applicant: {
          emailAddress: application.applicant.emailAddress,
        },
      },
    });

    return mapTo(Application, apps);
  }

  /**
    gets a list of applications that matches based on name and dob (spread across applicant + householdmember)
  */
  async checkAgainstNameAndDOB(
    application: Application,
    listingId: string,
  ): Promise<Application[]> {
    const firstNames = [
      application.applicant.firstName,
      ...(application.householdMember
        ? application.householdMember.map((member) => member.firstName)
        : []),
    ];
    const lastNames = [
      application.applicant.lastName,
      ...(application.householdMember
        ? application.householdMember.map((member) => member.lastName)
        : []),
    ];
    const birthMonths = [
      application.applicant.birthMonth,
      ...(application.householdMember
        ? application.householdMember.map((member) => member.birthMonth)
        : []),
    ];
    const birthDays = [
      application.applicant.birthDay,
      ...(application.householdMember
        ? application.householdMember.map((member) => member.birthDay)
        : []),
    ];
    const birthYears = [
      application.applicant.birthYear,
      ...(application.householdMember
        ? application.householdMember.map((member) => member.birthYear)
        : []),
    ];

    const apps = await this.prisma.applications.findMany({
      select: {
        id: true,
      },
      where: {
        id: {
          not: application.id,
        },
        status: ApplicationStatusEnum.submitted,
        listingId: listingId,
        AND: [
          {
            OR: [
              {
                householdMember: {
                  some: {
                    firstName: {
                      in: firstNames,
                    },
                  },
                },
              },
              {
                applicant: {
                  firstName: {
                    in: firstNames,
                  },
                },
              },
            ],
          },
          {
            OR: [
              {
                householdMember: {
                  some: {
                    lastName: {
                      in: lastNames,
                    },
                  },
                },
              },
              {
                applicant: {
                  lastName: {
                    in: lastNames,
                  },
                },
              },
            ],
          },
          {
            OR: [
              {
                householdMember: {
                  some: {
                    birthMonth: {
                      in: birthMonths,
                    },
                  },
                },
              },
              {
                applicant: {
                  birthMonth: {
                    in: birthMonths,
                  },
                },
              },
            ],
          },
          {
            OR: [
              {
                householdMember: {
                  some: {
                    birthDay: {
                      in: birthDays,
                    },
                  },
                },
              },
              {
                applicant: {
                  birthDay: {
                    in: birthDays,
                  },
                },
              },
            ],
          },
          {
            OR: [
              {
                householdMember: {
                  some: {
                    birthYear: {
                      in: birthYears,
                    },
                  },
                },
              },
              {
                applicant: {
                  birthYear: {
                    in: birthYears,
                  },
                },
              },
            ],
          },
        ],
      },
    });

    return mapTo(Application, apps);
  }

  /**
    either disconnects an application from a flagged set,
    or if the flagged set would only have 1 element, deletes the flagged set
  */
  async disconnectApplicationFromFlaggedSet(
    afsId: string,
    numberOfAttachedApplications: number,
    applicationId: string,
  ): Promise<void> {
    if (numberOfAttachedApplications === 2) {
      // if after we removed this application only 1 application would be left in the flagged set
      await this.prisma.applicationFlaggedSet.delete({
        where: {
          id: afsId,
        },
      });
    } else {
      // remove application from flagged set
      await this.prisma.applicationFlaggedSet.update({
        where: {
          id: afsId,
        },
        data: {
          applications: {
            disconnect: {
              id: applicationId,
            },
          },
        },
      });
    }

    // since application no longer belongs to the flagged set it can't be marked as duplicate
    await this.prisma.applications.update({
      data: {
        markedAsDuplicate: false,
        reviewStatus: ApplicationReviewStatusEnum.valid,
      },
      where: {
        id: applicationId,
      },
    });
  }

  /**
    creates a new flagged set
  */
  async createOrConnectToFlaggedSet(
    rule: RuleEnum,
    ruleKey: string,
    listingId: string,
    applicationIds: IdDTO[],
  ): Promise<void> {
    const correctFlaggedSet = await this.prisma.applicationFlaggedSet.findMany({
      where: {
        listingId,
        ruleKey,
      },
    });

    if (correctFlaggedSet.length) {
      // if we found a flagged set the application should belong to
      for (const flaggedSet of correctFlaggedSet) {
        await this.prisma.applicationFlaggedSet.update({
          data: {
            applications: {
              connect: applicationIds.map((app) => ({
                id: app.id,
              })),
            },
            // regardless of former status the afs should be reviewed again
            status: FlaggedSetStatusEnum.pending,
            resolvedTime: null,
            resolvingUserId: null,
          },
          where: {
            id: flaggedSet.id,
            ruleKey: ruleKey,
          },
        });
      }
    } else {
      // if no flagged set currently exists
      await this.prisma.applicationFlaggedSet.create({
        data: {
          rule,
          ruleKey,
          resolvedTime: null,
          status: FlaggedSetStatusEnum.pending,
          listings: {
            connect: {
              id: listingId,
            },
          },
          applications: {
            connect: applicationIds.map((app) => ({
              id: app.id,
            })),
          },
        },
      });
    }
  }
}
