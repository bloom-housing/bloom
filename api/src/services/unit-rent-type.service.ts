import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UnitRentType } from '../dtos/unit-rent-types/unit-rent-type.dto';
import { UnitRentTypeCreate } from '../dtos/unit-rent-types/unit-rent-type-create.dto';
import { UnitRentTypeUpdate } from '../dtos/unit-rent-types/unit-rent-type-update.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { UnitRentTypes } from '@prisma/client';

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
  async list(): Promise<UnitRentType[]> {
    const rawUnitRentTypes = await this.prisma.unitRentTypes.findMany();
    return mapTo(UnitRentType, rawUnitRentTypes);
  }

  /*
    this will return 1 unit rent type or error
  */
  async findOne(unitRentTypeId: string): Promise<UnitRentType> {
    const rawUnitRentType = await this.findOrThrow(unitRentTypeId);

    if (!rawUnitRentType) {
      throw new NotFoundException(
        `unitRentTypeId ${unitRentTypeId} was requested but not found`,
      );
    }

    return mapTo(UnitRentType, rawUnitRentType);
  }

  /*
    this will create a unit rent type
  */
  async create(incomingData: UnitRentTypeCreate): Promise<UnitRentType> {
    const rawResult = await this.prisma.unitRentTypes.create({
      data: {
        ...incomingData,
        id: undefined,
      },
    });

    return mapTo(UnitRentType, rawResult);
  }

  /*
    this will update a unit rent type's name or items field
    if no unit rent type has the id of the incoming argument an error is thrown
  */
  async update(incomingData: UnitRentTypeUpdate): Promise<UnitRentType> {
    await this.findOrThrow(incomingData.id);

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
  async delete(unitRentTypeId: string): Promise<SuccessDTO> {
    await this.findOrThrow(unitRentTypeId);
    await this.prisma.unitRentTypes.delete({
      where: {
        id: unitRentTypeId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    this will either find a record or throw a customized error
  */
  async findOrThrow(unitRentTypeId: string): Promise<UnitRentTypes> {
    const unitRentType = await this.prisma.unitRentTypes.findUnique({
      where: {
        id: unitRentTypeId,
      },
    });

    if (!unitRentType) {
      throw new NotFoundException(
        `unitRentTypeId ${unitRentTypeId} was requested but not found`,
      );
    }

    return unitRentType;
  }
}
