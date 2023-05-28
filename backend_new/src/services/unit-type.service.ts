import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UnitType } from '../dtos/unit-types/unit-type-get.dto';
import { UnitTypeCreate } from '../dtos/unit-types/unit-type-create.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';

/*
  this is the service for unit types
  it handles all the backend's business logic for reading/writing/deleting unit type data
*/

@Injectable()
export class UnitTypeService {
  constructor(private prisma: PrismaService) {}

  /*
    this will get a set of unit types given the params passed in
  */
  async list() {
    const rawUnitTypes = await this.prisma.unitTypes.findMany();
    return mapTo(UnitType, rawUnitTypes);
  }

  /*
    this will return 1 unit type or error
  */
  async findOne(unitTypeId: string) {
    const rawUnitType = await this.prisma.unitTypes.findFirst({
      where: {
        id: {
          equals: unitTypeId,
        },
      },
    });

    if (!rawUnitType) {
      throw new NotFoundException();
    }

    return mapTo(UnitType, rawUnitType);
  }

  /*
    this will create a unit type
  */
  async create(incomingData: UnitTypeCreate) {
    const rawResult = await this.prisma.unitTypes.create({
      data: {
        ...incomingData,
      },
    });

    return mapTo(UnitType, rawResult);
  }

  /*
    this will update a unit type's name or items field
    if no unit type has the id of the incoming argument an error is thrown
  */
  async update(incomingData: UnitType) {
    const unitType = await this.prisma.unitTypes.findFirst({
      where: {
        id: incomingData.id,
      },
    });

    if (!unitType) {
      throw new NotFoundException();
    }

    const rawResults = await this.prisma.unitTypes.update({
      data: {
        name: incomingData.name,
        numBedrooms: incomingData.numBedrooms,
      },
      where: {
        id: incomingData.id,
      },
    });
    return mapTo(UnitType, rawResults);
  }

  /*
    this will delete a unit type
  */
  async delete(unitTypeId: string) {
    await this.prisma.unitTypes.delete({
      where: {
        id: unitTypeId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }
}
