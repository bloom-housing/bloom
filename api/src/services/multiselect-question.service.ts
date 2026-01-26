import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  ListingsStatusEnum,
  MultiselectQuestionsStatusEnum,
  Prisma,
} from '@prisma/client';
import { CronJobService } from './cron-job.service';
import { PermissionService } from './permission.service';
import { PrismaService } from './prisma.service';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import { MultiselectQuestion } from '../dtos/multiselect-questions/multiselect-question.dto';
import { MultiselectQuestionCreate } from '../dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionUpdate } from '../dtos/multiselect-questions/multiselect-question-update.dto';
import { MultiselectQuestionQueryParams } from '../dtos/multiselect-questions/multiselect-question-query-params.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { FeatureFlagEnum } from '../enums/feature-flags/feature-flags-enum';
import { MultiselectQuestionFilterKeys } from '../enums/multiselect-questions/filter-key-enum';
import { MultiselectQuestionViews } from '../enums/multiselect-questions/view-enum';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { buildFilter } from '../utilities/build-filter';
import { buildOrderByForMultiselectQuestions } from '../utilities/build-order-by';
import { doJurisdictionHaveFeatureFlagSet } from '../utilities/feature-flag-utilities';
import { mapTo } from '../utilities/mapTo';
import { calculateSkip, calculateTake } from '../utilities/pagination-helpers';

export const includeViews: Partial<
  Record<MultiselectQuestionViews, Prisma.MultiselectQuestionsInclude>
> = {
  fundamentals: {
    jurisdiction: true,
    multiselectOptions: true,
  },
};

includeViews.base = {
  ...includeViews.fundamentals,
  listings: true,
};

const MSQ_RETIRE_CRON_JOB_NAME = 'MSQ_RETIRE_CRON_JOB';

/*
  this is the service for multiselect questions
  it handles all the backend's business logic for reading/writing/deleting multiselect question data
*/
@Injectable()
export class MultiselectQuestionService {
  constructor(
    private prisma: PrismaService,
    @Inject(Logger)
    private logger = new Logger(MultiselectQuestionService.name),
    private permissionService: PermissionService,
    private schedulerRegistry: SchedulerRegistry,
    private cronJobService: CronJobService,
  ) {}

  onModuleInit() {
    this.cronJobService.startCronJob(
      MSQ_RETIRE_CRON_JOB_NAME,
      process.env.MSQ_RETIRE_CRON_STRING,
      this.retireMultiselectQuestions.bind(this),
    );
  }

  /*
    this will get a set of multiselect questions given the params passed in
  */
  async list(
    params: MultiselectQuestionQueryParams,
  ): Promise<MultiselectQuestion[]> {
    const whereClause = this.buildWhere(params);

    const count = await this.prisma.multiselectQuestions.count({
      where: whereClause,
    });

    // if passed in page and limit would result in no results because there aren't that many
    // multiselectQuestions revert back to the first page
    let page = params.page;
    if (count && params.limit && params.limit !== 'all' && params.page > 1) {
      if (Math.ceil(count / params.limit) < params.page) {
        page = 1;
      }
    }

    const query = {
      skip: calculateSkip(params.limit, page),
      take: calculateTake(params.limit),
      orderBy: buildOrderByForMultiselectQuestions(
        params.orderBy,
        params.orderDir,
      ),
      where: whereClause,
    };

    const rawMultiselectQuestions =
      await this.prisma.multiselectQuestions.findMany({
        ...query,
        include: includeViews[params.view ?? 'fundamentals'],
      });

    // TODO: Can be removed after MSQ refactor
    const multiselectQuestionsWithJurisdictions = rawMultiselectQuestions.map(
      (msq) => {
        return {
          ...msq,
          jurisdictions: [msq.jurisdiction],
        };
      },
    );
    return mapTo(MultiselectQuestion, multiselectQuestionsWithJurisdictions);
  }

