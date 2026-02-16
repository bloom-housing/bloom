import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import {
  ApplicationReviewStatusEnum,
  FlaggedSetStatusEnum,
  ListingsStatusEnum,
  Prisma,
  RuleEnum,
} from '@prisma/client';
import { AfsMeta } from '../dtos/application-flagged-sets/afs-meta.dto';
import { AfsQueryParams } from '../dtos/application-flagged-sets/afs-query-params.dto';
import { AfsResolve } from '../dtos/application-flagged-sets/afs-resolve.dto';
import { ApplicationFlaggedSet } from '../dtos/application-flagged-sets/application-flagged-set.dto';
import { PaginatedAfsDto } from '../dtos/application-flagged-sets/paginated-afs.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { View } from '../enums/application-flagged-sets/view';
import { OrderByEnum } from '../enums/shared/order-by-enum';
import { mapTo } from '../utilities/mapTo';
import {
  buildPaginationMetaInfo,
  calculateSkip,
  calculateTake,
} from '../utilities/pagination-helpers';
import { CronJobService } from './cron-job.service';
import { PrismaService } from './prisma.service';

/*
  this is the service for application flaged sets
  it handles all the backend's business logic for managing flagged set data
*/

const CRON_JOB_NAME = 'AFS_CRON_JOB_v2';

type PossibleFlaggedSetQuery = {
  key: string;
  type: RuleEnum;
  applicationids: string[];
};

@Injectable()
export class ApplicationFlaggedSetService implements OnModuleInit {
  constructor(
    private prisma: PrismaService,
    @Inject(Logger)
    private logger = new Logger(ApplicationFlaggedSetService.name),
    private cronJobService: CronJobService,
  ) {}

