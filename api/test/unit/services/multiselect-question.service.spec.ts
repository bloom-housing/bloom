import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../../src/services/prisma.service';
import { MultiselectQuestionService } from '../../../src/services/multiselect-question.service';
import { MultiselectQuestionCreate } from '../../../src/dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionUpdate } from '../../../src/dtos/multiselect-questions/multiselect-question-update.dto';
import {
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
} from '@prisma/client';
import { MultiselectQuestionQueryParams } from '../../../src/dtos/multiselect-questions/multiselect-question-query-params.dto';
import { Compare } from '../../../src/dtos/shared/base-filter.dto';
import { randomUUID } from 'crypto';
import { FeatureFlagEnum } from '../../../src/enums/feature-flags/feature-flags-enum';

export const mockMultiselectQuestion = (
  position: number,
  date: Date,
  section?: MultiselectQuestionsApplicationSectionEnum,
  enableV2MSQ = false,
) => {
  return {
    id: randomUUID(),
    createdAt: date,
    updatedAt: date,
    text: `text ${position}`,
    subText: `subText ${position}`,
    description: `description ${position}`,
    links: [],
    options: [],
    optOutText: `optOutText ${position}`,
    hideFromListing: false,
    applicationSection:
      section ?? MultiselectQuestionsApplicationSectionEnum.programs,
    jurisdiction: {
      name: `jurisdiction${position}`,
      id: randomUUID(),
      featureFlags: [
        { name: FeatureFlagEnum.enableV2MSQ, active: enableV2MSQ },
      ],
    },
    isExclusive: enableV2MSQ ? true : false,
    name: enableV2MSQ ? `name ${position}` : `text ${position}`,
    status: enableV2MSQ
      ? MultiselectQuestionsStatusEnum.visible
      : MultiselectQuestionsStatusEnum.draft,
    multiselectOptions: [],
  };
};

