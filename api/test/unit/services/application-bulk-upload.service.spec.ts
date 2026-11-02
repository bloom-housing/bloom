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
  BackgroundJobStatusEnum,
  IncomePeriodEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';
import { lastValueFrom, toArray } from 'rxjs';
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
import { User } from '../../../src/dtos/users/user.dto';
import { FeatureFlagEnum } from '../../../src/enums/feature-flags/feature-flags-enum';
import { EmailService } from '../../../src/services/email.service';
import { SnapshotCreateService } from '../../../src/services/snapshot-create.service';
import { ConfigService } from '@nestjs/config';
import { BackgroundJobsService } from '../../../src/services/background-jobs.service';
import { BackgroundJob } from '../../../src/dtos/background-jobs/background-job.dto';
import { BulkUploadJobNotification } from '../../../src/types/ServerSideEvents';

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
  householdSize?: number;
  income?: string;
  incomePeriod?: IncomePeriodEnum;
  incomeVouchers?: string[];
  accessibility?: Partial<Accessibility>;
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
    accessibility: (options?.accessibility ?? {}) as Accessibility,
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
    householdSize: options?.householdSize,
    income: options?.income,
    incomePeriod: options?.incomePeriod,
    incomeVouchers: options?.incomeVouchers,
  };
};

const canOrThrowMock = jest.fn();
const downloadFromPrivateMock = jest.fn();
const backgroundJobCreateMock = jest.fn();
const backgroundJobUpdateMock = jest.fn();
const listingServiceMock = { getJurisdictionIdByListingId: jest.fn() };
const backgroundJobServiceMock = {
  findById: jest.fn(),
  create: backgroundJobCreateMock,
  update: backgroundJobUpdateMock,
};

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
  applicant: {
    firstName = 'Andrew',
    lastName = 'Rust',
    birthDay = 15,
    birthMonth = 3,
    birthYear = 1990,
  } = {},
  submissionDate = new Date(),
  householdSize = 2,
  income = '2500',
  incomePeriod = IncomePeriodEnum.perMonth,
  incomeVouchers = [],
  accessibility = {},
}: Omit<Partial<ApplicationContextFields>, 'applicant' | 'accessibility'> & {
  applicant?: Partial<ApplicationContextFields['applicant']>;
  accessibility?: Partial<ApplicationContextFields['accessibility']>;
}): ApplicationContextFields => ({
  id,
  applicant: { firstName, lastName, birthDay, birthMonth, birthYear },
  submissionDate,
  householdSize,
  income,
  incomePeriod,
  incomeVouchers,
  accessibility: {
    hearing: null,
    hearingAndVision: null,
    mobility: null,
    other: null,
    vision: null,
    ...accessibility,
  },
});

/**
 * Builds the context cells a template export would produce for the given DB
 * record. ADA and voucher cells default to the values for an application
 * without accessibility needs or an income voucher - override them explicitly
 * when the record has those set.
 */
const contextRow = (app: ApplicationContextFields): RowOverrides => {
  const { firstName, lastName, birthDay, birthMonth, birthYear } =
    app.applicant;
  const hasDateOfBirth =
    birthDay != null && birthMonth != null && birthYear != null;

  return {
    applicationId: app.id,
    applicantFirstName: firstName ?? '',
    applicantLastName: lastName ?? '',
    applicantDateOfBirth: hasDateOfBirth
      ? `${birthMonth}/${birthDay}/${birthYear}`
      : '',
    applicationSubmissionDate: app.submissionDate
      ? expectedDate(app.submissionDate)
      : '',
    householdSize: app.householdSize?.toString() ?? '',
    annualIncome:
      app.incomePeriod === IncomePeriodEnum.perYear ? app.income ?? '' : '',
    monthlyIncome:
      app.incomePeriod === IncomePeriodEnum.perMonth ? app.income ?? '' : '',
    requestedAccessibility: '',
    voucherOrSubsidy: 'No',
  };
};

