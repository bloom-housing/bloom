import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UnitAccessibilityPriorityType } from '../dtos/unit-accessibility-priority-types/unit-accessibility-priority-type.dto';
import { UnitAccessibilityPriorityTypeCreate } from '../dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create.dto';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { UnitAccessibilityPriorityTypeUpdate } from '../dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-update.dto';

/*
  this is the service for unit accessibility priority types
  it handles all the backend's business logic for reading/writing/deleting unit type data
*/

@Injectable()
export class UnitAccessibilityPriorityTypeService {
  constructor(private prisma: PrismaService) {}

  /*
    this will get a set of unit accessibility priority types given the params passed in
  */
  async list(): Promise<UnitAccessibilityPriorityType[]> {
    const rawunitPriortyTypes =
      await this.prisma.unitAccessibilityPriorityTypes.findMany();
    return mapTo(UnitAccessibilityPriorityType, rawunitPriortyTypes);
  }

  /*
    this will return 1 unit accessibility priority type or error
  */
  async findOne(
    unitAccessibilityPriorityTypeId: string,
  ): Promise<UnitAccessibilityPriorityType> {
    const rawunitPriortyTypes =
      await this.prisma.unitAccessibilityPriorityTypes.findUnique({
        where: {
          id: unitAccessibilityPriorityTypeId,
        },
      });

    if (!rawunitPriortyTypes) {
      throw new NotFoundException(
        `unitAccessibilityPriorityTypeId ${unitAccessibilityPriorityTypeId} was requested but not found`,
      );
    }

    return mapTo(UnitAccessibilityPriorityType, rawunitPriortyTypes);
  }

  /*
    this will create a unit accessibility priority type
  */
  async create(
    incomingData: UnitAccessibilityPriorityTypeCreate,
  ): Promise<UnitAccessibilityPriorityType> {
    const rawResult = await this.prisma.unitAccessibilityPriorityTypes.create({
      data: {
        ...incomingData,
      },
    });

    return mapTo(UnitAccessibilityPriorityType, rawResult);
  }

  /*
    this will update a unit accessibility priority type's name or items field
    if no unit accessibility priority type has the id of the incoming argument an error is thrown
  */
  async update(
    incomingData: UnitAccessibilityPriorityTypeUpdate,
  ): Promise<UnitAccessibilityPriorityType> {
    await this.findOrThrow(incomingData.id);

    const rawResults = await this.prisma.unitAccessibilityPriorityTypes.update({
      data: {
        ...incomingData,
        id: undefined,
      },
      where: {
        id: incomingData.id,
      },
    });
    return mapTo(UnitAccessibilityPriorityType, rawResults);
  }

  /*
    this will delete a unit accessibility priority type
  */
  async delete(unitAccessibilityPriorityTypeId: string): Promise<SuccessDTO> {
    await this.findOrThrow(unitAccessibilityPriorityTypeId);
    await this.prisma.unitAccessibilityPriorityTypes.delete({
      where: {
        id: unitAccessibilityPriorityTypeId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }

  /*
    this will either find a record or throw a customized error
  */
  async findOrThrow(unitAccessibilityPriorityTypeId: string): Promise<boolean> {
    const unitType =
      await this.prisma.unitAccessibilityPriorityTypes.findUnique({
        where: {
          id: unitAccessibilityPriorityTypeId,
        },
      });

    if (!unitType) {
      throw new NotFoundException(
        `unitAccessibilityPriorityTypeId ${unitAccessibilityPriorityTypeId} was requested but not found`,
      );
    }

    return true;
  }
}
