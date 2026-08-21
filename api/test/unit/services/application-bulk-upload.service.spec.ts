import fs from 'fs';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';
import { addressFactory } from '../../../prisma/seed-helpers/address-factory';
import { Address } from '../../../src/dtos/addresses/address.dto';
import { Accessibility } from '../../../src/dtos/applications/accessibility.dto';
import { AlternateContact } from '../../../src/dtos/applications/alternate-contact.dto';
import { Applicant } from '../../../src/dtos/applications/applicant.dto';
import { Application } from '../../../src/dtos/applications/application.dto';
import { Demographic } from '../../../src/dtos/applications/demographic.dto';
import {
  ApplicationBulkUploadService,
  ApplicationContextFields,
  bulkUploadHeaderNames,
  CsvRow,
} from '../../../src/services/application-bulk-upload.service';
import { ListingService } from '../../../src/services/listing.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { S3Service } from '../../../src/services/s3.service';
import { formatLocalDate } from '../../../src/utilities/format-local-date';
import { BackgroundJobsService } from '../../../src/services/background-jobs.service';
import { User } from '../../../src/dtos/users/user.dto';
import { FeatureFlagEnum } from '../../../src/enums/feature-flags/feature-flags-enum';

const mockApplication = ({
  markedAsDuplicate = false,
  applicant = {
    id: randomUUID(),
    applicantAddress: addressFactory() as unknown as Address,
    applicantWorkAddress: addressFactory() as unknown as Address,
  },
  ...options
}: {
  id?: string;
  applicant?: Partial<Applicant>;
  submissionDate?: Date;
  deletedAt?: Date;
  status?: ApplicationStatusEnum;
  applicationDeclineReason?: ApplicationDeclineReasonEnum;
  applicationDeclineReasonAdditionalDetails?: string;
  accessibleUnitWaitlistNumber?: number;
  conventionalUnitWaitlistNumber?: number;
  markedAsDuplicate?: boolean;
  position?: number;
  manualLotteryPositionNumber?: number;
}): Application => {
  return {
    id: options?.id || randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: options?.deletedAt ?? null,
    submissionDate: options?.submissionDate ?? new Date(),
    contactPreferences: ['example contact preference'],
    status: options?.status ?? ApplicationStatusEnum.submitted,
    submissionType: ApplicationSubmissionTypeEnum.electronical,
    markedAsDuplicate: markedAsDuplicate,
    confirmationCode: `confirmationCode ${options?.position}`,
    applicant: applicant as Applicant,
    manualLotteryPositionNumber: options?.manualLotteryPositionNumber ?? null,
    applicationLotteryPositions: [],
    applicationsMailingAddress: addressFactory() as unknown as Address,
    applicationsAlternateAddress: addressFactory() as unknown as Address,
    accessibility: {} as Accessibility,
    demographics: { howDidYouHear: [] } as unknown as Demographic,
    preferredUnitTypes: [],
    alternateContact: {
      address: addressFactory() as unknown as Address,
    } as unknown as AlternateContact,
    householdMember: [],
    listings: { id: randomUUID() },
    applicationDeclineReason: options?.applicationDeclineReason ?? null,
    applicationDeclineReasonAdditionalDetails:
      options?.applicationDeclineReasonAdditionalDetails ?? null,
    accessibleUnitWaitlistNumber: options?.accessibleUnitWaitlistNumber,
    conventionalUnitWaitlistNumber: options?.conventionalUnitWaitlistNumber,
  };
};

const canOrThrowMock = jest.fn();
const downloadFromPrivateMock = jest.fn();
const backgroundJobCreateMock = jest.fn();
const listingServiceMock = { getJurisdictionIdByListingId: jest.fn() };

const DATE_FORMAT = 'MM-DD-YYYY hh:mm:ssA z';

const expectedDate = (d: Date): string =>
  formatLocalDate(d.toISOString(), DATE_FORMAT, process.env.TIME_ZONE);

type RowOverrides = Partial<Record<keyof typeof bulkUploadHeaderNames, string>>;

const mockCsvInput = (
  rows: RowOverrides[] = [],
  options: { header?: string[] } = {},
): [string[], CsvRow[]] => {
  const headerRow = options.header ?? Object.values(bulkUploadHeaderNames);

  return [
    headerRow,
    rows.map((row) => {
      const cells = Object.keys(bulkUploadHeaderNames).map(
        (key) => row[key] ?? '',
      );
      return Object.fromEntries(
        headerRow.map((label, i) => [label, cells[i] ?? '']),
      );
    }),
  ];
};

