import { BadRequestException, NotFoundException, Query } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PropertyService } from '../../../src/services/property.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PropertyQueryParams } from '../../../src/dtos/properties/property-query-params.dto';
import PropertyCreate from '../../../src/dtos/properties/property-create.dto';
import { PropertyUpdate } from '../../../src/dtos/properties/property-update.dto';
import { Prisma } from '@prisma/client';

describe('Testing property service', () => {
  let service: PropertyService;
  let prisma: PrismaService;

  const mockProperty = (
    position: number,
    date: Date,
    jurisdictionId: string,
  ) => {
    return {
      id: randomUUID(),
      createdAt: date,
      updatedAt: date,
      name: `Property ${position}`,
      description: `Description ${position}`,
      url: `https://properties.com/property_${position}`,
      urlTitle: `Property ${position} Title`,
      jurisdictions: {
        id: jurisdictionId,
      },
    };
  };

  const mockPropertySet = (
    numberToCreate: number,
    date: Date,
    jurisdictionId: string,
  ) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockProperty(i, date, jurisdictionId));
    }
    return toReturn;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        PropertyService,
        PrismaService,
        {
          provide: PermissionService,
          useValue: {
            canOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('list', () => {
    it('should return properties from list() when no params are present', async () => {
      const date = new Date();
      const jurisdictionId = randomUUID();
      const mockedValue = mockPropertySet(3, date, jurisdictionId);
      prisma.properties.findMany = jest.fn().mockResolvedValue(mockedValue);
      prisma.properties.count = jest.fn().mockResolvedValue(3);

      const result = await service.list({});

      expect(result).toEqual({
        items: expect.arrayContaining([
          expect.objectContaining({
            ...mockedValue[0],
            jurisdictions: expect.objectContaining({
              id: mockedValue[0].jurisdictions.id,
            }),
          }),
          expect.objectContaining({
            ...mockedValue[1],
            jurisdictions: expect.objectContaining({
              id: mockedValue[1].jurisdictions.id,
            }),
          }),
          expect.objectContaining({
            ...mockedValue[2],
            jurisdictions: expect.objectContaining({
              id: mockedValue[2].jurisdictions.id,
            }),
          }),
        ]),
        meta: {
          currentPage: 1,
          itemCount: 3,
          itemsPerPage: 3,
          totalItems: 3,
          totalPages: 1,
        },
      });

      expect(prisma.properties.count).toHaveBeenCalledWith({
        where: {
          AND: [],
        },
      });

      expect(prisma.properties.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: undefined,
        where: {
          AND: [],
        },
        include: {
          jurisdictions: true,
        },
      });
    });

    it('should return properties from list() when params are present', async () => {
      const date = new Date();
      const jurisdictionId = randomUUID();
      const mockedValue = mockPropertySet(3, date, jurisdictionId);
      prisma.properties.findMany = jest.fn().mockResolvedValue(mockedValue);
      prisma.properties.count = jest.fn().mockResolvedValue(6);

      const params: PropertyQueryParams = {
        search: 'Woodside',
        page: 2,
        limit: 5,
        jurisdiction: jurisdictionId,
      };

      const result = await service.list(params);

      expect(result).toEqual({
        items: mockedValue,
        meta: {
          currentPage: 2,
          itemCount: 3,
          itemsPerPage: 5,
          totalItems: 6,
          totalPages: 2,
        },
      });

      expect(prisma.properties.count).toHaveBeenCalledWith({
        where: {
          AND: [
            {
              AND: {
                name: {
                  contains: 'Woodside',
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
            {
              AND: {
                jurisdictions: {
                  id: jurisdictionId,
                },
              },
            },
          ],
        },
      });

      expect(prisma.properties.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        where: {
          AND: [
            {
              AND: {
                name: {
                  contains: 'Woodside',
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
            {
              AND: {
                jurisdictions: {
                  id: jurisdictionId,
                },
              },
            },
          ],
        },
        include: {
          jurisdictions: true,
        },
      });
    });

    it('should return first page if params page is more than count', async () => {
      const date = new Date();
      const jurisdictionId = randomUUID();
      const mockedValue = mockPropertySet(3, date, jurisdictionId);
      prisma.properties.findMany = jest.fn().mockResolvedValue(mockedValue);
      prisma.properties.count = jest.fn().mockResolvedValue(3);

      const params: PropertyQueryParams = {
        page: 2,
        limit: 5,
      };

      const result = await service.list(params);

      expect(result).toEqual({
        items: mockedValue,
        meta: {
          currentPage: 2,
          itemCount: 3,
          itemsPerPage: 5,
          totalItems: 3,
          totalPages: 1,
        },
      });

      expect(prisma.properties.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 5,
        where: {
          AND: [],
        },
        include: {
          jurisdictions: true,
        },
      });
    });

    it('should handle limit "all" correctly', async () => {
      const date = new Date();
      const jurisdictionId = randomUUID();
      const mockedValue = mockPropertySet(10, date, jurisdictionId);
      prisma.properties.findMany = jest.fn().mockResolvedValue(mockedValue);
      prisma.properties.count = jest.fn().mockResolvedValue(10);

      const params: PropertyQueryParams = {
        limit: 'all',
        page: 1,
      };

      const result = await service.list(params);

      expect(result.items).toHaveLength(10);
      expect(prisma.properties.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: undefined,
        where: {
          AND: [],
        },
        include: {
          jurisdictions: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return property from findOne() when id present', async () => {
      const date = new Date();
      const jurisdictionId = randomUUID();
      const mockedValue = mockProperty(1, date, jurisdictionId);
      prisma.properties.findUnique = jest.fn().mockResolvedValue(mockedValue);

      const result = await service.findOne('example_id');

      expect(result).toEqual(mockedValue);

      expect(prisma.properties.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
        },
        where: {
          id: 'example_id',
        },
      });
    });

    it('should error when calling findOne() when id not present', async () => {
      await expect(
        async () => await service.findOne(undefined),
      ).rejects.toThrow(BadRequestException);
      await expect(
        async () => await service.findOne(undefined),
      ).rejects.toThrowError('a property ID must be provided');
    });

    it('should error when calling findOne() when property not found', async () => {
      prisma.properties.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.findOne('example_id'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        async () => await service.findOne('example_id'),
      ).rejects.toThrowError(
        'property with id example_id was requested but not found',
      );

      expect(prisma.properties.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
        },
        where: {
          id: 'example_id',
        },
      });
    });
  });

  describe('create', () => {
    it('should create a property when all data is provided', async () => {
      const jurisdictionId = randomUUID();
      const propertyId = randomUUID();
      const date = new Date();

      const propertyDto: PropertyCreate = {
        name: 'Woodside Apartments',
        description:
          'An old apartment units complex in a silent part of the town',
        url: 'https://properties.com/woodside_apartments',
        urlTitle: 'Woodside Apt.',
        jurisdictions: { id: jurisdictionId },
      };

      const mockJurisdiction = {
        id: jurisdictionId,
        featureFlags: {},
      };

      const mockCreatedProperty = {
        id: propertyId,
        createdAt: date,
        updatedAt: date,
        ...propertyDto,
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue(mockJurisdiction);
      prisma.properties.create = jest
        .fn()
        .mockResolvedValue(mockCreatedProperty);

      const result = await service.create(propertyDto);

      expect(result).toEqual(mockCreatedProperty);
      expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
        select: {
          featureFlags: true,
          id: true,
        },
        where: {
          id: jurisdictionId,
        },
      });
      expect(prisma.properties.create).toHaveBeenCalledWith({
        data: {
          ...propertyDto,
          jurisdictions: {
            connect: {
              id: jurisdictionId,
            },
          },
        },
        include: {
          jurisdictions: true,
        },
      });
    });

    it('should error when jurisdiction is not provided', async () => {
      const propertyDto: PropertyCreate = {
        name: 'Woodside Apartments',
        description: 'An old apartment units complex',
        url: 'https://properties.com/woodside_apartments',
        urlTitle: 'Woodside Apt.',
      };

      await expect(
        async () => await service.create(propertyDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        async () => await service.create(propertyDto),
      ).rejects.toThrowError('A jurisdiction must be provided');

      expect(prisma.jurisdictions.findFirst).not.toHaveBeenCalled();
      expect(prisma.properties.create).not.toHaveBeenCalled();
    });

    it('should error when jurisdiction is not found', async () => {
      const jurisdictionId = randomUUID();
      const propertyDto: PropertyCreate = {
        name: 'Woodside Apartments',
        description: 'An old apartment units complex',
        url: 'https://properties.com/woodside_apartments',
        urlTitle: 'Woodside Apt.',
        jurisdictions: { id: jurisdictionId },
      };

      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.create(propertyDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        async () => await service.create(propertyDto),
      ).rejects.toThrowError(
        `Entry for the linked jurisdiction with id: ${jurisdictionId} was not found`,
      );

      expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
        select: {
          featureFlags: true,
          id: true,
        },
        where: {
          id: jurisdictionId,
        },
      });
      expect(prisma.properties.create).not.toHaveBeenCalled();
    });

    it('should create a property with minimal data', async () => {
      const jurisdictionId = randomUUID();
      const propertyId = randomUUID();
      const date = new Date();

      const propertyDto: PropertyCreate = {
        name: 'Vineta Apartments',
        jurisdictions: { id: jurisdictionId },
      };

      const mockJurisdiction = {
        id: jurisdictionId,
        featureFlags: {},
      };

      const mockCreatedProperty = {
        id: propertyId,
        createdAt: date,
        updatedAt: date,
        name: 'Vineta Apartments',
        description: null,
        url: null,
        urlTitle: null,
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue(mockJurisdiction);
      prisma.properties.create = jest
        .fn()
        .mockResolvedValue(mockCreatedProperty);

      const result = await service.create(propertyDto);

      expect(result).toEqual(mockCreatedProperty);
    });
  });

  describe('update', () => {
    it('should update a property when all data is provided', async () => {
      const jurisdictionId = randomUUID();
      const propertyId = randomUUID();
      const date = new Date();

      const propertyDto: PropertyUpdate = {
        id: propertyId,
        name: 'Updated Name',
        description: 'Updated description',
        url: 'https://updated.com',
        urlTitle: 'Updated URL title',
        jurisdictions: { id: jurisdictionId },
      };

      const mockJurisdiction = {
        id: jurisdictionId,
      };

      const mockExistingProperty = {
        id: propertyId,
        createdAt: date,
        updatedAt: date,
        name: 'Original Name',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      const mockUpdatedProperty = {
        id: propertyId,
        createdAt: date,
        updatedAt: date,
        ...propertyDto,
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue(mockJurisdiction);
      prisma.properties.findFirst = jest
        .fn()
        .mockResolvedValue(mockExistingProperty);
      prisma.properties.update = jest
        .fn()
        .mockResolvedValue(mockUpdatedProperty);

      const result = await service.update(propertyDto);

      expect(result).toEqual(mockUpdatedProperty);
      expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
        select: {
          id: true,
        },
        where: {
          id: jurisdictionId,
        },
      });
      expect(prisma.properties.findFirst).toHaveBeenCalledWith({
        where: {
          id: propertyId,
        },
        include: {
          jurisdictions: true,
        },
      });
      expect(prisma.properties.update).toHaveBeenCalledWith({
        data: {
          ...propertyDto,
          jurisdictions: {
            connect: {
              id: jurisdictionId,
            },
          },
        },
        where: {
          id: propertyId,
        },
        include: {
          jurisdictions: true,
        },
      });
    });

    it('should error when jurisdiction is not provided', async () => {
      const propertyId = randomUUID();
      const propertyDto: PropertyUpdate = {
        id: propertyId,
        name: 'Updated Name',
      };

      await expect(
        async () => await service.update(propertyDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        async () => await service.update(propertyDto),
      ).rejects.toThrowError('A jurisdiction must be provided');

      expect(prisma.jurisdictions.findFirst).not.toHaveBeenCalled();
      expect(prisma.properties.update).not.toHaveBeenCalled();
    });

    it('should error when jurisdiction is not found', async () => {
      const jurisdictionId = randomUUID();
      const propertyId = randomUUID();
      const propertyDto: PropertyUpdate = {
        id: propertyId,
        name: 'Updated Name',
        jurisdictions: { id: jurisdictionId },
      };

      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.update(propertyDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        async () => await service.update(propertyDto),
      ).rejects.toThrowError(
        `Entry for the linked jurisdiction with id: ${jurisdictionId} was not found`,
      );

      expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
        select: {
          id: true,
        },
        where: {
          id: jurisdictionId,
        },
      });
      expect(prisma.properties.update).not.toHaveBeenCalled();
    });

    it('should error when property is not found', async () => {
      const jurisdictionId = randomUUID();
      const propertyId = randomUUID();
      const propertyDto: PropertyUpdate = {
        id: propertyId,
        name: 'Updated Name',
        jurisdictions: { id: jurisdictionId },
      };

      const mockJurisdiction = {
        id: jurisdictionId,
      };

      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue(mockJurisdiction);
      prisma.properties.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.update(propertyDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        async () => await service.update(propertyDto),
      ).rejects.toThrowError(`Property with id ${propertyId} was not found`);

      expect(prisma.properties.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteOne', () => {
    it('should delete a property when id is provided', async () => {
      const jurisdictionId = randomUUID();
      const propertyId = randomUUID();
      const date = new Date();

      const mockProperty = {
        id: propertyId,
        createdAt: date,
        updatedAt: date,
        name: 'Property to delete',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      const mockJurisdiction = {
        id: jurisdictionId,
      };

      prisma.properties.findFirst = jest.fn().mockResolvedValue(mockProperty);
      prisma.jurisdictions.findFirst = jest
        .fn()
        .mockResolvedValue(mockJurisdiction);
      prisma.properties.delete = jest.fn().mockResolvedValue(mockProperty);

      const result = await service.deleteOne(propertyId);

      expect(result).toEqual({ success: true });
      expect(prisma.properties.findFirst).toHaveBeenCalledWith({
        where: {
          id: propertyId,
        },
        include: {
          jurisdictions: true,
        },
      });
      expect(prisma.jurisdictions.findFirst).toHaveBeenCalledWith({
        select: {
          id: true,
        },
        where: {
          id: jurisdictionId,
        },
      });
      expect(prisma.properties.delete).toHaveBeenCalledWith({
        where: {
          id: propertyId,
        },
      });
    });

    it('should error when property id is not provided', async () => {
      await expect(async () => await service.deleteOne('')).rejects.toThrow(
        BadRequestException,
      );
      await expect(
        async () => await service.deleteOne(''),
      ).rejects.toThrowError('a property ID must be provided');

      expect(prisma.properties.findFirst).not.toHaveBeenCalled();
      expect(prisma.properties.delete).not.toHaveBeenCalled();
    });

    it('should error when property is not found', async () => {
      const propertyId = randomUUID();

      prisma.properties.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.deleteOne(propertyId),
      ).rejects.toThrow(BadRequestException);
      await expect(
        async () => await service.deleteOne(propertyId),
      ).rejects.toThrowError(`Property with id ${propertyId} was not found`);

      expect(prisma.properties.delete).not.toHaveBeenCalled();
    });

    it('should error when property has no jurisdiction', async () => {
      const propertyId = randomUUID();
      const date = new Date();

      const mockProperty = {
        id: propertyId,
        createdAt: date,
        updatedAt: date,
        name: 'Property without jurisdiction',
        jurisdictions: null,
      };

      prisma.properties.findFirst = jest.fn().mockResolvedValue(mockProperty);

      await expect(
        async () => await service.deleteOne(propertyId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        async () => await service.deleteOne(propertyId),
      ).rejects.toThrowError(
        'The property is not connected to any jurisdiction',
      );

      expect(prisma.properties.delete).not.toHaveBeenCalled();
    });

    it('should error when linked jurisdiction is not found', async () => {
      const jurisdictionId = randomUUID();
      const propertyId = randomUUID();
      const date = new Date();

      const mockProperty = {
        id: propertyId,
        createdAt: date,
        updatedAt: date,
        name: 'Property with missing jurisdiction',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      prisma.properties.findFirst = jest.fn().mockResolvedValue(mockProperty);
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.deleteOne(propertyId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        async () => await service.deleteOne(propertyId),
      ).rejects.toThrowError(
        `Entry for the linked jurisdiction with id: ${jurisdictionId} was not found`,
      );

      expect(prisma.properties.delete).not.toHaveBeenCalled();
    });
  });

  describe('findOrThrow', () => {
    it('should return property when found', async () => {
      const jurisdictionId = randomUUID();
      const propertyId = randomUUID();
      const date = new Date();

      const mockProperty = {
        id: propertyId,
        createdAt: date,
        updatedAt: date,
        name: 'Test Property',
        jurisdictions: {
          id: jurisdictionId,
        },
      };

      prisma.properties.findFirst = jest.fn().mockResolvedValue(mockProperty);

      const result = await service.findOrThrow(propertyId);

      expect(result).toEqual(mockProperty);
      expect(prisma.properties.findFirst).toHaveBeenCalledWith({
        where: {
          id: propertyId,
        },
        include: {
          jurisdictions: true,
        },
      });
    });

    it('should throw error when property is not found', async () => {
      const propertyId = randomUUID();

      prisma.properties.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.findOrThrow(propertyId),
      ).rejects.toThrow(BadRequestException);
      await expect(
        async () => await service.findOrThrow(propertyId),
      ).rejects.toThrowError(`Property with id ${propertyId} was not found`);

      expect(prisma.properties.findFirst).toHaveBeenCalledWith({
        where: {
          id: propertyId,
        },
        include: {
          jurisdictions: true,
        },
      });
    });
  });

  describe('buildWhere', () => {
    it('should build where clause with search param', () => {
      const params: PropertyQueryParams = {
        search: 'Woodside',
      };

      const result = service.buildWhere(params);

      expect(result).toEqual({
        AND: [
          {
            AND: {
              name: {
                contains: 'Woodside',
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        ],
      });
    });

    it('should build where clause with jurisdiction param', () => {
      const jurisdictionId = randomUUID();
      const params: PropertyQueryParams = {
        jurisdiction: jurisdictionId,
      };

      const result = service.buildWhere(params);

      expect(result).toEqual({
        AND: [
          {
            AND: {
              jurisdictions: {
                id: jurisdictionId,
              },
            },
          },
        ],
      });
    });

    it('should build where clause with both search and jurisdiction params', () => {
      const jurisdictionId = randomUUID();
      const params: PropertyQueryParams = {
        search: 'Creek',
        jurisdiction: jurisdictionId,
      };

      const result = service.buildWhere(params);

      expect(result).toEqual({
        AND: [
          {
            AND: {
              name: {
                contains: 'Creek',
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
          {
            AND: {
              jurisdictions: {
                id: jurisdictionId,
              },
            },
          },
        ],
      });
    });

    it('should build empty where clause when no params provided', () => {
      const params: PropertyQueryParams = {};

      const result = service.buildWhere(params);

      expect(result).toEqual({
        AND: [],
      });
    });
  });
});
