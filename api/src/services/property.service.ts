import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PropertyQueryParams } from '../dtos/properties/property-query-params.dto';
import {
  buildPaginationMetaInfo,
  calculateSkip,
  calculateTake,
} from '../utilities/pagination-helpers';
import { mapTo } from '../utilities/mapTo';
import Property from '../dtos/properties/property.dto';
import { PaginatedPropertyDto } from '../dtos/properties/paginated-property.dto';
import PropertyCreate from '../dtos/properties/property-create.dto';
import { PropertyUpdate } from '../dtos/properties/property-update.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { Prisma } from '@prisma/client';
import { User } from '../dtos/users/user.dto';
import { PermissionService } from './permission.service';
import { permissionActions } from '../enums/permissions/permission-actions-enum';

@Injectable()
export class PropertyService {
  constructor(
    private prisma: PrismaService,
    private permissionService: PermissionService,
  ) {}

  async list(params: PropertyQueryParams): Promise<PaginatedPropertyDto> {
    const whereClause = this.buildWhere(params);

    const count = await this.prisma.properties.count({
      where: whereClause,
    });

    let page = params.page;

    if (count && params.limit && params.limit !== 'all' && params.page > 1) {
      if (Math.ceil(count / params.limit) < params.page) {
        page = 1;
      }
    }

    const propertiesRaw = await this.prisma.properties.findMany({
      skip: calculateSkip(params.limit, page),
      take: calculateTake(params.limit),
      where: whereClause,
      include: {
        jurisdictions: true,
      },
    });

    const properties = mapTo(Property, propertiesRaw);

    return {
      items: properties,
      meta: buildPaginationMetaInfo(params, count, properties.length),
    };
  }

  async findOne(propertyId?: string) {
    if (!propertyId) {
      throw new BadRequestException('a property ID must be provided');
    }
    const propertyRaw = await this.prisma.properties.findUnique({
      where: {
        id: propertyId,
      },
      include: {
        jurisdictions: true,
      },
    });

    if (!propertyRaw) {
      throw new NotFoundException(
        `property with id ${propertyId} was requested but not found`,
      );
    }

    return mapTo(Property, propertyRaw);
  }

  async create(propertyDto: PropertyCreate, requestingUser: User) {
    if (!propertyDto.jurisdictions) {
      throw new BadRequestException('A jurisdiction must be provided');
    }

    const rawJurisdiction = await this.prisma.jurisdictions.findFirst({
      select: {
        featureFlags: true,
        id: true,
      },
      where: {
        id: propertyDto.jurisdictions.id,
      },
    });

    if (!rawJurisdiction) {
      throw new NotFoundException(
        `Entry for the linked jurisdiction with id: ${propertyDto.jurisdictions.id} was not found`,
      );
    }

    await this.permissionService.canOrThrow(
      requestingUser,
      'properties',
      permissionActions.create,
      {
        jurisdictionId: rawJurisdiction.id,
      },
    );

    const rawProperty = this.prisma.properties.create({
      data: {
        ...propertyDto,
        jurisdictions: propertyDto.jurisdictions
          ? {
              connect: {
                id: propertyDto.jurisdictions.id,
              },
            }
          : undefined,
      },
      include: {
        jurisdictions: true,
      },
    });

    return mapTo(Property, rawProperty);
  }

  async update(propertyDto: PropertyUpdate, requestingUser: User) {
    if (!propertyDto.jurisdictions) {
      throw new BadRequestException('A jurisdiction must be provided');
    }

    const rawJurisdiction = await this.prisma.jurisdictions.findFirst({
      select: {
        id: true,
      },
      where: {
        id: propertyDto.jurisdictions.id,
      },
    });

    if (!rawJurisdiction) {
      throw new NotFoundException(
        `Entry for the linked jurisdiction with id: ${propertyDto.jurisdictions.id} was not found`,
      );
    }

    await this.permissionService.canOrThrow(
      requestingUser,
      'properties',
      permissionActions.update,
      {
        id: propertyDto.id,
        jurisdictionId: rawJurisdiction.id,
      },
    );

    await this.findOrThrow(propertyDto.id);

    const rawProperty = await this.prisma.properties.update({
      data: {
        ...propertyDto,
        jurisdictions: propertyDto.jurisdictions
          ? {
              connect: {
                id: propertyDto.jurisdictions.id,
              },
            }
          : undefined,
      },
      where: {
        id: propertyDto.id,
      },
      include: {
        jurisdictions: true,
      },
    });

    return mapTo(Property, rawProperty);
  }

  async deleteOne(propertyId: string, requestingUser: User) {
    if (!propertyId) {
      throw new BadRequestException('a property ID must be provided');
    }

    const propertyData = await this.findOrThrow(propertyId);

    if (!propertyData.jurisdictions) {
      throw new NotFoundException(
        'The property is not connected to any jurisdiction',
      );
    }

    const rawJurisdiction = await this.prisma.jurisdictions.findFirst({
      select: {
        id: true,
      },
      where: {
        id: propertyData.jurisdictions.id,
      },
    });

    if (!rawJurisdiction) {
      throw new NotFoundException(
        `Entry for the linked jurisdiction with id: ${propertyData.jurisdictions.id} was not found`,
      );
    }

    await this.permissionService.canOrThrow(
      requestingUser,
      'properties',
      permissionActions.create,
      {
        jurisdictionId: rawJurisdiction.id,
      },
    );

    await this.prisma.properties.delete({
      where: {
        id: propertyId,
      },
    });

    return {
      success: true,
    } as SuccessDTO;
  }

  async findOrThrow(propertyId: string): Promise<Property> {
    const property = await this.prisma.properties.findFirst({
      where: {
        id: propertyId,
      },
      include: {
        jurisdictions: true,
      },
    });

    if (!property) {
      throw new BadRequestException(
        `Property with id ${propertyId} was not found`,
      );
    }

    return property;
  }

  buildWhere(params: PropertyQueryParams): Prisma.PropertiesWhereInput {
    const filters: Prisma.PropertiesWhereInput[] = [];

    if (params.search) {
      filters.push({
        AND: {
          name: {
            contains: params.search,
          },
        },
      });
    }

    if (params.jurisdiction) {
      filters.push({
        AND: {
          jurisdictions: {
            id: params.jurisdiction,
          },
        },
      });
    }

    return {
      AND: filters,
    };
  }
}
