import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ListingCreateUpdateValidationPipe } from '../../../src/validation-pipes/listing-create-update-pipe';
import { PrismaService } from '../../../src/services/prisma.service';
import { ListingCreate } from '../../../src/dtos/listings/listing-create.dto';
import { ListingUpdate } from '../../../src/dtos/listings/listing-update.dto';
import { randomUUID } from 'crypto';

describe('ListingCreateUpdateValidationPipe', () => {
  let pipe: ListingCreateUpdateValidationPipe;
  let metadata: ArgumentMetadata;
  let mockSuperTransform: jest.SpyInstance;

  const mockPrisma = {
    jurisdictions: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingCreateUpdateValidationPipe,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    pipe = module.get<ListingCreateUpdateValidationPipe>(
      ListingCreateUpdateValidationPipe,
    );

    metadata = {
      type: 'body',
      metatype: Object,
    };

    // Mock the parent ValidationPipe's transform method
    mockSuperTransform = jest.spyOn(ValidationPipe.prototype, 'transform');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('transform', () => {
    it('should skip jurisdiction check for non-body metadata types', async () => {
      const value = { name: 'Test Listing' };
      const queryMetadata = {
        type: 'query',
        metatype: Object,
      } as ArgumentMetadata;

      mockSuperTransform.mockResolvedValue(value);

      await pipe.transform(value, queryMetadata);

      expect(mockPrisma.jurisdictions.findFirst).not.toHaveBeenCalled();
      expect(mockSuperTransform).toHaveBeenCalledWith(value, queryMetadata);
    });

    it('should skip jurisdiction check for non-jurisdiction requests', async () => {
      const value = {
        name: 'Test Listing',
        listingsBuildingAddress: {
          street: '123 Main St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
        },
      };

      mockSuperTransform.mockResolvedValue(value);

      await pipe.transform(value, metadata);

      expect(mockPrisma.jurisdictions.findFirst).not.toHaveBeenCalled();
      expect(mockSuperTransform).toHaveBeenCalledWith(value, {
        ...metadata,
        metatype: ListingCreate,
      });
    });

    it('should use ListingCreate metatype for requests without id', async () => {
      const value = { name: 'Test Listing' };

      mockSuperTransform.mockResolvedValue(value);

      await pipe.transform(value, metadata);

      expect(mockSuperTransform).toHaveBeenCalledWith(value, {
        ...metadata,
        metatype: ListingCreate,
      });
    });

    it('should use ListingUpdate metatype for requests with id', async () => {
      const value = {
        id: randomUUID(),
        name: 'Test Listing',
      };

      mockSuperTransform.mockResolvedValue(value);

      await pipe.transform(value, metadata);

      expect(mockSuperTransform).toHaveBeenCalledWith(value, {
        ...metadata,
        metatype: ListingUpdate,
      });
    });

    it('should validate with minimal fields when jurisdiction specifies them', async () => {
      const jurisdictionId = randomUUID();
      const value = {
        name: 'Test Listing',
        listingsBuildingAddress: {
          street: '123 Main St',
          city: 'Detroit',
          state: 'MI',
          zipCode: '48201',
        },
        jurisdictions: { id: jurisdictionId },
      };

      // Mock jurisdiction with minimal required field
      mockPrisma.jurisdictions.findFirst.mockResolvedValue({
        requiredListingFields: ['name', 'listingsBuildingAddress'],
      });

      const expectedTransformedValue = {
        ...value,
        units: [],
        unitGroups: [],
        requiredFields: ['name', 'listingsBuildingAddress'],
      };
      mockSuperTransform.mockResolvedValue(expectedTransformedValue);

      await pipe.transform(value, metadata);

      expect(mockPrisma.jurisdictions.findFirst).toHaveBeenCalledWith({
        where: { id: jurisdictionId },
        select: { requiredListingFields: true },
      });

      expect(mockSuperTransform).toHaveBeenCalledWith(
        expectedTransformedValue,
        {
          ...metadata,
          metatype: ListingCreate,
        },
      );
    });

    it('should use default fields when jurisdiction has empty required fields array', async () => {
      const jurisdictionId = randomUUID();
      const value = {
        name: 'Test Listing',
        jurisdictions: { id: jurisdictionId },
      };

      // Mock jurisdiction with empty required fields array
      mockPrisma.jurisdictions.findFirst.mockResolvedValue({
        requiredListingFields: [],
      });

      const expectedDefaultFields = [
        'listingsBuildingAddress',
        'name',
        'developer',
        'listingImages',
        'leasingAgentEmail',
        'leasingAgentName',
        'leasingAgentPhone',
        'jurisdictions',
        'units',
      ];

      const expectedTransformedValue = {
        ...value,
        units: [],
        unitGroups: [],
        requiredFields: expectedDefaultFields,
      };
      mockSuperTransform.mockResolvedValue(expectedTransformedValue);

      await pipe.transform(value, metadata);

      expect(mockSuperTransform).toHaveBeenCalledWith(
        expectedTransformedValue,
        {
          ...metadata,
          metatype: ListingCreate,
        },
      );
    });

    it('should use default fields when jurisdiction has null required fields', async () => {
      const jurisdictionId = randomUUID();
      const value = {
        name: 'Test Listing',
        jurisdictions: { id: jurisdictionId },
      };

      // Mock jurisdiction with null required fields
      mockPrisma.jurisdictions.findFirst.mockResolvedValue({
        requiredListingFields: null,
      });

      const expectedDefaultFields = [
        'listingsBuildingAddress',
        'name',
        'developer',
        'listingImages',
        'leasingAgentEmail',
        'leasingAgentName',
        'leasingAgentPhone',
        'jurisdictions',
        'units',
      ];

      const expectedTransformedValue = {
        ...value,
        units: [],
        unitGroups: [],
        requiredFields: expectedDefaultFields,
      };
      mockSuperTransform.mockResolvedValue(expectedTransformedValue);

      await pipe.transform(value, metadata);

      expect(mockSuperTransform).toHaveBeenCalledWith(
        expectedTransformedValue,
        {
          ...metadata,
          metatype: ListingCreate,
        },
      );
    });

    it('should use default fields when jurisdiction is not found', async () => {
      const jurisdictionId = randomUUID();
      const value = {
        name: 'Test Listing',
        jurisdictions: { id: jurisdictionId },
      };

      // Mock jurisdiction not found
      mockPrisma.jurisdictions.findFirst.mockResolvedValue(null);

      const expectedDefaultFields = [
        'listingsBuildingAddress',
        'name',
        'developer',
        'listingImages',
        'leasingAgentEmail',
        'leasingAgentName',
        'leasingAgentPhone',
        'jurisdictions',
        'units',
      ];

      const expectedTransformedValue = {
        ...value,
        units: [],
        unitGroups: [],
        requiredFields: expectedDefaultFields,
      };
      mockSuperTransform.mockResolvedValue(expectedTransformedValue);

      await pipe.transform(value, metadata);

      expect(mockSuperTransform).toHaveBeenCalledWith(
        expectedTransformedValue,
        {
          ...metadata,
          metatype: ListingCreate,
        },
      );
    });

    it('should handle update scenarios with custom required fields', async () => {
      const jurisdictionId = randomUUID();
      const listingId = randomUUID();
      const value = {
        id: listingId,
        name: 'Updated Test Listing',
        jurisdictions: { id: jurisdictionId },
      };

      // Mock jurisdiction with custom required fields
      mockPrisma.jurisdictions.findFirst.mockResolvedValue({
        requiredListingFields: [
          'name',
          'leasingAgentEmail',
          'digitalApplication',
        ],
      });

      const expectedTransformedValue = {
        ...value,
        units: [],
        unitGroups: [],
        requiredFields: ['name', 'leasingAgentEmail', 'digitalApplication'],
      };
      mockSuperTransform.mockResolvedValue(expectedTransformedValue);

      await pipe.transform(value, metadata);

      expect(mockSuperTransform).toHaveBeenCalledWith(
        expectedTransformedValue,
        {
          ...metadata,
          metatype: ListingUpdate,
        },
      );
    });

    it('should handle jurisdiction with undefined id gracefully', async () => {
      const value = {
        name: 'Test Listing',
        jurisdictions: { id: undefined },
      };

      mockSuperTransform.mockResolvedValue(value);

      await pipe.transform(value, metadata);

      expect(mockPrisma.jurisdictions.findFirst).not.toHaveBeenCalled();
      expect(mockSuperTransform).toHaveBeenCalledWith(value, {
        ...metadata,
        metatype: ListingCreate,
      });
    });

    it('should handle missing jurisdictions property gracefully', async () => {
      const value = {
        name: 'Test Listing',
      };

      mockSuperTransform.mockResolvedValue(value);

      await pipe.transform(value, metadata);

      expect(mockPrisma.jurisdictions.findFirst).not.toHaveBeenCalled();
      expect(mockSuperTransform).toHaveBeenCalledWith(value, {
        ...metadata,
        metatype: ListingCreate,
      });
    });

    it('should keep the unit data', async () => {
      const jurisdictionId = randomUUID();
      const listingId = randomUUID();
      const value = {
        id: listingId,
        name: 'Updated Test Listing',
        jurisdictions: { id: jurisdictionId },
        units: [{ id: 'id1' }],
      };

      // Mock jurisdiction with custom required fields
      mockPrisma.jurisdictions.findFirst.mockResolvedValue({
        requiredListingFields: ['name'],
      });

      const expectedTransformedValue = {
        ...value,
        units: [{ id: 'id1' }],
        unitGroups: [],
        requiredFields: ['name'],
      };
      mockSuperTransform.mockResolvedValue(expectedTransformedValue);

      await pipe.transform(value, metadata);

      expect(mockSuperTransform).toHaveBeenCalledWith(
        expectedTransformedValue,
        {
          ...metadata,
          metatype: ListingUpdate,
        },
      );
    });

    it('should keep the unit group data', async () => {
      const jurisdictionId = randomUUID();
      const listingId = randomUUID();
      const value = {
        id: listingId,
        name: 'Updated Test Listing',
        jurisdictions: { id: jurisdictionId },
        unitGroups: [{ id: 'id1' }],
      };

      // Mock jurisdiction with custom required fields
      mockPrisma.jurisdictions.findFirst.mockResolvedValue({
        requiredListingFields: ['name'],
      });

      const expectedTransformedValue = {
        ...value,
        units: [],
        unitGroups: [{ id: 'id1' }],
        requiredFields: ['name'],
      };
      mockSuperTransform.mockResolvedValue(expectedTransformedValue);

      await pipe.transform(value, metadata);

      expect(mockSuperTransform).toHaveBeenCalledWith(
        expectedTransformedValue,
        {
          ...metadata,
          metatype: ListingUpdate,
        },
      );
    });
  });
});
