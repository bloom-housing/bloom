import { randomUUID } from 'crypto';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ListingsStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
} from '@prisma/client';
import MultiselectQuestion from '../../../src/dtos/multiselect-questions/multiselect-question.dto';
import { MultiselectQuestionCreate } from '../../../src/dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionQueryParams } from '../../../src/dtos/multiselect-questions/multiselect-question-query-params.dto';
import { MultiselectQuestionUpdate } from '../../../src/dtos/multiselect-questions/multiselect-question-update.dto';
import { Compare } from '../../../src/dtos/shared/base-filter.dto';
import { User } from '../../../src/dtos/users/user.dto';
import { FeatureFlagEnum } from '../../../src/enums/feature-flags/feature-flags-enum';
import { MultiselectQuestionService } from '../../../src/services/multiselect-question.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { CronJobService } from '../../../src/services/cron-job.service';

const user = new User();
const canOrThrowMock = jest.fn();

export const mockMultiselectQuestion = (
  position: number,
  date: Date,
  section?: MultiselectQuestionsApplicationSectionEnum,
  enableV2MSQ = false,
  status: MultiselectQuestionsStatusEnum = MultiselectQuestionsStatusEnum.visible,
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
    status: enableV2MSQ ? status : MultiselectQuestionsStatusEnum.draft,
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
      providers: [
        Logger,
        CronJobService,
        MultiselectQuestionService,
        {
          provide: PermissionService,
          useValue: {
            canOrThrow: canOrThrowMock,
          },
        },
        PrismaService,
        SchedulerRegistry,
      ],
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

      expect(await service.create(params, user)).toEqual({
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

      expect(await service.create(params, user)).toEqual({
        ...params,
        id: mockedMultiselectQuestion.id,
        createdAt: date,
        updatedAt: date,
        jurisdiction: {
          id: mockedMultiselectQuestion.jurisdiction.id,
          name: 'jurisdiction2',
          ordinal: undefined,
        },
        jurisdictions: [
          {
            id: mockedMultiselectQuestion.jurisdiction.id,
            name: 'jurisdiction2',
            ordinal: undefined,
          },
        ],
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

    it('should error invalid status is passed to create()', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        2,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
      );
      prisma.multiselectQuestions.create = jest.fn().mockResolvedValue(null);

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
        status: MultiselectQuestionsStatusEnum.active,
        subText: 'subText 2',
        text: 'text 2',
      };

      await expect(
        async () => await service.create(params, user),
      ).rejects.toThrowError("status must be 'draft' or 'visible' on create");
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
      prisma.$transaction = jest.fn().mockResolvedValue([
        {
          ...mockedMultiselectQuestion,
          text: '',
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.preferences,
          jurisdiction: { name: 'jurisdiction1', id: 'jurisdictionId' },
        },
      ]);

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

      expect(await service.update(params, user)).toEqual({
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
      prisma.$transaction = jest.fn().mockResolvedValue([
        {
          ...mockedMultiselectQuestion,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.preferences,
          isExclusive: false,
          jurisdiction: { name: 'jurisdiction1', id: 'jurisdictionId' },
          jurisdictions: undefined,
          name: 'name change',
          status: MultiselectQuestionsStatusEnum.draft,
          text: '',
        },
      ]);

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

      expect(await service.update(params, user)).toEqual({
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
          links: undefined,
          jurisdiction: { connect: { id: 'jurisdictionId' } },
          multiselectOptions: {
            createMany: {
              data: undefined,
            },
          },
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
      prisma.$transaction = jest.fn().mockResolvedValue([]);

      const params: MultiselectQuestionUpdate = {
        id: 'example id',
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        jurisdictions: [],
        status: MultiselectQuestionsStatusEnum.draft,
        text: '',
      };

      await expect(
        async () => await service.update(params, user),
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

      expect(await service.delete(id, user)).toEqual({
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

      expect(await service.delete(id, user)).toEqual({
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

  describe('validateStatusStateTransition', () => {
    describe('draft transitions', () => {
      it('should allow draft to draft', () => {
        expect(
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.draft,
            MultiselectQuestionsStatusEnum.draft,
          ),
        ).toBeNull;
      });
      it('should allow draft to visible', () => {
        expect(
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.draft,
            MultiselectQuestionsStatusEnum.visible,
          ),
        ).toBeNull;
      });
      it('should error when moving draft to a state other than visible', () => {
        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.draft,
            MultiselectQuestionsStatusEnum.active,
          ),
        ).rejects.toThrowError();

        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.retired,
            MultiselectQuestionsStatusEnum.toRetire,
          ),
        ).rejects.toThrowError();

        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.retired,
            MultiselectQuestionsStatusEnum.retired,
          ),
        ).rejects.toThrowError();
      });
    });

    describe('visible transitions', () => {
      it('should allow visible to visible', () => {
        expect(
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.visible,
            MultiselectQuestionsStatusEnum.visible,
          ),
        ).toBeNull;
      });
      it('should allow visible to draft', () => {
        expect(
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.visible,
            MultiselectQuestionsStatusEnum.draft,
          ),
        ).toBeNull;
      });
      it('should allow visible to active', () => {
        expect(
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.visible,
            MultiselectQuestionsStatusEnum.active,
          ),
        ).toBeNull;
      });
      it('should error when moving visible to a state other than draft or active', () => {
        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.visible,
            MultiselectQuestionsStatusEnum.toRetire,
          ),
        ).rejects.toThrowError();

        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.retired,
            MultiselectQuestionsStatusEnum.retired,
          ),
        ).rejects.toThrowError();
      });
    });

    describe('active transitions', () => {
      it('should allow active to toRetire', () => {
        expect(
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.active,
            MultiselectQuestionsStatusEnum.toRetire,
          ),
        ).toBeNull;
      });
      it('should allow active to retired', () => {
        expect(
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.active,
            MultiselectQuestionsStatusEnum.retired,
          ),
        ).toBeNull;
      });
      it('should not allow active to active', () => {
        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.active,
            MultiselectQuestionsStatusEnum.active,
          ),
        ).rejects.toThrowError();
      });
      it('should error when moving active to a state other than toRetire or retired', () => {
        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.active,
            MultiselectQuestionsStatusEnum.draft,
          ),
        ).rejects.toThrowError();

        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.active,
            MultiselectQuestionsStatusEnum.visible,
          ),
        ).rejects.toThrowError();
      });
    });

    describe('toRetire transitions', () => {
      it('should allow toRetire to active', () => {
        expect(
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.toRetire,
            MultiselectQuestionsStatusEnum.active,
          ),
        ).toBeNull;
      });
      it('should allow toRetire to retired', () => {
        expect(
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.toRetire,
            MultiselectQuestionsStatusEnum.retired,
          ),
        ).toBeNull;
      });
      it('should not allow toRetire to toRetire', () => {
        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.toRetire,
            MultiselectQuestionsStatusEnum.toRetire,
          ),
        ).rejects.toThrowError();
      });
      it('should error when moving toRetire to a state other than active or retired', () => {
        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.toRetire,
            MultiselectQuestionsStatusEnum.draft,
          ),
        ).rejects.toThrowError();

        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.toRetire,
            MultiselectQuestionsStatusEnum.visible,
          ),
        ).rejects.toThrowError();
      });
    });

    describe('retired transitions', () => {
      it('should not allow retired to retired', () => {
        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.retired,
            MultiselectQuestionsStatusEnum.retired,
          ),
        ).rejects.toThrowError();
      });
      it('should error when moving retired to any state', () => {
        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.retired,
            MultiselectQuestionsStatusEnum.draft,
          ),
        ).rejects.toThrowError();

        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.retired,
            MultiselectQuestionsStatusEnum.visible,
          ),
        ).rejects.toThrowError();

        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.retired,
            MultiselectQuestionsStatusEnum.active,
          ),
        ).rejects.toThrowError();

        expect(async () =>
          service.validateStatusStateTransition(
            MultiselectQuestionsStatusEnum.retired,
            MultiselectQuestionsStatusEnum.toRetire,
          ),
        ).rejects.toThrowError();
      });
    });
  });

  describe('statusStateTransition', () => {
    it('should update the status of a multiselectQuestion with a valid transition', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        1,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
      );

      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);

      expect(
        await service.statusStateTransition(
          mockedMultiselectQuestion as unknown as MultiselectQuestion,
          MultiselectQuestionsStatusEnum.active,
        ),
      ).toBeNull;

      expect(prisma.multiselectQuestions.update).toHaveBeenCalledWith({
        data: {
          status: MultiselectQuestionsStatusEnum.active,
        },
        where: {
          id: mockedMultiselectQuestion.id,
        },
      });
    });

    it('should error with an invalid transition', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        2,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
      );

      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);

      expect(
        async () =>
          await service.statusStateTransition(
            mockedMultiselectQuestion as unknown as MultiselectQuestion,
            MultiselectQuestionsStatusEnum.retired,
          ),
      ).rejects.toThrowError();

      expect(prisma.multiselectQuestions.update).not.toHaveBeenCalled();
    });
  });

  describe('activateMany', () => {
    it('should update status to active for multiselectQuestions in visible state', async () => {
      const date = new Date();
      const mockedVisible = mockMultiselectQuestion(
        1,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
      );
      const mockedActive = mockMultiselectQuestion(
        2,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
        MultiselectQuestionsStatusEnum.active,
      );

      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);

      expect(
        await service.activateMany([
          mockedVisible as unknown as MultiselectQuestion,
          mockedActive as unknown as MultiselectQuestion,
        ]),
      ).toEqual({
        success: true,
      });

      expect(prisma.multiselectQuestions.update).toHaveBeenCalledTimes(1);
      expect(prisma.multiselectQuestions.update).toHaveBeenCalledWith({
        data: {
          status: MultiselectQuestionsStatusEnum.active,
        },
        where: {
          id: mockedVisible.id,
        },
      });
    });
  });

  describe('reActivate', () => {
    it('should update status to active for a multiselectQuestion in toRetire state', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        1,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
        MultiselectQuestionsStatusEnum.toRetire,
      );

      prisma.multiselectQuestions.findUnique = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);
      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);

      expect(
        await service.reActivate(mockedMultiselectQuestion.id, user),
      ).toEqual({
        success: true,
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
      expect(prisma.multiselectQuestions.update).toHaveBeenCalledWith({
        data: {
          status: MultiselectQuestionsStatusEnum.active,
        },
        where: {
          id: mockedMultiselectQuestion.id,
        },
      });
    });

    it('should error with an invalid transition', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        2,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
        MultiselectQuestionsStatusEnum.active,
      );

      prisma.multiselectQuestions.findUnique = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestion);
      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);

      expect(
        async () =>
          await service.reActivate(mockedMultiselectQuestion.id, user),
      ).rejects.toThrowError();

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
          multiselectOptions: true,
        },
        where: {
          id: mockedMultiselectQuestion.id,
        },
      });
      expect(prisma.multiselectQuestions.update).not.toHaveBeenCalled();
    });
  });

  describe('retire', () => {
    it('should update status to retired for a multiselectQuestion with closed listings', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        1,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
        MultiselectQuestionsStatusEnum.active,
      );

      prisma.multiselectQuestions.findUnique = jest.fn().mockResolvedValue({
        ...mockedMultiselectQuestion,
        listings: [{ listings: { status: ListingsStatusEnum.closed } }],
      });
      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);

      expect(await service.retire(mockedMultiselectQuestion.id, user)).toEqual({
        success: true,
      });

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
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
          id: mockedMultiselectQuestion.id,
        },
      });
      expect(prisma.multiselectQuestions.update).toHaveBeenCalledWith({
        data: {
          status: MultiselectQuestionsStatusEnum.retired,
        },
        where: {
          id: mockedMultiselectQuestion.id,
        },
      });
    });

    it('should update status to toRetire for a multiselectQuestion with active listings', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        1,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
        MultiselectQuestionsStatusEnum.active,
      );

      prisma.multiselectQuestions.findUnique = jest.fn().mockResolvedValue({
        ...mockedMultiselectQuestion,
        listings: [
          { listings: { status: ListingsStatusEnum.closed } },
          { listings: { status: ListingsStatusEnum.active } },
        ],
      });
      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);

      expect(await service.retire(mockedMultiselectQuestion.id, user)).toEqual({
        success: true,
      });

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
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
          id: mockedMultiselectQuestion.id,
        },
      });
      expect(prisma.multiselectQuestions.update).toHaveBeenCalledWith({
        data: {
          status: MultiselectQuestionsStatusEnum.toRetire,
        },
        where: {
          id: mockedMultiselectQuestion.id,
        },
      });
    });

    it('should error with an invalid transition', async () => {
      const date = new Date();
      const mockedMultiselectQuestion = mockMultiselectQuestion(
        2,
        date,
        MultiselectQuestionsApplicationSectionEnum.programs,
        true,
      );

      prisma.multiselectQuestions.findUnique = jest.fn().mockResolvedValue({
        ...mockedMultiselectQuestion,
        listings: [{ listings: { status: ListingsStatusEnum.closed } }],
      });
      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);

      expect(
        async () => await service.retire(mockedMultiselectQuestion.id, user),
      ).rejects.toThrowError();

      expect(prisma.multiselectQuestions.findUnique).toHaveBeenCalledWith({
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
          id: mockedMultiselectQuestion.id,
        },
      });
      expect(prisma.multiselectQuestions.update).not.toHaveBeenCalled();
    });
  });

  describe('retireMultiselectQuestions', () => {
    it('should call updateMany', async () => {
      prisma.cronJob.findFirst = jest
        .fn()
        .mockResolvedValue({ id: randomUUID() });
      prisma.cronJob.update = jest.fn().mockResolvedValue(true);
      prisma.multiselectQuestions.updateMany = jest
        .fn()
        .mockResolvedValue({ count: 2 });

      expect(await service.retireMultiselectQuestions()).toEqual({
        success: true,
      });

      expect(prisma.cronJob.findFirst).toHaveBeenCalled();
      expect(prisma.cronJob.update).toHaveBeenCalled();
      expect(prisma.multiselectQuestions.updateMany).toHaveBeenCalledWith({
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
    });
  });
});
