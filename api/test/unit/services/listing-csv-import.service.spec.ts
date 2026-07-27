import { randomUUID } from 'crypto';
import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { ListingsStatusEnum } from '@prisma/client';
import { ListingCsvImportService } from '../../../src/services/listing-csv-import.service';
import { ListingService } from '../../../src/services/listing.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { ListingCreateUpdateValidationPipe } from '../../../src/validation-pipes/listing-create-update-pipe';
import { User } from '../../../src/dtos/users/user.dto';

const mockFindFirstUnitType = jest.fn();
const mockFindUniqueJurisdiction = jest.fn();
const mockFindFirstJurisdiction = jest.fn();

// This should be switched to the normal way of mocking after https://github.com/bloom-housing/bloom/issues/5546 is completed
// ValidateOnlyUnitsOrUnitGroups (exercised via the real
// ListingCreateUpdateValidationPipe below) instantiates its own
// PrismaService directly. Mocking the module itself
// keeps every `new PrismaService()` call pointed at
// these same jest mocks, so this stays a real, offline unit test.
jest.mock('../../../src/services/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    unitTypes: { findFirst: mockFindFirstUnitType },
    jurisdictions: {
      findUnique: mockFindUniqueJurisdiction,
      findFirst: mockFindFirstJurisdiction,
    },
  })),
}));

