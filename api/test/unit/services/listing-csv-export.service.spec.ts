import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { ListingCsvExporterService } from '../../../src/services/listing-csv-export.service';
import { PrismaService } from '../../../src/services/prisma.service';
import Listing from '../../../src/dtos/listings/listing.dto';

describe('Testing listing csv export service', () => {
  let service: ListingCsvExporterService;
  let writeStream;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ListingCsvExporterService, Logger],
    }).compile();

    service = module.get<ListingCsvExporterService>(ListingCsvExporterService);
  });

  beforeEach(() => {
    writeStream = fs.createWriteStream('sampleFile.csv');
    jest.spyOn(fs, 'createWriteStream').mockReturnValue(writeStream);
  });

  afterEach(() => {
    writeStream.end();
    fs.unlink('sampleFile.csv', () => {
      // do nothing
    });
    jest.restoreAllMocks();
  });

  describe('createUnitCsv', () => {
    it('should create the unit csv', async () => {
      const unit = {
        number: 1,
        numBathrooms: 2,
        floor: 3,
        sqFeet: 1200,
        minOccupancy: 1,
        maxOccupancy: 8,
        amiPercentage: 80,
        monthlyRentAsPercentOfIncome: null,
        monthlyRent: 4000,
        unitTypes: { id: randomUUID(), name: 'studio' },
        amiChart: { id: randomUUID(), name: 'Ami Chart Name' },
      };
      const mockListing = {
        id: 'listing1-ID',
        name: `listing1-Name`,
        units: [unit],
      };
      const mockListing2 = {
        id: 'listing2-ID',
        name: `listing2-Name`,
        units: [
          {
            ...unit,
            monthlyRentAsPercentOfIncome: 30.0,
            unitTypes: { id: randomUUID(), name: 'twoBdrm' },
          },
        ],
      };
      await service.createUnitCsv('sampleFile.csv', [
        mockListing as unknown as Listing,
        mockListing2 as unknown as Listing,
      ]);
      expect(writeStream.bytesWritten).toBeGreaterThan(0);
      const content = fs.readFileSync('sampleFile.csv', 'utf8');
      expect(content).toContain(
        'Listing Id,Listing Name,Unit Number,Unit Type,Number of Bathrooms,Unit Floor,Square Footage,Minimum Occupancy,Max Occupancy,AMI Chart,AMI Level,Rent Type',
      );
      expect(content).toContain(
        'listing1-ID,listing1-Name,1,studio,2,3,1200,1,8,Ami Chart Name,80,Fixed amount',
      );
      expect(content).toContain(
        'listing2-ID,listing2-Name,1,twoBdrm,2,3,1200,1,8,Ami Chart Name,80,% of income',
      );
    });
  });
});