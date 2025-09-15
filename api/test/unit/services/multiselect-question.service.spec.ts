import { Test, TestingModule } from '@nestjs/testing';
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

export const mockMultiselectQuestion = (
  position: number,
  date: Date,
  section?: MultiselectQuestionsApplicationSectionEnum,
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
    jurisdiction: { name: `jurisdiction${position}`, id: randomUUID() },
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
      providers: [MultiselectQuestionService, PrismaService],
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
          jurisdictions: [
            {
              id: mockedValue[0].jurisdiction.id,
              name: 'jurisdiction0',
              ordinal: undefined,
            },
          ],
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
          jurisdictions: [
            {
              id: mockedValue[1].jurisdiction.id,
              name: 'jurisdiction1',
              ordinal: undefined,
            },
          ],
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
          jurisdictions: [
            {
              id: mockedValue[2].jurisdiction.id,
              name: 'jurisdiction2',
              ordinal: undefined,
            },
          ],
        },
      ]);

      expect(prisma.multiselectQuestions.findMany).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
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
          jurisdictions: [
            {
              id: mockedValue[0].jurisdiction.id,
              name: 'jurisdiction0',
              ordinal: undefined,
            },
          ],
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
          jurisdictions: [
            {
              id: mockedValue[1].jurisdiction.id,
              name: 'jurisdiction1',
              ordinal: undefined,
            },
          ],
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
          jurisdictions: [
            {
              id: mockedValue[2].jurisdiction.id,
              name: 'jurisdiction2',
              ordinal: undefined,
            },
          ],
        },
      ]);

      expect(prisma.multiselectQuestions.findMany).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
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
      const mockedValue = mockMultiselectQuestion(3, date);
      prisma.multiselectQuestions.findFirst = jest
        .fn()
        .mockResolvedValue(mockedValue);

      expect(await service.findOne('example Id')).toEqual({
        id: mockedValue.id,
        createdAt: date,
        updatedAt: date,
        text: 'text 3',
        subText: 'subText 3',
        description: 'description 3',
        links: [],
        options: [],
        optOutText: 'optOutText 3',
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        jurisdictions: [
          {
            id: mockedValue.jurisdiction.id,
            name: 'jurisdiction3',
            ordinal: undefined,
          },
        ],
      });

      expect(prisma.multiselectQuestions.findFirst).toHaveBeenCalledWith({
        where: {
          id: {
            equals: 'example Id',
          },
        },
        include: {
          jurisdiction: true,
        },
      });
    });

    it('should error when nonexistent id is passed to findOne()', async () => {
      prisma.multiselectQuestions.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.findOne('example Id'),
      ).rejects.toThrowError();

      expect(prisma.multiselectQuestions.findFirst).toHaveBeenCalledWith({
        where: {
          id: {
            equals: 'example Id',
          },
        },
        include: {
          jurisdiction: true,
        },
      });
    });
  });

  describe('create', () => {
    it('should create with call to create()', async () => {
      const date = new Date();
      const mockedValue = mockMultiselectQuestion(3, date);
      prisma.multiselectQuestions.create = jest
        .fn()
        .mockResolvedValue(mockedValue);

      const params: MultiselectQuestionCreate = {
        text: 'text 4',
        subText: 'subText 4',
        description: 'description 4',
        links: [],
        options: [],
        optOutText: 'optOutText 4',
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        jurisdictions: [{ id: 'jurisdiction id' }],
      };

      expect(await service.create(params)).toEqual({
        id: mockedValue.id,
        createdAt: date,
        updatedAt: date,
        text: 'text 3',
        subText: 'subText 3',
        description: 'description 3',
        links: [],
        options: [],
        optOutText: 'optOutText 3',
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        jurisdictions: [
          {
            id: mockedValue.jurisdiction.id,
            name: 'jurisdiction3',
            ordinal: undefined,
          },
        ],
      });

      expect(prisma.multiselectQuestions.create).toHaveBeenCalledWith({
        data: {
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          description: 'description 4',
          isExclusive: false,
          hideFromListing: false,
          jurisdiction: { connect: { id: 'jurisdiction id' } },
          links: [],
          multiselectOptions: undefined,
          name: 'text 4',
          options: [],
          optOutText: 'optOutText 4',
          status: MultiselectQuestionsStatusEnum.draft,
          subText: 'subText 4',
          text: 'text 4',
        },
        include: {
          jurisdiction: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update with call to update()', async () => {
      const date = new Date();

      const mockedMultiselectQuestions = mockMultiselectQuestion(3, date);

      prisma.multiselectQuestions.findFirst = jest
        .fn()
        .mockResolvedValue(mockedMultiselectQuestions);
      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue({
        ...mockedMultiselectQuestions,
        text: '',
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        jurisdiction: { name: 'jurisdiction1', id: 'jurisdictionId' },
      });

      const params: MultiselectQuestionUpdate = {
        id: mockedMultiselectQuestions.id,
        jurisdictions: [{ name: 'jurisdiction1', id: 'jurisdictionId' }],
        text: '',
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
      };

      expect(await service.update(params)).toEqual({
        id: mockedMultiselectQuestions.id,
        createdAt: date,
        updatedAt: date,
        text: '',
        subText: 'subText 3',
        description: 'description 3',
        links: [],
        options: [],
        optOutText: 'optOutText 3',
        hideFromListing: false,
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        jurisdictions: [
          {
            id: 'jurisdictionId',
            name: 'jurisdiction1',
            ordinal: undefined,
          },
        ],
      });

      expect(prisma.multiselectQuestions.findFirst).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
        },
        where: {
          id: mockedMultiselectQuestions.id,
        },
      });

      expect(prisma.multiselectQuestions.update).toHaveBeenCalledWith({
        data: {
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.preferences,
          isExclusive: false,
          links: undefined,
          jurisdiction: { connect: { id: 'jurisdictionId' } },
          multiselectOptions: undefined,
          name: '',
          options: undefined,
          text: '',
        },
        where: {
          id: mockedMultiselectQuestions.id,
        },
        include: {
          jurisdiction: true,
        },
      });
    });

    it('should error when nonexistent id is passed to update()', async () => {
      prisma.multiselectQuestions.findFirst = jest.fn().mockResolvedValue(null);
      prisma.multiselectQuestions.update = jest.fn().mockResolvedValue(null);

      const params: MultiselectQuestionUpdate = {
        id: 'example id',
        text: '',
        jurisdictions: [],
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      };

      await expect(
        async () => await service.update(params),
      ).rejects.toThrowError();

      expect(prisma.multiselectQuestions.findFirst).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
        },
        where: {
          id: 'example id',
        },
      });
    });
  });

  describe('update', () => {
    it('should delete with call to delete()', async () => {
      const date = new Date();
      const mockedValue = mockMultiselectQuestion(3, date);
      prisma.multiselectQuestions.findFirst = jest
        .fn()
        .mockResolvedValue(mockedValue);
      prisma.multiselectQuestions.delete = jest
        .fn()
        .mockResolvedValue(mockedValue);

      expect(await service.delete('example Id')).toEqual({
        success: true,
      });

      expect(prisma.multiselectQuestions.delete).toHaveBeenCalledWith({
        where: {
          id: 'example Id',
        },
      });

      expect(prisma.multiselectQuestions.findFirst).toHaveBeenCalledWith({
        include: {
          jurisdiction: true,
        },
        where: {
          id: 'example Id',
        },
      });
    });
  });
});
