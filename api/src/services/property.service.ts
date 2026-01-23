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

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns a paginated list of properties matching the provided query parameters.
   *
   * @param params - Query parameters including pagination, search term, and filters.
   * @returns A paginated DTO containing the matching properties and pagination metadata.
   */
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

  /**
   * Retrieves a single property by its ID, including its jurisdictions.
   *
   * @param propertyId - The unique identifier of the property to retrieve.
   * @returns The mapped `Property` DTO for the requested property.
   * @throws {BadRequestException} If no property ID is provided.
   * @throws {NotFoundException} If no property is found for the given ID.
   */
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

  /**
   * Creates a new property and links it to the provided jurisdiction.
   *
   * @param propertyDto - The data used to create the property.
   * @returns The newly created property mapped to a `Property` DTO.
   * @throws {BadRequestException} If a jurisdiction is not provided.
   * @throws {NotFoundException} If the linked jurisdiction cannot be found.
   */
  async create(propertyDto: PropertyCreate) {
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

    const rawProperty = await this.prisma.properties.create({
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

  /**
   * Updates an existing property and its jurisdiction linkage.
   *
   * @param propertyDto - The updated property data, including ID and jurisdiction.
   * @returns The updated property mapped to a `Property` DTO.
   * @throws {BadRequestException} If a jurisdiction is not provided.
   * @throws {NotFoundException} If the linked jurisdiction cannot be found.
   */
  async update(propertyDto: PropertyUpdate) {
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

  /**
   * Deletes a property by its ID after validating jurisdiction linkage and permissions.
   *
   * @param propertyId - The ID of the property to delete.
   * @returns A `SuccessDTO` indicating that the delete operation completed successfully.
   * @throws {BadRequestException} If no property ID is provided.
   * @throws {NotFoundException} If the property or its linked jurisdiction is not found.
   */
  async deleteOne(propertyId: string) {
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

    await this.prisma.properties.delete({
      where: {
        id: propertyId,
      },
    });

    return {
      success: true,
    } as SuccessDTO;
  }

  /**
   * Finds a property by ID or throws if it cannot be found.
   *
   * @param propertyId - The ID of the property to look up.
   * @returns The raw property entity including its jurisdictions.
   * @throws {BadRequestException} If no property is found for the given ID.
   */
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

  /**
   * Builds a valid Prisma filter object from the provided query parameters.
   *
   * @param params - Query parameters including search term and jurisdiction filter.
   * @returns A Prisma-compatible where clause used to filter properties.
   */
  buildWhere(params: PropertyQueryParams): Prisma.PropertiesWhereInput {
    const filters: Prisma.PropertiesWhereInput[] = [];

    if (params.search) {
      filters.push({
        AND: {
          name: {
            contains: params.search,
            mode: Prisma.QueryMode.insensitive,
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
