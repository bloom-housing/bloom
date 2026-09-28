import { of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { FeatureFlagAssociate } from '../../../src/dtos/feature-flags/feature-flag-associate.dto';
import { FeatureFlagCreate } from '../../../src/dtos/feature-flags/feature-flag-create.dto';
import { FeatureFlagUpdate } from '../../../src/dtos/feature-flags/feature-flag-update.dto';
import { FeatureFlagService } from '../../../src/services/feature-flag.service';
import { JurisdictionService } from '../../../src/services/jurisdiction.service';
import { PrismaService } from '../../../src/services/prisma.service';

describe('Testing feature flag service', () => {
  let service: FeatureFlagService;
  let prisma: PrismaService;
  const httpServiceMock = {
    get: jest.fn(),
    post: jest.fn().mockReturnValue(of({})),
  };

  const mockFeatureFlag = (position: number, date: Date, active = true) => {
    return {
      id: randomUUID(),
      createdAt: date,
      updatedAt: date,
      name: `feature flag ${position}`,
      description: `feature flag description ${position}`,
      active: active,
    };
  };

  const mockFeatureFlagSet = (numberToCreate: number, date: Date) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockFeatureFlag(i, date));
    }
    return toReturn;
  };

  beforeEach(() => {
    httpServiceMock.post.mockClear();
    httpServiceMock.post.mockReturnValue(of({}));
    // revalidatePublicSites returns early without a passkey, and CI has no api/.env to supply one.
    process.env.API_PASS_KEY = 'test-passkey';
    delete process.env.PUBLIC_SITE_DISCOVERY_NAME;
  });

  afterEach(() => {
    delete process.env.API_PASS_KEY;
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureFlagService,
        JurisdictionService,
        { provide: HttpService, useValue: httpServiceMock },
        PrismaService,
        Logger,
      ],
    }).compile();

    service = module.get<FeatureFlagService>(FeatureFlagService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('Testing list()', () => {
    it('should return list of feature flags', async () => {
      const date = new Date();
      const mockedValue = mockFeatureFlagSet(3, date);
      prisma.featureFlags.findMany = jest.fn().mockResolvedValue(mockedValue);

      expect(await service.list()).toEqual(mockedValue);

      expect(prisma.featureFlags.findMany).toHaveBeenCalledWith({
        include: {
          jurisdictions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });
  });

  describe('Testing findOne()', () => {
    it('should find and return one feature flag', async () => {
      const date = new Date();
      const mockedValue = mockFeatureFlag(1, date);
      prisma.featureFlags.findFirst = jest.fn().mockResolvedValue(mockedValue);

      expect(await service.findOne(mockedValue.id)).toEqual(mockedValue);

      expect(prisma.featureFlags.findFirst).toHaveBeenCalledWith({
        include: {
          jurisdictions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id: mockedValue.id,
        },
      });
    });

    it('should not find a feature flag and throw error', async () => {
      prisma.featureFlags.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.findOne('example Id'),
      ).rejects.toThrowError(
        'feature flag id example Id was requested but not found',
      );

      expect(prisma.featureFlags.findFirst).toHaveBeenCalledWith({
        include: {
          jurisdictions: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          id: 'example Id',
        },
      });
    });
  });

  describe('Testing create()', () => {
    it('should create a new feature flag record', async () => {
      const date = new Date();
      const mockedValue = mockFeatureFlag(1, date);
      prisma.featureFlags.create = jest.fn().mockResolvedValue(mockedValue);

      const params: FeatureFlagCreate = {
        name: mockedValue.name,
        description: mockedValue.description,
        active: mockedValue.active,
      };

      expect(await service.create(params)).toEqual(mockedValue);

      expect(prisma.featureFlags.create).toHaveBeenCalledWith({
        data: {
          name: mockedValue.name,
          description: mockedValue.description,
          active: mockedValue.active,
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
    });
  });

  describe('Testing update()', () => {
    it('should update existing feature flag record', async () => {
      const date = new Date();

      const mockedValue = mockFeatureFlag(1, date);

      prisma.featureFlags.findFirst = jest.fn().mockResolvedValue(mockedValue);
      prisma.featureFlags.update = jest.fn().mockResolvedValue({
        ...mockedValue,
        description: 'updated feature flag 1',
      });

      const params: FeatureFlagUpdate = {
        id: mockedValue.id,
        description: 'updated feature flag 1',
        active: mockedValue.active,
      };

      expect(await service.update(params)).toEqual({
        id: mockedValue.id,
        name: mockedValue.name,
        description: 'updated feature flag 1',
        active: mockedValue.active,
        createdAt: date,
        updatedAt: date,
        jurisdictions: undefined,
      });

      expect(prisma.featureFlags.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockedValue.id,
        },
      });

      expect(prisma.featureFlags.update).toHaveBeenCalledWith({
        data: {
          description: 'updated feature flag 1',
          active: mockedValue.active,
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
          id: mockedValue.id,
        },
      });
    });

    it('should not find a feature flag and throw error', async () => {
      prisma.featureFlags.findFirst = jest.fn().mockResolvedValue(null);
      prisma.featureFlags.update = jest.fn().mockResolvedValue(null);

      const params: FeatureFlagUpdate = {
        id: 'example id',
        description: 'example description',
        active: true,
      };

      await expect(
        async () => await service.update(params),
      ).rejects.toThrowError(
        'feature flag id example id was requested but not found',
      );

      expect(prisma.featureFlags.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'example id',
        },
      });
    });
  });

  describe('Testing delete()', () => {
    it('should delete feature flag record', async () => {
      const date = new Date();
      const mockedValue = mockFeatureFlag(1, date);

      prisma.featureFlags.findFirst = jest.fn().mockResolvedValue(mockedValue);
      prisma.featureFlags.delete = jest.fn().mockResolvedValue(mockedValue);

      expect(await service.delete(mockedValue.id)).toEqual({
        success: true,
      });

      expect(prisma.featureFlags.delete).toHaveBeenCalledWith({
        where: {
          id: mockedValue.id,
        },
      });

      expect(prisma.featureFlags.delete).toHaveBeenCalledWith({
        where: {
          id: mockedValue.id,
        },
      });
    });
  });

  describe('Testing associateJurisdictions()', () => {
    const givenAssociation = () => {
      const mockedValue = mockFeatureFlag(1, new Date());
      prisma.featureFlags.findFirst = jest
        .fn()
        .mockResolvedValue({ ...mockedValue, jurisdictions: [] });
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue({ id: 'id' });
      prisma.featureFlags.update = jest
        .fn()
        .mockResolvedValue({ ...mockedValue, jurisdictions: [] });
      return mockedValue;
    };

    // The public site reads its flags off the jurisdiction, which it caches for the whole
    // revalidate window, so a toggle that is not followed by a rebuild takes an hour to show.
    it('rebuilds the sites gaining the flag and the ones losing it', async () => {
      const mockedValue = givenAssociation();
      prisma.jurisdictions.findMany = jest
        .fn()
        .mockResolvedValue([
          { publicUrl: 'http://gaining' },
          { publicUrl: 'http://losing' },
        ]);

      await service.associateJurisdictions({
        id: mockedValue.id,
        associate: ['gaining-id'],
        remove: ['losing-id'],
      });

      expect(prisma.jurisdictions.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['gaining-id', 'losing-id'] } },
        select: { publicUrl: true },
      });
      expect(httpServiceMock.post).toHaveBeenCalledWith(
        'http://gaining/api/revalidate',
        {},
        expect.anything(),
      );
      expect(httpServiceMock.post).toHaveBeenCalledWith(
        'http://losing/api/revalidate',
        {},
        expect.anything(),
      );
    });

    // Two jurisdictions on one deployment share a public site, so it must be rebuilt once.
    it('posts once when two jurisdictions share a public site', async () => {
      const mockedValue = givenAssociation();
      prisma.jurisdictions.findMany = jest
        .fn()
        .mockResolvedValue([
          { publicUrl: 'http://site' },
          { publicUrl: 'http://site/' },
        ]);

      await service.associateJurisdictions({
        id: mockedValue.id,
        associate: ['gaining-id'],
        remove: ['losing-id'],
      });

      expect(httpServiceMock.post).toHaveBeenCalledTimes(1);
      expect(httpServiceMock.post).toHaveBeenCalledWith(
        'http://site/api/revalidate',
        {},
        expect.anything(),
      );
    });

    it('should associate and remove jurisdictions from feature flag record', async () => {
      const date = new Date();

      const mockedValue = mockFeatureFlag(1, date);
      const unchangingJurisdiction = {
        id: 'jurisdiction id 1',
        name: 'jurisdiction name 1',
      };
      const associateJurisdiction = {
        id: 'jurisdiction id 2',
        name: 'jurisdiction name 2',
      };
      const removeJurisdiction = {
        id: 'jurisdiction id 3',
        name: 'jurisdiction name 3',
      };

      prisma.featureFlags.findFirst = jest.fn().mockResolvedValue({
        ...mockedValue,
        jurisdictions: [unchangingJurisdiction, removeJurisdiction],
      });
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue({ id: 'id' });
      prisma.featureFlags.update = jest.fn().mockResolvedValue({
        ...mockedValue,
        jurisdictions: [unchangingJurisdiction, associateJurisdiction],
      });
      prisma.jurisdictions.findMany = jest.fn().mockResolvedValue([]);

      const params: FeatureFlagAssociate = {
        id: mockedValue.id,
        associate: [associateJurisdiction.id],
        remove: [removeJurisdiction.id],
      };

      expect(await service.associateJurisdictions(params)).toEqual({
        id: mockedValue.id,
        name: mockedValue.name,
        description: mockedValue.description,
        active: mockedValue.active,
        createdAt: date,
        updatedAt: date,
        jurisdictions: [unchangingJurisdiction, associateJurisdiction],
      });

      expect(prisma.featureFlags.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockedValue.id,
        },
      });

      expect(prisma.featureFlags.update).toHaveBeenCalledWith({
        data: {
          jurisdictions: {
            connect: [{ id: associateJurisdiction.id }],
            disconnect: [{ id: removeJurisdiction.id }],
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
          id: mockedValue.id,
        },
      });
    });

    it('should not find a feature flag and throw error', async () => {
      prisma.featureFlags.findFirst = jest.fn().mockResolvedValue(null);
      prisma.featureFlags.update = jest.fn().mockResolvedValue(null);

      const params: FeatureFlagAssociate = {
        id: 'example id',
        associate: [],
        remove: [],
      };

      await expect(
        async () => await service.associateJurisdictions(params),
      ).rejects.toThrowError(
        'feature flag id example id was requested but not found',
      );

      expect(prisma.featureFlags.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'example id',
        },
      });
    });
  });
});