describe('Testing listing csv import service', () => {
  let service: ListingCsvImportService;

  const mockCreate = jest.fn();
  const jurisdictionId = randomUUID();
  const unitTypeId = randomUUID();

  const requestingUser = { id: randomUUID() } as User;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListingCsvImportService,
        Logger,
        ListingCreateUpdateValidationPipe,
        {
          provide: PrismaService,
          useValue: {
            unitTypes: { findFirst: mockFindFirstUnitType },
            jurisdictions: {
              findUnique: mockFindUniqueJurisdiction,
              findFirst: mockFindFirstJurisdiction,
            },
          },
        },
        {
          provide: ListingService,
          useValue: { create: mockCreate },
        },
      ],
    }).compile();

    service = module.get<ListingCsvImportService>(ListingCsvImportService);
  });

  beforeEach(() => {
    mockFindFirstUnitType.mockResolvedValue({ id: unitTypeId });
    mockFindUniqueJurisdiction.mockResolvedValue({ id: jurisdictionId });
    // No jurisdiction-specific required fields, so the pipe falls back to
    // its defaults. Those defaults are all publish-only fields, and every
    // listing here is created as pending, so they don't block validation.
    mockFindFirstJurisdiction.mockResolvedValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('groups rows sharing a listingRowId into a single listing with multiple units', async () => {
    const listingId = randomUUID();
    mockCreate.mockResolvedValue({ id: listingId });

    const csvData = [
      'listingRowId,name,unitType,monthlyRent',
      `1,Sunset Apts,studio,1200`,
      `1,Sunset Apts,oneBdrm,1500`,
    ].join('\n');

    const result = await service.importCsv(
      csvData,
      requestingUser,
      jurisdictionId,
    );

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const [passedDto] = mockCreate.mock.calls[0];
    expect(passedDto.name).toBe('Sunset Apts');
    expect(passedDto.jurisdictions).toEqual({ id: jurisdictionId });
    expect(passedDto.status).toBe(ListingsStatusEnum.pending);
    expect(passedDto.units).toHaveLength(2);
    expect(passedDto.units[0].monthlyRent).toBe('1200');
    expect(passedDto.units[1].monthlyRent).toBe('1500');

    expect(mockCreate).toHaveBeenCalledWith(passedDto, requestingUser);
    expect(result).toEqual({
      created: [{ row: 2, listingRowId: '1', id: listingId }],
      errors: [],
    });
  });

  it('creates independent listings for each distinct listingRowId', async () => {
    mockCreate
      .mockResolvedValueOnce({ id: 'listing-1' })
      .mockResolvedValueOnce({ id: 'listing-2' });

    const csvData = [
      'listingRowId,name,unitType,monthlyRent',
      `1,Sunset Apts,studio,1200`,
      `2,Oak Manor,studio,1300`,
    ].join('\n');

    const result = await service.importCsv(
      csvData,
      requestingUser,
      jurisdictionId,
    );

    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(result.created).toHaveLength(2);
    expect(result.errors).toHaveLength(0);
  });

  it('reports a per-listing error without failing the rest of the batch', async () => {
    mockCreate
      .mockRejectedValueOnce(new ForbiddenException('not allowed'))
      .mockResolvedValueOnce({ id: 'listing-2' });

    const csvData = [
      'listingRowId,name,unitType,monthlyRent',
      `1,Sunset Apts,studio,1200`,
      `2,Oak Manor,studio,1300`,
    ].join('\n');

    const result = await service.importCsv(
      csvData,
      requestingUser,
      jurisdictionId,
    );

    expect(result.created).toEqual([
      { row: 3, listingRowId: '2', id: 'listing-2' },
    ]);
    expect(result.errors).toEqual([
      { row: 2, listingRowId: '1', message: 'not allowed' },
    ]);
  });

  it('skips only the listing that fails real DTO validation, and still creates the rest of the batch', async () => {
    mockCreate.mockResolvedValue({ id: 'listing-2' });

    const csvData = [
      'listingRowId,name,unitType,monthlyRent',
      // row 1 (listingRowId "1"): name is blank, which fails the
      // unconditional @IsDefined on ListingCreate.name
      `1,,studio,1200`,
      // row 2 (listingRowId "2"): fully valid
      `2,Oak Manor,studio,1300`,
    ].join('\n');

    const result = await service.importCsv(
      csvData,
      requestingUser,
      jurisdictionId,
    );

    // Only the valid listing reaches ListingService.create
    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Oak Manor' }),
      requestingUser,
    );

    expect(result.created).toEqual([
      { row: 3, listingRowId: '2', id: 'listing-2' },
    ]);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toMatchObject({ row: 2, listingRowId: '1' });
    expect(result.errors[0].message).toEqual(expect.any(String));
    expect(result.errors[0].message.length).toBeGreaterThan(0);
  });

  it('errors when the CSV references an unknown unit type', async () => {
    mockFindFirstUnitType.mockResolvedValue(null);

    const csvData = [
      'listingRowId,name,unitType',
      `1,Sunset Apts,notARealType`,
    ].join('\n');

    const result = await service.importCsv(
      csvData,
      requestingUser,
      jurisdictionId,
    );

    expect(mockCreate).not.toHaveBeenCalled();
    expect(result.errors).toEqual([
      {
        row: 2,
        listingRowId: '1',
        message: 'Unknown unitType "notARealType"',
      },
    ]);
  });

  it('builds a building address only when at least one address field is present', async () => {
    mockCreate.mockResolvedValue({ id: 'listing-1' });

    const csvData = [
      'listingRowId,name,unitType,buildingAddressStreet,buildingAddressCity,buildingAddressState,buildingAddressZip',
      `1,Sunset Apts,studio,123 Main St,Bloomington,CA,90001`,
    ].join('\n');

    await service.importCsv(csvData, requestingUser, jurisdictionId);

    const [passedDto] = mockCreate.mock.calls[0];
    expect(passedDto.listingsBuildingAddress).toEqual({
      street: '123 Main St',
      city: 'Bloomington',
      state: 'CA',
      zipCode: '90001',
      street2: undefined,
      county: undefined,
      latitude: undefined,
      longitude: undefined,
    });
  });

  it('throws when the CSV has no listingRowId column', async () => {
    const csvData = ['name', `Sunset Apts`].join('\n');

    await expect(
      service.importCsv(csvData, requestingUser, jurisdictionId),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws when the CSV has no data rows', async () => {
    await expect(
      service.importCsv('listingRowId,name', requestingUser, jurisdictionId),
    ).rejects.toThrow(BadRequestException);
  });
});
