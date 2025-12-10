import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PropertyQueryParams } from 'src/dtos/properties/property-query-params.dto';
import {
  buildPaginationMetaInfo,
  calculateSkip,
  calculateTake,
} from 'src/utilities/pagination-helpers';
import { mapTo } from 'src/utilities/mapTo';
import Property from 'src/dtos/properties/property.dto';
import { PagiantedPropertyDto } from 'src/dtos/properties/paginated-property.dto';
import PropertyCreate from 'src/dtos/properties/property-create.dto';

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

  async create(propertDto: PropertyCreate) {
    const rawProperty = this.prisma.properties.create({
      data: {
        ...propertDto,
      },
    });

    return mapTo(Property, rawProperty);
  }
}