  onModuleInit() {
    this.cronJobService.startCronJob(
      CRON_JOB_NAME,
      process.env.DUPLICATES_PROCESSING_CRON_STRING,
      this.processDuplicates.bind(this),
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
    if (count && params.limit && params.limit !== 'all' && params.page > 1) {
      if (Math.ceil(count / params.limit) < params.page) {
        params.page = 1;
        params.limit = count;
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
      skip: calculateSkip(params.limit, params.page),
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
    const [totalCount, totalResolvedCount, totalPendingCount] =
      await Promise.all([
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
        ),
      ]);

    return {
      totalCount,
      totalResolvedCount,
      totalPendingCount,
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
   * Run the duplicate process on all listings that match the criteria
   *
   * @param listingId optional parameter to run the process on a specific listing
   * @param forceProcess optional parameter to force the process to run even if listing would not normally run
   */
  async processDuplicates(
    listingId?: string,
    forceProcess?: boolean,
  ): Promise<SuccessDTO> {
    this.logger.warn('running the Application flagged sets cron job');
    await this.cronJobService.markCronJobAsStarted(CRON_JOB_NAME);
    const outOfDateListings = await this.prisma.listings.findMany({
      select: {
        id: true,
        afsLastRunAt: true,
        name: true,
      },
      where: {
        lastApplicationUpdateAt: {
          not: null,
        },
        id: listingId,
        AND: [
          // Allow the ability to force process even if application flag set has run more recent than last application update
          !forceProcess
            ? {
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
              }
            : {},
        ],
      },
    });
    this.logger.warn(
      `running duplicates check on ${
        outOfDateListings.length
      } listings. Listings - ${outOfDateListings
        ?.map((listing) => listing.id)
        .toString()}`,
    );
    for (const listing of outOfDateListings) {
      // find all flagged keys for this listing that applies to more than one listing
      const flaggedApplicationGrouped: PossibleFlaggedSetQuery[] = await this
        .prisma
        .$queryRaw`select key, array_agg(application_id) as applicationIds, type
        FROM application_flagged_set_possibilities
        WHERE listing_id = ${listing.id}::UUID
        GROUP BY key, type
        HAVING count(application_id) > 1;`;

      // Group all of the flagged keys by application id
      const applicationToGroupList = {};
      flaggedApplicationGrouped.forEach((group) => {
        group.applicationids.forEach((id) => {
          const inGroupList = applicationToGroupList[id] || [];
          inGroupList.push(group);
          applicationToGroupList[id] = inGroupList;
        });
      });

      let individualMatchingGroup = [];
      const groupByIntersectingIdsAndRemoveFromList = (
        value: PossibleFlaggedSetQuery[],
        key: string,
      ): PossibleFlaggedSetQuery[] => {
        individualMatchingGroup.push(...value);
        delete applicationToGroupList[key];
        value.forEach((v) => {
          v.applicationids.forEach((id) => {
            if (id !== key) {
              const nextIdValues = applicationToGroupList[id];
              if (nextIdValues) {
                return groupByIntersectingIdsAndRemoveFromList(
                  nextIdValues,
                  id,
                );
              }
            }
          });
        });
        return individualMatchingGroup;
      };

      // Loop through the grouped by application list and combine the ones that have overlap
      // Using a while loop because as it groups it jumps around and only needs to go over each group once
      const matchingGroups = [];
      while (Object.keys(applicationToGroupList).length > 0) {
        individualMatchingGroup = [];
        const [key, value] = Object.entries(applicationToGroupList)[0];
        const matchedGroups = groupByIntersectingIdsAndRemoveFromList(
          value as PossibleFlaggedSetQuery[],
          key,
        );
        // Remove duplicated groups
        matchedGroups
          .map((group) => group.key)
          .filter((e, i, a) => a.indexOf(e) !== i)
          .forEach((groupKey) => {
            const foundIndex = matchedGroups.findIndex(
              (group) => group.key === groupKey,
            );
            matchedGroups.splice(foundIndex, 1);
          });
        matchingGroups.push(matchedGroups);
      }

      const applicationFlaggedSetsInDB =
        await this.prisma.applicationFlaggedSet.findMany({
          include: {
            applications: {
              select: {
                id: true,
              },
            },
          },
          where: {
            listingId: listing.id,
          },
        });

      // These are the flag sets in the style and grouping that goes in the DB
      const constructedFlaggedSets = matchingGroups.map((flaggedGroup) => {
        if (flaggedGroup.length === 1) {
          return {
            ruleKey: flaggedGroup[0].key || '',
            rule: flaggedGroup[0].type as RuleEnum,
            applications: flaggedGroup[0].applicationids,
          };
        }
        // Most common multiple match is email and primary user name/dob
        // but it can be more than 2 if also some or all of the household members match
        // in rare cases it can also be primary applicant and household member match but email does not
        if (flaggedGroup.length > 1) {
          const applicationIDs = [];
          flaggedGroup.forEach((group) => {
            applicationIDs.push(...group.applicationids);
          });
          const uniqueIds = [...new Set(applicationIDs)];
          const emailFlagged = flaggedGroup.find(
            (group) => group.type === RuleEnum.email,
          );
          // all name flags need to be sorted alphabetically so they are the same every time
          const nameFlagged = flaggedGroup
            .filter((group) => group.type === RuleEnum.nameAndDOB)
            ?.sort((flagA, flagB) => flagB.key.localeCompare(flagA.key));
          if (!emailFlagged) {
            // In the rare case that more than one name/dob matches but not email it should still be nameAndDOB
            return {
              ruleKey: `${nameFlagged.map((flag) => flag.key).join('-')}`,
              rule: RuleEnum.nameAndDOB,
              applications: uniqueIds,
            };
          }
          return {
            ruleKey: `${emailFlagged.key}-${nameFlagged
              .map((flag) => flag.key)
              .join('-')}`,
            rule: RuleEnum.combination,
            applications: uniqueIds,
          };
        }
      });
      // Remove unused application flagged sets that are no longer valid
      // There are multiple scenarios this can happen
      //  1. An application is deleted from the system
      //  2. An application is edited so either the applications no longer conflict or now is considered
      //     a match with both types (will be part of combination)
      //  3. A new application is added that partially matches a group so the group key is now different
      for (const flaggedSet of applicationFlaggedSetsInDB) {
        const foundApplicationFlaggedSet = constructedFlaggedSets.find(
          (afs) => afs.ruleKey === flaggedSet.ruleKey,
        );
        if (!foundApplicationFlaggedSet) {
          await this.prisma.applicationFlaggedSet.delete({
            where: { id: flaggedSet.id },
          });
        }
      }
      // Save or Update flag sets in the database
      for (const flaggedGroup of constructedFlaggedSets) {
        const foundApplicationFlaggedSet = applicationFlaggedSetsInDB.find(
          (afs) => afs.ruleKey === flaggedGroup.ruleKey,
        );
        if (foundApplicationFlaggedSet) {
          const foundAFSApplicationIds =
            foundApplicationFlaggedSet.applications.map((afs) => afs.id);
          // find if the saved flagged group is different size or doesn't contain the same applications
          if (
            !(
              foundAFSApplicationIds.length ===
                flaggedGroup.applications.length &&
              foundAFSApplicationIds.every((value) =>
                flaggedGroup.applications.includes(value),
              )
            )
          ) {
            const applicationIdsNoLongerValid = foundAFSApplicationIds.filter(
              (afsId) => !flaggedGroup.applications.includes(afsId),
            );
            await this.prisma.applicationFlaggedSet.update({
              data: {
                applications: {
                  // disconnect any application that no longer match
                  disconnect: applicationIdsNoLongerValid
                    ? applicationIdsNoLongerValid.map((afs) => {
                        return { id: afs };
                      })
                    : undefined,
                  connect: flaggedGroup.applications.map((application) => {
                    return { id: application };
                  }),
                },
                status: FlaggedSetStatusEnum.pending,
              },
              where: { id: foundApplicationFlaggedSet.id },
            });
          }
          // If generated is the same as in the db than do nothing, otherwise create a new one
        } else {
          try {
            await this.prisma.applicationFlaggedSet.create({
              data: {
                ruleKey: flaggedGroup.ruleKey,
                rule: flaggedGroup.rule,
                listings: {
                  connect: {
                    id: listing.id,
                  },
                },
                status: FlaggedSetStatusEnum.pending,
                applications: {
                  connect: flaggedGroup.applications.map((application) => {
                    return { id: application };
                  }),
                },
              },
            });
          } catch (e) {
            this.logger.error(
              `${CRON_JOB_NAME} unable to create flag set for rule ${flaggedGroup.rule} and rule key ${flaggedGroup.ruleKey} on listing ${listing.id}`,
            );
            this.logger.error(e);
          }
        }
      }
      // set the last run at date to the listings
      for (const listing of outOfDateListings) {
        await this.prisma.listings.update({
          where: {
            id: listing.id,
          },
          data: {
            afsLastRunAt: new Date(),
          },
        });
      }
    }

    return {
      success: true,
    };
  }
}
