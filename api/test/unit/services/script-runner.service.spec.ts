import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  LanguagesEnum,
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { Request as ExpressRequest } from 'express';
import { User } from '../../../src/dtos/users/user.dto';
import { AmiChartService } from '../../../src/services/ami-chart.service';
import { EmailService } from '../../../src/services/email.service';
import { FeatureFlagService } from '../../../src/services/feature-flag.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { ScriptRunnerService } from '../../../src/services/script-runner.service';
import { MultiselectQuestionService } from '../../../src/services/multiselect-question.service';

describe('Testing script runner service', () => {
  let service: ScriptRunnerService;
  let prisma: PrismaService;
  let emailService: EmailService;
  let multiselectQuestionService: MultiselectQuestionService;
  let mockConsoleLog;

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScriptRunnerService,
        PrismaService,
        {
          provide: EmailService,
          useValue: {
            applicationScriptRunner: jest.fn(),
          },
        },
        AmiChartService,
        FeatureFlagService,
        JurisdictionService,
        Logger,
        {
          provide: MultiselectQuestionService,
          useValue: {
            create: jest.fn().mockResolvedValue({
              id: 'new id',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ScriptRunnerService>(ScriptRunnerService);
    emailService = module.get<EmailService>(EmailService);
    prisma = module.get<PrismaService>(PrismaService);
    multiselectQuestionService = module.get<MultiselectQuestionService>(
      MultiselectQuestionService,
    );
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
  });

  it('should add lottery translations', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.translations.findFirst = jest
      .fn()
      .mockResolvedValue({ id: randomUUID(), translations: {} });
    prisma.translations.update = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'add lottery translations';

    const res = await service.addLotteryTranslations({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
  });

  it('should add lottery translations and create if empty', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.translations.findMany = jest.fn().mockResolvedValue(undefined);
    prisma.translations.update = jest.fn().mockResolvedValue(null);
    prisma.translations.create = jest.fn().mockReturnValue({
      language: LanguagesEnum.en,
      translations: {},
      jurisdictions: undefined,
    });

    const id = randomUUID();
    const scriptName = 'add lottery translations create if empty';

    const res = await service.addLotteryTranslationsCreateIfEmpty({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });

    expect(prisma.translations.create).toHaveBeenCalled();
  });

  it('should bulk resend application confirmations', async () => {
    const id = randomUUID();
    const scriptName = 'bulk application resend';
    const listingId = randomUUID();
    const jurisdictionId = randomUUID();
    const applicationId = randomUUID();

    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.listings.findUnique = jest.fn().mockResolvedValue({
      id: listingId,
      jurisdictions: {
        id: jurisdictionId,
      },
    });
    prisma.applications.findMany = jest.fn().mockResolvedValue([
      {
        id: applicationId,
        language: 'en',
        confirmationCode: 'conf code',
        applicant: {
          id: randomUUID(),
          emailAddress: 'example email address',
          firstName: 'example first name',
          middleName: 'example middle name',
          lastName: 'example last name',
        },
      },
    ]);

    const res = await service.bulkApplicationResend(
      {
        user: {
          id,
        } as unknown as User,
      } as unknown as ExpressRequest,
      {
        listingId,
      },
    );

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
    expect(prisma.listings.findUnique).toHaveBeenCalledWith({
      select: {
        id: true,
        jurisdictions: {
          select: {
            id: true,
          },
        },
      },
      where: {
        id: listingId,
      },
    });
    expect(prisma.applications.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        language: true,
        confirmationCode: true,
        applicant: {
          select: {
            id: true,
            emailAddress: true,
            firstName: true,
            middleName: true,
            lastName: true,
          },
        },
      },
      where: {
        listingId: listingId,
        deletedAt: null,
        applicant: {
          emailAddress: {
            not: null,
          },
        },
      },
    });
    expect(emailService.applicationScriptRunner).toHaveBeenCalledWith(
      {
        id: applicationId,
        language: 'en',
        confirmationCode: 'conf code',
        applicant: {
          id: expect.anything(),
          emailAddress: 'example email address',
          firstName: 'example first name',
          middleName: 'example middle name',
          lastName: 'example last name',
        },
      },
      { id: jurisdictionId },
    );
  });

  it('should build ami chart import object', async () => {
    const id = randomUUID();
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.amiChart.create = jest.fn().mockResolvedValue(null);

    const name = 'example name';
    const scriptName = `AMI Chart ${name}`;
    const jurisdictionId = 'example jurisdictionId';
    const valueItem =
      '15 18400 21000 23650 26250 28350 30450 32550 34650\n30 39150 44750 50350 55900 60400 64850 69350 73800\n50 65250 74600 83900 93200 100700 108150 115600 123050';
    const res = await service.amiChartImport(
      {
        user: {
          id,
        } as unknown as User,
      } as unknown as ExpressRequest,
      {
        values: valueItem,
        name,
        jurisdictionId,
      },
    );
    expect(res.success).toEqual(true);
    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
    expect(prisma.amiChart.create).toHaveBeenCalledWith({
      data: {
        name,
        items: [
          {
            percentOfAmi: 15,
            householdSize: 1,
            income: 18400,
          },
          {
            percentOfAmi: 15,
            householdSize: 2,
            income: 21000,
          },
          {
            percentOfAmi: 15,
            householdSize: 3,
            income: 23650,
          },
          {
            percentOfAmi: 15,
            householdSize: 4,
            income: 26250,
          },
          {
            percentOfAmi: 15,
            householdSize: 5,
            income: 28350,
          },
          {
            percentOfAmi: 15,
            householdSize: 6,
            income: 30450,
          },
          {
            percentOfAmi: 15,
            householdSize: 7,
            income: 32550,
          },
          {
            percentOfAmi: 15,
            householdSize: 8,
            income: 34650,
          },
          {
            percentOfAmi: 30,
            householdSize: 1,
            income: 39150,
          },
          {
            percentOfAmi: 30,
            householdSize: 2,
            income: 44750,
          },
          {
            percentOfAmi: 30,
            householdSize: 3,
            income: 50350,
          },
          {
            percentOfAmi: 30,
            householdSize: 4,
            income: 55900,
          },
          {
            percentOfAmi: 30,
            householdSize: 5,
            income: 60400,
          },
          {
            percentOfAmi: 30,
            householdSize: 6,
            income: 64850,
          },
          {
            percentOfAmi: 30,
            householdSize: 7,
            income: 69350,
          },
          {
            percentOfAmi: 30,
            householdSize: 8,
            income: 73800,
          },
          {
            percentOfAmi: 50,
            householdSize: 1,
            income: 65250,
          },
          {
            percentOfAmi: 50,
            householdSize: 2,
            income: 74600,
          },
          {
            percentOfAmi: 50,
            householdSize: 3,
            income: 83900,
          },
          {
            percentOfAmi: 50,
            householdSize: 4,
            income: 93200,
          },
          {
            percentOfAmi: 50,
            householdSize: 5,
            income: 100700,
          },
          {
            percentOfAmi: 50,
            householdSize: 6,
            income: 108150,
          },
          {
            percentOfAmi: 50,
            householdSize: 7,
            income: 115600,
          },
          {
            percentOfAmi: 50,
            householdSize: 8,
            income: 123050,
          },
        ],
        jurisdictions: {
          connect: {
            id: jurisdictionId,
          },
        },
      },
      include: {
        jurisdictions: true,
      },
    });
  });

  it('should update existing ami chart', async () => {
    const id = randomUUID();
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.amiChart.findUnique = jest.fn().mockResolvedValue({
      id: id,
      name: 'example name',
    });
    prisma.amiChart.update = jest.fn().mockResolvedValue(null);

    const name = 'example name';
    const scriptName = `AMI Chart ${id} update ${new Date()}`;
    const valueItem =
      '15 18400 21000 23650 26250 28350 30450 32550 34650\n30 39150 44750 50350 55900 60400 64850 69350 73800\n50 65250 74600 83900 93200 100700 108150 115600 123050';
    const res = await service.amiChartUpdateImport(
      {
        user: {
          id,
        } as unknown as User,
      } as unknown as ExpressRequest,
      {
        amiId: id,
        values: valueItem,
      },
    );
    expect(res.success).toEqual(true);
    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
    expect(prisma.amiChart.update).toHaveBeenCalledWith({
      data: {
        id: undefined,
        items: [
          {
            percentOfAmi: 15,
            householdSize: 1,
            income: 18400,
          },
          {
            percentOfAmi: 15,
            householdSize: 2,
            income: 21000,
          },
          {
            percentOfAmi: 15,
            householdSize: 3,
            income: 23650,
          },
          {
            percentOfAmi: 15,
            householdSize: 4,
            income: 26250,
          },
          {
            percentOfAmi: 15,
            householdSize: 5,
            income: 28350,
          },
          {
            percentOfAmi: 15,
            householdSize: 6,
            income: 30450,
          },
          {
            percentOfAmi: 15,
            householdSize: 7,
            income: 32550,
          },
          {
            percentOfAmi: 15,
            householdSize: 8,
            income: 34650,
          },
          {
            percentOfAmi: 30,
            householdSize: 1,
            income: 39150,
          },
          {
            percentOfAmi: 30,
            householdSize: 2,
            income: 44750,
          },
          {
            percentOfAmi: 30,
            householdSize: 3,
            income: 50350,
          },
          {
            percentOfAmi: 30,
            householdSize: 4,
            income: 55900,
          },
          {
            percentOfAmi: 30,
            householdSize: 5,
            income: 60400,
          },
          {
            percentOfAmi: 30,
            householdSize: 6,
            income: 64850,
          },
          {
            percentOfAmi: 30,
            householdSize: 7,
            income: 69350,
          },
          {
            percentOfAmi: 30,
            householdSize: 8,
            income: 73800,
          },
          {
            percentOfAmi: 50,
            householdSize: 1,
            income: 65250,
          },
          {
            percentOfAmi: 50,
            householdSize: 2,
            income: 74600,
          },
          {
            percentOfAmi: 50,
            householdSize: 3,
            income: 83900,
          },
          {
            percentOfAmi: 50,
            householdSize: 4,
            income: 93200,
          },
          {
            percentOfAmi: 50,
            householdSize: 5,
            income: 100700,
          },
          {
            percentOfAmi: 50,
            householdSize: 6,
            income: 108150,
          },
          {
            percentOfAmi: 50,
            householdSize: 7,
            income: 115600,
          },
          {
            percentOfAmi: 50,
            householdSize: 8,
            income: 123050,
          },
        ],
        jurisdictions: undefined,
        name: name,
      },
      include: {
        jurisdictions: true,
      },
      where: {
        id: id,
      },
    });
  });

  it('should transfer data', async () => {
    prisma.listings.updateMany = jest.fn().mockResolvedValue({ count: 1 });

    const id = randomUUID();
    const res = await service.optOutExistingLotteries({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.listings.updateMany).toHaveBeenCalledWith({
      data: { lotteryOptIn: false },
      where: {
        reviewOrderType: ReviewOrderTypeEnum.lottery,
        lotteryOptIn: null,
      },
    });
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'updated lottery opt in for 1 listings',
    );
  });

  it('should hide programs from listing detail page', async () => {
    const id = randomUUID();
    const scriptName = 'hideProgramsFromListings';

    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.multiselectQuestions.updateMany = jest.fn().mockResolvedValue(null);

    const res = await service.hideProgramsFromListings({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
    expect(prisma.multiselectQuestions.updateMany).toHaveBeenCalledWith({
      data: {
        hideFromListing: true,
      },
      where: {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      },
    });
  });

  it('should create 16 feature flags', async () => {
    const id = randomUUID();
    const scriptName = 'add feature flags';

    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.featureFlags.create = jest.fn().mockResolvedValue({ id: 'new id' });

    const res = await service.addFeatureFlags({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
    expect(prisma.featureFlags.create).toHaveBeenCalledTimes(17);
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Number of feature flags created: 17',
    );
  });

  it('should migrate preferences and programs to the multiselect question table', async () => {
    const id = randomUUID();
    const scriptName = 'migrate Detroit to multiselect questions';

    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.$queryRawUnsafe = jest.fn().mockResolvedValue([
      {
        id: 'example id',
        title: 'example title',
        subtitle: 'example subtitle',
        description: 'example description',
        links: [{ url: 'https://www.example.com', title: 'Link Title' }],
        form_metadata: {
          key: 'liveWork',
          options: [
            { key: 'live', extraData: [] },
            { key: 'work', extraData: [] },
          ],
          hideFromListing: true,
        },
        name: 'example name',
        listing_id: 'example listing_id',
        ordinal: 1,
      },
    ]);
    prisma.multiselectQuestions.create = jest.fn().mockResolvedValue({
      id: 'new id',
    });
    prisma.listings.update = jest.fn().mockResolvedValue(null);

    const res = await service.migrateDetroitToMultiselectQuestions({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
    expect(prisma.$queryRawUnsafe).toHaveBeenCalledTimes(5);
    expect(multiselectQuestionService.create).toHaveBeenCalledTimes(2);
    expect(prisma.listings.update).toHaveBeenCalledWith({
      data: {
        listingMultiselectQuestions: {
          create: {
            ordinal: 1,
            multiselectQuestionId: 'new id',
          },
        },
      },
      where: {
        id: 'example listing_id',
      },
    });
  }, 100000);

  it('should migrate multiselect data to refactored schema', async () => {
    const id = randomUUID();
    const scriptName = 'migrate multiselect data to refactor';

    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.multiselectQuestions.findMany = jest.fn().mockResolvedValue([
      {
        id: 'question1',
        listings: [{ listings: { status: ListingsStatusEnum.active } }],
        optOutText: 'No',
        options: [{ exclusive: true, ordinal: 1, text: 'option name' }],
      },
    ]);
    prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);
    prisma.multiselectOptions.createMany = jest.fn().mockResolvedValue(null);
    prisma.multiselectOptions.create = jest.fn().mockResolvedValue(null);

    const res = await service.migrateMultiselectDataToRefactor({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });

    expect(prisma.multiselectQuestions.findMany).toBeCalledWith({
      include: {
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
    });

    expect(prisma.multiselectQuestions.update).toHaveBeenCalledWith({
      data: { isExclusive: true, status: 'active' },
      where: { id: 'question1' },
    });
    expect(prisma.multiselectOptions.createMany).toHaveBeenCalledWith({
      data: [
        {
          isOptOut: false,
          multiselectQuestionId: 'question1',
          name: 'option name',
          ordinal: 1,
        },
      ],
    });
    expect(prisma.multiselectOptions.create).toHaveBeenCalledWith({
      data: {
        isOptOut: true,
        multiselectQuestionId: 'question1',
        name: 'No',
        ordinal: 2,
      },
    });
  });

  it('should migrate application msq selection data to refactored schema', async () => {
    const id = randomUUID();
    const scriptName =
      'migrate multiselect application data to refactor with page 1 of size 5000';

    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);
    prisma.applications.findMany = jest.fn().mockResolvedValue([
      {
        id: 'application1',
        listings: { jurisdictions: { name: 'jurisdiction name' } },
        preferences: [
          {
            claimed: true,
            key: 'questiom name',
            multiselectQuestionId: 'question1',
            options: [
              {
                checked: true,
                extraData: [
                  {
                    key: 'addressHolderAddress',
                    value: {
                      city: 'city',
                      state: 'state',
                      street: 'street',
                      zipCode: 'zipCode',
                    },
                  },
                  {
                    key: 'addressHolderName',
                    value: 'name',
                  },
                  {
                    key: 'addressHolderRelationship',
                    value: 'spouse',
                  },
                  {
                    key: 'geocodingVerified',
                    value: true,
                  },
                ],
                key: 'option name',
              },
            ],
          },
        ],
        programs: [],
      },
    ]);
    prisma.multiselectQuestions.findFirst = jest.fn().mockResolvedValue({
      id: 'question1',
      multiselectOptions: [{ id: 'option1', ordinal: 1, name: 'option name' }],
    });
    prisma.address.create = jest.fn().mockResolvedValue({ id: 'address1' });
    prisma.applicationSelections.create = jest.fn().mockResolvedValue(null);

    const res = await service.migrateMultiselectApplicationDataToRefactor({
      user: {
        id,
      } as unknown as User,
    } as unknown as ExpressRequest);

    expect(res.success).toBe(true);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });

    expect(prisma.applications.findMany).toBeCalledWith({
      include: {
        listings: {
          include: {
            jurisdictions: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      skip: 0,
      take: 5_000,
      orderBy: { createdAt: 'asc' },
    });

    expect(prisma.multiselectQuestions.findFirst).toHaveBeenCalledWith({
      include: { multiselectOptions: true },
      where: { id: 'question1' },
    });

    expect(prisma.applicationSelections.create).toHaveBeenCalledWith({
      data: {
        applicationId: 'application1',
        hasOptedOut: false,
        multiselectQuestionId: 'question1',
        selections: {
          createMany: {
            data: [
              {
                addressHolderAddressId: 'address1',
                addressHolderName: 'name',
                addressHolderRelationship: 'spouse',
                isGeocodingVerified: true,
                multiselectOptionId: 'option1',
              },
            ],
          },
        },
      },
    });
  });

  // | ---------- HELPER TESTS BELOW ---------- | //
  it('should mark script run as started if no script run present in db', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue(null);
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt';

    await service.markScriptAsRunStart(scriptName, {
      id,
    } as unknown as User);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).toHaveBeenCalledWith({
      data: {
        scriptName,
        triggeringUser: id,
      },
    });
  });

  it('should error if script run is in progress or failed', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
      didScriptRun: false,
    });
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt 2';

    await expect(
      async () =>
        await service.markScriptAsRunStart(scriptName, {
          id,
        } as unknown as User),
    ).rejects.toThrowError(
      `${scriptName} has an attempted run and it failed, or is in progress. If it failed, please delete the db entry and try again`,
    );

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).not.toHaveBeenCalled();
  });

  it('should error if script run already succeeded', async () => {
    prisma.scriptRuns.findUnique = jest.fn().mockResolvedValue({
      id: randomUUID(),
      didScriptRun: true,
    });
    prisma.scriptRuns.create = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt 3';

    await expect(
      async () =>
        await service.markScriptAsRunStart(scriptName, {
          id,
        } as unknown as User),
    ).rejects.toThrowError(`${scriptName} has already been run and succeeded`);

    expect(prisma.scriptRuns.findUnique).toHaveBeenCalledWith({
      where: {
        scriptName,
      },
    });
    expect(prisma.scriptRuns.create).not.toHaveBeenCalled();
  });

  it('should mark script run as started if no script run present in db', async () => {
    prisma.scriptRuns.update = jest.fn().mockResolvedValue(null);

    const id = randomUUID();
    const scriptName = 'new run attempt 4';

    await service.markScriptAsComplete(scriptName, {
      id,
    } as unknown as User);

    expect(prisma.scriptRuns.update).toHaveBeenCalledWith({
      data: {
        didScriptRun: true,
        triggeringUser: id,
      },
      where: {
        scriptName,
      },
    });
  });

  describe('migrateDetroitToMultiselectQuestions helpers', () => {
    const translations = {
      generalCore: {
        'application.type.core.translationKey': 'general core translation',
        't.preferNotToSay': 'general core prefer not to say',
      },
      generalPartners: {
        'application.type.partners.translationKey':
          'general partners translation',
      },
      generalPublic: {
        'application.type.public.translationKey': 'general public translation',
      },
      detroitCore: {
        'application.type.core.translationKey': 'detroit core translation',
      },
      detroitPartners: {
        'application.type.partners.translationKey':
          'detroit partners translation',
      },
      detroitPublic: {
        'application.type.public.translationKey': 'detroit public translation',
        'application.preferences.liveWork.live.label': 'Live in city',
        'application.preferences.liveWork.work.label': 'Work in city',
        'application.preferences.PBV.residency.label': 'Residency',
        'application.preferences.PBV.homeless.label': 'Homeless',
        'application.preferences.PBV.homeless.description':
          'Unhoused or in temporary housing',
        'application.preferences.PBV.noneApplyButConsider.label':
          'None Apply But Consider',
        'application.preferences.PBV.doNotConsider.label': 'Do Not Consider',
      },
    };

    describe('test resolvehideFromListing', () => {
      it('should find hideFromListing in object and return true', () => {
        const pref = { form_metadata: { hideFromListing: true } };

        const res = service.resolveHideFromListings(pref);

        expect(res).toBe(true);
      });

      it('should find hideFromListing in object and return false', () => {
        const pref = { form_metadata: { hideFromListing: false } };

        const res = service.resolveHideFromListings(pref);

        expect(res).toBe(false);
      });

      it('should not find hideFromListing in object and return null', () => {
        const pref1 = {};

        const res1 = service.resolveHideFromListings(pref1);

        expect(res1).toBeNull();

        const pref2 = { form_metadata: {} };

        const res2 = service.resolveHideFromListings(pref2);

        expect(res2).toBeNull();
      });
    });

    describe('test resolveOptionValues', () => {
      it('should resolve simple option values', () => {
        const formMetaData = {
          key: 'liveWork',
          options: [
            { key: 'live', extraData: [] },
            { key: 'work', extraData: [] },
          ],
        };

        const res = service.resolveOptionValues(
          formMetaData,
          'preferences',
          'Detroit',
          translations,
        );

        expect(res).toStrictEqual({
          optOutText: null,
          options: [
            { ordinal: 1, text: 'Live in city' },
            { ordinal: 2, text: 'Work in city' },
          ],
        });
      });

      it('should resolve complex option values', () => {
        const formMetaData = {
          key: 'PBV',
          options: [
            {
              key: 'residency',
              extraData: [
                { key: 'name', type: 'text' },
                { key: 'address', type: 'address' },
              ],
            },
            { key: 'homeless', extraData: [], description: true },
            {
              key: 'noneApplyButConsider',
              exclusive: true,
              extraData: [],
            },
            {
              key: 'doNotConsider',
              exclusive: true,
              extraData: [],
              description: false,
            },
          ],
          hideGenericDecline: true,
        };

        const res = service.resolveOptionValues(
          formMetaData,
          'preferences',
          'Detroit',
          translations,
        );

        expect(res).toStrictEqual({
          optOutText: 'Do Not Consider',
          options: [
            { ordinal: 1, text: 'Residency', collectAddress: true },
            {
              ordinal: 2,
              text: 'Homeless',
              description: 'Unhoused or in temporary housing',
            },
            { ordinal: 3, text: 'None Apply But Consider', exclusive: true },
          ],
        });
      });
    });

    describe('test getTranslated', () => {
      it('should return no translation when no searchkey is matched', () => {
        const res = service.getTranslated('', '', '', '', translations);

        expect(res).toBe('no translation');
      });

      it('should return preferNotToSay when translationKey is preferNotToSay', () => {
        const res = service.getTranslated(
          '',
          '',
          'preferNotToSay',
          '',
          translations,
        );

        expect(res).toBe('general core prefer not to say');
      });

      it('should return jurisdiction specific translation if found', () => {
        const res = service.getTranslated(
          'type',
          'core',
          'translationKey',
          'Detroit',
          translations,
        );

        expect(res).toBe('detroit core translation');
      });

      it('should return generic translation if jurisdiction not found', () => {
        const res = service.getTranslated(
          'type',
          'core',
          'translationKey',
          'juris',
          translations,
        );

        expect(res).toBe('general core translation');
      });

      it('should return translation based on full searchkey', () => {
        const generalPartnersRes = service.getTranslated(
          'type',
          'partners',
          'translationKey',
          '',
          translations,
        );

        expect(generalPartnersRes).toBe('general partners translation');

        const generalPublicRes = service.getTranslated(
          'type',
          'public',
          'translationKey',
          '',
          translations,
        );

        expect(generalPublicRes).toBe('general public translation');

        const detroitPartnersRes = service.getTranslated(
          'type',
          'partners',
          'translationKey',
          'Detroit',
          translations,
        );

        expect(detroitPartnersRes).toBe('detroit partners translation');

        const detroitPublicRes = service.getTranslated(
          'type',
          'public',
          'translationKey',
          'Detroit',
          translations,
        );

        expect(detroitPublicRes).toBe('detroit public translation');
      });
    });
  });
});