const mockCsvResponse = (
  rows: RowOverrides[] = [],
  options: { header?: string[]; bom?: boolean; blankLines?: boolean } = {},
): ReadableStream => {
  const cell = (value: string): string =>
    `"${(value ?? '').replace(/"/g, '""')}"`;

  const line = (cells: string[]): string => cells.map(cell).join(',');

  const [headerRow, dataRows] = mockCsvInput(rows, { header: options.header });

  let header = line(headerRow);
  if (options.bom) header = `﻿${header}`;

  const dataLines = dataRows.flatMap((row, i) => {
    const rowLine = line(headerRow.map((label) => row[label]));
    return options.blankLines && i > 0 ? ['', rowLine] : [rowLine];
  });

  const csv = [header, ...dataLines].join('\n');
  return Readable.toWeb(Readable.from([Buffer.from(csv, 'utf8')]));
};

const dbContext = ({
  id,
  applicant: { firstName = 'Andrew', lastName = 'Rust' },
  submissionDate = new Date(),
}: Partial<ApplicationContextFields>): ApplicationContextFields => ({
  id,
  applicant: { firstName, lastName },
  submissionDate,
});

describe('Testing application bulk upload services', () => {
  let service: ApplicationBulkUploadService;
  let prisma: PrismaService;
  let writeStream;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationBulkUploadService,
        PrismaService,
        { provide: ListingService, useValue: listingServiceMock },
        {
          provide: PermissionService,
          useValue: { canOrThrow: canOrThrowMock },
        },
        {
          provide: S3Service,
          useValue: {
            downloadFromPrivate: downloadFromPrivateMock,
            uploadToPrivate: jest.fn(),
            urlForPrivate: jest.fn(),
            uploadURLForPublic: jest.fn(),
            uploadURLForPrivate: jest.fn(),
            urlForPublic: jest.fn(),
          },
        },
        {
          provide: BackgroundJobsService,
          useValue: {
            create: backgroundJobCreateMock,
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationBulkUploadService>(
      ApplicationBulkUploadService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('bulk update template csv export', () => {
    beforeEach(() => {
      writeStream = fs.createWriteStream('sampleTemplate.csv');
      jest.spyOn(fs, 'createWriteStream').mockReturnValue(writeStream);
    });

    afterEach(() => {
      writeStream.end();
      if (fs.existsSync('sampleTemplate.csv')) {
        fs.unlinkSync('sampleTemplate.csv');
      }
      jest.restoreAllMocks();
    });

    const applicationsSet = [
      mockApplication({
        id: randomUUID(),
        position: 1,
        submissionDate: new Date(1779228000000),
        applicant: {
          firstName: 'Colleen',
          lastName: 'Tawnee',
        },
        status: ApplicationStatusEnum.declined,
        manualLotteryPositionNumber: 15,
        applicationDeclineReason:
          ApplicationDeclineReasonEnum.householdSizeTooLarge,
        applicationDeclineReasonAdditionalDetails: 'Some additional details',
      }),
      mockApplication({
        id: randomUUID(),
        position: 2,
        submissionDate: new Date(1775124000000),
        applicant: {
          firstName: 'Erin',
          lastName: 'Patsy',
        },
        status: ApplicationStatusEnum.submitted,
        accessibleUnitWaitlistNumber: 2,
      }),
      mockApplication({
        id: randomUUID(),
        position: 3,
        submissionDate: new Date(1784820600000),
        applicant: {
          firstName: 'Nanny',
          lastName: 'Hayley',
        },
        status: ApplicationStatusEnum.waitlist,
        conventionalUnitWaitlistNumber: 5,
      }),
    ];

    it('should generate a valid template CSV file', async () => {
      const mockListingId = randomUUID();
      prisma.applications.findMany = jest
        .fn()
        .mockResolvedValue(applicationsSet);

      await service.csvExportHelper(
        'sampleTemplate.csv',
        mockListingId,
        applicationsSet.map((app) => ({ id: app.id })),
      );

      expect(writeStream.bytesWritten).toBeGreaterThan(0);
      const content = fs.readFileSync('sampleTemplate.csv', 'utf8');

      const headers =
        '"Application Id","Applicant First Name","Applicant Last Name","Application Submission Date","Lottery Position Number","Application Status","Application Decline Reason","Application Decline Reason Additional Details","Waitlist Position (Accessible Unit)","Waitlist Position (Conventional Unit)"';

      const rowOne = `"${applicationsSet[0].id}","Colleen","Tawnee","05-19-2026 03:00:00PM PDT","15","Declined","Household size too large","Some additional details",,`;
      const rowTwo = `"${applicationsSet[1].id}","Erin","Patsy","04-02-2026 03:00:00AM PDT",,"Submitted",,,"2",`;
      const rowThree = `"${applicationsSet[2].id}","Nanny","Hayley","07-23-2026 08:30:00AM PDT",,"Wait list",,,,"5"`;

      expect(content).toContain(headers);
      expect(content).toContain(rowOne);
      expect(content).toContain(rowTwo);
      expect(content).toContain(rowThree);
    });
  });

  describe('authorizeExport', () => {
    const listingId = randomUUID();
    const jurisdictionId = randomUUID();

    beforeEach(() => {
      listingServiceMock.getJurisdictionIdByListingId.mockResolvedValue(
        jurisdictionId,
      );
      canOrThrowMock.mockResolvedValue(undefined);
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        featureFlags: [
          {
            name: FeatureFlagEnum.enableApplicationBulkCSVUpdates,
            active: true,
          },
        ],
      });
    });

    afterEach(() => {
      listingServiceMock.getJurisdictionIdByListingId.mockReset();
      backgroundJobCreateMock.mockReset();
      canOrThrowMock.mockReset();
    });

    it('should throw ForbiddenException immediately for isLimitedJurisdictionalAdmin users', async () => {
      const user = {
        userRoles: { isLimitedJurisdictionalAdmin: true },
      } as User;

      await expect(service.authorizeExport(user, listingId)).rejects.toThrow(
        ForbiddenException,
      );

      expect(
        listingServiceMock.getJurisdictionIdByListingId,
      ).not.toHaveBeenCalled();
      expect(canOrThrowMock).not.toHaveBeenCalled();
    });

    it('should call listingService.getJurisdictionIdByListingId with the correct listingId', async () => {
      const user = {
        userRoles: { isLimitedJurisdictionalAdmin: false },
      } as User;

      await service.authorizeExport(user, listingId);

      expect(
        listingServiceMock.getJurisdictionIdByListingId,
      ).toHaveBeenCalledWith(listingId);
    });

    it('should call permissionService.canOrThrow with listing, update, and resolved jurisdictionId', async () => {
      const user = {
        userRoles: { isLimitedJurisdictionalAdmin: false },
      } as User;

      await service.authorizeExport(user, listingId);

      expect(canOrThrowMock).toHaveBeenCalledWith(user, 'listing', 'update', {
        id: listingId,
        jurisdictionId,
      });
    });

    it('should throw BadRequestException when the jurisdiction can not be retrieved', async () => {
      const user = {
        userRoles: { isLimitedJurisdictionalAdmin: false },
      } as User;
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.authorizeExport(user, listingId)).rejects.toThrow(
        new BadRequestException(
          `Failed to retrieve jurisdiction with id: ${jurisdictionId}`,
        ),
      );

      expect(canOrThrowMock).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when the jurisdiction does not have the enableApplicationBulkCSVUpdates flag set', async () => {
      const user = {
        userRoles: { isLimitedJurisdictionalAdmin: false },
      } as User;
      prisma.jurisdictions.findFirst = jest.fn().mockResolvedValue({
        featureFlags: [
          {
            name: FeatureFlagEnum.enableApplicationBulkCSVUpdates,
            active: false,
          },
        ],
      });

      await expect(service.authorizeExport(user, listingId)).rejects.toThrow(
        new BadRequestException(
          `Jurisdiction with id: ${jurisdictionId} does not have the enableApplicationBulkCSVUpdates feature flag set`,
        ),
      );

      expect(canOrThrowMock).not.toHaveBeenCalled();
    });

    it('should re-throw ForbiddenException when canOrThrow rejects', async () => {
      const user = {
        userRoles: { isLimitedJurisdictionalAdmin: false },
      } as User;
      canOrThrowMock.mockRejectedValue(new ForbiddenException());

      await expect(service.authorizeExport(user, listingId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('processBulkUpload', () => {
    const listingId = randomUUID();
    const backgroundJobId = randomUUID();
    const s3Key = 'uploads/applications.csv';
    const mockRequestingUser = {
      userRoles: { isLimitedJurisdictionalAdmin: false },
    } as User;

    beforeEach(() => {
      downloadFromPrivateMock.mockReset();
      backgroundJobCreateMock.mockReset();
      prisma.applications.findMany = jest.fn().mockResolvedValue([]);
    });

    describe('file format (validateFileFormat)', () => {
      it('should reject a non-CSV s3Key before attempting any download', async () => {
        await expect(
          service.processBulkUpload(
            {
              s3Key: 'uploads/applications.txt',
              listingId,
            },
            mockRequestingUser,
          ),
        ).rejects.toThrow(
          new BadRequestException('Upload Failed: file must be a CSV format'),
        );

        expect(downloadFromPrivateMock).not.toHaveBeenCalled();
      });

      it('should accept a .csv key regardless of case and proceed past the format gate', async () => {
        const s3KeyUpperCase = 'uploads/applications.CSV';
        downloadFromPrivateMock.mockRejectedValue(new Error('error'));

        await expect(
          service.processBulkUpload(
            { s3Key: s3KeyUpperCase, listingId },
            mockRequestingUser,
          ),
        ).rejects.toThrow(
          new NotFoundException(
            'The CSV file could not be retrieved from the S3 bucket',
          ),
        );

        expect(downloadFromPrivateMock).toHaveBeenCalledWith(s3KeyUpperCase);
      });
    });

    describe('S3 retrieval', () => {
      it('should throw NotFoundException when downloadFromPrivate rejects', async () => {
        downloadFromPrivateMock.mockRejectedValue(new Error('error'));

        await expect(
          service.processBulkUpload({ s3Key, listingId }, mockRequestingUser),
        ).rejects.toThrow(
          new NotFoundException(
            'The CSV file could not be retrieved from the S3 bucket',
          ),
        );

        expect(downloadFromPrivateMock).toHaveBeenCalledWith(s3Key);
      });
    });

    describe('parsing (csv-parse options)', () => {
      it('should tolerate a BOM-prefixed header row and proceed past header validation', async () => {
        downloadFromPrivateMock.mockResolvedValue(
          mockCsvResponse([], { bom: true }),
        );

        await expect(
          service.processBulkUpload({ s3Key, listingId }, mockRequestingUser),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: CSV contains no application records',
          ),
        );
      });

      it('should skip empty lines between rows so they are not counted as data records', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });
        const appTwo = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Erin', lastName: 'Patsy' },
          submissionDate: new Date(2026, 2, 15, 8, 30, 0),
        });

        prisma.applications.findMany = jest
          .fn()
          .mockResolvedValue([appOne, appTwo]);

        backgroundJobCreateMock.mockResolvedValue({ id: backgroundJobId });
        downloadFromPrivateMock.mockResolvedValue(
          mockCsvResponse(
            [
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
              },
              {
                applicationId: appTwo.id,
                applicantFirstName: appTwo.applicant.firstName,
                applicantLastName: appTwo.applicant.lastName,
                applicationSubmissionDate: expectedDate(appTwo.submissionDate),
                applicationStatus: 'Submitted',
              },
            ],
            { blankLines: true },
          ),
        );

        await expect(
          service.processBulkUpload({ s3Key, listingId }, mockRequestingUser),
        ).resolves.toBeUndefined();
      });
    });
  });

  describe('validateCSV', () => {
    const listingId = randomUUID();

    beforeEach(() => {
      prisma.applications.findMany = jest.fn().mockResolvedValue([]);
    });

    describe('headers (validateHeaders)', () => {
      it('should reject a CSV missing a required column', async () => {
        const header = Object.values(bulkUploadHeaderNames).slice(1);

        await expect(
          service.validateCSV(...mockCsvInput([], { header }), listingId),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: CSV has additional or missing columns',
          ),
        );
      });

      it('should reject a CSV with an unknown column swapped in at the correct count', async () => {
        const header = Object.values(bulkUploadHeaderNames);
        header[0] = 'Unknown';

        await expect(
          service.validateCSV(
            ...mockCsvInput([{ applicationId: randomUUID() }], { header }),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: CSV has additional or missing columns',
          ),
        );
      });
    });

    describe('data rows (validateHasDataRows)', () => {
      it('should reject a CSV with only a header row and no data rows', async () => {
        await expect(
          service.validateCSV(...mockCsvInput([]), listingId),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: CSV contains no application records',
          ),
        );
      });
    });

    describe('duplicate IDs (validateNoDuplicateId)', () => {
      it('should report the row of the second occurrence when duplicates are non-adjacent (rows 2 & 4 → row 4)', async () => {
        const duplicateId = randomUUID();

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              { applicationId: duplicateId },
              { applicationId: randomUUID() },
              { applicationId: duplicateId },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 4 contain duplicate application IDs',
          ),
        );
      });
    });

    describe('application id existence / listing (fetchDbApplications + validateApplicationId)', () => {
      it('should report the row of the first unknown id when an id is not present in the DB result', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
              },
              {
                applicationId: randomUUID(),
                applicantFirstName: 'Erin',
                applicantLastName: 'Patsy',
                applicationSubmissionDate: expectedDate(new Date(2026, 2, 15)),
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 3 have incorrect application identification numbers or belong to a different listing',
          ),
        );
      });

      it('should reject and query the DB once with the listing-scoped where clause when the id belongs to a different listing', async () => {
        const applicationId = randomUUID();

        const findManyMock = jest.fn().mockResolvedValue([]);
        prisma.applications.findMany = findManyMock;

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId,
                applicantFirstName: 'Andrew',
                applicantLastName: 'Rust',
                applicationSubmissionDate: expectedDate(new Date(2026, 0, 1)),
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have incorrect application identification numbers or belong to a different listing',
          ),
        );

        expect(findManyMock).toHaveBeenCalledTimes(1);
        expect(findManyMock).toHaveBeenCalledWith(
          expect.objectContaining({
            where: { id: { in: [applicationId] }, listingId },
          }),
        );
      });
    });

    describe('context fields (validateContextFields)', () => {
      it('should reject a row whose first name does not match the DB applicant', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: 'Mismatch',
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have incorrect application details (Applicant first name, last name or submission date)',
          ),
        );
      });

      it('should reject a row whose last name does not match the DB applicant', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: 'Mismatch',
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have incorrect application details (Applicant first name, last name or submission date)',
          ),
        );
      });

      it('should reject a row whose submission date does not match the DB record', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(new Date(2026, 5, 20)),
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have incorrect application details (Applicant first name, last name or submission date)',
          ),
        );
      });

      it('should pass when first name, last name, and submission date all match', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should treat null DB applicant names with empty CSV name cells as a match', async () => {
        const appOne = {
          id: randomUUID(),
          applicant: { firstName: null, lastName: null },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        } as unknown as ApplicationContextFields;

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: '',
                applicantLastName: '',
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should treat a null DB submission date with an empty CSV date cell as a match', async () => {
        const appOne = {
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: null,
        } as unknown as ApplicationContextFields;

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: '',
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should reject a non-empty CSV date when the DB submission date is null', async () => {
        const appOne = {
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: null,
        } as unknown as ApplicationContextFields;

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(new Date(2026, 0, 1)),
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have incorrect application details (Applicant first name, last name or submission date)',
          ),
        );
      });
    });

    describe('status (validateStatus)', () => {
      it('should reject a row with an unrecognised status string', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Approved',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: Could not match one or more application status inputs beginning on row 2 with accepted system options',
          ),
        );
      });

      it.each([
        { status: 'Declined', declineReason: 'Household size too large' },
        { status: 'Received a Unit' },
        { status: 'Submitted' },
        { status: 'Wait list' },
        { status: 'Wait list - Declined' },
      ])(
        'should accept the valid status "$status"',
        async ({ status, declineReason }) => {
          const appOne = dbContext({
            id: randomUUID(),
            applicant: { firstName: 'Andrew', lastName: 'Rust' },
            submissionDate: new Date(2026, 0, 1, 10, 0, 0),
          });

          prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

          await expect(
            service.validateCSV(
              ...mockCsvInput([
                {
                  applicationId: appOne.id,
                  applicantFirstName: appOne.applicant.firstName,
                  applicantLastName: appOne.applicant.lastName,
                  applicationSubmissionDate: expectedDate(
                    appOne.submissionDate,
                  ),
                  applicationStatus: status,
                  applicationDeclineReason: declineReason ?? '',
                },
              ]),
              listingId,
            ),
          ).resolves.toBeUndefined();
        },
      );
    });

    describe('decline reason (validateDeclineReason)', () => {
      it('should reject a row with a non-empty unrecognised decline reason', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Declined',
                applicationDeclineReason: 'Not a real reason',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: Could not match one or more application decline reason inputs beginning on row 2 with accepted system options',
          ),
        );
      });

      it('should allow an empty decline reason', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                applicationDeclineReason: '',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });
    });

    describe('decline consistency (validateDeclineConsistency)', () => {
      it('should reject a row with a declined status but an empty decline reason', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Declined',
                applicationDeclineReason: '',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have a declined status without a decline reason',
          ),
        );
      });

      it('should reject a row with a decline reason but a non-declined status', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                applicationDeclineReason: 'Household size too large',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have a decline reason without a declined status',
          ),
        );
      });

      it('should pass when a declined status is paired with a valid decline reason', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Declined',
                applicationDeclineReason: 'Household size too large',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });
    });

    describe('additional details (validateAdditionalDetails)', () => {
      it.each([
        'Attempted to contact; no response',
        'Applicant declined unit',
        'Other',
      ])(
        'should reject a row whose decline reason "%s" requires additional details when details are empty',
        async (declineReason) => {
          const appOne = dbContext({
            id: randomUUID(),
            applicant: { firstName: 'Andrew', lastName: 'Rust' },
            submissionDate: new Date(2026, 0, 1, 10, 0, 0),
          });

          prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

          await expect(
            service.validateCSV(
              ...mockCsvInput([
                {
                  applicationId: appOne.id,
                  applicantFirstName: appOne.applicant.firstName,
                  applicantLastName: appOne.applicant.lastName,
                  applicationSubmissionDate: expectedDate(
                    appOne.submissionDate,
                  ),
                  applicationStatus: 'Declined',
                  applicationDeclineReason: declineReason,
                  applicationDeclineReasonAdditionalDetails: '',
                },
              ]),
              listingId,
            ),
          ).rejects.toThrow(
            new BadRequestException(
              'Upload Failed: One or more rows beginning on row 2 require additional details for the provided decline reason',
            ),
          );
        },
      );

      it('should pass when a decline reason requiring additional details is provided with details', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Declined',
                applicationDeclineReason: 'Other',
                applicationDeclineReasonAdditionalDetails:
                  'Some additional details',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should pass when a decline reason that does not require details has empty details', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Declined',
                applicationDeclineReason: 'Household size too large',
                applicationDeclineReasonAdditionalDetails: '',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should pass when additional details are exactly 2000 characters', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Declined',
                applicationDeclineReason: 'Other',
                applicationDeclineReasonAdditionalDetails: 'a'.repeat(2000),
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should reject a row whose additional details exceed 2000 characters', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Declined',
                applicationDeclineReason: 'Other',
                applicationDeclineReasonAdditionalDetails: 'a'.repeat(2001),
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have application decline reason additional details exceeding 2000 characters',
          ),
        );
      });
    });

    describe('waitlist consistency (validateWaitlistConsistency)', () => {
      it('should reject a row with an accessible waitlist position but a non-waitlist status', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                waitlistPositionAccessibleUnit: '2',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have a waitlist position without a waitlist status',
          ),
        );
      });

      it('should reject a row with a conventional waitlist position but a non-waitlist status', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                waitlistPositionConventionalUnit: '5',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have a waitlist position without a waitlist status',
          ),
        );
      });

      it.each(['Wait list', 'Wait list - Declined'])(
        'should pass a row with a waitlist position and the "%s" status',
        async (status) => {
          const appOne = dbContext({
            id: randomUUID(),
            applicant: { firstName: 'Andrew', lastName: 'Rust' },
            submissionDate: new Date(2026, 0, 1, 10, 0, 0),
          });

          prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

          await expect(
            service.validateCSV(
              ...mockCsvInput([
                {
                  applicationId: appOne.id,
                  applicantFirstName: appOne.applicant.firstName,
                  applicantLastName: appOne.applicant.lastName,
                  applicationSubmissionDate: expectedDate(
                    appOne.submissionDate,
                  ),
                  applicationStatus: status,
                  waitlistPositionAccessibleUnit: '2',
                },
              ]),
              listingId,
            ),
          ).resolves.toBeUndefined();
        },
      );
    });

    describe('numeric fields (validateNumericFields)', () => {
      it('should reject a row with a non-numeric value in a numeric column', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                lotteryPositionNumber: 'abc',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have invalid numeric values',
          ),
        );
      });

      it('should reject a row with a negative numeric value', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                lotteryPositionNumber: '-1',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have invalid numeric values',
          ),
        );
      });

      it('should reject a lottery position of 0 (minimum is 1)', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                lotteryPositionNumber: '0',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have invalid numeric values',
          ),
        );
      });

      it('should allow a waitlist position of 0 (only lottery rejects 0)', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Wait list',
                waitlistPositionAccessibleUnit: '0',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should reject a fractional numeric value (integer rule)', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                lotteryPositionNumber: '1.5',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: One or more rows beginning on row 2 have invalid numeric values',
          ),
        );
      });

      it('should treat a whitespace-only lottery cell as empty and not coerce it to 0', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                lotteryPositionNumber: ' ',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should pass when all numeric cells are empty', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Andrew', lastName: 'Rust' },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: appOne.applicant.firstName,
                applicantLastName: appOne.applicant.lastName,
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                lotteryPositionNumber: '',
                waitlistPositionAccessibleUnit: '',
                waitlistPositionConventionalUnit: '',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });
    });

    it('should resolve as success for a fully valid multi-row CSV mixing statuses', async () => {
      const submittedApp = dbContext({
        id: randomUUID(),
        applicant: { firstName: 'Andrew', lastName: 'Rust' },
        submissionDate: new Date(2026, 0, 1, 10, 0, 0),
      });
      const declinedApp = dbContext({
        id: randomUUID(),
        applicant: { firstName: 'Colleen', lastName: 'Tawnee' },
        submissionDate: new Date(2026, 3, 2, 10, 0, 0),
      });
      const waitlistApp = dbContext({
        id: randomUUID(),
        applicant: { firstName: 'Nanny', lastName: 'Hayley' },
        submissionDate: new Date(2026, 6, 23, 15, 30, 0),
      });

      prisma.applications.findMany = jest
        .fn()
        .mockResolvedValue([submittedApp, declinedApp, waitlistApp]);

      await expect(
        service.validateCSV(
          ...mockCsvInput([
            {
              applicationId: submittedApp.id,
              applicantFirstName: submittedApp.applicant.firstName,
              applicantLastName: submittedApp.applicant.lastName,
              applicationSubmissionDate: expectedDate(
                submittedApp.submissionDate,
              ),
              applicationStatus: 'Submitted',
            },
            {
              applicationId: declinedApp.id,
              applicantFirstName: declinedApp.applicant.firstName,
              applicantLastName: declinedApp.applicant.lastName,
              applicationSubmissionDate: expectedDate(
                declinedApp.submissionDate,
              ),
              applicationStatus: 'Declined',
              applicationDeclineReason: 'Other',
              applicationDeclineReasonAdditionalDetails:
                'Some additional details',
            },
            {
              applicationId: waitlistApp.id,
              applicantFirstName: waitlistApp.applicant.firstName,
              applicantLastName: waitlistApp.applicant.lastName,
              applicationSubmissionDate: expectedDate(
                waitlistApp.submissionDate,
              ),
              applicationStatus: 'Wait list',
              waitlistPositionAccessibleUnit: '2',
              waitlistPositionConventionalUnit: '5',
            },
          ]),
          listingId,
        ),
      ).resolves.toBeUndefined();
    });

    it('should validate rows past the first 500-row chunk and report their absolute row number', async () => {
      const apps = Array.from({ length: 501 }, (_, i) =>
        dbContext({
          id: randomUUID(),
          applicant: { firstName: `First${i}`, lastName: `Last${i}` },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        }),
      );

      const findManyMock = jest.fn().mockResolvedValue(apps);
      prisma.applications.findMany = findManyMock;

      await expect(
        service.validateCSV(
          ...mockCsvInput(
            apps.map((app, i) => ({
              applicationId: app.id,
              applicantFirstName: app.applicant.firstName,
              applicantLastName: app.applicant.lastName,
              applicationSubmissionDate: expectedDate(app.submissionDate),
              applicationStatus: i === 500 ? 'Approved' : 'Submitted',
            })),
          ),
          listingId,
        ),
      ).rejects.toThrow(
        new BadRequestException(
          'Upload Failed: Could not match one or more application status inputs beginning on row 502 with accepted system options',
        ),
      );

      expect(findManyMock).toHaveBeenCalledTimes(2);
    });
  });
});
