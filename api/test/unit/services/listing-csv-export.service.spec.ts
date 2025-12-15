import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import {
  ListingEventsTypeEnum,
  ListingsStatusEnum,
  MarketingSeasonEnum,
  MarketingTypeEnum,
  MonthEnum,
} from '@prisma/client';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import fs from 'fs';
import { ListingCsvExporterService } from '../../../src/services/listing-csv-export.service';
import { PrismaService } from '../../../src/services/prisma.service';
import Listing from '../../../src/dtos/listings/listing.dto';
import { User } from '../../../src/dtos/users/user.dto';
import { Unit } from '../../../src/dtos/units/unit.dto';
import { FeatureFlagEnum } from '../../../src/enums/feature-flags/feature-flags-enum';
import { Jurisdiction } from '../../../src/dtos/jurisdictions/jurisdiction.dto';
import { FeatureFlag } from '../../../src/dtos/feature-flags/feature-flag.dto';

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
  const timestamp = new Date(1759430299657);

  const mockBaseJurisdiction: Jurisdiction = {
    id: 'jurisdiction-ID',
    name: 'jurisdiction-Name',
    createdAt: timestamp,
    updatedAt: timestamp,
    featureFlags: [],
    languages: ['en', 'es'],
    multiselectQuestions: [],
    publicUrl: '',
    emailFromAddress: '',
    rentalAssistanceDefault: '',
    whatToExpect: '',
    whatToExpectAdditionalText: '',
    whatToExpectUnderConstruction: '',
    allowSingleUseCodeLogin: false,
    listingApprovalPermissions: [],
    duplicateListingPermissions: [],
    requiredListingFields: [],
    visibleNeighborhoodAmenities: [],
  };

  const mockBaseUnit: Unit = {
    number: '1',
    numBathrooms: 2,
    floor: 3,
    sqFeet: '1200',
    minOccupancy: 1,
    maxOccupancy: 8,
    amiPercentage: '80',
    monthlyRentAsPercentOfIncome: null,
    monthlyRent: '4000',
    unitTypes: {
      id: randomUUID(),
      name: 'studio',
      createdAt: timestamp,
      updatedAt: timestamp,
      numBedrooms: 1,
    },
    amiChart: {
      id: randomUUID(),
      name: 'Ami Chart Name',
      createdAt: timestamp,
      updatedAt: timestamp,
      items: [],
      jurisdictions: null,
    },
    id: 'unit1-ID',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  type MockListing = Listing & {
    userAccounts: User[];
  };
  const mockBaseListing: MockListing = {
    id: 'listing1-ID',
    name: `listing1-Name`,
    createdAt: timestamp,
    jurisdictions: mockBaseJurisdiction,
    status: ListingsStatusEnum.active,
    publishedAt: timestamp,
    contentUpdatedAt: timestamp,
    developer: 'developer',
    listingsBuildingAddress: {
      street: '123 main st',
      city: 'Bloomington',
      state: 'BL',
      zipCode: '01234',
      latitude: 100.5,
      longitude: 200.5,
      id: 'listingbuildingaddress1-ID',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    neighborhood: 'neighborhood',
    yearBuilt: 2025,
    listingEvents: [
      {
        type: ListingEventsTypeEnum.publicLottery,
        startTime: timestamp,
        endTime: dayjs(timestamp).add(2, 'hours').toDate(),
        note: 'lottery note',
        id: 'listingevent1-ID',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    applicationFee: '45',
    depositHelperText: 'sample deposit helper text',
    depositMin: '12',
    depositMax: '120',
    costsNotIncluded: 'sample costs not included',
    amenities: 'sample amenities',
    accessibility: 'sample accessibility',
    unitAmenities: 'sample unit amenities',
    smokingPolicy: 'sample smoking policy',
    petPolicy: 'sample pet policy',
    servicesOffered: 'sample services offered',
    leasingAgentName: 'Name of leasing agent',
    leasingAgentEmail: 'Email of leasing agent',
    leasingAgentTitle: 'Title of leasing agent',
    leasingAgentOfficeHours: 'office hours',
    listingsLeasingAgentAddress: {
      street: '321 main st',
      city: 'Bloomington',
      state: 'BL',
      zipCode: '01234',
      latitude: 100.5,
      longitude: 200.5,
      id: 'listingleasingagentaddress1-ID',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    listingsApplicationMailingAddress: {
      street: '456 main st',
      city: 'Bloomington',
      state: 'BL',
      zipCode: '01234',
      latitude: 100.5,
      longitude: 200.5,
      id: 'listingmailingaddress1-ID',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    listingsApplicationPickUpAddress: {
      street: '789 main st',
      city: 'Bloomington',
      state: 'BL',
      zipCode: '01234',
      latitude: 100.5,
      longitude: 200.5,
      id: 'listingpickupaddress1-ID',
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    applicationDueDate: timestamp,
    listingMultiselectQuestions: [],
    applicationMethods: [],
    units: [mockBaseUnit],
    displayWaitlistSize: false,
    showWaitlist: false,
    referralApplication: null,
    assets: [],
    applicationLotteryTotals: null,
    updatedAt: timestamp,
    marketingType: MarketingTypeEnum.comingSoon,
    marketingSeason: MarketingSeasonEnum.summer,
    marketingMonth: MonthEnum.july,
    marketingYear: 2025,
    userAccounts: [
      {
        firstName: 'userFirst',
        lastName: 'userLast',
      } as User,
    ],
  };

  describe('createCsv', () => {
    it('should create the listing csv with no feature flags', async () => {
      await service.createCsv('sampleFile.csv', undefined, {
        listings: [mockBaseListing],
        user: { jurisdictions: [mockBaseJurisdiction] } as unknown as User,
      });

      expect(writeStream.bytesWritten).toBeGreaterThan(0);
      const content = fs.readFileSync('sampleFile.csv', 'utf8');
      // Validate headers
      expect(content).toContain(
        'Listing Id,Created At Date,Jurisdiction,Listing Name,Listing Status,Publish Date,Last Updated,Copy or Original,Copied From,Developer,Building Street Address,Building City,Building State,Building Zip,Building Neighborhood,Building Year Built,Reserved Community Types,Latitude,Longitude,Number of Units,Listing Availability,Review Order,Lottery Date,Lottery Start,Lottery End,Lottery Notes,Housing Preferences,Housing Programs,Application Fee,Deposit Helper Text,Deposit Type,Deposit Value,Deposit Min,Deposit Max,Costs Not Included,Property Amenities,Additional Accessibility,Unit Amenities,Smoking Policy,Pets Policy,Services Offered,Eligibility Rules - Credit History,Eligibility Rules - Rental History,Eligibility Rules - Criminal Background,Eligibility Rules - Rental Assistance,Building Selection Criteria,Important Program Rules,Required Documents,Special Notes,Waitlist,Leasing Agent Name,Leasing Agent Email,Leasing Agent Phone,Leasing Agent Title,Leasing Agent Office Hours,Leasing Agent Street Address,Leasing Agent Apt/Unit #,Leasing Agent City,Leasing Agent State,Leasing Agent Zip,Leasing Agency Mailing Address,Leasing Agency Mailing Address Street 2,Leasing Agency Mailing Address City,Leasing Agency Mailing Address State,Leasing Agency Mailing Address Zip,Leasing Agency Pickup Address,Leasing Agency Pickup Address Street 2,Leasing Agency Pickup Address City,Leasing Agency Pickup Address State,Leasing Agency Pickup Address Zip,Leasing Pick Up Office Hours,Digital Application,Digital Application URL,Paper Application,Paper Application URL,Referral Opportunity,Can applications be mailed in?,Can applications be picked up?,Can applications be dropped off?,Postmark,Additional Application Submission Notes,Application Due Date,Application Due Time,Open House,Partners Who Have Access',
      );
      // Validate first row
      expect(content).toContain(
        '"listing1-ID","10-02-2025 11:38:19AM PDT","jurisdiction-Name","listing1-Name","Public","10-02-2025 11:38:19AM PDT","10-02-2025 11:38:19AM PDT","Original",,"developer","123 main st","Bloomington","BL","01234","neighborhood","2025",,"100.5","200.5","1","Available Units",,"10-02-2025","11:38AM PDT","01:38PM PDT","lottery note",,,"$45","sample deposit helper text",,,"$12","$120","sample costs not included","sample amenities","sample accessibility","sample unit amenities","sample smoking policy","sample pet policy","sample services offered",,,,,,,,,"No","Name of leasing agent","Email of leasing agent",,"Title of leasing agent","office hours","321 main st",,"Bloomington","BL","01234","456 main st",,"Bloomington","BL","01234","789 main st",,"Bloomington","BL","01234",,"No",,"No",,"No","No","No","No",,,"10-02-2025","11:38AM PDT",,"userFirst userLast"',
      );
    });
    it('should create the listing csv with marketing type seasons', async () => {
      await service.createCsv('sampleFile.csv', undefined, {
        listings: [
          {
            ...mockBaseListing,
            marketingMonth: null,
            showWaitlist: false,
            referralApplication: null,
          },
        ],
        user: {
          jurisdictions: [
            {
              ...mockBaseJurisdiction,
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableMarketingStatus,
                  active: true,
                } as FeatureFlag,
              ],
            },
          ],
        } as unknown as User,
      });

      expect(writeStream.bytesWritten).toBeGreaterThan(0);
      const content = fs.readFileSync('sampleFile.csv', 'utf8');
      // Validate headers
      expect(content).toContain(
        'Listing Id,Created At Date,Jurisdiction,Listing Name,Listing Status,Publish Date,Last Updated,Copy or Original,Copied From,Developer,Building Street Address,Building City,Building State,Building Zip,Building Neighborhood,Building Year Built,Reserved Community Types,Latitude,Longitude,Number of Units,Listing Availability,Review Order,Lottery Date,Lottery Start,Lottery End,Lottery Notes,Housing Preferences,Housing Programs,Application Fee,Deposit Helper Text,Deposit Type,Deposit Value,Deposit Min,Deposit Max,Costs Not Included,Property Amenities,Additional Accessibility,Unit Amenities,Smoking Policy,Pets Policy,Services Offered,Eligibility Rules - Credit History,Eligibility Rules - Rental History,Eligibility Rules - Criminal Background,Eligibility Rules - Rental Assistance,Building Selection Criteria,Important Program Rules,Required Documents,Special Notes,Waitlist,Marketing Status,Marketing Season,Marketing Year,Leasing Agent Name,Leasing Agent Email,Leasing Agent Phone,Leasing Agent Title,Leasing Agent Office Hours,Leasing Agent Street Address,Leasing Agent Apt/Unit #,Leasing Agent City,Leasing Agent State,Leasing Agent Zip,Leasing Agency Mailing Address,Leasing Agency Mailing Address Street 2,Leasing Agency Mailing Address City,Leasing Agency Mailing Address State,Leasing Agency Mailing Address Zip,Leasing Agency Pickup Address,Leasing Agency Pickup Address Street 2,Leasing Agency Pickup Address City,Leasing Agency Pickup Address State,Leasing Agency Pickup Address Zip,Leasing Pick Up Office Hours,Digital Application,Digital Application URL,Paper Application,Paper Application URL,Referral Opportunity,Can applications be mailed in?,Can applications be picked up?,Can applications be dropped off?,Postmark,Additional Application Submission Notes,Application Due Date,Application Due Time,Open House,Partners Who Have Access',
      );
      // Validate first row
      expect(content).toContain(
        '"listing1-ID","10-02-2025 11:38:19AM PDT","jurisdiction-Name","listing1-Name","Public","10-02-2025 11:38:19AM PDT","10-02-2025 11:38:19AM PDT","Original",,"developer","123 main st","Bloomington","BL","01234","neighborhood","2025",,"100.5","200.5","1","Available Units",,"10-02-2025","11:38AM PDT","01:38PM PDT","lottery note",,,"$45","sample deposit helper text",,,"$12","$120","sample costs not included","sample amenities","sample accessibility","sample unit amenities","sample smoking policy","sample pet policy","sample services offered",,,,,,,,,"No","Under Construction","Summer","2025","Name of leasing agent","Email of leasing agent",,"Title of leasing agent","office hours","321 main st",,"Bloomington","BL","01234","456 main st",,"Bloomington","BL","01234","789 main st",,"Bloomington","BL","01234",,"No",,"No",,"No","No","No","No",,,"10-02-2025","11:38AM PDT",,"userFirst userLast"',
      );
    });
    it('should create the listing csv with marketing type months', async () => {
      await service.createCsv('sampleFile.csv', undefined, {
        listings: [
          {
            ...mockBaseListing,
            marketingSeason: null,
            showWaitlist: false,
            referralApplication: null,
          },
        ],
        user: {
          jurisdictions: [
            {
              ...mockBaseJurisdiction,
              featureFlags: [
                {
                  name: FeatureFlagEnum.enableMarketingStatus,
                  active: true,
                } as FeatureFlag,
                {
                  name: FeatureFlagEnum.enableMarketingStatusMonths,
                  active: true,
                } as FeatureFlag,
              ],
            },
          ],
        } as unknown as User,
      });

      expect(writeStream.bytesWritten).toBeGreaterThan(0);
      const content = fs.readFileSync('sampleFile.csv', 'utf8');
      // Validate headers
      expect(content).toContain(
        'Listing Id,Created At Date,Jurisdiction,Listing Name,Listing Status,Publish Date,Last Updated,Copy or Original,Copied From,Developer,Building Street Address,Building City,Building State,Building Zip,Building Neighborhood,Building Year Built,Reserved Community Types,Latitude,Longitude,Number of Units,Listing Availability,Review Order,Lottery Date,Lottery Start,Lottery End,Lottery Notes,Housing Preferences,Housing Programs,Application Fee,Deposit Helper Text,Deposit Type,Deposit Value,Deposit Min,Deposit Max,Costs Not Included,Property Amenities,Additional Accessibility,Unit Amenities,Smoking Policy,Pets Policy,Services Offered,Eligibility Rules - Credit History,Eligibility Rules - Rental History,Eligibility Rules - Criminal Background,Eligibility Rules - Rental Assistance,Building Selection Criteria,Important Program Rules,Required Documents,Special Notes,Waitlist,Marketing Status,Marketing Month,Marketing Year,Leasing Agent Name,Leasing Agent Email,Leasing Agent Phone,Leasing Agent Title,Leasing Agent Office Hours,Leasing Agent Street Address,Leasing Agent Apt/Unit #,Leasing Agent City,Leasing Agent State,Leasing Agent Zip,Leasing Agency Mailing Address,Leasing Agency Mailing Address Street 2,Leasing Agency Mailing Address City,Leasing Agency Mailing Address State,Leasing Agency Mailing Address Zip,Leasing Agency Pickup Address,Leasing Agency Pickup Address Street 2,Leasing Agency Pickup Address City,Leasing Agency Pickup Address State,Leasing Agency Pickup Address Zip,Leasing Pick Up Office Hours,Digital Application,Digital Application URL,Paper Application,Paper Application URL,Referral Opportunity,Can applications be mailed in?,Can applications be picked up?,Can applications be dropped off?,Postmark,Additional Application Submission Notes,Application Due Date,Application Due Time,Open House,Partners Who Have Access',
      );
      // Validate first row
      expect(content).toContain(
        '"listing1-ID","10-02-2025 11:38:19AM PDT","jurisdiction-Name","listing1-Name","Public","10-02-2025 11:38:19AM PDT","10-02-2025 11:38:19AM PDT","Original",,"developer","123 main st","Bloomington","BL","01234","neighborhood","2025",,"100.5","200.5","1","Available Units",,"10-02-2025","11:38AM PDT","01:38PM PDT","lottery note",,,"$45","sample deposit helper text",,,"$12","$120","sample costs not included","sample amenities","sample accessibility","sample unit amenities","sample smoking policy","sample pet policy","sample services offered",,,,,,,,,"No","Under Construction","July","2025","Name of leasing agent","Email of leasing agent",,"Title of leasing agent","office hours","321 main st",,"Bloomington","BL","01234","456 main st",,"Bloomington","BL","01234","789 main st",,"Bloomington","BL","01234",,"No",,"No",,"No","No","No","No",,,"10-02-2025","11:38AM PDT",,"userFirst userLast"',
      );
    });
    it.todo('should create the listing csv with feature flagged columns');
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
        '"listing1-ID","listing1-Name","1","studio","2","3","1200","1","8","Ami Chart Name","80","Fixed amount"',
      );
      expect(content).toContain(
        '"listing2-ID","listing2-Name","1","twoBdrm","2","3","1200","1","8","Ami Chart Name","80","% of income"',
      );
    });

    it('should create the unit groups csv when feature flag is enabled', async () => {
      const unitGroup = {
        id: randomUUID(),
        totalCount: 5,
        totalAvailable: 2,
        minOccupancy: 1,
        maxOccupancy: 3,
        floorMin: 1,
        floorMax: 3,
        sqFeetMin: '800',
        sqFeetMax: '1000',
        bathroomMin: '1',
        bathroomMax: '2',
        unitTypes: [
          { id: randomUUID(), name: 'studio' },
          { id: randomUUID(), name: 'oneBdrm' },
        ],
        unitGroupAmiLevels: [
          {
            id: randomUUID(),
            monthlyRentDeterminationType: 'percentOfIncome',
            amiChart: { id: randomUUID(), name: 'Ami Chart Name' },
          },
          {
            id: randomUUID(),
            monthlyRentDeterminationType: 'flatRent',
            amiChart: { id: randomUUID(), name: 'Ami Chart Name' },
          },
        ],
      };

      const mockListing = {
        id: 'listing1-ID',
        name: 'listing1-Name',
        unitGroups: [unitGroup],
        unitGroupsSummarized: {
          unitGroupSummary: [
            {
              rentRange: {
                min: 3000,
                max: 4000,
              },
              amiPercentageRange: {
                min: 30,
                max: 50,
              },
            },
          ],
        },
      };

      await service.createUnitCsv(
        'sampleFile.csv',
        [mockListing as unknown as Listing],
        true, // enableUnitGroups flag
      );

      expect(writeStream.bytesWritten).toBeGreaterThan(0);
      const content = fs.readFileSync('sampleFile.csv', 'utf8');

      // Check headers
      expect(content).toContain(
        'Listing Id,Listing Name,Unit Group Id,Unit Types,AMI Chart,AMI Levels,Rent Type,Monthly Rent,Affordable Unit Group Quantity,Unit Group Vacancies,Waitlist Status,Minimum Occupancy,Maximum Occupancy,Minimum Sq ft,Maximum Sq ft,Minimum Floor,Maximum Floor,Minimum Bathrooms,Maximum Bathrooms',
      );

      expect(content).toContain(
        `"listing1-ID","listing1-Name","${unitGroup.id}","Studio, One Bedroom","Ami Chart Name","30% - 50%","Percent Of Income, Flat Rent","3000 - 4000","5","2","No","1","3","800","1000","1","3","1","2"`,
      );
    });
  });

  describe('authorizeCSVExport', () => {
    it('should allow admin users to export', async () => {
      const user = {
        userRoles: {
          isAdmin: true,
        },
      };

      await expect(
        service.authorizeCSVExport(user as any),
      ).resolves.toBeUndefined();
    });

    it('should allow support admin users to export', async () => {
      const user = {
        userRoles: {
          isSupportAdmin: true,
        },
      };

      await expect(
        service.authorizeCSVExport(user as any),
      ).resolves.toBeUndefined();
    });

    it('should allow jurisdictional admin users to export', async () => {
      const user = {
        userRoles: {
          isJurisdictionalAdmin: true,
        },
      };

      await expect(
        service.authorizeCSVExport(user as any),
      ).resolves.toBeUndefined();
    });

    it('should throw ForbiddenException for unauthorized users', async () => {
      const user = {
        userRoles: {
          isAdmin: false,
          isJurisdictionalAdmin: false,
          isLimitedJurisdictionalAdmin: false,
          isPartner: false,
          isSupportAdmin: false,
        },
      };

      await expect(service.authorizeCSVExport(user as any)).rejects.toThrow(
        'Forbidden',
      );
    });

    it('should throw ForbiddenException for undefined user', async () => {
      await expect(service.authorizeCSVExport()).rejects.toThrow('Forbidden');
    });
  });
});
