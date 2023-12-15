import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MultiselectQuestion } from '../dtos/multiselect-questions/multiselect-question.dto';
import { MultiselectQuestionUpdate } from '../dtos/multiselect-questions/multiselect-question-update.dto';
import { MultiselectQuestionCreate } from '../dtos/multiselect-questions/multiselect-question-create.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { Prisma } from '@prisma/client';
import { buildFilter } from '../utilities/build-filter';
import { MultiselectQuestionFilterKeys } from '../enums/multiselect-questions/filter-key-enum';
import { MultiselectQuestionQueryParams } from '../dtos/multiselect-questions/multiselect-question-query-params.dto';

const view: Prisma.MultiselectQuestionsInclude = {
  jurisdictions: true,
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
    const rawMultiselectQuestions =
      await this.prisma.multiselectQuestions.findMany({
        include: view,
        where: this.buildWhere(params),
      });
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
      if (MultiselectQuestionFilterKeys.jurisdiction in filter) {
        const builtFilter = buildFilter({
          $comparison: filter.$comparison,
          $include_nulls: false,
          value: filter[MultiselectQuestionFilterKeys.jurisdiction],
          key: MultiselectQuestionFilterKeys.jurisdiction,
          caseSensitive: true,
        });
        filters.push({
          OR: builtFilter.map((filt) => ({
            jurisdictions: {
              some: {
                id: filt,
              },
            },
          })),
        });
      } else if (MultiselectQuestionFilterKeys.applicationSection in filter) {
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

    return mapTo(MultiselectQuestion, rawMultiselectQuestion);
  }

  /*
    this will create a multiselect question
  */
  async create(
    incomingData: MultiselectQuestionCreate,
  ): Promise<MultiselectQuestion> {
    const rawResult = await this.prisma.multiselectQuestions.create({
      data: {
        ...incomingData,
        jurisdictions: {
          connect: incomingData.jurisdictions.map((juris) => ({
            id: juris.id,
          })),
        },
        links: JSON.stringify(incomingData.links),
        options: JSON.stringify(incomingData.options),
      },
      include: view,
    });

    return mapTo(MultiselectQuestion, rawResult);
  }

  /*
    this will update a multiselect question's name or items field
    if no multiselect question has the id of the incoming argument an error is thrown
  */
  async update(
    incomingData: MultiselectQuestionUpdate,
  ): Promise<MultiselectQuestion> {
    await this.findOrThrow(incomingData.id);

    const rawResults = await this.prisma.multiselectQuestions.update({
      data: {
        ...incomingData,
        jurisdictions: {
          connect: incomingData.jurisdictions.map((juris) => ({
            id: juris.id,
          })),
        },
        links: JSON.stringify(incomingData.links),
        options: JSON.stringify(incomingData.options),
        id: undefined,
      },
      where: {
        id: incomingData.id,
      },
      include: view,
    });
    return mapTo(MultiselectQuestion, rawResults);
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
  async findOrThrow(multiselectQuestionId: string): Promise<boolean> {
    const multiselectQuestion =
      await this.prisma.multiselectQuestions.findFirst({
        where: {
          id: multiselectQuestionId,
        },
      });

    if (!multiselectQuestion) {
      throw new NotFoundException(
        `multiselectQuestionId ${multiselectQuestionId} was requested but not found`,
      );
    }

    return true;
  }

  async findByListingId(listingId: string): Promise<MultiselectQuestion[]> {
    const questions = await this.prisma.multiselectQuestions.findMany({
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

    return mapTo(MultiselectQuestion, questions);
  }
}