  /*
    this will build the where clause for list()
  */
  buildWhere(
    params: MultiselectQuestionQueryParams,
  ): Prisma.MultiselectQuestionsWhereInput {
    const filters: Prisma.MultiselectQuestionsWhereInput[] = [];
    if (params?.filter?.length) {
      params.filter.forEach((filter) => {
        if (filter[MultiselectQuestionFilterKeys.applicationSection]) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[MultiselectQuestionFilterKeys.applicationSection],
            key: MultiselectQuestionFilterKeys.applicationSection,
            caseSensitive: true,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({
              applicationSection: filt,
            })),
          });
        } else if (filter[MultiselectQuestionFilterKeys.jurisdiction]) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[MultiselectQuestionFilterKeys.jurisdiction],
            key: MultiselectQuestionFilterKeys.jurisdiction,
            caseSensitive: true,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({
              jurisdiction: {
                id: filt,
              },
            })),
          });
        } else if (filter[MultiselectQuestionFilterKeys.status]) {
          const builtFilter = buildFilter({
            $comparison: filter.$comparison,
            $include_nulls: false,
            value: filter[MultiselectQuestionFilterKeys.status],
            key: MultiselectQuestionFilterKeys.status,
            caseSensitive: true,
          });
          filters.push({
            OR: builtFilter.map((filt) => ({
              status: filt,
            })),
          });
        }
      });
    }

    if (params?.search) {
      filters.push({
        name: {
          contains: params.search,
          mode: Prisma.QueryMode.insensitive,
        },
      });
    }

    return {
      AND: filters,
    };
  }

  /*
    this will return 1 multiselect question or error
  */
  async findOne(
    multiselectQuestionId: string,
    view: MultiselectQuestionViews = MultiselectQuestionViews.fundamentals,
  ): Promise<MultiselectQuestion> {
    const rawMultiselectQuestion =
      await this.prisma.multiselectQuestions.findUnique({
        include: includeViews[view],
        where: {
          id: multiselectQuestionId,
        },
      });

    if (!rawMultiselectQuestion) {
      throw new NotFoundException(
        `multiselectQuestionId ${multiselectQuestionId} was requested but not found`,
      );
    }

    // TODO: Can be removed after MSQ refactor
    rawMultiselectQuestion['jurisdictions'] = [
      rawMultiselectQuestion.jurisdiction,
    ];

    return mapTo(MultiselectQuestion, rawMultiselectQuestion);
  }

  /*
    this will create a multiselect question
  */
  async create(
    incomingData: MultiselectQuestionCreate,
    requestingUser: User,
  ): Promise<MultiselectQuestion> {
    const {
      isExclusive,
      jurisdiction,
      jurisdictions,
      links,
      multiselectOptions,
      name,
      options,
      status,
      ...createData
    } = incomingData;

    const rawJurisdiction = await this.prisma.jurisdictions.findFirstOrThrow({
      select: {
        featureFlags: true,
        id: true,
      },
      where: {
        id: jurisdiction
          ? jurisdiction.id
          : jurisdictions?.at(0)
          ? jurisdictions?.at(0)?.id
          : undefined,
      },
    });

    await this.permissionService.canOrThrow(
      requestingUser,
      'multiselectQuestion',
      permissionActions.create,
      {
        jurisdictionId: rawJurisdiction.id,
      },
    );

    const enableV2MSQ = doJurisdictionHaveFeatureFlagSet(
      rawJurisdiction as Jurisdiction,
      FeatureFlagEnum.enableV2MSQ,
    );

    if (
      status &&
      !(
        status === MultiselectQuestionsStatusEnum.draft ||
        status === MultiselectQuestionsStatusEnum.visible
      )
    ) {
      throw new BadRequestException(
        "status must be 'draft' or 'visible' on create",
      );
    }

    const rawMultiselectQuestion =
      await this.prisma.multiselectQuestions.create({
        data: {
          ...createData,
          jurisdiction: {
            connect: { id: rawJurisdiction.id },
          },
          links: links
            ? (links as unknown as Prisma.InputJsonArray)
            : undefined,

          // TODO: Can be removed after MSQ refactor
          options: options
            ? (options as unknown as Prisma.InputJsonArray)
            : undefined,

          // TODO: Use of the feature flag is temporary until after MSQ refactor
          isExclusive: enableV2MSQ ? isExclusive : false,
          name: enableV2MSQ ? name : createData.text,
          status: enableV2MSQ ? status : MultiselectQuestionsStatusEnum.draft,

          multiselectOptions: enableV2MSQ
            ? {
                createMany: {
                  data: multiselectOptions?.map((option) => {
                    // TODO: Can be removed after MSQ refactor
                    delete option['collectAddress'];
                    delete option['collectName'];
                    delete option['collectRelationship'];
                    delete option['exclusive'];
                    delete option['text'];
                    return {
                      ...option,
                      links: option.links as unknown as Prisma.InputJsonArray,
                      name: option.name,
                    };
                  }),
                },
              }
            : undefined,
        },
        include: includeViews.fundamentals,
      });

    // TODO: Can be removed after MSQ refactor
    rawMultiselectQuestion['jurisdictions'] = [
      rawMultiselectQuestion.jurisdiction,
    ];
    return mapTo(MultiselectQuestion, rawMultiselectQuestion);
  }

  /*
    this will update a multiselect question's name or items field
    if no multiselect question has the id of the incoming argument an error is thrown
  */
  async update(
    incomingData: MultiselectQuestionUpdate,
    requestingUser: User,
  ): Promise<MultiselectQuestion> {
    const {
      id,
      isExclusive,
      jurisdiction,
      jurisdictions,
      links,
      multiselectOptions,
      name,
      options,
      status,
      ...updateData
    } = incomingData;

    const currentMultiselectQuestion = await this.findOne(id);

    const rawJurisdiction = await this.prisma.jurisdictions.findFirstOrThrow({
      select: {
        featureFlags: true,
        id: true,
      },
      where: {
        id: jurisdiction
          ? jurisdiction.id
          : jurisdictions?.at(0)
          ? jurisdictions?.at(0)?.id
          : undefined,
      },
    });

    await this.permissionService.canOrThrow(
      requestingUser,
      'multiselectQuestion',
      permissionActions.update,
      {
        id: id,
        jurisdictionId: rawJurisdiction.id,
      },
    );

    const enableV2MSQ = doJurisdictionHaveFeatureFlagSet(
      rawJurisdiction as Jurisdiction,
      FeatureFlagEnum.enableV2MSQ,
    );

    if (enableV2MSQ) {
      this.validateStatusStateTransition(
        currentMultiselectQuestion.status,
        status,
      );
    }

    // Wrap the deletion and update in one transaction so that multiselectOptions aren't lost if update fails
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const transactions = await this.prisma.$transaction([
      // delete the multiselect options
      this.prisma.multiselectOptions.deleteMany({
        where: {
          multiselectQuestionId: id,
        },
      }),
      // update the multiselect question
      this.prisma.multiselectQuestions.update({
        data: {
          ...updateData,
          id: undefined,
          jurisdiction: {
            connect: { id: rawJurisdiction.id },
          },
          links: links
            ? (links as unknown as Prisma.InputJsonArray)
            : undefined,
          // TODO: Can be removed after MSQ refactor
          options: options
            ? (options as unknown as Prisma.InputJsonArray)
            : undefined,

          // TODO: Use of the feature flag is temporary until after MSQ refactor
          isExclusive: enableV2MSQ ? isExclusive : false,
          name: enableV2MSQ ? name : updateData.text,
          status: enableV2MSQ ? status : MultiselectQuestionsStatusEnum.draft,

          multiselectOptions: enableV2MSQ
            ? {
                createMany: {
                  data: multiselectOptions?.map((option) => {
                    delete option['id'];
                    // TODO: The following 5 deletes can be removed after MSQ refactor
                    delete option['collectAddress'];
                    delete option['collectName'];
                    delete option['collectRelationship'];
                    delete option['exclusive'];
                    delete option['text'];
                    return {
                      ...option,
                      links: option.links as unknown as Prisma.InputJsonArray,
                      name: option.name,
                    };
                  }),
                },
              }
            : undefined,
        },
        where: {
          id: id,
        },
        include: includeViews.fundamentals,
      }),
    ]);
    const rawMultiselectQuestion = transactions[
      transactions.length - 1
    ] as unknown as MultiselectQuestion;

    // TODO: Can be removed after MSQ refactor
    rawMultiselectQuestion['jurisdictions'] = [
      rawMultiselectQuestion.jurisdiction,
    ];

    return mapTo(MultiselectQuestion, rawMultiselectQuestion);
  }

  /*
    this will delete a multiselect question
  */
  async delete(
    multiselectQuestionId: string,
    requestingUser: User,
  ): Promise<SuccessDTO> {
    const currentMultiselectQuestion = await this.findOne(
      multiselectQuestionId,
    );

    const enableV2MSQ = doJurisdictionHaveFeatureFlagSet(
      currentMultiselectQuestion.jurisdiction as Jurisdiction,
      FeatureFlagEnum.enableV2MSQ,
    );

    await this.permissionService.canOrThrow(
      requestingUser,
      'multiselectQuestion',
      permissionActions.delete,
      {
        id: multiselectQuestionId,
        jurisdictionId: currentMultiselectQuestion.jurisdiction.id,
      },
    );

    if (enableV2MSQ) {
      this.validateStatusStateTransition(
        currentMultiselectQuestion.status,
        currentMultiselectQuestion.status,
      );
    }

    await this.prisma.multiselectQuestions.delete({
      where: {
        id: multiselectQuestionId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }

  async findByListingId(listingId: string): Promise<MultiselectQuestion[]> {
    let rawMultiselectQuestions =
      await this.prisma.multiselectQuestions.findMany({
        include: includeViews.base,
        where: {
          listings: {
            some: {
              listingId,
            },
          },
        },
      });

    // TODO: Temporary until front end accepts MSQ refactor
    rawMultiselectQuestions = rawMultiselectQuestions.map((msq) => ({
      ...msq,
      jurisdictions: [{ id: msq.jurisdictionId }],
    }));
    return mapTo(MultiselectQuestion, rawMultiselectQuestions);
  }

  /**
    validates that the attempted status state transition is allowed in the state machine,
    if not it throws a custom error
  */
  validateStatusStateTransition(
    currentState: MultiselectQuestionsStatusEnum,
    nextState: MultiselectQuestionsStatusEnum,
  ) {
    if (currentState === nextState) {
      if (
        nextState === MultiselectQuestionsStatusEnum.active ||
        nextState === MultiselectQuestionsStatusEnum.toRetire ||
        nextState === MultiselectQuestionsStatusEnum.retired
      ) {
        throw new BadRequestException(
          `A multiselect question of status '${nextState}' cannot be edited or deleted`,
        );
      }
      return;
    }

    switch (currentState) {
      case MultiselectQuestionsStatusEnum.draft:
        if (nextState !== MultiselectQuestionsStatusEnum.visible) {
          throw new BadRequestException(
            "status 'draft' can only change to 'visible'",
          );
        }
        break;
      case MultiselectQuestionsStatusEnum.visible:
        if (
          nextState !== MultiselectQuestionsStatusEnum.draft &&
          nextState !== MultiselectQuestionsStatusEnum.active
        ) {
          throw new BadRequestException(
            "status 'visible' can only change to 'draft' or 'active'",
          );
        }
        break;
      case MultiselectQuestionsStatusEnum.active:
        if (
          nextState !== MultiselectQuestionsStatusEnum.toRetire &&
          nextState !== MultiselectQuestionsStatusEnum.retired
        ) {
          throw new BadRequestException(
            "status 'active' can only change to 'toRetire' or 'retired'",
          );
        }
        break;

      case MultiselectQuestionsStatusEnum.toRetire:
        if (
          nextState !== MultiselectQuestionsStatusEnum.retired &&
          nextState !== MultiselectQuestionsStatusEnum.active
        ) {
          throw new BadRequestException(
            "status 'toRetire' can only change to 'retired'",
          );
        }
        break;

      case MultiselectQuestionsStatusEnum.retired:
        throw new BadRequestException("status 'retired' cannot be changed");

      default:
        throw new BadRequestException(
          `current status is not of type MultiselectQuestionsStatusEnum: ${currentState}`,
        );
    }
  }

  /**
    moves a multiselect question to a new status state
  */
  async statusStateTransition(
    multiselectQuestion: MultiselectQuestion,
    status: MultiselectQuestionsStatusEnum,
  ) {
    this.validateStatusStateTransition(multiselectQuestion.status, status);

    await this.prisma.multiselectQuestions.update({
      data: {
        status: status,
      },
      where: {
        id: multiselectQuestion.id,
      },
    });
  }

  /**
    actives any visible multiselect questions
  */
  async activateMany(
    multiselectQuestions: MultiselectQuestion[],
  ): Promise<SuccessDTO> {
    if (
      multiselectQuestions.some(
        (multiselectQuestion) =>
          multiselectQuestion.status === MultiselectQuestionsStatusEnum.draft ||
          multiselectQuestion.status === MultiselectQuestionsStatusEnum.retired,
      )
    ) {
      throw new BadRequestException(
        'only multiselect questions in visible, active or toRetire status can be associated with a listing being published',
      );
    }
    // What if one fails?
    for (const multiselectQuestion of multiselectQuestions) {
      if (
        multiselectQuestion.status === MultiselectQuestionsStatusEnum.visible
      ) {
        await this.statusStateTransition(
          multiselectQuestion,
          MultiselectQuestionsStatusEnum.active,
        );
      }
    }
    return {
      success: true,
    } as SuccessDTO;
  }

  async reActivate(
    multiselectQuestionId: string,
    requestingUser: User,
  ): Promise<SuccessDTO> {
    const multiselectQuestion = await this.findOne(multiselectQuestionId);

    await this.permissionService.canOrThrow(
      requestingUser,
      'multiselectQuestion',
      permissionActions.update,
      {
        id: multiselectQuestionId,
        jurisdictionId: multiselectQuestion.jurisdiction.id,
      },
    );

    await this.statusStateTransition(
      multiselectQuestion,
      MultiselectQuestionsStatusEnum.active,
    );

    return {
      success: true,
    } as SuccessDTO;
  }

  /**
    attempts to move a multiselect question to retired status,
    if it is still associated with open listings it is moved to toRetire
  */
  async retire(
    multiselectQuestionId: string,
    requestingUser: User,
  ): Promise<SuccessDTO> {
    const rawMultiselectQuestion =
      await this.prisma.multiselectQuestions.findUnique({
        include: {
          jurisdiction: true,
          listings: {
            include: {
              listings: {
                select: {
                  status: true,
                },
              },
            },
          },
        },
        where: {
          id: multiselectQuestionId,
        },
      });

    if (!rawMultiselectQuestion) {
      throw new NotFoundException(
        `multiselectQuestionId ${multiselectQuestionId} was requested but not found`,
      );
    }

    await this.permissionService.canOrThrow(
      requestingUser,
      'multiselectQuestion',
      permissionActions.update,
      {
        id: multiselectQuestionId,
        jurisdictionId: rawMultiselectQuestion.jurisdiction.id,
      },
    );

    const multiselectQuestion = mapTo(
      MultiselectQuestion,
      rawMultiselectQuestion,
    );

    if (
      rawMultiselectQuestion.listings.every(
        ({ listings }) => listings.status === ListingsStatusEnum.closed,
      )
    ) {
      await this.statusStateTransition(
        multiselectQuestion,
        MultiselectQuestionsStatusEnum.retired,
      );
    } else {
      await this.statusStateTransition(
        multiselectQuestion,
        MultiselectQuestionsStatusEnum.toRetire,
      );
    }

    return {
      success: true,
    } as SuccessDTO;
  }

  /**
    runs the job to auto retire multiselect questions that are waiting to be retired
  */
  async retireMultiselectQuestions(): Promise<SuccessDTO> {
    this.logger.warn('retireMultiselectQuestionsCron job running');
    await this.cronJobService.markCronJobAsStarted('MSQ_RETIRE_CRON_JOB');

    const res = await this.prisma.multiselectQuestions.updateMany({
      data: {
        status: MultiselectQuestionsStatusEnum.retired,
      },
      where: {
        listings: {
          every: {
            listings: {
              status: ListingsStatusEnum.closed,
            },
          },
        },
        status: MultiselectQuestionsStatusEnum.toRetire,
      },
    });

    this.logger.warn(
      `Changed the status of ${res?.count} multiselect questions`,
    );

    return {
      success: true,
    };
  }
}
