import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/services/prisma.service';
import { MultiselectQuestionService } from '../../../src/services/multiselect-question.service';
import { MultiselectQuestionCreate } from '../../../src/dtos/multiselect-questions/multiselect-question-create.dto';
import { MultiselectQuestionUpdate } from '../../../src/dtos/multiselect-questions/multiselect-question-update.dto';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';
import { MultiselectQuestionQueryParams } from '../../../src/dtos/multiselect-questions/multiselect-question-query-params.dto';
import { Compare } from '../../../src/dtos/shared/base-filter.dto';
import { randomUUID } from 'crypto';

describe('Testing multiselect question service', () => {
  let service: MultiselectQuestionService;
  let prisma: PrismaService;

  const mockMultiselectQuestion = (position: number, date: Date) => {
    return {
      id: randomUUID(),
      createdAt: date,
      updatedAt: date,
      text: `text ${position}`,
      subText: `subText ${position}`,
      description: `description ${position}`,
      links: `{}`,
      options: `{}`,
      optOutText: `optOutText ${position}`,
      hideFromListing: false,
      applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
    };
  };

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

  it('testing list() no params', async () => {
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
        text: `text 0`,
        subText: `subText 0`,
        description: `description 0`,
        links: `{}`,
        options: `{}`,
        optOutText: `optOutText 0`,
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      },
      {
        id: mockedValue[1].id,
        createdAt: date,
        updatedAt: date,
        text: `text 1`,
        subText: `subText 1`,
        description: `description 1`,
        links: `{}`,
        options: `{}`,
        optOutText: `optOutText 1`,
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      },
      {
        id: mockedValue[2].id,
        createdAt: date,
        updatedAt: date,
        text: `text 2`,
        subText: `subText 2`,
        description: `description 2`,
        links: `{}`,
        options: `{}`,
        optOutText: `optOutText 2`,
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      },
    ]);

    expect(prisma.multiselectQuestions.findMany).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      where: {
        AND: [],
      },
    });
  });

  it('testing list() params', async () => {
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
        text: `text 0`,
        subText: `subText 0`,
        description: `description 0`,
        links: `{}`,
        options: `{}`,
        optOutText: `optOutText 0`,
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      },
      {
        id: mockedValue[1].id,
        createdAt: date,
        updatedAt: date,
        text: `text 1`,
        subText: `subText 1`,
        description: `description 1`,
        links: `{}`,
        options: `{}`,
        optOutText: `optOutText 1`,
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      },
      {
        id: mockedValue[2].id,
        createdAt: date,
        updatedAt: date,
        text: `text 2`,
        subText: `subText 2`,
        description: `description 2`,
        links: `{}`,
        options: `{}`,
        optOutText: `optOutText 2`,
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      },
    ]);

    expect(prisma.multiselectQuestions.findMany).toHaveBeenCalledWith({
      include: {
        jurisdictions: true,
      },
      where: {
        AND: [
          {
            OR: [
              {
                applicationSection: {
                  equals: MultiselectQuestionsApplicationSectionEnum.programs,
                  mode: 'default',
                },
              },
            ],
          },
        ],
      },
    });
  });

  it('testing findOne() with id present', async () => {
    const date = new Date();
    const mockedValue = mockMultiselectQuestion(3, date);
    prisma.multiselectQuestions.findFirst = jest
      .fn()
      .mockResolvedValue(mockedValue);

    expect(await service.findOne('example Id')).toEqual({
      id: mockedValue.id,
      createdAt: date,
      updatedAt: date,
      text: `text 3`,
      subText: `subText 3`,
      description: `description 3`,
      links: `{}`,
      options: `{}`,
      optOutText: `optOutText 3`,
      hideFromListing: false,
      applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
    });

    expect(prisma.multiselectQuestions.findFirst).toHaveBeenCalledWith({
      where: {
        id: {
          equals: 'example Id',
        },
      },
      include: {
        jurisdictions: true,
      },
    });
  });

  it('testing findOne() with id not present', async () => {
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
        jurisdictions: true,
      },
    });
  });

  it('testing create()', async () => {
    const date = new Date();
    const mockedValue = mockMultiselectQuestion(3, date);
    prisma.multiselectQuestions.create = jest
      .fn()
      .mockResolvedValue(mockedValue);

    const params: MultiselectQuestionCreate = {
      text: `text 4`,
      subText: `subText 4`,
      description: `description 4`,
      links: [],
      options: [],
      optOutText: `optOutText 4`,
      hideFromListing: false,
      applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      jurisdictions: [{ id: 'jurisdiction id' }],
    };

    expect(await service.create(params)).toEqual({
      id: mockedValue.id,
      createdAt: date,
      updatedAt: date,
      text: `text 3`,
      subText: `subText 3`,
      description: `description 3`,
      links: `{}`,
      options: `{}`,
      optOutText: `optOutText 3`,
      hideFromListing: false,
      applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
    });

    expect(prisma.multiselectQuestions.create).toHaveBeenCalledWith({
      data: {
        text: `text 4`,
        subText: `subText 4`,
        description: `description 4`,
        links: '[]',
        options: '[]',
        optOutText: `optOutText 4`,
        hideFromListing: false,
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        jurisdictions: { connect: [{ id: 'jurisdiction id' }] },
      },
      include: {
        jurisdictions: true,
      },
    });
  });

  it('testing update() existing record found', async () => {
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
    });

    const params: MultiselectQuestionUpdate = {
      id: mockedMultiselectQuestions.id,
      jurisdictions: [],
      text: '',
      applicationSection:
        MultiselectQuestionsApplicationSectionEnum.preferences,
    };

    expect(await service.update(params)).toEqual({
      id: mockedMultiselectQuestions.id,
      createdAt: date,
      updatedAt: date,
      text: '',
      subText: `subText 3`,
      description: `description 3`,
      links: `{}`,
      options: `{}`,
      optOutText: `optOutText 3`,
      hideFromListing: false,
      applicationSection:
        MultiselectQuestionsApplicationSectionEnum.preferences,
    });

    expect(prisma.multiselectQuestions.findFirst).toHaveBeenCalledWith({
      where: {
        id: mockedMultiselectQuestions.id,
      },
    });

    expect(prisma.multiselectQuestions.update).toHaveBeenCalledWith({
      data: {
        jurisdictions: {
          connect: [],
        },
        text: '',
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
      },
      where: {
        id: mockedMultiselectQuestions.id,
      },
      include: {
        jurisdictions: true,
      },
    });
  });

  it('testing update() existing record not found', async () => {
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
      where: {
        id: 'example id',
      },
    });
  });

  it('testing delete()', async () => {
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
      where: {
        id: 'example Id',
      },
    });
  });
});
