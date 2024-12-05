import { randomUUID } from 'crypto';
import { PassThrough } from 'stream';
import { Test, TestingModule } from '@nestjs/testing';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';
import { HttpModule } from '@nestjs/axios';
import { Request as ExpressRequest, Response } from 'express';
import { PrismaService } from '../../../src/services/prisma.service';
import { ApplicationCsvQueryParams } from '../../../src/dtos/applications/application-csv-query-params.dto';
import { User } from '../../../src/dtos/users/user.dto';
import MultiselectQuestion from '../../../src/dtos/multiselect-questions/multiselect-question.dto';
import { ApplicationExporterService } from '../../../src/services/application-exporter.service';
import { MultiselectQuestionService } from '../../../src/services/multiselect-question.service';
import { mockApplicationSet } from './application.service.spec';
import { mockMultiselectQuestion } from './multiselect-question.service.spec';
import { ListingService } from '../../../src/services/listing.service';
import { PermissionService } from '../../../src/services/permission.service';
import { TranslationService } from '../../../src/services/translation.service';
import { ApplicationFlaggedSetService } from '../../../src/services/application-flagged-set.service';
import { EmailService } from '../../../src/services/email.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { GoogleTranslateService } from '../../../src/services/google-translate.service';
import { unitTypeToReadable } from '../../../src/utilities/application-export-helpers';

