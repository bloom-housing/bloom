import fs from 'fs';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
  BackgroundJobStatusEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { lastValueFrom, toArray } from 'rxjs';
import { addressFactory } from '../../../prisma/seed-helpers/address-factory';
import { Address } from '../../../src/dtos/addresses/address.dto';
import { Accessibility } from '../../../src/dtos/applications/accessibility.dto';
import { AlternateContact } from '../../../src/dtos/applications/alternate-contact.dto';
import { Applicant } from '../../../src/dtos/applications/applicant.dto';
import { Application } from '../../../src/dtos/applications/application.dto';
import { Demographic } from '../../../src/dtos/applications/demographic.dto';
import { ApplicationBulkUploadService } from '../../../src/services/application-bulk-upload.service';
import { ListingService } from '../../../src/services/listing.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';
import { S3Service } from '../../../src/services/s3.service';
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
const backgroundJobServiceMock = { findById: jest.fn() };

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
            uploadToPrivate: jest.fn(),
            urlForPrivate: jest.fn(),
            uploadURLForPublic: jest.fn(),
            uploadURLForPrivate: jest.fn(),
            urlForPublic: jest.fn(),
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
