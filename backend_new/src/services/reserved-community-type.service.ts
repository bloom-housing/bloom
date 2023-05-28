import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { ReservedCommunityType } from '../dtos/reserved-community-types/reserved-community-type-get.dto';
import { ReservedCommunitTypeCreate } from '../dtos/reserved-community-types/reserved-community-type-create.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { ReservedCommunityTypeQueryParams } from '../dtos/reserved-community-types/reserved-community-type-query-params.dto';

/*
  this is the service for reserved community types
  it handles all the backend's business logic for reading/writing/deleting reserved community type data
*/

const view: Prisma.ReservedCommunityTypesInclude = {
  jurisdictions: true,
};

@Injectable()
export class ReservedCommunityTypeService {
  constructor(private prisma: PrismaService) {}

  /*
    this will get a set of reserved community types given the params passed in
  */
  async list(params: ReservedCommunityTypeQueryParams) {
    const rawReservedCommunityTypes =
      await this.prisma.reservedCommunityTypes.findMany({
        include: view,
        where: this.buildWhereClause(params),
      });
    return mapTo(ReservedCommunityType, rawReservedCommunityTypes);
  }

  /*
    this helps build the where clause for the list()
  */
  buildWhereClause(
    params: ReservedCommunityTypeQueryParams,
  ): Prisma.ReservedCommunityTypesWhereInput {
    const filters: Prisma.ReservedCommunityTypesWhereInput[] = [];

    if (params) {
      if ('jurisdictionName' in params && params.jurisdictionName) {
        filters.push({
          jurisdictions: {
            name: params.jurisdictionName,
          },
        });
      }
    }

    return {
      AND: filters,
    };
  }

  /*
    this will return 1 reserved community type or error
  */
  async findOne(reservedCommunityTypeId: string) {
    const rawReservedCommunityTypes =
      await this.prisma.reservedCommunityTypes.findFirst({
        include: view,
        where: {
          id: {
            equals: reservedCommunityTypeId,
          },
        },
      });

    if (!rawReservedCommunityTypes) {
      throw new NotFoundException();
    }

    return mapTo(ReservedCommunityType, rawReservedCommunityTypes);
  }

  /*
    this will create a reserved community type
  */
  async create(incomingData: ReservedCommunitTypeCreate) {
    const rawResult = await this.prisma.reservedCommunityTypes.create({
      data: {
        ...incomingData,
        jurisdictions: {
          connect: {
            id: incomingData.jurisdictions.id,
          },
        },
      },
      include: view,
    });

    return mapTo(ReservedCommunityType, rawResult);
  }

  /*
    this will update a reserved community type's name or items field
    if no eserved community type has the id of the incoming argument an error is thrown
  */
  async update(incomingData: ReservedCommunityType) {
    const reservedCommunityType =
      await this.prisma.reservedCommunityTypes.findFirst({
        where: {
          id: incomingData.id,
        },
      });

    if (!reservedCommunityType) {
      throw new NotFoundException();
    }

    const rawResults = await this.prisma.reservedCommunityTypes.update({
      include: view,
      data: {
        name: incomingData.name,
        description: incomingData.description,
      },
      where: {
        id: incomingData.id,
      },
    });
    return mapTo(ReservedCommunityType, rawResults);
  }

  /*
    this will delete a reserved community type
  */
  async delete(reservedCommunityTypeId: string) {
    await this.prisma.reservedCommunityTypes.delete({
      where: {
        id: reservedCommunityTypeId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }
}
