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
import { buildFilter } from '../utilities/build-filter';
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
    });

    if (!propertyRaw) {
      throw new NotFoundException(
        `property with id ${propertyId} was requested but not found`,
      );
    }

    return mapTo(Property, propertyRaw);
  }

  async create(propertyDto: PropertyCreate, requestingUser: User) {
    const rawJurisdiction = await this.prisma.jurisdictions.findFirstOrThrow({
      select: {
        featureFlags: true,
        id: true,
      },
      where: {
        id: propertyDto.jurisdictions
          ? propertyDto.jurisdictions.id
          : undefined,
      },
    });

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
    });

    return mapTo(Property, rawProperty);
  }

  async update(propertyDto: PropertyUpdate, requestingUser: User) {
    const rawJurisdiction = await this.prisma.jurisdictions.findFirstOrThrow({
      select: {
        featureFlags: true,
        id: true,
      },
      where: {
        id: propertyDto.jurisdictions
          ? propertyDto.jurisdictions.id
          : undefined,
      },
    });

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
    });

    return mapTo(Property, rawProperty);
  }

  async deleteOne(propertyId: string, requestingUser: User) {
    if (!propertyId) {
      throw new BadRequestException('a property ID must be provided');
    }

    const propertyData = await this.findOrThrow(propertyId);

    const rawJurisdiction = await this.prisma.jurisdictions.findFirstOrThrow({
      select: {
        featureFlags: true,
        id: true,
      },
      where: {
        id: propertyData.jurisdictions
          ? propertyData.jurisdictions.id
          : undefined,
      },
    });

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

    if (!params?.filter?.length) {
      return {
        AND: filters,
      };
    }

    params.filter.forEach((filter) => {
      const builtFilter = buildFilter({
        $comparison: filter.$comparison,
        $include_nulls: false,
        value: filter.jurisdiction,
        key: 'jurisdiction',
        caseSensitive: true,
      });

      filters.push({
        OR: builtFilter.map((entry) => ({
          jurisdictions: {
            id: entry,
          },
        })),
      });
    });

    return {
      AND: filters,
    };
  }
}
