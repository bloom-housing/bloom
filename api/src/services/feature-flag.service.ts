import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JurisdictionService } from './jurisdiction.service';
import { PrismaService } from './prisma.service';
import { FeatureFlag } from '../dtos/feature-flags/feature-flag.dto';
import { FeatureFlagAssociate } from '../dtos/feature-flags/feature-flag-associate.dto';
import { FeatureFlagCreate } from '../dtos/feature-flags/feature-flag-create.dto';
import { FeatureFlagUpdate } from '../dtos/feature-flags/feature-flag-update.dto';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { mapTo } from '../utilities/mapTo';

/**
      this is the service for feature flags
      it handles all the backend's business logic for reading/writing/deleting feature flag data
    */
@Injectable()
export class FeatureFlagService {
  constructor(
    private prisma: PrismaService,
    private jurisdictionService: JurisdictionService,
  ) {}

  /**
        this will get a set of feature flags
      */
  async list(): Promise<FeatureFlag[]> {
    const rawfeatureFlags = await this.prisma.featureFlags.findMany({
      include: {
        jurisdictions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return mapTo(FeatureFlag, rawfeatureFlags);
  }

  /*
        this will return 1 feature flag or error
      */
  async findOne(featureFlagId: string): Promise<FeatureFlag> {
    if (!featureFlagId) {
      throw new BadRequestException('a feature flag id must be provided');
    }

    const rawFeatureFlag = await this.prisma.featureFlags.findFirst({
      include: {
        jurisdictions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id: featureFlagId,
      },
    });

    if (!rawFeatureFlag) {
      throw new NotFoundException(
        `feature flag id ${featureFlagId} was requested but not found`,
      );
    }

    return mapTo(FeatureFlag, rawFeatureFlag);
  }

  /*
        this will create a feature flag
      */
  async create(dto: FeatureFlagCreate): Promise<FeatureFlag> {
    const rawResult = await this.prisma.featureFlags.create({
      data: {
        ...dto,
      },
      include: {
        jurisdictions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return mapTo(FeatureFlag, rawResult);
  }

  /*
        this will update a feature flag's name or description field
        if no feature flag has the id of the incoming argument an error is thrown
      */
  async update(dto: FeatureFlagUpdate): Promise<FeatureFlag> {
    await this.findOrThrow(dto.id);

    const rawResults = await this.prisma.featureFlags.update({
      data: {
        ...dto,
        id: undefined,
      },
      include: {
        jurisdictions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id: dto.id,
      },
    });
    return mapTo(FeatureFlag, rawResults);
  }

  /*
        this will delete a feature flag
      */
  async delete(featureFlagId: string): Promise<SuccessDTO> {
    await this.findOrThrow(featureFlagId);
    await this.prisma.featureFlags.delete({
      where: {
        id: featureFlagId,
      },
    });
    return {
      success: true,
    } as SuccessDTO;
  }

  /*
        this will either find a record or throw a customized error
      */
  async findOrThrow(featureFlagId: string): Promise<boolean> {
    const featureFlag = await this.prisma.featureFlags.findFirst({
      where: {
        id: featureFlagId,
      },
    });

    if (!featureFlag) {
      throw new NotFoundException(
        `feature flag id ${featureFlagId} was requested but not found`,
      );
    }

    return true;
  }

  async associateJurisdictions(
    dto: FeatureFlagAssociate,
  ): Promise<FeatureFlag> {
    await this.findOrThrow(dto.id);

    const idsToAssociateSet = new Set(dto.associate);

    dto.remove.forEach((id) => {
      if (idsToAssociateSet.has(id)) {
        // Remove the item from the set
        idsToAssociateSet.delete(id);
      }
    });

    const idsToAssociate = [...idsToAssociateSet];

    for (const id of idsToAssociate) {
      try {
        await this.jurisdictionService.findOrThrow(id);
      } catch (e) {
        throw new BadRequestException(
          `jurisdiction id ${id} was requested for association but not found`,
        );
      }
    }

    const rawResults = await this.prisma.featureFlags.update({
      data: {
        jurisdictions: {
          connect: idsToAssociate.map((id) => {
            return { id: id };
          }),
          disconnect: dto.remove.map((id) => {
            return { id: id };
          }),
        },
      },
      include: {
        jurisdictions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        id: dto.id,
      },
    });
    return mapTo(FeatureFlag, rawResults);
  }
}
