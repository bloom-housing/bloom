import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
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
import {
  buildPaginationMetaInfo,
  calculateSkip,
  calculateTake,
} from '../utilities/pagination-helpers';
import { AfsResolve } from '../dtos/application-flagged-sets/afs-resolve.dto';
import { User } from '../dtos/users/user.dto';
import { Application } from '../dtos/applications/application.dto';
import { IdDTO } from '../dtos/shared/id.dto';
import { startCronJob } from '../utilities/cron-job-starter';

/*
  this is the service for application flaged sets
  it handles all the backend's business logic for managing flagged set data
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
    startCronJob(
      this.prisma,
      CRON_JOB_NAME,
      process.env.AFS_PROCESSING_CRON_STRING,
      this.process.bind(this),
      this.logger,
      this.schedulerRegistry,
    );
  }

  /**
    this will get a set of application flagged sets given the params passed in
  */
  async list(params: AfsQueryParams): Promise<PaginatedAfsDto> {
    const whereClause = this.buildWhere(params);

    const count = await this.prisma.applicationFlaggedSet.count({
      where: whereClause,
    });

    // if passed in page and limit would result in no results because there aren't that many listings
    // revert back to the first page
    let page = params.page;
    if (count && params.limit && params.limit !== 'all' && params.page > 1) {
      if (Math.ceil(count / params.limit) < params.page) {
        page = 1;
      }
    }

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
      skip: calculateSkip(params.limit, page),
      take: calculateTake(params.limit),
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
      switch (params.view) {
        case View.pending:
          filters.push({
            status: FlaggedSetStatusEnum.pending,
          });
          break;
        case View.pendingNameAndDoB:
          filters.push({
            status: FlaggedSetStatusEnum.pending,
            rule: RuleEnum.nameAndDOB,
          });
          break;
        case View.pendingEmail:
          filters.push({
            status: FlaggedSetStatusEnum.pending,
            rule: RuleEnum.email,
          });
          break;
        case View.resolved:
          filters.push({
            status: FlaggedSetStatusEnum.resolved,
          });
          break;
      }
    }

    if (params.search) {
      filters.push({
        applications: {
          some: {
            applicant: {
              OR: [
                {
                  firstName: {
                    contains: params.search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  lastName: {
                    contains: params.search,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            },
          },
        },
      });
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
      totalNamePendingCount,
      totalEmailPendingCount,
    ] = await Promise.all([
      this.prisma.applications.count({
        where: {
          listingId: params.listingId,
          // We only should display non-deleted applications
          deletedAt: null,
        },
      }),
      this.metaDataQueryBuilder(
        params.listingId,
        FlaggedSetStatusEnum.resolved,
      ),
      this.metaDataQueryBuilder(
        params.listingId,
        FlaggedSetStatusEnum.pending,
        RuleEnum.nameAndDOB,
      ),
      this.metaDataQueryBuilder(
        params.listingId,
        FlaggedSetStatusEnum.pending,
        RuleEnum.email,
      ),
    ]);

    return {
      totalCount,
      totalResolvedCount,
      totalPendingCount: totalNamePendingCount + totalEmailPendingCount,
      totalNamePendingCount,
      totalEmailPendingCount,
    };
  }

  /**
    helper that builds the meta functions queries
  */
  metaDataQueryBuilder(
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

    let applicationIds: string[] = [];
    if (dto.applications?.length) {
      applicationIds = dto.applications.map((app) => app.id);
      filter.push({
        applications: {
          some: {
            id: {
              in: applicationIds,
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
              in: applicationIds,
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

    const selectedApps = afs.applications
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
  async process(listingId?: string): Promise<SuccessDTO> {
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
        id: listingId,
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
    // if we already found a match then we know that the application can't go into another flagged set
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

      if (!alreadyFoundMatch && applicationsThatMatched.length) {
        const builtRuleKey = this.buildRuleKey(application, rule, listingId);
        // if there were duplicates (application could be a part of a flagged set)
        if (flagSetsThisAppBelongsTo.length) {
          // if application is part of a flagged set already
          for (const flaggedSet of flagSetsThisAppBelongsTo) {
            if (flaggedSet.ruleKey === builtRuleKey) {
              // if application belongs in this flagged set
              alreadyFoundMatch = true;
            } else {
              // application doesn't belong in this flagged set
              await this.disconnectApplicationFromFlaggedSet(
                flaggedSet.id,
                flaggedSet.applications.length,
                application.id,
              );
            }
          }
          if (!alreadyFoundMatch) {
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
        `${listingId}-nameAndDOB-${application.applicant.firstName?.toLowerCase()}-${application.applicant.lastName?.toLowerCase()}` +
        `-${application.applicant.birthMonth}-${application.applicant.birthDay}-${application.applicant.birthYear}`
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
    const firstNames = this.criteriaBuilderForCheckAgainstNameAndDOB(
      'firstName',
      application,
    ).filter((value) => value);
    const lastNames = this.criteriaBuilderForCheckAgainstNameAndDOB(
      'lastName',
      application,
    ).filter((value) => value);
    const birthMonths = this.criteriaBuilderForCheckAgainstNameAndDOB(
      'birthMonth',
      application,
    ).filter((value) => value);
    const birthDays = this.criteriaBuilderForCheckAgainstNameAndDOB(
      'birthDay',
      application,
    ).filter((value) => value);
    const birthYears = this.criteriaBuilderForCheckAgainstNameAndDOB(
      'birthYear',
      application,
    ).filter((value) => value);

    const apps =
      firstNames.length && lastNames.length
        ? await this.prisma.applications.findMany({
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
                            mode: 'insensitive',
                          },
                        },
                      },
                    },
                    {
                      applicant: {
                        firstName: {
                          in: firstNames,
                          mode: 'insensitive',
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
                            mode: 'insensitive',
                          },
                        },
                      },
                    },
                    {
                      applicant: {
                        lastName: {
                          in: lastNames,
                          mode: 'insensitive',
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
                            in: birthMonths.map((val) => Number(val)),
                          },
                        },
                      },
                    },
                    {
                      applicant: {
                        birthMonth: {
                          in: birthMonths.map((val) => Number(val)),
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
                            in: birthDays.map((val) => Number(val)),
                          },
                        },
                      },
                    },
                    {
                      applicant: {
                        birthDay: {
                          in: birthDays.map((val) => Number(val)),
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
                            in: birthYears.map((val) => Number(val)),
                          },
                        },
                      },
                    },
                    {
                      applicant: {
                        birthYear: {
                          in: birthYears.map((val) => Number(val)),
                        },
                      },
                    },
                  ],
                },
              ],
            },
          })
        : [];

    return mapTo(Application, apps);
  }

  criteriaBuilderForCheckAgainstNameAndDOB(
    key: string,
    application: Application,
  ): string[] {
    return [
      application.applicant[key],
      ...(application.householdMember
        ? application.householdMember.map((member) => member[key])
        : []),
    ];
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