describe('Testing multiselect question service', () => {
  let service: MultiselectQuestionService;
  let prisma: PrismaService;

  const mockMultiselectQuestionSet = (numberToCreate: number, date: Date) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockMultiselectQuestion(i, date));
    }
    return toReturn;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Logger, MultiselectQuestionService, PrismaService],
    }).compile();

    service = module.get<MultiselectQuestionService>(
      MultiselectQuestionService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('list', () => {
    it('should get records with empty param call to list()', async () => {
      const date = new Date();
      const mockedValue = mockMultiselectQuestionSet(3, date);
      prisma.multiselectQuestions.findMany = jest
        .fn()
        .mockResolvedValue(mockedValue);

      expect(await service.list({})).toEqual([
        {
          id: mockedValue[0].id,
          createdAt: date,
          updatedAt: date,
          text: 'text 0',
          subText: 'subText 0',
          description: 'description 0',
          links: [],
          options: [],
          optOutText: 'optOutText 0',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          jurisdiction: {
            id: mockedValue[0].jurisdiction.id,
            name: 'jurisdiction0',
            ordinal: undefined,
          },
          jurisdictions: [
            {
              id: mockedValue[0].jurisdiction.id,
              name: 'jurisdiction0',
              ordinal: undefined,
            },
          ],
          multiselectOptions: [],
          // Because enableMSQV2 is off
          isExclusive: false,
          name: 'text 0',
          status: MultiselectQuestionsStatusEnum.draft,
        },
        {
          id: mockedValue[1].id,
          createdAt: date,
          updatedAt: date,
          text: 'text 1',
          subText: 'subText 1',
          description: 'description 1',
          links: [],
          options: [],
          optOutText: 'optOutText 1',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          jurisdiction: {
            id: mockedValue[1].jurisdiction.id,
            name: 'jurisdiction1',
            ordinal: undefined,
          },
          jurisdictions: [
            {
              id: mockedValue[1].jurisdiction.id,
              name: 'jurisdiction1',
              ordinal: undefined,
            },
          ],
          multiselectOptions: [],
          // Because enableMSQV2 is off
          isExclusive: false,
          name: 'text 1',
          status: MultiselectQuestionsStatusEnum.draft,
        },
        {
          id: mockedValue[2].id,
          createdAt: date,
          updatedAt: date,
          text: 'text 2',
          subText: 'subText 2',
          description: 'description 2',
          links: [],
          options: [],
          optOutText: 'optOutText 2',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          jurisdiction: {
            id: mockedValue[2].jurisdiction.id,
            name: 'jurisdiction2',
            ordinal: undefined,
          },
          jurisdictions: [
            {
              id: mockedValue[2].jurisdiction.id,
              name: 'jurisdiction2',
              ordinal: undefined,
            },
          ],
          multiselectOptions: [],
          // Because enableMSQV2 is off
          isExclusive: false,
          name: 'text 2',
          status: MultiselectQuestionsStatusEnum.draft,
        },
      ]);

      expect(prisma.multiselectQuestions.findMany).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
        where: {
          AND: [],
        },
      });
    });

    it('should get records with paramaterized call to list()', async () => {
      const date = new Date();
      const mockedValue = mockMultiselectQuestionSet(3, date);
      prisma.multiselectQuestions.findMany = jest
        .fn()
        .mockResolvedValue(mockedValue);

      const params: MultiselectQuestionQueryParams = {
        filter: [
          {
            $comparison: Compare['='],
            applicationSection:
              MultiselectQuestionsApplicationSectionEnum.programs,
          },
        ],
      };

      expect(await service.list(params)).toEqual([
        {
          id: mockedValue[0].id,
          createdAt: date,
          updatedAt: date,
          text: 'text 0',
          subText: 'subText 0',
          description: 'description 0',
          links: [],
          options: [],
          optOutText: 'optOutText 0',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          jurisdiction: {
            id: mockedValue[0].jurisdiction.id,
            name: 'jurisdiction0',
            ordinal: undefined,
          },
          jurisdictions: [
            {
              id: mockedValue[0].jurisdiction.id,
              name: 'jurisdiction0',
              ordinal: undefined,
            },
          ],
          multiselectOptions: [],
          // Because enableMSQV2 is off
          isExclusive: false,
          name: 'text 0',
          status: MultiselectQuestionsStatusEnum.draft,
        },
        {
          id: mockedValue[1].id,
          createdAt: date,
          updatedAt: date,
          text: 'text 1',
          subText: 'subText 1',
          description: 'description 1',
          links: [],
          options: [],
          optOutText: 'optOutText 1',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          jurisdiction: {
            id: mockedValue[1].jurisdiction.id,
            name: 'jurisdiction1',
            ordinal: undefined,
          },
          jurisdictions: [
            {
              id: mockedValue[1].jurisdiction.id,
              name: 'jurisdiction1',
              ordinal: undefined,
            },
          ],
          multiselectOptions: [],
          // Because enableMSQV2 is off
          isExclusive: false,
          name: 'text 1',
          status: MultiselectQuestionsStatusEnum.draft,
        },
        {
          id: mockedValue[2].id,
          createdAt: date,
          updatedAt: date,
          text: 'text 2',
          subText: 'subText 2',
          description: 'description 2',
          links: [],
          options: [],
          optOutText: 'optOutText 2',
          hideFromListing: false,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          jurisdiction: {
            id: mockedValue[2].jurisdiction.id,
            name: 'jurisdiction2',
            ordinal: undefined,
          },
          jurisdictions: [
            {
              id: mockedValue[2].jurisdiction.id,
              name: 'jurisdiction2',
              ordinal: undefined,
            },
          ],
          multiselectOptions: [],
          // Because enableMSQV2 is off
          isExclusive: false,
          name: 'text 2',
          status: MultiselectQuestionsStatusEnum.draft,
        },
      ]);

      expect(prisma.multiselectQuestions.findMany).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
        where: {
          AND: [
            {
              OR: [
                {
                  applicationSection: {
                    equals: MultiselectQuestionsApplicationSectionEnum.programs,
                  },
                },
              ],
            },
          ],
        },
      });
    });
  });

  describe('findOne', () => {
    it('should get record with call to findOne()', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(3, date);
      prisma.multiselectQuestions.findUnique = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);

      expect(await service.findOne('example Id')).toEqual({
        ...mockedMultiselectQuestion,
        jurisdiction: {
          id: mockedMultiselectQuestion.jurisdiction.id,
          name: 'jurisdiction3',
          ordinal: undefined,
        },
        jurisdictions: [
          {
            id: mockedMultiselectQuestion.jurisdiction.id,
            name: 'jurisdiction3',
            ordinal: undefined,
          },
        ],
      });

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'example Id',
        },
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
      });
    });

    it('should get record with call to findOne() with v2 enabled', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        3,
        date,
        MultiselectQuestionsApplicationSectionEnum.preferences,
        true,
      );
      prisma.multiselectQuestions.findUnique = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);

      expect(await service.findOne('example Id')).toEqual({
        ...mockedMultiselectQuestion,
        jurisdiction: {
          id: mockedMultiselectQuestion.jurisdiction.id,
          name: 'jurisdiction3',
          ordinal: undefined,
        },
      });

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'example Id',
        },
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
      });
    });

    it('should error when nonexistent id is passed to findOne()', async () => {
      prisma.multiselectQuestions.findUnique = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        async () => await service.findOne('example Id'),
      ).rejects.toThrowError();

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'example Id',
        },
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
      });
    });
  });

  describe('create', () => {
    it('should create with call to create()', async () => {
      const date = new Date();
      const mockedValue = mockMultiselectQuestion(1, date);
      prisma.multiselectQuestions.create = jest
        .fn()
        .mockResolvedValue(mockedValue);
      prisma.jurisdictions.findFirstOrThrow = jest
        .fn()
        .mockResolvedValue(mockedValue.jurisdiction);

      const params: MultiselectQuestionCreate = {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description: 'description 1',
        hideFromListing: false,
        jurisdictions: [{ id: mockedValue.jurisdiction.id }],
        links: [],
        options: [],
        optOutText: 'optOutText 1',
        status: MultiselectQuestionsStatusEnum.draft,
        subText: 'subText 1',
        text: 'text 1',
      };

      expect(await service.create(params)).toEqual({
        ...params,
        id: mockedValue.id,
        createdAt: date,
        updatedAt: date,
        jurisdiction: {
          id: mockedValue.jurisdiction.id,
          name: 'jurisdiction1',
          ordinal: undefined,
        },
        jurisdictions: [
          {
            id: mockedValue.jurisdiction.id,
            name: 'jurisdiction1',
            ordinal: undefined,
          },
        ],
        multiselectOptions: [],
        // Because enableMSQV2 is off
        isExclusive: false,
        name: 'text 1',
        status: MultiselectQuestionsStatusEnum.draft,
      });

      delete params['jurisdictions'];
      expect(prisma.multiselectQuestions.create).toHaveBeenCalledWith({
        data: {
          ...params,
          jurisdiction: { connect: { id: mockedValue.jurisdiction.id } },
          multiselectOptions: undefined,
          // Because enableMSQV2 is off
          isExclusive: false,
          name: 'text 1',
          status: MultiselectQuestionsStatusEnum.draft,
        },
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
      });
    });

    it('should create with call to create() with v2 enabled', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        2,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
      );
      prisma.multiselectQuestions.create = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);

      prisma.jurisdictions.findFirstOrThrow = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion.jurisdiction);

      const params: MultiselectQuestionCreate = {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        description: 'description 2',
        isExclusive: true,
        hideFromListing: false,
        jurisdiction: { id: mockedMultiselectQuestion.jurisdiction.id },
        jurisdictions: undefined,
        links: [],
        multiselectOptions: [],
        name: 'name 2',
        options: [],
        optOutText: 'optOutText 2',
        status: MultiselectQuestionsStatusEnum.visible,
        subText: 'subText 2',
        text: 'text 2',
      };

      expect(await service.create(params)).toEqual({
        ...params,
        id: mockedMultiselectQuestion.id,
        createdAt: date,
        updatedAt: date,
        jurisdiction: {
          id: mockedMultiselectQuestion.jurisdiction.id,
          name: 'jurisdiction2',
          ordinal: undefined,
        },
      });

      delete params['jurisdictions'];
      expect(prisma.multiselectQuestions.create).toHaveBeenCalledWith({
        data: {
          ...params,
          jurisdiction: {
            connect: { id: mockedMultiselectQuestion.jurisdiction.id },
          },
          multiselectOptions: {
            createMany: {
              data: [],
            },
          },
        },
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update with call to update()', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(3, date);

      prisma.multiselectQuestions.findUnique = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);
      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue({
        ...mockedMultiselectQuestion,
        text: '',
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        jurisdiction: { name: 'jurisdiction1', id: 'jurisdictionId' },
      });

      prisma.jurisdictions.findFirstOrThrow = jest.fn().mockResolvedValue({
        name: 'jurisdiction1',
        id: 'jurisdictionId',
      });

      const params: MultiselectQuestionUpdate = {
        id: mockedMultiselectQuestion.id,
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        jurisdictions: [{ name: 'jurisdiction1', id: 'jurisdictionId' }],
        status: MultiselectQuestionsStatusEnum.draft,
        text: '',
      };

      expect(await service.update(params)).toEqual({
        ...mockedMultiselectQuestion,
        ...params,
        jurisdiction: {
          id: 'jurisdictionId',
          name: 'jurisdiction1',
          ordinal: undefined,
        },
        jurisdictions: [
          {
            id: 'jurisdictionId',
            name: 'jurisdiction1',
            ordinal: undefined,
          },
        ],
      });

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
        where: {
          id: mockedMultiselectQuestion.id,
        },
      });

      delete params['id'];
      delete params['jurisdictions'];
      expect(prisma.multiselectQuestions.update).toHaveBeenCalledWith({
        data: {
          ...params,
          isExclusive: false,
          links: undefined,
          jurisdiction: { connect: { id: 'jurisdictionId' } },
          multiselectOptions: undefined,
          name: '',
          options: undefined,
        },
        where: {
          id: mockedMultiselectQuestion.id,
        },
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
      });
    });

    it('should update with call to update() with v2 enabled', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        4,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
      );

      prisma.multiselectQuestions.findUnique = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);
      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue({
        ...mockedMultiselectQuestion,
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        isExclusive: false,
        jurisdiction: { name: 'jurisdiction1', id: 'jurisdictionId' },
        jurisdictions: undefined,
        name: 'name change',
        status: MultiselectQuestionsStatusEnum.draft,
        text: '',
      });

      prisma.jurisdictions.findFirstOrThrow = jest.fn().mockResolvedValue({
        name: 'jurisdiction1',
        id: 'jurisdictionId',
        featureFlags: [{ name: FeatureFlagEnum.enableV2MSQ, active: true }],
      });

      const params: MultiselectQuestionUpdate = {
        id: mockedMultiselectQuestion.id,
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        isExclusive: false,
        jurisdiction: { name: 'jurisdiction1', id: 'jurisdictionId' },
        jurisdictions: undefined,
        name: 'name change',
        status: MultiselectQuestionsStatusEnum.draft,
        text: '',
      };

      expect(await service.update(params)).toEqual({
        ...mockedMultiselectQuestion,
        ...params,
        jurisdiction: {
          id: 'jurisdictionId',
          name: 'jurisdiction1',
          ordinal: undefined,
        },
      });

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
        where: {
          id: mockedMultiselectQuestion.id,
        },
      });

      delete params['id'];
      delete params['jurisdictions'];
      expect(prisma.multiselectQuestions.update).toHaveBeenCalledWith({
        data: {
          ...params,
          links: undefined,
          jurisdiction: { connect: { id: 'jurisdictionId' } },
          multiselectOptions: undefined,
          options: undefined,
        },
        where: {
          id: mockedMultiselectQuestion.id,
        },
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
      });
    });

    it('should error when nonexistent id is passed to update()', async () => {
      prisma.multiselectQuestions.findUnique = jest
        .fn()
        .mockResolvedValue(null);
      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);

      const params: MultiselectQuestionUpdate = {
        id: 'example id',
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        jurisdictions: [],
        status: MultiselectQuestionsStatusEnum.draft,
        text: '',
      };

      await expect(
        async () => await service.update(params),
      ).rejects.toThrowError();

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
        where: {
          id: 'example id',
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete with call to delete()', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(5, date);
      prisma.multiselectQuestions.findUnique = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);
      prisma.multiselectQuestions.delete = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);
      const id = mockedMultiselectQuestion.id;

      expect(await service.delete(id)).toEqual({
        success: true,
      });

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
        where: {
          id: id,
        },
      });

      expect(prisma.multiselectQuestions.delete).toHaveBeenCalledWith({
        where: {
          id: id,
        },
      });
    });

    it('should delete with call to delete() with v2 enabled', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        6,
        date,
        MultiselectQuestionsApplicationSectionEnum.preferences,
        true,
      );
      prisma.multiselectQuestions.findUnique = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);
      prisma.multiselectQuestions.delete = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);

      const id = mockedMultiselectQuestion.id;

      expect(await service.delete(id)).toEqual({
        success: true,
      });

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
        where: {
          id: id,
        },
      });

      expect(prisma.multiselectQuestions.delete).toHaveBeenCalledWith({
        where: {
          id: id,
        },
      });
    });
  });

  // describe('validateStatusStateTransition', () => {
  //   describe('draft transitions', () => {});

  //   describe('visible transitions', () => {});

  //   describe('active transitions', () => {});

  //   describe('toRetire transitions', () => {});

  //   describe('retire transitions', () => {});
  // });

  // describe('statusStateTransition', () => {});

  // describe('activateMany', () => {});

  // describe('reActivate', () => {});

  // describe('retire', () => {});

  // describe('retireMultiselectQuestions', () => {});

  describe('markCronJobAsStarted', () => {
    it('should create new cronjob entry if none is present', async () => {
      prisma.cronJob.findFirst = jest.fn().mockResolvedValue(null);
      prisma.cronJob.create = jest.fn().mockResolvedValue(true);

      await service.markCronJobAsStarted('MSQ_RETIRE_CRON_JOB');

      expect(prisma.cronJob.findFirst).toHaveBeenCalledWith({
        where: {
          name: 'MSQ_RETIRE_CRON_JOB',
        },
      });
      expect(prisma.cronJob.create).toHaveBeenCalledWith({
        data: {
          lastRunDate: expect.anything(),
          name: 'MSQ_RETIRE_CRON_JOB',
        },
      });
    });

    it('should update cronjob entry if one is present', async () => {
      prisma.cronJob.findFirst = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });
      prisma.cronJob.update = jest.fn().mockResolvedValue(true);

      await service.markCronJobAsStarted('MSQ_RETIRE_CRON_JOB');

      expect(prisma.cronJob.findFirst).toHaveBeenCalledWith({
        where: {
          name: 'MSQ_RETIRE_CRON_JOB',
        },
      });
      expect(prisma.cronJob.update).toHaveBeenCalledWith({
        data: {
          lastRunDate: expect.anything(),
        },
        where: {
          id: expect.anything(),
        },
      });
    });
  });
});
