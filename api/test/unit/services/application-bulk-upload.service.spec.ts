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
} from '../../../src/services/application-bulk-upload.service';
import { ListingService } from '../../../src/services/listing.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { S3Service } from '../../../src/services/s3.service';
import { formatLocalDate } from '../../../src/utilities/format-local-date';

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
const listingServiceMock = { getJurisdictionIdByListingId: jest.fn() };
const downloadFromPrivateMock = jest.fn();

const DATE_FORMAT = 'MM-DD-YYYY hh:mm:ssA z';

const expectedDate = (d: Date): string =>
  formatLocalDate(d.toISOString(), DATE_FORMAT, process.env.TIME_ZONE);

type RowOverrides = Partial<Record<keyof typeof bulkUploadHeaderNames, string>>;

const mockCsvResponse = (
  rows: RowOverrides[] = [],
  options: { header?: string; bom?: boolean; blankLines?: boolean } = {},
): ReadableStream => {
  const cell = (value: string): string =>
    `"${(value ?? '').replace(/"/g, '""')}"`;

  const line = (row: RowOverrides): string =>
    Object.keys(bulkUploadHeaderNames)
      .map((key) => cell(row[key] ?? ''))
      .join(',');

  let header =
    options.header ?? Object.values(bulkUploadHeaderNames).map(cell).join(',');
  if (options.bom) header = `﻿${header}`;

  const dataLines = rows.flatMap((row, i) =>
    options.blankLines && i > 0 ? ['', line(row)] : [line(row)],
  );

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
          useValue: { downloadFromPrivate: downloadFromPrivateMock },
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
        submissionDate: new Date(2026, 4, 19, 22, 0, 0),
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
        submissionDate: new Date(2026, 3, 2, 10, 0, 0),
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
        submissionDate: new Date(2026, 6, 23, 15, 30, 0),
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
    });

    afterEach(() => {
      listingServiceMock.getJurisdictionIdByListingId.mockReset();
      canOrThrowMock.mockReset();
    });

    it('should throw ForbiddenException immediately for isLimitedJurisdictionalAdmin users', async () => {
      const user = { userRoles: { isLimitedJurisdictionalAdmin: true } };

      await expect(service.authorizeExport(user, listingId)).rejects.toThrow(
        ForbiddenException,
      );

      expect(
        listingServiceMock.getJurisdictionIdByListingId,
      ).not.toHaveBeenCalled();
      expect(canOrThrowMock).not.toHaveBeenCalled();
    });

    it('should call listingService.getJurisdictionIdByListingId with the correct listingId', async () => {
      const user = { userRoles: { isLimitedJurisdictionalAdmin: false } };

      await service.authorizeExport(user, listingId);

      expect(
        listingServiceMock.getJurisdictionIdByListingId,
      ).toHaveBeenCalledWith(listingId);
    });

    it('should call permissionService.canOrThrow with listing, update, and resolved jurisdictionId', async () => {
      const user = { userRoles: { isLimitedJurisdictionalAdmin: false } };

      await service.authorizeExport(user, listingId);

      expect(canOrThrowMock).toHaveBeenCalledWith(user, 'listing', 'update', {
        id: listingId,
        jurisdictionId,
      });
    });

    it('should re-throw ForbiddenException when canOrThrow rejects', async () => {
      const user = { userRoles: { isLimitedJurisdictionalAdmin: false } };
      canOrThrowMock.mockRejectedValue(new ForbiddenException());

      await expect(service.authorizeExport(user, listingId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('validateCSV', () => {
    const listingId = randomUUID();
    const s3Key = 'uploads/applications.csv';

    beforeEach(() => {
      downloadFromPrivateMock.mockReset();
      prisma.applications.findMany = jest.fn().mockResolvedValue([]);
    });

    describe('file format (validateFileFormat)', () => {
      it('should reject a non-CSV s3Key before attempting any download', async () => {
        await expect(
          service.validateCSV({ s3Key: 'uploads/applications.txt', listingId }),
        ).rejects.toThrow(
          new BadRequestException('Upload Failed: file must be a CSV format'),
        );

        expect(downloadFromPrivateMock).not.toHaveBeenCalled();
      });

      it('should accept a .csv key regardless of case and proceed past the format gate', async () => {
        const s3KeyUpperCase = 'uploads/applications.CSV';
        downloadFromPrivateMock.mockRejectedValue(new Error('boom'));

        await expect(
          service.validateCSV({ s3Key: s3KeyUpperCase, listingId }),
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
        downloadFromPrivateMock.mockRejectedValue(new Error('boom'));

        await expect(service.validateCSV({ s3Key, listingId })).rejects.toThrow(
          new NotFoundException(
            'The CSV file could not be retrieved from the S3 bucket',
          ),
        );

        expect(downloadFromPrivateMock).toHaveBeenCalledWith(s3Key);
      });
    });

    describe('headers (validateHeaders)', () => {
      it('should reject a CSV missing a required column', async () => {
        const header = Object.values(bulkUploadHeaderNames)
          .slice(1)
          .map((h) => `"${h}"`)
          .join(',');
        downloadFromPrivateMock.mockResolvedValue(
          mockCsvResponse([], { header }),
        );

        await expect(service.validateCSV({ s3Key, listingId })).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: CSV has additional or missing columns',
          ),
        );
      });

      it('should reject a CSV with an unknown column swapped in at the correct count', async () => {
        const headers = Object.values(bulkUploadHeaderNames);
        headers[0] = 'Unknown';

        downloadFromPrivateMock.mockResolvedValue(
          mockCsvResponse([{ applicationId: randomUUID() }], {
            header: headers.map((h) => `"${h}"`).join(','),
          }),
        );

        await expect(service.validateCSV({ s3Key, listingId })).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: CSV has additional or missing columns',
          ),
        );
      });

      it('should tolerate a BOM-prefixed header row and proceed past header validation', async () => {
        downloadFromPrivateMock.mockResolvedValue(
          mockCsvResponse([], { bom: true }),
        );

        await expect(service.validateCSV({ s3Key, listingId })).rejects.toThrow(
          new BadRequestException(
            'Upload Failed: CSV contains no application records',
          ),
        );
      });
    });

    describe('data rows (validateHasDataRows)', () => {
      it('should reject a CSV with only a header row and no data rows', async () => {
        downloadFromPrivateMock.mockResolvedValue(mockCsvResponse([]));

        await expect(service.validateCSV({ s3Key, listingId })).rejects.toThrow(
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
          service.validateCSV({ s3Key, listingId }),
        ).resolves.toEqual({ success: true });
      });
    });
  });
});
