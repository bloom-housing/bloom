import fs from 'fs';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { addressFactory } from '../../../prisma/seed-helpers/address-factory';
import { Address } from '../../../src/dtos/addresses/address.dto';
import { Accessibility } from '../../../src/dtos/applications/accessibility.dto';
import { AlternateContact } from '../../../src/dtos/applications/alternate-contact.dto';
import { Applicant } from '../../../src/dtos/applications/applicant.dto';
import { ApplicationLotteryPosition } from '../../../src/dtos/applications/application-lottery-position.dto';
import { Application } from '../../../src/dtos/applications/application.dto';
import { Demographic } from '../../../src/dtos/applications/demographic.dto';
import { ApplicationBulkUploadService } from '../../../src/services/application-bulk-upload.service';
import { ListingService } from '../../../src/services/listing.service';
import { PermissionService } from '../../../src/services/permission.service';
import { PrismaService } from '../../../src/services/prisma.service';

const mockApplication = ({
  markedAsDuplicate = false,
  applicant = {
    id: randomUUID(),
    applicantAddress: addressFactory() as unknown as Address,
    applicantWorkAddress: addressFactory() as unknown as Address,
  },
  applicationLotteryPositions = [],
  ...options
}: {
  id?: string;
  applicant?: Partial<Applicant>;
  submissionDate?: Date;
  deletedAt?: Date;
  applicationLotteryPositions?: ApplicationLotteryPosition[];
  status?: ApplicationStatusEnum;
  applicationDeclineReason?: ApplicationDeclineReasonEnum;
  applicationDeclineReasonAdditionalDetails?: string;
  accessibleUnitWaitlistNumber?: number;
  conventionalUnitWaitlistNumber?: number;
  markedAsDuplicate?: boolean;
  position?: number;
}): Application => {
  return {
    id: options?.id || randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: options.deletedAt ?? null,
    submissionDate: options.submissionDate ?? new Date(),
    contactPreferences: ['example contact preference'],
    status: options.status ?? ApplicationStatusEnum.submitted,
    submissionType: ApplicationSubmissionTypeEnum.electronical,
    markedAsDuplicate: markedAsDuplicate,
    confirmationCode: `confirmationCode ${options.position}`,
    applicant: applicant as Applicant,
    applicationLotteryPositions:
      applicationLotteryPositions as ApplicationLotteryPosition[],
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
    applicationDeclineReason: options.applicationDeclineReason ?? null,
    applicationDeclineReasonAdditionalDetails:
      options.applicationDeclineReasonAdditionalDetails ?? null,
    accessibleUnitWaitlistNumber: options.accessibleUnitWaitlistNumber,
    conventionalUnitWaitlistNumber: options.conventionalUnitWaitlistNumber,
  };
};

const canOrThrowMock = jest.fn();
const listingServiceMock = { getJurisdictionIdByListingId: jest.fn() };

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
      ],
    }).compile();

    service = module.get<ApplicationBulkUploadService>(
      ApplicationBulkUploadService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

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

  describe('bulk update template csv export', () => {
    const applicationsSet = [
      mockApplication({
        id: randomUUID(),
        position: 1,
        submissionDate: new Date(2026, 4, 19),
        applicant: {
          firstName: 'Colleen',
          lastName: 'Tawnee',
        },
        status: ApplicationStatusEnum.declined,
        applicationLotteryPositions: [
          { ordinal: 15 } as ApplicationLotteryPosition,
        ],
        applicationDeclineReason:
          ApplicationDeclineReasonEnum.householdSizeTooLarge,
        applicationDeclineReasonAdditionalDetails: 'Some additional details',
      }),
      mockApplication({
        id: randomUUID(),
        position: 2,
        submissionDate: new Date(2026, 3, 2),
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
        submissionDate: new Date(2026, 6, 23),
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

      const rowOne = `"${applicationsSet[0].id}","Colleen","Tawnee","05-18-2026 10:00:00PM GMT+2",,"Declined","householdSizeTooLarge","Some additional details",,`;
      const rowTwo = `"${applicationsSet[1].id}","Erin","Patsy","04-01-2026 10:00:00PM GMT+2",,"Submitted",,,"2",`;
      const rowThree = `"${applicationsSet[2].id}","Nanny","Hayley","07-22-2026 10:00:00PM GMT+2",,"Waitlist",,,,"5"`;

      expect(content).toContain(headers);
      expect(content).toContain(rowOne);
      expect(content).toContain(rowTwo);
      expect(content).toContain(rowThree);
    });
  });
});