const contextFieldsError = (row = 2): string =>
  `Upload Failed: One or more rows beginning on row ${row} have incorrect application details (Applicant First Name, Applicant Last Name, Primary DOB, Application Submission Date, Household size, Declared annual income, Declared monthly income, Request ADA or Subsidy/Voucher)`;

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
          provide: BackgroundJobsService,
          useValue: backgroundJobServiceMock,
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
          provide: EmailService,
          useValue: {
            applicationUpdateEmail: jest.fn(),
            applicationsBulkSuccessWithErrors: jest.fn(),
            applicationsBulkSuccess: jest.fn(),
            applicationsBulkFailure: jest.fn(),
          },
        },
        SnapshotCreateService,
        ConfigService,
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
          birthDay: '15',
          birthMonth: '3',
          birthYear: '1990',
        },
        status: ApplicationStatusEnum.declined,
        manualLotteryPositionNumber: 15,
        applicationDeclineReason:
          ApplicationDeclineReasonEnum.householdSizeTooLarge,
        applicationDeclineReasonAdditionalDetails: 'Some additional details',
        householdSize: 2,
        income: '55000',
        incomePeriod: IncomePeriodEnum.perYear,
        incomeVouchers: ['incomeVoucher'],
        accessibility: { mobility: true, other: true },
      }),
      mockApplication({
        id: randomUUID(),
        position: 2,
        submissionDate: new Date(1775124000000),
        applicant: {
          firstName: 'Erin',
          lastName: 'Patsy',
          birthDay: '2',
          birthMonth: '11',
          birthYear: '1985',
        },
        status: ApplicationStatusEnum.submitted,
        accessibleUnitWaitlistNumber: 2,
        householdSize: 4,
        income: '2500',
        incomePeriod: IncomePeriodEnum.perMonth,
        incomeVouchers: ['issuedVouchers'],
        accessibility: { hearingAndVision: true, hearing: true, vision: true },
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
        incomeVouchers: [],
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
        '"Application Id","Applicant First Name","Applicant Last Name","Primary DOB","Application Submission Date","Lottery Position Number","Application Status","Application Decline Reason","Application Decline Reason Additional Details","Waitlist Position (Accessible Unit)","Waitlist Position (Conventional Unit)","Household size","Declared annual income","Declared monthly income","Request ADA","Subsidy/Voucher"';

      const rowOne = `"${applicationsSet[0].id}","Colleen","Tawnee","3/15/1990","05-19-2026 03:00:00PM PDT","15","Declined","Household size too large","Some additional details",,,"2","55000",,"Mobility, Other","Yes"`;
      const rowTwo = `"${applicationsSet[1].id}","Erin","Patsy","11/2/1985","04-02-2026 03:00:00AM PDT",,"Submitted",,,"2",,"4",,"2500","Hearing and vision","No"`;
      const rowThree = `"${applicationsSet[2].id}","Nanny","Hayley",,"07-23-2026 08:30:00AM PDT",,"Wait list",,,,"5",,,,,"No"`;

      expect(content).toContain(headers);
      expect(content).toContain(rowOne);
      expect(content).toContain(rowTwo);
      expect(content).toContain(rowThree);
    });

    it('should export the subsidy/voucher column as Yes/No when the multiselect voucher flag is off', () => {
      const headers = service.getBulkUploadHeaders();

      expect(
        service.populateDataForEachHeader(
          headers,
          mockApplication({
            incomeVouchers: ['issuedVouchers', 'incomeVoucher'],
          }),
        ),
      ).toMatch(/,"Yes"$/);
      expect(
        service.populateDataForEachHeader(
          headers,
          mockApplication({ incomeVouchers: ['issuedVouchers'] }),
        ),
      ).toMatch(/,"No"$/);
    });

    it('should export the readable voucher names when the multiselect voucher flag is on', () => {
      const headers = service.getBulkUploadHeaders({
        enableMultiselectVoucherQuestion: true,
      });

      expect(
        service.populateDataForEachHeader(
          headers,
          mockApplication({
            incomeVouchers: ['issuedVouchers', 'incomeVoucher'],
          }),
        ),
      ).toMatch(/,"Section 8, Income Voucher"$/);
      expect(
        service.populateDataForEachHeader(
          headers,
          mockApplication({ incomeVouchers: [] }),
        ),
      ).toMatch(/,$/);
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
      backgroundJobUpdateMock.mockReset();
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

      expect(canOrThrowMock).toHaveBeenCalledWith(
        user,
        'listing',
        'update',
        {
          id: listingId,
          jurisdictionId,
        },
        { allowedForExport: true },
      );
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
    const s3Key = 'uploads/applications.csv';
    const mockRequestingUser = {
      userRoles: { isLimitedJurisdictionalAdmin: false },
    } as User;

    beforeEach(() => {
      downloadFromPrivateMock.mockReset();
      backgroundJobCreateMock.mockReset();
      prisma.applications.findMany = jest.fn().mockResolvedValue([]);
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        name: 'Test Listing',
        jurisdictions: {
          id: randomUUID(),
          publicUrl: 'test-url.com',
        },
      });
    });

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

    it('should throw NotFoundException when downloadFromPrivate rejects', async () => {
      downloadFromPrivateMock.mockRejectedValue(new Error('error'));
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        name: 'Test Listing',
        jurisdictions: {
          id: randomUUID(),
          publicUrl: 'test-url.com',
        },
      });

      await expect(
        service.processBulkUpload({ s3Key, listingId }, mockRequestingUser),
      ).rejects.toThrow(
        new NotFoundException(
          'The CSV file could not be retrieved from the S3 bucket',
        ),
      );

      expect(downloadFromPrivateMock).toHaveBeenCalledWith(s3Key);
    });

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

      it.each([
        bulkUploadHeaderNames.applicantDateOfBirth,
        bulkUploadHeaderNames.householdSize,
        bulkUploadHeaderNames.annualIncome,
        bulkUploadHeaderNames.monthlyIncome,
        bulkUploadHeaderNames.requestedAccessibility,
        bulkUploadHeaderNames.voucherOrSubsidy,
      ])(
        'should reject a CSV missing the "%s" context column',
        async (missingHeader) => {
          const header = Object.values(bulkUploadHeaderNames).filter(
            (label) => label !== missingHeader,
          );

          await expect(
            service.validateCSV(...mockCsvInput([], { header }), listingId),
          ).rejects.toThrow(
            new BadRequestException(
              'Upload Failed: CSV has additional or missing columns',
            ),
          );
        },
      );

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
        const unknownApp = dbContext({
          id: randomUUID(),
          applicant: { firstName: 'Erin', lastName: 'Patsy' },
          submissionDate: new Date(2026, 2, 15),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              { ...contextRow(appOne), applicationStatus: 'Submitted' },
              { ...contextRow(unknownApp), applicationStatus: 'Submitted' },
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
        const otherListingApp = dbContext({
          id: randomUUID(),
          submissionDate: new Date(2026, 0, 1),
        });

        const findManyMock = jest.fn().mockResolvedValue([]);
        prisma.applications.findMany = findManyMock;

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                ...contextRow(otherListingApp),
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
            where: { id: { in: [otherListingApp.id] }, listingId },
          }),
        );
      });

      it('should select every context field from the DB', async () => {
        const appOne = dbContext({ id: randomUUID() });

        const findManyMock = jest.fn().mockResolvedValue([appOne]);
        prisma.applications.findMany = findManyMock;

        await service.validateCSV(
          ...mockCsvInput([
            { ...contextRow(appOne), applicationStatus: 'Submitted' },
          ]),
          listingId,
        );

        expect(findManyMock).toHaveBeenCalledWith(
          expect.objectContaining({
            select: expect.objectContaining({
              applicant: {
                select: expect.objectContaining({
                  birthDay: true,
                  birthMonth: true,
                  birthYear: true,
                }),
              },
              householdSize: true,
              income: true,
              incomePeriod: true,
              incomeVouchers: true,
              accessibility: {
                select: {
                  vision: true,
                  hearing: true,
                  mobility: true,
                  hearingAndVision: true,
                  other: true,
                },
              },
            }),
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
                ...contextRow(appOne),
                applicantFirstName: 'Mismatch',
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(new BadRequestException(contextFieldsError()));
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
                ...contextRow(appOne),
                applicantLastName: 'Mismatch',
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(new BadRequestException(contextFieldsError()));
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
                ...contextRow(appOne),
                applicationSubmissionDate: expectedDate(new Date(2026, 5, 20)),
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(new BadRequestException(contextFieldsError()));
      });

      it('should pass when every context field matches the DB record', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: {
            firstName: 'Andrew',
            lastName: 'Rust',
            birthDay: 15,
            birthMonth: 3,
            birthYear: 1990,
          },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
          householdSize: 3,
          income: '2500',
          incomePeriod: IncomePeriodEnum.perMonth,
          incomeVouchers: ['incomeVoucher'],
          accessibility: { mobility: true },
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                applicationId: appOne.id,
                applicantFirstName: 'Andrew',
                applicantLastName: 'Rust',
                applicantDateOfBirth: '3/15/1990',
                applicationSubmissionDate: expectedDate(appOne.submissionDate),
                applicationStatus: 'Submitted',
                householdSize: '3',
                annualIncome: '',
                monthlyIncome: '2500',
                requestedAccessibility: 'Mobility',
                voucherOrSubsidy: 'Yes',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should treat null DB applicant names with empty CSV name cells as a match', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { firstName: null, lastName: null },
          submissionDate: new Date(2026, 0, 1, 10, 0, 0),
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                ...contextRow(appOne),
                applicantFirstName: '',
                applicantLastName: '',
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should treat a null DB submission date with an empty CSV date cell as a match', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          submissionDate: null,
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                ...contextRow(appOne),
                applicationSubmissionDate: '',
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      it('should reject a non-empty CSV date when the DB submission date is null', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          submissionDate: null,
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                ...contextRow(appOne),
                applicationSubmissionDate: expectedDate(new Date(2026, 0, 1)),
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(new BadRequestException(contextFieldsError()));
      });

      it('should reject a row whose date of birth does not match the DB applicant', async () => {
        const appOne = dbContext({
          id: randomUUID(),
          applicant: { birthDay: 15, birthMonth: 3, birthYear: 1990 },
        });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                ...contextRow(appOne),
                applicantDateOfBirth: '15/3/1990',
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(new BadRequestException(contextFieldsError()));
      });

      it('should reject a row whose household size does not match the DB record', async () => {
        const appOne = dbContext({ id: randomUUID(), householdSize: 2 });
        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                ...contextRow(appOne),
                householdSize: '3',
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).rejects.toThrow(new BadRequestException(contextFieldsError()));
      });

      it('should treat a null DB household size with an empty CSV cell as a match', async () => {
        const appOne = dbContext({ id: randomUUID(), householdSize: null });

        prisma.applications.findMany = jest.fn().mockResolvedValue([appOne]);

        await expect(
          service.validateCSV(
            ...mockCsvInput([
              {
                ...contextRow(appOne),
                householdSize: '',
                applicationStatus: 'Submitted',
              },
            ]),
            listingId,
          ),
        ).resolves.toBeUndefined();
      });

      describe('declared income', () => {
        it.each([
          {
            scenario: 'yearly income in the annual column',
            income: '55000',
            incomePeriod: IncomePeriodEnum.perYear,
            annualIncome: '55000',
            monthlyIncome: '',
          },
          {
            scenario: 'monthly income in the monthly column',
            income: '2500',
            incomePeriod: IncomePeriodEnum.perMonth,
            annualIncome: '',
            monthlyIncome: '2500',
          },
          {
            scenario: 'a null income with both columns empty',
            income: null,
            incomePeriod: IncomePeriodEnum.perMonth,
            annualIncome: '',
            monthlyIncome: '',
          },
          {
            scenario: 'a null income period with both columns empty',
            income: '2500',
            incomePeriod: null,
            annualIncome: '',
            monthlyIncome: '',
          },
        ])(
          'should pass for $scenario',
          async ({ income, incomePeriod, annualIncome, monthlyIncome }) => {
            const appOne = dbContext({
              id: randomUUID(),
              income,
              incomePeriod,
            });

            prisma.applications.findMany = jest
              .fn()
              .mockResolvedValue([appOne]);

            await expect(
              service.validateCSV(
                ...mockCsvInput([
                  {
                    ...contextRow(appOne),
                    annualIncome,
                    monthlyIncome,
                    applicationStatus: 'Submitted',
                  },
                ]),
                listingId,
              ),
            ).resolves.toBeUndefined();
          },
        );

        it.each([
          {
            scenario: 'a different yearly income',
            income: '55000',
            incomePeriod: IncomePeriodEnum.perYear,
            annualIncome: '50000',
            monthlyIncome: '',
          },
          {
            scenario: 'yearly income in the monthly column',
            income: '55000',
            incomePeriod: IncomePeriodEnum.perYear,
            annualIncome: '',
            monthlyIncome: '55000',
          },
          {
            scenario: 'yearly income in both columns',
            income: '55000',
            incomePeriod: IncomePeriodEnum.perYear,
            annualIncome: '55000',
            monthlyIncome: '55000',
          },
          {
            scenario: 'a different monthly income',
            income: '2500',
            incomePeriod: IncomePeriodEnum.perMonth,
            annualIncome: '',
            monthlyIncome: '3000',
          },
          {
            scenario: 'monthly income in the annual column',
            income: '2500',
            incomePeriod: IncomePeriodEnum.perMonth,
            annualIncome: '2500',
            monthlyIncome: '',
          },
          {
            scenario: 'an annual value next to a matching monthly income',
            income: '2500',
            incomePeriod: IncomePeriodEnum.perMonth,
            annualIncome: '30000',
            monthlyIncome: '2500',
          },
          {
            scenario: 'an income value when the DB income is null',
            income: null,
            incomePeriod: IncomePeriodEnum.perMonth,
            annualIncome: '',
            monthlyIncome: '2500',
          },
        ])(
          'should reject $scenario',
          async ({ income, incomePeriod, annualIncome, monthlyIncome }) => {
            const appOne = dbContext({
              id: randomUUID(),
              income,
              incomePeriod,
            });

            prisma.applications.findMany = jest
              .fn()
              .mockResolvedValue([appOne]);

            await expect(
              service.validateCSV(
                ...mockCsvInput([
                  {
                    ...contextRow(appOne),
                    annualIncome,
                    monthlyIncome,
                    applicationStatus: 'Submitted',
                  },
                ]),
                listingId,
              ),
            ).rejects.toThrow(new BadRequestException(contextFieldsError()));
          },
        );
      });

      describe('requested ADA', () => {
        it.each([
          { accessibility: {}, requestedAccessibility: '' },
          {
            accessibility: { hearing: true },
            requestedAccessibility: 'Hearing',
          },
          {
            accessibility: { vision: true, mobility: true },
            requestedAccessibility: 'Vision, Mobility',
          },
          {
            accessibility: {
              hearingAndVision: true,
              hearing: true,
              vision: true,
            },
            requestedAccessibility: 'Hearing and vision',
          },
          {
            accessibility: {
              hearing: true,
              vision: true,
              mobility: true,
              other: true,
            },
            requestedAccessibility: 'Hearing, Vision, Mobility, Other',
          },
        ])(
          'should pass when the CSV cell is "$requestedAccessibility" for %o',
          async ({ accessibility, requestedAccessibility }) => {
            const appOne = dbContext({ id: randomUUID(), accessibility });

            prisma.applications.findMany = jest
              .fn()
              .mockResolvedValue([appOne]);

            await expect(
              service.validateCSV(
                ...mockCsvInput([
                  {
                    ...contextRow(appOne),
                    requestedAccessibility,
                    applicationStatus: 'Submitted',
                  },
                ]),
                listingId,
              ),
            ).resolves.toBeUndefined();
          },
        );

        it.each([
          { accessibility: { mobility: true }, requestedAccessibility: '' },
          { accessibility: {}, requestedAccessibility: 'Mobility' },
          {
            accessibility: { hearingAndVision: true },
            requestedAccessibility: 'Hearing, Vision',
          },
          {
            accessibility: { mobility: true, other: true },
            requestedAccessibility: 'Other, Mobility',
          },
        ])(
          'should reject the CSV cell "$requestedAccessibility" for %o',
          async ({ accessibility, requestedAccessibility }) => {
            const appOne = dbContext({ id: randomUUID(), accessibility });

            prisma.applications.findMany = jest
              .fn()
              .mockResolvedValue([appOne]);

            await expect(
              service.validateCSV(
                ...mockCsvInput([
                  {
                    ...contextRow(appOne),
                    requestedAccessibility,
                    applicationStatus: 'Submitted',
                  },
                ]),
                listingId,
              ),
            ).rejects.toThrow(new BadRequestException(contextFieldsError()));
          },
        );
      });

      describe('subsidy/voucher', () => {
        it.each([
          {
            incomeVouchers: ['incomeVoucher', 'none'],
            voucherOrSubsidy: 'Yes',
          },
          { incomeVouchers: ['issuedVouchers'], voucherOrSubsidy: 'No' },
          { incomeVouchers: [], voucherOrSubsidy: 'No' },
          { incomeVouchers: null, voucherOrSubsidy: 'No' },
        ])(
          'should pass "$voucherOrSubsidy" for $incomeVouchers when the multiselect voucher flag is off',
          async ({ incomeVouchers, voucherOrSubsidy }) => {
            const appOne = dbContext({ id: randomUUID(), incomeVouchers });

            prisma.applications.findMany = jest
              .fn()
              .mockResolvedValue([appOne]);

            await expect(
              service.validateCSV(
                ...mockCsvInput([
                  {
                    ...contextRow(appOne),
                    voucherOrSubsidy,
                    applicationStatus: 'Submitted',
                  },
                ]),
                listingId,
              ),
            ).resolves.toBeUndefined();
          },
        );

        it.each([
          { incomeVouchers: [], voucherOrSubsidy: 'Yes' },
          { incomeVouchers: ['incomeVoucher'], voucherOrSubsidy: 'No' },
          {
            incomeVouchers: ['incomeVoucher'],
            voucherOrSubsidy: 'Income Voucher',
          },
          { incomeVouchers: ['incomeVoucher'], voucherOrSubsidy: '' },
        ])(
          'should reject "$voucherOrSubsidy" for $incomeVouchers when the multiselect voucher flag is off',
          async ({ incomeVouchers, voucherOrSubsidy }) => {
            const appOne = dbContext({ id: randomUUID(), incomeVouchers });

            prisma.applications.findMany = jest
              .fn()
              .mockResolvedValue([appOne]);

            await expect(
              service.validateCSV(
                ...mockCsvInput([
                  {
                    ...contextRow(appOne),
                    voucherOrSubsidy,
                    applicationStatus: 'Submitted',
                  },
                ]),
                listingId,
              ),
            ).rejects.toThrow(new BadRequestException(contextFieldsError()));
          },
        );

        it.each([
          {
            incomeVouchers: ['issuedVouchers', 'incomeVoucher'],
            voucherOrSubsidy: 'Section 8, Income Voucher',
          },
          {
            incomeVouchers: ['rentalAssistance'],
            voucherOrSubsidy: 'Rental Assistance from other source',
          },
          { incomeVouchers: ['none'], voucherOrSubsidy: 'None' },
          { incomeVouchers: [], voucherOrSubsidy: '' },
          { incomeVouchers: null, voucherOrSubsidy: '' },
        ])(
          'should pass "$voucherOrSubsidy" for $incomeVouchers when the multiselect voucher flag is on',
          async ({ incomeVouchers, voucherOrSubsidy }) => {
            const appOne = dbContext({ id: randomUUID(), incomeVouchers });

            prisma.applications.findMany = jest
              .fn()
              .mockResolvedValue([appOne]);

            await expect(
              service.validateCSV(
                ...mockCsvInput([
                  {
                    ...contextRow(appOne),
                    voucherOrSubsidy,
                    applicationStatus: 'Submitted',
                  },
                ]),
                listingId,
                { enableMultiselectVoucherQuestion: true },
              ),
            ).resolves.toBeUndefined();
          },
        );

        it.each([
          { incomeVouchers: ['incomeVoucher'], voucherOrSubsidy: 'Yes' },
          { incomeVouchers: [], voucherOrSubsidy: 'No' },
          {
            incomeVouchers: ['issuedVouchers', 'incomeVoucher'],
            voucherOrSubsidy: 'Income Voucher, Section 8',
          },
        ])(
          'should reject "$voucherOrSubsidy" for $incomeVouchers when the multiselect voucher flag is on',
          async ({ incomeVouchers, voucherOrSubsidy }) => {
            const appOne = dbContext({ id: randomUUID(), incomeVouchers });

            prisma.applications.findMany = jest
              .fn()
              .mockResolvedValue([appOne]);

            await expect(
              service.validateCSV(
                ...mockCsvInput([
                  {
                    ...contextRow(appOne),
                    voucherOrSubsidy,
                    applicationStatus: 'Submitted',
                  },
                ]),
                listingId,
                { enableMultiselectVoucherQuestion: true },
              ),
            ).rejects.toThrow(new BadRequestException(contextFieldsError()));
          },
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
              { ...contextRow(appOne), applicationStatus: 'Approved' },
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
                  ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                  ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                  ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
                ...contextRow(appOne),
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
        income: '55000',
        incomePeriod: IncomePeriodEnum.perYear,
        accessibility: { mobility: true },
      });
      const declinedApp = dbContext({
        id: randomUUID(),
        applicant: {
          firstName: 'Colleen',
          lastName: 'Tawnee',
          birthDay: null,
          birthMonth: null,
          birthYear: null,
        },
        submissionDate: new Date(2026, 3, 2, 10, 0, 0),
        householdSize: null,
        income: null,
      });
      const waitlistApp = dbContext({
        id: randomUUID(),
        applicant: { firstName: 'Nanny', lastName: 'Hayley' },
        submissionDate: new Date(2026, 6, 23, 15, 30, 0),
        householdSize: 5,
        incomeVouchers: ['incomeVoucher'],
      });

      prisma.applications.findMany = jest
        .fn()
        .mockResolvedValue([submittedApp, declinedApp, waitlistApp]);

      await expect(
        service.validateCSV(
          ...mockCsvInput([
            {
              ...contextRow(submittedApp),
              requestedAccessibility: 'Mobility',
              applicationStatus: 'Submitted',
            },
            {
              ...contextRow(declinedApp),
              applicationStatus: 'Declined',
              applicationDeclineReason: 'Other',
              applicationDeclineReasonAdditionalDetails:
                'Some additional details',
            },
            {
              ...contextRow(waitlistApp),
              voucherOrSubsidy: 'Yes',
              applicationStatus: 'Wait list',
              waitlistPositionAccessibleUnit: '2',
              waitlistPositionConventionalUnit: '5',
            },
          ]),
          listingId,
        ),
      ).resolves.toBeUndefined();
    });

    it('should report the absolute row number of a context field mismatch in a later row', async () => {
      const apps = [
        dbContext({ id: randomUUID() }),
        dbContext({ id: randomUUID(), householdSize: 4 }),
      ];

      prisma.applications.findMany = jest.fn().mockResolvedValue(apps);

      await expect(
        service.validateCSV(
          ...mockCsvInput([
            { ...contextRow(apps[0]), applicationStatus: 'Submitted' },
            {
              ...contextRow(apps[1]),
              householdSize: '2',
              applicationStatus: 'Submitted',
            },
          ]),
          listingId,
        ),
      ).rejects.toThrow(new BadRequestException(contextFieldsError(3)));
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
              ...contextRow(app),
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

  describe('getUploadJobNotification', () => {
    const jobId = randomUUID();

    const storedJob = (overrides: Partial<BackgroundJob>): BackgroundJob =>
      ({
        id: jobId,
        status: BackgroundJobStatusEnum.processing,
        totalRecords: null,
        errorMessage: null,
        errorRow: null,
        completedAt: null,
        ...overrides,
      } as BackgroundJob);

    afterEach(() => {
      backgroundJobServiceMock.findById.mockReset();
    });

    it('should emit a single error notification and complete when the job does not exist', async () => {
      backgroundJobServiceMock.findById.mockResolvedValue(null);

      const notifications = await lastValueFrom(
        service.getUploadJobNotification(jobId).pipe(toArray()),
      );

      expect(notifications).toEqual([
        {
          jobId,
          status: BackgroundJobStatusEnum.failed,
          errorMessage: `Job with id: ${jobId} was not found`,
        },
      ]);
      expect(backgroundJobServiceMock.findById).toHaveBeenCalledWith(jobId);
    });

    it('should emit the stored completed state and complete when the job already finished', async () => {
      const completedAt = new Date();
      backgroundJobServiceMock.findById.mockResolvedValue(
        storedJob({
          status: BackgroundJobStatusEnum.completed,
          totalRecords: 42,
          completedAt,
        }),
      );

      const notifications = await lastValueFrom(
        service.getUploadJobNotification(jobId).pipe(toArray()),
      );

      expect(notifications).toEqual([
        {
          jobId,
          status: BackgroundJobStatusEnum.completed,
          totalRecords: 42,
          errorMessage: null,
          errorRow: null,
          completedAt: completedAt.toISOString(),
        },
      ]);
    });

    it('should emit the stored failure details and complete when the job already failed', async () => {
      backgroundJobServiceMock.findById.mockResolvedValue(
        storedJob({
          status: BackgroundJobStatusEnum.failed,
          errorMessage: 'Malformed row',
          errorRow: 7,
        }),
      );

      const notifications = await lastValueFrom(
        service.getUploadJobNotification(jobId).pipe(toArray()),
      );

      expect(notifications).toEqual([
        {
          jobId,
          status: BackgroundJobStatusEnum.failed,
          totalRecords: null,
          errorMessage: 'Malformed row',
          errorRow: 7,
          completedAt: null,
        },
      ]);
    });

    it('should emit the pending state, stay open, then complete on a terminal notification', async () => {
      backgroundJobServiceMock.findById.mockResolvedValue(
        storedJob({
          status: BackgroundJobStatusEnum.processing,
        }),
      );

      const collected = lastValueFrom(
        service.getUploadJobNotification(jobId).pipe(toArray()),
      );

      await Promise.resolve();

      const completion = {
        jobId,
        status: BackgroundJobStatusEnum.completed,
        totalRecords: 10,
        errorMessage: null,
        errorRow: null,
        completedAt: new Date().toISOString(),
      };
      service['notifications$'].next(completion);

      await expect(collected).resolves.toEqual([
        {
          jobId,
          status: BackgroundJobStatusEnum.processing,
          totalRecords: null,
          errorMessage: null,
          errorRow: null,
          completedAt: null,
        },
        completion,
      ]);
    });

    it('should ignore notifications belonging to a different job', async () => {
      backgroundJobServiceMock.findById.mockResolvedValue(storedJob({}));

      const received: BulkUploadJobNotification[] = [];
      const subscription = service
        .getUploadJobNotification(jobId)
        .subscribe((notification) => received.push(notification));

      await Promise.resolve();

      service['notifications$'].next({
        jobId: randomUUID(),
        status: BackgroundJobStatusEnum.completed,
      });

      // only the pending notification for this job, and the stream is still open
      expect(received).toHaveLength(1);
      expect(received[0].status).toBe(BackgroundJobStatusEnum.processing);
      expect(subscription.closed).toBe(false);

      subscription.unsubscribe();
    });

    it('should emit an error notification and complete when the job lookup fails', async () => {
      backgroundJobServiceMock.findById.mockRejectedValue(
        new Error('Invalid uuid'),
      );

      const notifications = await lastValueFrom(
        service.getUploadJobNotification(jobId).pipe(toArray()),
      );

      expect(notifications).toEqual([
        {
          jobId,
          status: BackgroundJobStatusEnum.failed,
          errorMessage: 'Invalid uuid',
        },
      ]);
    });

    it('should detach from the notifications subject once a subscriber goes away', async () => {
      backgroundJobServiceMock.findById.mockResolvedValue(storedJob({}));

      const subscription = service.getUploadJobNotification(jobId).subscribe();

      expect(service['notifications$'].observed).toBe(true);

      subscription.unsubscribe();

      expect(service['notifications$'].observed).toBe(false);
    });
  });
});
