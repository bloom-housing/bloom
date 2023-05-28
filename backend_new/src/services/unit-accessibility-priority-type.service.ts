import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UnitAccessibilityPriorityType } from '../dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-get.dto';
import { UnitAccessibilityPriorityTypeCreate } from '../dtos/unit-accessibility-priority-types/unit-accessibility-priority-type-create';
import { mapTo } from '../utilities/mapTo';
import { SuccessDTO } from '../dtos/shared/success.dto';

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
  async list() {
    const rawunitPriortyTypes =
      await this.prisma.unitAccessibilityPriorityTypes.findMany();
    return mapTo(UnitAccessibilityPriorityType, rawunitPriortyTypes);
  }

  /*
    this will return 1 unit accessibility priority type or error
  */
  async findOne(unitAccessibilityPriorityTypeId: string) {
    const rawunitPriortyTypes =
      await this.prisma.unitAccessibilityPriorityTypes.findFirst({
        where: {
          id: {
            equals: unitAccessibilityPriorityTypeId,
          },
        },
      });

    if (!rawunitPriortyTypes) {
      throw new NotFoundException();
    }

    return mapTo(UnitAccessibilityPriorityType, rawunitPriortyTypes);
  }

  /*
    this will create a unit accessibility priority type
  */
  async create(incomingData: UnitAccessibilityPriorityTypeCreate) {
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
  async update(incomingData: UnitAccessibilityPriorityType) {
    const unitPriorityType =
      await this.prisma.unitAccessibilityPriorityTypes.findFirst({
        where: {
          id: incomingData.id,
        },
      });

    if (!unitPriorityType) {
      throw new NotFoundException();
    }

    const rawResults = await this.prisma.unitAccessibilityPriorityTypes.update({
      data: {
        name: incomingData.name,
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
  async delete(unitAccessibilityPriorityTypeId: string) {
    await this.prisma.unitAccessibilityPriorityTypes.delete({
      where: {
        id: unitAccessibilityPriorityTypeId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }
}
