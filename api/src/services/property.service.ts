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
import { PagiantedPropertyDto } from '../dtos/properties/paginated-property.dto';
import PropertyCreate from '../dtos/properties/property-create.dto';
import { PropertyUpdate } from '../dtos/properties/property-update.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async list(params: PropertyQueryParams): Promise<PagiantedPropertyDto> {
    const whereClause = params?.search
      ? {
          name: {
            contains: params.search,
          },
        }
      : {};

    const count = await this.prisma.properties.count({
      where: whereClause,
    });

    let page = params.page;

    if (count && params.limit && params.limit !== 'all' && params.page > 1) {
      if (Math.ceil(count / params.limit) < params.page) {
        page = 1;
      }
    }

    const properitesRaw = await this.prisma.properties.findMany({
      skip: calculateSkip(params.limit, page),
      take: calculateTake(params.limit),
      where: whereClause,
    });

    const properites = mapTo(Property, properitesRaw);

    return {
      items: properites,
      meta: buildPaginationMetaInfo(params, count, properites.length),
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
        `property with id ${propertyId} was requested but not found `,
      );
    }

    return mapTo(Property, propertyRaw);
  }

  async create(propertyDto: PropertyCreate) {
    const rawProperty = this.prisma.properties.create({
      data: {
        ...propertyDto,
      },
    });

    return mapTo(Property, rawProperty);
  }

  async update(propertyDto: PropertyUpdate) {
    const rawProperty = await this.prisma.properties.update({
      data: {
        ...propertyDto,
      },
      where: {
        id: propertyDto.id,
      },
    });

    return mapTo(Property, rawProperty);
  }

  async deleteOne(propertyId: string) {
    if (!propertyId) {
      throw new BadRequestException('a property ID must be provided');
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
}