describe('Testing application export service', () => {
  let service: ApplicationExporterService;
  let prisma: PrismaService;
  let permissionService: PermissionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationExporterService,
        PrismaService,
        MultiselectQuestionService,
        ListingService,
        PermissionService,
        TranslationService,
        ApplicationFlaggedSetService,
        {
          provide: EmailService,
          useValue: {
            requestApproval: jest.fn(),
            changesRequested: jest.fn(),
            listingApproved: jest.fn(),
          },
        },
        ConfigService,
        Logger,
        SchedulerRegistry,
        GoogleTranslateService,
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<ApplicationExporterService>(
      ApplicationExporterService,
    );
    prisma = module.get<PrismaService>(PrismaService);
    permissionService = module.get<PermissionService>(PermissionService);
  });

  it('should build csv headers without demographics', async () => {
    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
    } as unknown as User;

    const applications = mockApplicationSet(5, new Date(), 1);
    prisma.applications.findMany = jest.fn().mockReturnValue(applications);
    prisma.listings.findUnique = jest.fn().mockResolvedValue({});
    permissionService.canOrThrow = jest.fn().mockResolvedValue(true);

    prisma.multiselectQuestions.findMany = jest.fn().mockReturnValue([
      {
        ...mockMultiselectQuestion(
          0,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.preferences,
        ),
        options: [
          { id: 1, text: 'text' },
          { id: 2, text: 'text', collectAddress: true },
        ],
      },
      {
        ...mockMultiselectQuestion(
          1,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.programs,
        ),
        options: [{ id: 1, text: 'text' }],
      },
    ]);

    const exportResponse = await service.csvExport(
      { user: requestingUser } as unknown as ExpressRequest,
      {} as unknown as Response,
      {
        id: randomUUID(),
        includeDemographics: false,
      } as unknown as ApplicationCsvQueryParams,
    );

    const headerRow =
      '"Application Id","Application Confirmation Code","Application Type","Application Submission Date","Application Received At","Application Received By","Primary Applicant First Name","Primary Applicant Middle Name","Primary Applicant Last Name","Primary Applicant Birth Day","Primary Applicant Birth Month","Primary Applicant Birth Year","Primary Applicant Email Address","Primary Applicant Phone Number","Primary Applicant Phone Type","Primary Applicant Additional Phone Number","Primary Applicant Street","Primary Applicant Street 2","Primary Applicant City","Primary Applicant State","Primary Applicant Zip Code","Primary Applicant Mailing Street","Primary Applicant Mailing Street 2","Primary Applicant Mailing City","Primary Applicant Mailing State","Primary Applicant Mailing Zip Code","Alternate Contact First Name","Alternate Contact Last Name","Alternate Contact Type","Alternate Contact Agency","Alternate Contact Other Type","Alternate Contact Email Address","Alternate Contact Phone Number","Alternate Contact Street","Alternate Contact Street 2","Alternate Contact City","Alternate Contact State","Alternate Contact Zip Code","Income","Income Period","Accessibility Mobility","Accessibility Vision","Accessibility Hearing","Expecting Household Changes","Household Includes Student or Member Nearing 18","Vouchers or Subsidies","Requested Unit Types","Preference text 0","Preference text 0 - text - Address","Program text 1","Household Size","Household Member (1) First Name","Household Member (1) Middle Name","Household Member (1) Last Name","Household Member (1) First Name","Household Member (1) Birth Day","Household Member (1) Birth Month","Household Member (1) Birth Year","Household Member (1) Same as Primary Applicant","Household Member (1) Relationship","Household Member (1) Street","Household Member (1) Street 2","Household Member (1) City","Household Member (1) State","Household Member (1) Zip Code","Marked As Duplicate","Flagged As Duplicate"';
    const firstApp =
      '"application 0 firstName","application 0 middleName","application 0 lastName","application 0 birthDay","application 0 birthMonth","application 0 birthYear","application 0 emailaddress","application 0 phoneNumber","application 0 phoneNumberType","additionalPhoneNumber 0","application 0 applicantAddress street","application 0 applicantAddress street2","application 0 applicantAddress city","application 0 applicantAddress state","application 0 applicantAddress zipCode",,,,,,,,,,,,,,,,,,"income 0","per month",,,,"true","true","true","Studio,One Bedroom",,,,,,,,,,,,,,,,,,,';

    const mockedStream = new PassThrough();
    exportResponse.getStream().pipe(mockedStream);

    // In order to make sure the last expect statements are properly hit we need to wrap in a promise and resolve it
    const readable = await new Promise((resolve) => {
      mockedStream.on('data', async (d) => {
        const value = Buffer.from(d).toString();
        mockedStream.end();
        mockedStream.destroy();
        resolve(value);
      });
    });

    expect(readable).toContain(headerRow);
    expect(readable).toContain(firstApp);
  });

  it('should build csv headers with demographics', async () => {
    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
    } as unknown as User;

    const applications = mockApplicationSet(3, new Date());
    prisma.applications.findMany = jest.fn().mockReturnValue(applications);
    prisma.listings.findUnique = jest.fn().mockResolvedValue({});
    permissionService.canOrThrow = jest.fn().mockResolvedValue(true);

    prisma.multiselectQuestions.findMany = jest
      .fn()
      .mockReturnValue([
        mockMultiselectQuestion(
          0,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.preferences,
        ),
        mockMultiselectQuestion(
          1,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.programs,
        ),
      ]);

    const exportResponse = await service.csvExport(
      { user: requestingUser } as unknown as ExpressRequest,
      {} as unknown as Response,
      {
        id: 'test',
        includeDemographics: true,
      } as unknown as ApplicationCsvQueryParams,
    );

    const headerRow =
      '"Application Id","Application Confirmation Code","Application Type","Application Submission Date","Application Received At","Application Received By","Primary Applicant First Name","Primary Applicant Middle Name","Primary Applicant Last Name","Primary Applicant Birth Day","Primary Applicant Birth Month","Primary Applicant Birth Year","Primary Applicant Email Address","Primary Applicant Phone Number","Primary Applicant Phone Type","Primary Applicant Additional Phone Number","Primary Applicant Street","Primary Applicant Street 2","Primary Applicant City","Primary Applicant State","Primary Applicant Zip Code","Primary Applicant Mailing Street","Primary Applicant Mailing Street 2","Primary Applicant Mailing City","Primary Applicant Mailing State","Primary Applicant Mailing Zip Code","Alternate Contact First Name","Alternate Contact Last Name","Alternate Contact Type","Alternate Contact Agency","Alternate Contact Other Type","Alternate Contact Email Address","Alternate Contact Phone Number","Alternate Contact Street","Alternate Contact Street 2","Alternate Contact City","Alternate Contact State","Alternate Contact Zip Code","Income","Income Period","Accessibility Mobility","Accessibility Vision","Accessibility Hearing","Expecting Household Changes","Household Includes Student or Member Nearing 18","Vouchers or Subsidies","Requested Unit Types","Preference text 0","Program text 1","Household Size","Marked As Duplicate","Flagged As Duplicate","Race","Gender","Sexual Orientation","Spoken Language","How did you Hear?"';
    const firstApp =
      '"application 0 firstName","application 0 middleName","application 0 lastName","application 0 birthDay","application 0 birthMonth","application 0 birthYear","application 0 emailaddress","application 0 phoneNumber","application 0 phoneNumberType","additionalPhoneNumber 0","application 0 applicantAddress street","application 0 applicantAddress street2","application 0 applicantAddress city","application 0 applicantAddress state","application 0 applicantAddress zipCode",,,,,,,,,,,,,,,,,,"income 0","per month",,,,"true","true","true","Studio,One Bedroom",,,,,,"Indigenous",,,,"Other"';

    const mockedStream = new PassThrough();
    exportResponse.getStream().pipe(mockedStream);
    const readable = await new Promise((resolve) => {
      mockedStream.on('data', async (d) => {
        const value = Buffer.from(d).toString();
        mockedStream.end();
        mockedStream.destroy();
        resolve(value);
      });
    });

    expect(readable).toContain(headerRow);
    expect(readable).toContain(firstApp);
  });

  it('should build csv with submission date defaulted to TIME_ZONE variable', async () => {
    process.env.TIME_ZONE = 'America/Los_Angeles';
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));

    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
    } as unknown as User;

    const applications = mockApplicationSet(5, new Date());
    prisma.applications.findMany = jest.fn().mockReturnValue(applications);
    prisma.listings.findUnique = jest.fn().mockResolvedValue({});
    permissionService.canOrThrow = jest.fn().mockResolvedValue(true);

    prisma.multiselectQuestions.findMany = jest.fn().mockReturnValue([
      {
        ...mockMultiselectQuestion(
          0,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.preferences,
        ),
        options: [
          { id: 1, text: 'text' },
          { id: 2, text: 'text', collectAddress: true },
        ],
      },
      {
        ...mockMultiselectQuestion(
          1,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.programs,
        ),
        options: [{ id: 1, text: 'text' }],
      },
    ]);

    jest
      .spyOn({ unitTypeToReadable }, 'unitTypeToReadable')
      .mockReturnValue('Studio');
    const exportResponse = await service.csvExport(
      { user: requestingUser } as unknown as ExpressRequest,
      {} as unknown as Response,
      { id: randomUUID() } as unknown as ApplicationCsvQueryParams,
    );

    const mockedStream = new PassThrough();
    exportResponse.getStream().pipe(mockedStream);

    // In order to make sure the last expect statements are properly hit we need to wrap in a promise and resolve it
    const readable = await new Promise((resolve) => {
      mockedStream.on('data', async (d) => {
        const value = Buffer.from(d).toString();
        mockedStream.end();
        mockedStream.destroy();
        resolve(value);
      });
    });

    expect(readable).toContain('PST');
  });

  it('should build csv with submission date in custom timezone', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));

    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
    } as unknown as User;

    const applications = mockApplicationSet(5, new Date());
    prisma.applications.findMany = jest.fn().mockReturnValue(applications);
    prisma.listings.findUnique = jest.fn().mockResolvedValue({});
    permissionService.canOrThrow = jest.fn().mockResolvedValue(true);

    prisma.multiselectQuestions.findMany = jest.fn().mockReturnValue([
      {
        ...mockMultiselectQuestion(
          0,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.preferences,
        ),
        options: [
          { id: 1, text: 'text' },
          { id: 2, text: 'text', collectAddress: true },
        ],
      },
      {
        ...mockMultiselectQuestion(
          1,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.programs,
        ),
        options: [{ id: 1, text: 'text' }],
      },
    ]);

    jest
      .spyOn({ unitTypeToReadable }, 'unitTypeToReadable')
      .mockReturnValue('Studio');
    const exportResponse = await service.csvExport(
      { user: requestingUser } as unknown as ExpressRequest,
      {} as unknown as Response,
      {
        id: randomUUID(),
        timeZone: 'America/New_York',
      } as unknown as ApplicationCsvQueryParams,
    );

    const mockedStream = new PassThrough();
    exportResponse.getStream().pipe(mockedStream);

    // In order to make sure the last expect statements are properly hit we need to wrap in a promise and resolve it
    const readable = await new Promise((resolve) => {
      mockedStream.on('data', async (d) => {
        const value = Buffer.from(d).toString();
        mockedStream.end();
        mockedStream.destroy();
        resolve(value);
      });
    });

    expect(readable).toContain('EST');
  });

  it('should build csv when application has null programs', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));

    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
    } as unknown as User;

    const applications = mockApplicationSet(5, new Date());
    applications.forEach((app) => {
      app.programs = null;
    });
    prisma.applications.findMany = jest.fn().mockReturnValue(applications);
    prisma.listings.findUnique = jest.fn().mockResolvedValue({});
    permissionService.canOrThrow = jest.fn().mockResolvedValue(true);

    prisma.multiselectQuestions.findMany = jest.fn().mockReturnValue([
      {
        ...mockMultiselectQuestion(
          0,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.preferences,
        ),
        options: [
          { id: 1, text: 'text' },
          { id: 2, text: 'text', collectAddress: true },
        ],
      },
      {
        ...mockMultiselectQuestion(
          1,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.programs,
        ),
        options: [{ id: 1, text: 'text' }],
      },
    ]);

    jest
      .spyOn({ unitTypeToReadable }, 'unitTypeToReadable')
      .mockReturnValue('Studio');
    const exportResponse = await service.csvExport(
      { user: requestingUser } as unknown as ExpressRequest,
      {} as unknown as Response,
      {
        listingId: randomUUID(),
        timeZone: 'America/New_York',
      } as unknown as ApplicationCsvQueryParams,
    );

    const mockedStream = new PassThrough();
    exportResponse.getStream().pipe(mockedStream);

    // In order to make sure the last expect statements are properly hit we need to wrap in a promise and resolve it
    const readable = await new Promise((resolve) => {
      mockedStream.on('data', async (d) => {
        const value = Buffer.from(d).toString();
        mockedStream.end();
        mockedStream.destroy();
        resolve(value);
      });
    });

    expect(readable).toContain('EST');
  });

  it('should sort listing preferences by ordinal', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01'));

    const unsortedPreferences = [
      {
        ...mockMultiselectQuestion(
          0,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.preferences,
        ),
      },
      {
        ...mockMultiselectQuestion(
          1,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.preferences,
        ),
      },
      {
        ...mockMultiselectQuestion(
          2,
          new Date(),
          MultiselectQuestionsApplicationSectionEnum.programs,
        ),
        options: [{ id: 1, text: 'text' }],
      },
    ] as MultiselectQuestion[];

    const listingId = randomUUID();

    prisma.listingMultiselectQuestions.findMany = jest.fn().mockReturnValue([
      {
        listingId,
        multiselectQuestionId: unsortedPreferences[1].id,
        ordinal: 1,
      },
      {
        listingId,
        multiselectQuestionId: unsortedPreferences[0].id,
        ordinal: 2,
      },
    ]);

    const sortedPreferences = await service.sortPreferencesByOrdinal(
      unsortedPreferences,
      listingId,
    );
    expect(sortedPreferences[0].text).toEqual('text 1');
    expect(sortedPreferences[1].text).toEqual('text 0');
  });
});
