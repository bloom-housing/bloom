import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UnitRentType } from '../dtos/unit-rent-types/unit-rent-type-get.dto';
import { UnitRentTypeCreate } from '../dtos/unit-rent-types/unit-rent-type-create.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';

/*
  this is the service for unit rent types
  it handles all the backend's business logic for reading/writing/deleting unit rent type data
*/

@Injectable()
export class UnitRentTypeService {
  constructor(private prisma: PrismaService) {}

  /*
    this will get a set of unit rent types given the params passed in
  */
  async list() {
    const rawUnitRentTypes = await this.prisma.unitRentTypes.findMany();
    return mapTo(UnitRentType, rawUnitRentTypes);
  }

  /*
    this will return 1 unit rent type or error
  */
  async findOne(unitRentTypeId: string) {
    const rawUnitRentType = await this.prisma.unitRentTypes.findFirst({
      where: {
        id: {
          equals: unitRentTypeId,
        },
      },
    });

    if (!rawUnitRentType) {
      throw new NotFoundException();
    }

    return mapTo(UnitRentType, rawUnitRentType);
  }

  /*
    this will create a unit rent type
  */
  async create(incomingData: UnitRentTypeCreate) {
    const rawResult = await this.prisma.unitRentTypes.create({
      data: {
        ...incomingData,
      },
    });

    return mapTo(UnitRentType, rawResult);
  }

  /*
    this will update a unit rent type's name or items field
    if no unit rent type has the id of the incoming argument an error is thrown
  */
  async update(incomingData: UnitRentType) {
    const unitRentType = await this.prisma.unitRentTypes.findFirst({
      where: {
        id: incomingData.id,
      },
    });

    if (!unitRentType) {
      throw new NotFoundException();
    }

    const rawResults = await this.prisma.unitRentTypes.update({
      data: {
        name: incomingData.name,
      },
      where: {
        id: incomingData.id,
      },
    });
    return mapTo(UnitRentType, rawResults);
  }

  /*
    this will delete a unit rent type
  */
  async delete(unitRentTypeId: string) {
    await this.prisma.unitRentTypes.delete({
      where: {
        id: unitRentTypeId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }
}
