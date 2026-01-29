import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Jurisdiction } from '../dtos/jurisdictions/jurisdiction.dto';
import { JurisdictionCreate } from '../dtos/jurisdictions/jurisdiction-create.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { Prisma } from '@prisma/client';
import { JurisdictionUpdate } from '../dtos/jurisdictions/jurisdiction-update.dto';

const view: Prisma.JurisdictionsInclude = {
  featureFlags: true,
  multiselectQuestions: true,
};
/**
  this is the service for jurisdictions
  it handles all the backend's business logic for reading/writing/deleting jurisdiction data
*/
@Injectable()
export class JurisdictionService {
  constructor(private prisma: PrismaService) {}

  /**
    this will get a set of jurisdictions given the params passed in
  */
  async list(): Promise<Jurisdiction[]> {
    const rawJurisdictions = await this.prisma.jurisdictions.findMany({
      include: view,
    });
    return mapTo(Jurisdiction, rawJurisdictions);
  }

  /*
    this will build the where clause for findOne()
  */
  buildWhere({
    jurisdictionId,
    jurisdictionName,
  }: {
    jurisdictionId?: string;
    jurisdictionName?: string;
  }): Prisma.JurisdictionsWhereInput {
    const toReturn: Prisma.JurisdictionsWhereInput = {};
    if (jurisdictionId) {
      toReturn.id = {
        equals: jurisdictionId,
      };
    } else if (jurisdictionName) {
      toReturn.name = {
        equals: jurisdictionName,
      };
    }
    return toReturn;
  }

  /*
    this will return 1 jurisdiction or error
  */
  async findOne(condition: {
    jurisdictionId?: string;
    jurisdictionName?: string;
  }): Promise<Jurisdiction> {
    if (!condition.jurisdictionId && !condition.jurisdictionName) {
      throw new BadRequestException(
        'a jurisdiction id or jurisdiction name must be provided',
      );
    }

    const rawJurisdiction = await this.prisma.jurisdictions.findFirst({
      where: this.buildWhere(condition),
      include: view,
    });

    if (!rawJurisdiction) {
      throw new NotFoundException(
        `jurisdiction ${
          condition.jurisdictionId || condition.jurisdictionName
        } was requested but not found`,
      );
    }

    return mapTo(Jurisdiction, rawJurisdiction);
  }

  /*
    this will create a jurisdiction
  */
  async create(incomingData: JurisdictionCreate): Promise<Jurisdiction> {
    const rawResult = await this.prisma.jurisdictions.create({
      data: {
        ...incomingData,
        listingFeaturesConfiguration:
          incomingData.listingFeaturesConfiguration as unknown as Prisma.JsonArray,
      },
      include: view,
    });

    return mapTo(Jurisdiction, rawResult);
  }

  /*
    this will update a jurisdiction's name or items field
    if no jurisdiction has the id of the incoming argument an error is thrown
  */
  async update(incomingData: JurisdictionUpdate): Promise<Jurisdiction> {
    await this.findOrThrow(incomingData.id);

    const rawResults = await this.prisma.jurisdictions.update({
      data: {
        ...incomingData,
        id: undefined,
        listingFeaturesConfiguration:
          incomingData.listingFeaturesConfiguration as unknown as Prisma.JsonArray,
      },
      where: {
        id: incomingData.id,
      },
      include: view,
    });
    return mapTo(Jurisdiction, rawResults);
  }

  /*
    this will delete a jurisdiction
  */
  async delete(jurisdictionId: string): Promise<SuccessDTO> {
    await this.findOrThrow(jurisdictionId);
    await this.prisma.jurisdictions.delete({
      where: {
        id: jurisdictionId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    this will either find a record or throw a customized error
  */
  async findOrThrow(jurisdictionId: string): Promise<boolean> {
    const jurisdiction = await this.prisma.jurisdictions.findFirst({
      where: {
        id: jurisdictionId,
      },
    });

    if (!jurisdiction) {
      throw new NotFoundException(
        `jurisdictionId ${jurisdictionId} was requested but not found`,
      );
    }

    return true;
  }
}
