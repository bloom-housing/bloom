import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AgencyQueryParams } from '../../../src/dtos/agency/agency-query-params.dto';
import Agency from '../../../src/dtos/agency/agency.dto';
import { AgencyService } from '../../../src/services/agency.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { PermissionService } from '../../../src/services/permission.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Testing agency service', () => {
  let service: AgencyService;
  let prisma: PrismaService;

  const mockAgency = (
    idx: number,
    date: Date,
    jurisdictionId: string,
  ): Agency => {
    return {
      id: randomUUID(),
      createdAt: date,
      updatedAt: date,
      name: `Agency ${idx}`,
      jurisdictions: {
        id: jurisdictionId,
      },
    };
  };

  const mockAgencySet = (
    numberToCreate: number,
    date: Date,
    jurisdictionId: string,
  ) => {
    const toReturn = [];
    for (let i = 0; i < numberToCreate; i++) {
      toReturn.push(mockAgency(i, date, jurisdictionId));
    }
    return toReturn;
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AgencyService,
        PrismaService,
        {
          provide: PermissionService,
          useValue: {
            canOrThrow: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AgencyService>(AgencyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('list', () => {
    it('should return agencies from list() when no params are present', async () => {
      const date = new Date();
      const jurisdictionId = randomUUID();
      const mockedValue = mockAgencySet(3, date, jurisdictionId);
      prisma.agency.findMany = jest.fn().mockResolvedValue(mockedValue);
      prisma.agency.count = jest.fn().mockResolvedValue(3);

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

      expect(prisma.agency.count).toHaveBeenCalledWith();

      expect(prisma.agency.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: undefined,
        include: {
          jurisdictions: true,
        },
      });
    });

    it('should return agencies from list() when params are present', async () => {
      const date = new Date();
      const jurisdictionId = randomUUID();
      const mockedValue = mockAgencySet(3, date, jurisdictionId);
      prisma.agency.findMany = jest.fn().mockResolvedValue(mockedValue);
      prisma.agency.count = jest.fn().mockResolvedValue(6);

      const params: AgencyQueryParams = {
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
          totalItems: 6,
          totalPages: 2,
        },
      });

      expect(prisma.agency.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        include: {
          jurisdictions: true,
        },
      });
    });

    it('should return first page if params page is more than count', async () => {
      const date = new Date();
      const jurisdictionId = randomUUID();
      const mockedValue = mockAgencySet(3, date, jurisdictionId);
      prisma.agency.findMany = jest.fn().mockResolvedValue(mockedValue);
      prisma.agency.count = jest.fn().mockResolvedValue(3);

      const params: AgencyQueryParams = {
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

      expect(prisma.agency.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 5,
        include: {
          jurisdictions: true,
        },
      });
    });

    it('should handle limit "all" correctly', async () => {
      const date = new Date();
      const jurisdictionId = randomUUID();
      const mockedValue = mockAgencySet(10, date, jurisdictionId);
      prisma.agency.findMany = jest.fn().mockResolvedValue(mockedValue);
      prisma.agency.count = jest.fn().mockResolvedValue(10);

      const params: AgencyQueryParams = {
        limit: 'all',
        page: 1,
      };

      const result = await service.list(params);

      expect(result.items).toHaveLength(10);
      expect(prisma.agency.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: undefined,
        include: {
          jurisdictions: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should throw error when the non exiting ID is passed', async () => {
      prisma.agency.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        async () => await service.findOne('example_ID'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        async () => await service.findOne('example_ID'),
      ).rejects.toThrowError('An agency with id: example_ID was not found');
    });

    it('should return agency when a valid ID is passed', async () => {
      const mockedValue = mockAgency(1, new Date(), randomUUID());
      prisma.agency.findUnique = jest.fn().mockReturnValue(mockedValue);

      const result = await service.findOne('example_ID');

      expect(result).toEqual(mockedValue);

      expect(prisma.agency.findUnique).toHaveBeenCalledWith({
        include: {
          jurisdictions: true,
        },
        where: {
          id: 'example_ID',
        },
      });
    });
  });

  describe('create', () => {
    it('should throw error when jurisdiction ID field is missing', async () => {
      prisma.agency.create = jest.fn().mockResolvedValue(null);
      prisma.jurisdictions.findUnique = jest.fn().mockResolvedValue(null);

      const mockDTO = {
        name: 'Agency',
        jurisdictions: {
          id: undefined,
        },
      };

      await expect(async () => await service.create(mockDTO)).rejects.toThrow(
        BadRequestException,
      );
      await expect(
        async () => await service.create(mockDTO),
      ).rejects.toThrowError('A valid jurisdiction must be provided');
    });

    it('should throw error when jurisdiction is not found', async () => {
      prisma.agency.create = jest.fn().mockResolvedValue(null);
      prisma.jurisdictions.findUnique = jest.fn().mockResolvedValue(null);

      const mockDTO = {
        name: 'Agency',
        jurisdictions: {
          id: randomUUID(),
        },
      };

      await expect(async () => await service.create(mockDTO)).rejects.toThrow(
        NotFoundException,
      );
      expect(async () => await service.create(mockDTO)).rejects.toThrowError(
        `A jurisdiction with ID: ${mockDTO.jurisdictions.id} was not found`,
      );
    });

    it('should create a new agency entry', async () => {
      const mockedValue = mockAgency(1, new Date(), randomUUID());
      const mockJurisdiction = {
        id: randomUUID(),
        featureFlags: {},
      };

      prisma.agency.create = jest.fn().mockResolvedValue(mockedValue);
      prisma.jurisdictions.findUnique = jest
        .fn()
        .mockReturnValue(mockJurisdiction);

      const result = await service.create({
        name: mockedValue.name,
        jurisdictions: mockedValue.jurisdictions,
      });

      expect(result).toEqual(mockedValue);
      expect(prisma.jurisdictions.findUnique).toHaveBeenCalledWith({
        select: {
          id: true,
        },
        where: {
          id: mockedValue.jurisdictions.id,
        },
      });
      expect(prisma.agency.create).toHaveBeenCalledWith({
        data: {
          name: mockedValue.name,
          jurisdictions: {
            connect: {
              id: mockedValue.jurisdictions.id,
            },
          },
        },
        include: {
          jurisdictions: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should throw error when jurisdiction ID is missing', async () => {
      prisma.agency.update = jest.fn().mockResolvedValue(null);
      prisma.jurisdictions.findUnique = jest.fn().mockResolvedValue(null);

      const mockUpdateDto = {
        id: randomUUID(),
        name: 'Updated',
        jurisdictions: {
          id: undefined,
        },
      };

      await expect(
        async () => await service.update(mockUpdateDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        async () => await service.update(mockUpdateDto),
      ).rejects.toThrowError('A valid jurisdiction must be provided');
    });

    it('should throw error when jurisdiction is not found', async () => {
      prisma.agency.update = jest.fn().mockResolvedValue(null);
      prisma.jurisdictions.findUnique = jest.fn().mockResolvedValue(null);

      const mockUpdateDto = {
        id: randomUUID(),
        name: 'Updated',
        jurisdictions: {
          id: randomUUID(),
        },
      };

      await expect(
        async () => await service.update(mockUpdateDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        async () => await service.update(mockUpdateDto),
      ).rejects.toThrowError(
        `A jurisdiction with ID: ${mockUpdateDto.jurisdictions.id} was not found`,
      );
    });

    it('should throw error when agency is not found', async () => {
      const mockUpdateDto = {
        id: randomUUID(),
        name: 'Updated',
        jurisdictions: {
          id: randomUUID(),
        },
      };

      prisma.agency.update = jest.fn().mockResolvedValue(null);
      prisma.agency.findUnique = jest.fn().mockResolvedValue(null);
      prisma.jurisdictions.findUnique = jest
        .fn()
        .mockResolvedValue(mockUpdateDto.jurisdictions);

      await expect(
        async () => await service.update(mockUpdateDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        async () => await service.update(mockUpdateDto),
      ).rejects.toThrowError(
        `An agency with id: ${mockUpdateDto.id} was not found`,
      );
    });

    it('should update the agency', async () => {
      const mockUpdateDto = {
        id: randomUUID(),
        name: 'Updated',
        jurisdictions: {
          id: randomUUID(),
        },
      };

      prisma.agency.update = jest.fn().mockResolvedValue(mockUpdateDto);
      prisma.agency.findUnique = jest.fn().mockResolvedValue({
        ...mockUpdateDto,
        name: 'Old Agency',
      });
      prisma.jurisdictions.findUnique = jest
        .fn()
        .mockResolvedValue(mockUpdateDto.jurisdictions);

      const result = await service.update(mockUpdateDto);
      expect(result).toEqual(mockUpdateDto);
      expect(prisma.agency.update).toHaveBeenCalledWith({
        data: {
          ...mockUpdateDto,
          jurisdictions: {
            connect: {
              id: mockUpdateDto.jurisdictions.id,
            },
          },
        },
        where: {
          id: mockUpdateDto.id,
        },
        include: {
          jurisdictions: true,
        },
      });
    });
  });

  describe('deleteOne', () => {
    it('should throw error when agency ID is missing', async () => {
      prisma.agency.findUnique = jest.fn().mockResolvedValue(null);
      await expect(
        async () => await service.deleteOne(undefined),
      ).rejects.toThrow(BadRequestException);
      await expect(
        async () => await service.deleteOne(undefined),
      ).rejects.toThrowError('A agency ID must be provided');
    });

    it('should throw error when agency is not found', async () => {
      const randID = randomUUID();
      prisma.agency.findUnique = jest.fn().mockResolvedValue(null);
      await expect(
        async () => await service.deleteOne({ id: randID }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        async () => await service.deleteOne({ id: randID }),
      ).rejects.toThrowError(`An agency with id: ${randID} was not found`);
    });

    it('should delete the agency entry', async () => {
      const randID = randomUUID();
      prisma.agency.findUnique = jest.fn().mockResolvedValue({
        ...mockAgency(1, new Date(), randomUUID()),
        id: randID,
      });
      prisma.agency.delete = jest.fn();

      await service.deleteOne({ id: randID });
      expect(prisma.agency.delete).toHaveBeenCalledWith({
        where: {
          id: randID,
        },
      });
    });
  });
});
