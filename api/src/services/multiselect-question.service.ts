import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MultiselectQuestion } from '../dtos/multiselect-questions/multiselect-question.dto';
import { MultiselectQuestionUpdate } from '../dtos/multiselect-questions/multiselect-question-update.dto';
import { MultiselectQuestionCreate } from '../dtos/multiselect-questions/multiselect-question-create.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { MultiselectQuestionsStatusEnum, Prisma } from '@prisma/client';
import { buildFilter } from '../utilities/build-filter';
import { MultiselectQuestionFilterKeys } from '../enums/multiselect-questions/filter-key-enum';
import { MultiselectQuestionQueryParams } from '../dtos/multiselect-questions/multiselect-question-query-params.dto';

const view: Prisma.MultiselectQuestionsInclude = {
  jurisdiction: true,
};

/*
  this is the service for multiselect questions
  it handles all the backend's business logic for reading/writing/deleting multiselect questione data
*/
@Injectable()
export class MultiselectQuestionService {
  constructor(private prisma: PrismaService) {}

  /*
    this will get a set of multiselect questions given the params passed in
  */
  async list(
    params: MultiselectQuestionQueryParams,
  ): Promise<MultiselectQuestion[]> {
    let rawMultiselectQuestions =
      await this.prisma.multiselectQuestions.findMany({
        include: view,
        where: this.buildWhere(params),
      });

    // TODO: Temporary until front end accepts MSQ refactor
    rawMultiselectQuestions = rawMultiselectQuestions.map((msq) => ({
      ...msq,
      jurisdictions: [msq.jurisdiction],
    }));
    return mapTo(MultiselectQuestion, rawMultiselectQuestions);
  }

  /*
    this will build the where clause for list()
  */
  buildWhere(
    params: MultiselectQuestionQueryParams,
  ): Prisma.MultiselectQuestionsWhereInput {
    const filters: Prisma.MultiselectQuestionsWhereInput[] = [];
    if (!params?.filter?.length) {
      return {
        AND: filters,
      };
    }
    params.filter.forEach((filter) => {
      if (filter[MultiselectQuestionFilterKeys.jurisdiction]) {
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
      } else if (filter[MultiselectQuestionFilterKeys.applicationSection]) {
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
      }
    });
    return {
      AND: filters,
    };
  }

  /*
    this will return 1 multiselect question or error
  */
  async findOne(multiSelectQuestionId: string): Promise<MultiselectQuestion> {
    const rawMultiselectQuestion =
      await this.prisma.multiselectQuestions.findFirst({
        where: {
          id: {
            equals: multiSelectQuestionId,
          },
        },
        include: view,
      });

    if (!rawMultiselectQuestion) {
      throw new NotFoundException(
        `multiselectQuestionId ${multiSelectQuestionId} was requested but not found`,
      );
    }

    // TODO: Temporary until front end accepts MSQ refactor
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
  ): Promise<MultiselectQuestion> {
    const { jurisdictions, links, options, ...createData } = incomingData;

    const rawMultiselectQuestion =
      await this.prisma.multiselectQuestions.create({
        data: {
          ...createData,
          jurisdiction: {
            connect: jurisdictions?.at(0)?.id
              ? { id: jurisdictions?.at(0)?.id }
              : undefined,
          },
          links: links
            ? (links as unknown as Prisma.InputJsonArray)
            : undefined,
          options: options
            ? (options as unknown as Prisma.InputJsonArray)
            : undefined,
          status: MultiselectQuestionsStatusEnum.draft,

          // TODO: Temporary until after MSQ refactor
          isExclusive: false,
          multiselectOptions: undefined,
          name: createData.text,
        },
        include: view,
      });

    // TODO: Temporary until front end accepts MSQ refactor
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
  ): Promise<MultiselectQuestion> {
    const { id, jurisdictions, links, options, ...updateData } = incomingData;

    await this.findOrThrow(id);

    const rawMultiselectQuestion =
      await this.prisma.multiselectQuestions.update({
        data: {
          ...updateData,
          id: undefined,
          jurisdiction: {
            connect: jurisdictions?.at(0)?.id
              ? { id: jurisdictions?.at(0)?.id }
              : undefined,
          },
          links: links
            ? (links as unknown as Prisma.InputJsonArray)
            : undefined,
          options: options
            ? (options as unknown as Prisma.InputJsonArray)
            : undefined,

          // TODO: Temporary until after MSQ refactor
          isExclusive: false,
          multiselectOptions: undefined,
          name: updateData.text,
        },
        where: {
          id: id,
        },
        include: view,
      });

    // TODO: Temporary until front end accepts MSQ refactor
    rawMultiselectQuestion['jurisdictions'] = [
      rawMultiselectQuestion?.jurisdiction,
    ];
    return mapTo(MultiselectQuestion, rawMultiselectQuestion);
  }

  /*
    this will delete a multiselect question
  */
  async delete(multiSelectQuestionId: string): Promise<SuccessDTO> {
    await this.findOrThrow(multiSelectQuestionId);
    await this.prisma.multiselectQuestions.delete({
      where: {
        id: multiSelectQuestionId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    this will either find a record or throw a customized error
  */
  async findOrThrow(
    multiselectQuestionId: string,
  ): Promise<MultiselectQuestion> {
    const rawMultiselectQuestion =
      await this.prisma.multiselectQuestions.findFirst({
        include: {
          jurisdiction: true,
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

    // TODO: Temporary until front end accepts MSQ refactor
    rawMultiselectQuestion['jurisdictions'] = [
      rawMultiselectQuestion.jurisdiction,
    ];
    return mapTo(MultiselectQuestion, rawMultiselectQuestion);
  }

  async findByListingId(listingId: string): Promise<MultiselectQuestion[]> {
    let rawMultiselectQuestions =
      await this.prisma.multiselectQuestions.findMany({
        include: {
          listings: true,
        },
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
}
