import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AgencyQueryParams } from '../dtos/agency/agency-query-params.dto';
import AgencyCreate from '../dtos/agency/agency-create.dto';
import { AgencyUpdate } from '../dtos/agency/agency-update.dto';
import {
  buildPaginationMetaInfo,
  calculateSkip,
  calculateTake,
} from '../utilities/pagination-helpers';
import { mapTo } from '../utilities/mapTo';
import Agency from '../dtos/agency/agency.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { IdDTO } from '../dtos/shared/id.dto';

@Injectable()
export class AgencyService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns a paginated list of agencies matching the provided query parameters.
   *
   * @param params - Query parameters including pagination.
   * @returns A paginated DTO containing the matching agencies and pagination metadata.
   */
  async list(params: AgencyQueryParams) {
    const count = await this.prisma.agency.count();

    let page = params.page;

    if (count && params.limit && params.limit !== 'all' && params.page > 1) {
      if (Math.ceil(count / params.limit) < params.page) {
        page = 1;
      }
    }

    const agenciesRaw = await this.prisma.agency.findMany({
      skip: calculateSkip(params.limit, page),
      take: calculateTake(params.limit),
      include: {
        jurisdictions: true,
      },
    });

    const agencies = mapTo(Agency, agenciesRaw);

    return {
      items: agencies,
      meta: buildPaginationMetaInfo(params, count, agencies.length),
    };
  }

  /**
   * Returns a single agency entry matching the provided ID.
   *
   * @param agencyId - The ID of the agency to retrieve.
   * @returns The mapped Agency DTO for the requested agency.
   * @throws {BadRequestException} If no agency ID is provided
   * @throws {NotFoundException} If no agency is found for the given ID.
   */
  async findOne(agencyId?: string) {
    if (!agencyId) {
      throw new BadRequestException('An agency ID must be provided');
    }

    const agencyRaw = await this.findOrThrowAgency(agencyId);

    return mapTo(Agency, agencyRaw);
  }

  /**
   * Creates a new property and links it to the provided jurisdiction.
   *
   * @param agencyDto - The data used to create the agency entry.
   * @returns The DTO object of the newly created agency.
   * @throws {BadRequestException} If a jurisdiction ID to link to is not provided.
   * @throws {NotFoundException} If a jurisdiction to link to is not found for the given ID.
   */
  async create(agencyDto: AgencyCreate) {
    if (!agencyDto.jurisdictions || !agencyDto.jurisdictions.id) {
      throw new BadRequestException('A valid jurisdiction must be provided');
    }

    await this.findOrThrowJurisdiction(agencyDto.jurisdictions.id);

    const rawAgency = await this.prisma.agency.create({
      data: {
        ...agencyDto,
        jurisdictions: {
          connect: {
            id: agencyDto.jurisdictions.id,
          },
        },
      },
      include: {
        jurisdictions: true,
      },
    });

    return mapTo(Agency, rawAgency);
  }

  /**
   * Updates and existing agency entry with new data.
   *
   * @param agencyDto - The data used to update the agency entry.
   * @returns The updated DTO of the targeted agency.
   * @throws {BadRequestException} If a jurisdiction ID to link to is not provided.
   * @throws {NotFoundException} If a jurisdiction to link to is not found for the given ID.
   */
  async update(agencyDto: AgencyUpdate) {
    if (!agencyDto.jurisdictions || !agencyDto.jurisdictions.id) {
      throw new BadRequestException('A valid jurisdiction must be provided');
    }

    await this.findOrThrowJurisdiction(agencyDto.jurisdictions.id);

    await this.findOrThrowAgency(agencyDto.id);

    const rawAgency = await this.prisma.agency.update({
      data: {
        ...agencyDto,
        jurisdictions: {
          connect: {
            id: agencyDto.jurisdictions.id,
          },
        },
      },
      where: {
        id: agencyDto.id,
      },
      include: {
        jurisdictions: true,
      },
    });

    return mapTo(Agency, rawAgency);
  }

  /**
   * Deletes a record of a given agency by its ID.
   *
   * @param agencyId - The ID of the agency which should be removed.
   * @returns A `SuccessDTO` indicating that the delete operation completed successfully.
   * @throws {BadRequestException} If no property ID is provided.
   */
  async deleteOne(idDto: IdDTO) {
    if (!idDto || !idDto.id) {
      throw new BadRequestException('A agency ID must be provided');
    }

    await this.findOrThrowAgency(idDto.id);

    await this.prisma.agency.delete({
      where: {
        id: idDto.id,
      },
    });

    return {
      success: true,
    } as SuccessDTO;
  }

  async findOrThrowJurisdiction(jurisdictionId: string): Promise<void> {
    const rawJurisdiction = await this.prisma.jurisdictions.findUnique({
      select: {
        id: true,
      },
      where: {
        id: jurisdictionId,
      },
    });

    if (!rawJurisdiction) {
      throw new NotFoundException(
        `A jurisdiction with ID: ${jurisdictionId} was not found`,
      );
    }
  }

  async findOrThrowAgency(agencyId: string): Promise<Agency> {
    const exitingAgency = await this.prisma.agency.findUnique({
      where: {
        id: agencyId,
      },
      include: {
        jurisdictions: true,
      },
    });

    if (!exitingAgency) {
      throw new NotFoundException(
        `An agency with id: ${agencyId} was not found`,
      );
    }

    return exitingAgency;
  }
}
