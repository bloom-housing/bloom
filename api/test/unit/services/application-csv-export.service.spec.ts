import { randomUUID } from 'crypto';
import { PassThrough } from 'stream';
import { Test, TestingModule } from '@nestjs/testing';
import {
  LotteryStatusEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from '@prisma/client';
import { HttpModule } from '@nestjs/axios';
import { Request as ExpressRequest, Response } from 'express';
import { PrismaService } from '../../../src/services/prisma.service';
import { ApplicationCsvExporterService } from '../../../src/services/application-csv-export.service';
import { MultiselectQuestionService } from '../../../src/services/multiselect-question.service';
import { ApplicationMultiselectQuestion } from '../../../src/dtos/applications/application-multiselect-question.dto';
import { InputType } from '../../../src/enums/shared/input-type-enum';
import { UnitType } from 'src/dtos/unit-types/unit-type.dto';
import { Address } from '../../../src/dtos/addresses/address.dto';
import { ApplicationFlaggedSet } from '../../../src/dtos/application-flagged-sets/application-flagged-set.dto';
import { User } from '../../../src/dtos/users/user.dto';
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
import { CsvHeader } from '../../../src/types/CsvExportInterface';

describe('Testing application CSV export service', () => {
  let service: ApplicationCsvExporterService;
  let address: Address;
  let prisma: PrismaService;
  let permissionService: PermissionService;
  const csvHeaders: CsvHeader[] = [
    {
      path: 'id',
      label: 'Application Id',
    },
    {
      path: 'confirmationCode',
      label: 'Application Confirmation Code',
    },
    {
      path: 'submissionType',
      label: 'Application Type',
    },
    {
      path: 'submissionDate',
      label: 'Application Submission Date',
    },
    {
      path: 'receivedAt',
      label: 'Application Received At',
    },
    {
      path: 'receivedBy',
      label: 'Application Received By',
    },
    {
      path: 'applicant.firstName',
      label: 'Primary Applicant First Name',
    },
    {
      path: 'applicant.middleName',
      label: 'Primary Applicant Middle Name',
    },
    {
      path: 'applicant.lastName',
      label: 'Primary Applicant Last Name',
    },
    {
      path: 'applicant.birthDay',
      label: 'Primary Applicant Birth Day',
    },
    {
      path: 'applicant.birthMonth',
      label: 'Primary Applicant Birth Month',
    },
    {
      path: 'applicant.birthYear',
      label: 'Primary Applicant Birth Year',
    },
    {
      path: 'applicant.emailAddress',
      label: 'Primary Applicant Email Address',
    },
    {
      path: 'applicant.phoneNumber',
      label: 'Primary Applicant Phone Number',
    },
    {
      path: 'applicant.phoneNumberType',
      label: 'Primary Applicant Phone Type',
    },
    {
      path: 'additionalPhoneNumber',
      label: 'Primary Applicant Additional Phone Number',
    },
    {
      path: 'contactPreferences',
      label: 'Primary Applicant Preferred Contact Type',
    },
    {
      path: 'applicant.applicantAddress.street',
      label: `Primary Applicant Street`,
    },
    {
      path: 'applicant.applicantAddress.street2',
      label: `Primary Applicant Street 2`,
    },
    {
      path: 'applicant.applicantAddress.city',
      label: `Primary Applicant City`,
    },
    {
      path: 'applicant.applicantAddress.state',
      label: `Primary Applicant State`,
    },
    {
      path: 'applicant.applicantAddress.zipCode',
      label: `Primary Applicant Zip Code`,
    },
    {
      path: 'applicationsMailingAddress.street',
      label: `Primary Applicant Mailing Street`,
    },
    {
      path: 'applicationsMailingAddress.street2',
      label: `Primary Applicant Mailing Street 2`,
    },
    {
      path: 'applicationsMailingAddress.city',
      label: `Primary Applicant Mailing City`,
    },
    {
      path: 'applicationsMailingAddress.state',
      label: `Primary Applicant Mailing State`,
    },
    {
      path: 'applicationsMailingAddress.zipCode',
      label: `Primary Applicant Mailing Zip Code`,
    },
    {
      path: 'applicant.applicantWorkAddress.street',
      label: `Primary Applicant Work Street`,
    },
    {
      path: 'applicant.applicantWorkAddress.street2',
      label: `Primary Applicant Work Street 2`,
    },
    {
      path: 'applicant.applicantWorkAddress.city',
      label: `Primary Applicant Work City`,
    },
    {
      path: 'applicant.applicantWorkAddress.state',
      label: `Primary Applicant Work State`,
    },
    {
      path: 'applicant.applicantWorkAddress.zipCode',
      label: `Primary Applicant Work Zip Code`,
    },
    {
      path: 'alternateContact.firstName',
      label: 'Alternate Contact First Name',
    },
    {
      path: 'alternateContact.lastName',
      label: 'Alternate Contact Last Name',
    },
    {
      path: 'alternateContact.type',
      label: 'Alternate Contact Type',
    },
    {
      path: 'alternateContact.agency',
      label: 'Alternate Contact Agency',
    },
    {
      path: 'alternateContact.otherType',
      label: 'Alternate Contact Other Type',
    },
    {
      path: 'alternateContact.emailAddress',
      label: 'Alternate Contact Email Address',
    },
    {
      path: 'alternateContact.phoneNumber',
      label: 'Alternate Contact Phone Number',
    },
    {
      path: 'alternateContact.address.street',
      label: `Alternate Contact Street`,
    },
    {
      path: 'alternateContact.address.street2',
      label: `Alternate Contact Street 2`,
    },
    {
      path: 'alternateContact.address.city',
      label: `Alternate Contact City`,
    },
    {
      path: 'alternateContact.address.state',
      label: `Alternate Contact State`,
    },
    {
      path: 'alternateContact.address.zipCode',
      label: `Alternate Contact Zip Code`,
    },
    {
      path: 'income',
      label: 'Income',
    },
    {
      path: 'incomePeriod',
      label: 'Income Period',
      format: (val: string): string =>
        val === 'perMonth' ? 'per month' : 'per year',
    },
    {
      path: 'accessibility.mobility',
      label: 'Accessibility Mobility',
    },
    {
      path: 'accessibility.vision',
      label: 'Accessibility Vision',
    },
    {
      path: 'accessibility.hearing',
      label: 'Accessibility Hearing',
    },
    {
      path: 'householdExpectingChanges',
      label: 'Expecting Household Changes',
    },
    {
      path: 'householdStudent',
      label: 'Household Includes Student or Member Nearing 18',
    },
    {
      path: 'incomeVouchers',
      label: 'Vouchers or Subsidies',
    },
    {
      path: 'preferredUnitTypes',
      label: 'Requested Unit Types',
      format: (val: UnitType[]): string => {
        return val
          .map((unit) => service.unitTypeToReadable(unit.name))
          .join(',');
      },
    },
  ];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationCsvExporterService,
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

    service = module.get<ApplicationCsvExporterService>(
      ApplicationCsvExporterService,
    );
    prisma = module.get<PrismaService>(PrismaService);
    permissionService = module.get<PermissionService>(PermissionService);

    address = {
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      street: '123 4th St',
      street2: '#5',
      city: 'City',
      state: 'State',
      zipCode: '67890',
    };
  });

  it('tests unitTypeToReadable with type in typeMap', () => {
    const types = [
      'SRO',
      'studio',
      'oneBdrm',
      'twoBdrm',
      'threeBdrm',
      'fourBdrm',
    ];

    const readableTypes = [
      'SRO',
      'Studio',
      'One Bedroom',
      'Two Bedroom',
      'Three Bedroom',
      'Four+ Bedroom',
    ];

    for (let i = 0; i < types.length; i++) {
      expect(service.unitTypeToReadable(types[i])).toBe(readableTypes[i]);
    }
  });

  it('tests unitTypeToRedable with type not in typeMap', () => {
    const custom = 'FiveBdrm';
    expect(service.unitTypeToReadable(custom)).toBe(custom);
  });

  it('tests convertDemographicRaceToReadable with valid type', () => {
    const keys = [
      'indigenous-alaskanNative',
      'indigenous',
      'pacificIslander-nativeHawaiian',
    ];

    const values = [
      'Indigenous[Alaskan Native]',
      'Indigenous',
      'Pacific Islander[Native Hawaiian]',
    ];

    for (let i = 0; i < keys.length; i++) {
      expect(service.convertDemographicRaceToReadable(keys[i])).toBe(values[i]);
    }
  });

  it('tests convertDemographicRaceToReadable with valid type and custom value', () => {
    expect(
      service.convertDemographicRaceToReadable(
        'pacificIslander-otherPacificIslander:Fijian',
      ),
    ).toBe('Pacific Islander[Other Pacific Islander:Fijian]');
  });

  it('tests convertDemographicRaceToReadable with type not in typeMap', () => {
    const custom = 'This is a custom value';
    expect(service.convertDemographicRaceToReadable(custom)).toBe(custom);
  });

  it('tests multiselectQuestionFormat with undefined question passed', () => {
    expect(
      service.multiselectQuestionFormat(undefined, undefined, undefined),
    ).toBe('');
  });

  it('tests multiselectQuestionFormat', () => {
    const question: ApplicationMultiselectQuestion = {
      multiselectQuestionId: randomUUID(),
      key: 'Test Preference 1',
      claimed: true,
      options: [
        {
          key: 'option 1',
          checked: true,
          extraData: [
            {
              key: 'address',
              type: InputType.address,
              value: address,
            },
          ],
        },
      ],
    };

    expect(
      service.multiselectQuestionFormat(question, 'option 1', 'address'),
    ).toBe('123 4th St #5 City, State 67890');
  });

  it('tests addressToString without street 2', () => {
    const testAddress = { ...address, street2: undefined };
    expect(service.addressToString(testAddress)).toBe(
      '123 4th St City, State 67890',
    );
  });

  it('tests getCsvHeaders with no houshold members, multiselect questions or demographics', async () => {
    const headers = await service.getCsvHeaders(0, [], process.env.TIME_ZONE);
    const testHeaders = [
      ...csvHeaders,
      {
        path: 'householdSize',
        label: 'Household Size',
      },
      {
        path: 'markedAsDuplicate',
        label: 'Marked As Duplicate',
      },
      {
        path: 'applicationFlaggedSet',
        label: 'Flagged As Duplicate',
        format: (val: ApplicationFlaggedSet[]): boolean => {
          return val.length > 0;
        },
      },
    ];
    expect(JSON.stringify(headers)).toEqual(JSON.stringify(testHeaders));
  });

  it('tests getCsvHeaders with household members and no multiselect questions or demographics', async () => {
    const headers = await service.getCsvHeaders(3, [], process.env.TIME_ZONE);
    const testHeaders = [
      ...csvHeaders,
      {
        path: 'householdSize',
        label: 'Household Size',
      },
      ...service.getHouseholdCsvHeaders(3),
      {
        path: 'markedAsDuplicate',
        label: 'Marked As Duplicate',
      },
      {
        path: 'applicationFlaggedSet',
        label: 'Flagged As Duplicate',
        format: (val: ApplicationFlaggedSet[]): boolean => {
          return val.length > 0;
        },
      },
    ];
    expect(JSON.stringify(headers)).toEqual(JSON.stringify(testHeaders));
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

    service.unitTypeToReadable = jest.fn().mockReturnValue('Studio');
    const exportResponse = await service.exportFile(
      { user: requestingUser } as unknown as ExpressRequest,
      {} as unknown as Response,
      {
        listingId: randomUUID(),
        includeDemographics: false,
      },
    );

    const headerRow =
      '"Application Id","Application Confirmation Code","Application Type","Application Submission Date","Application Received At","Application Received By","Primary Applicant First Name","Primary Applicant Middle Name","Primary Applicant Last Name","Primary Applicant Birth Day","Primary Applicant Birth Month","Primary Applicant Birth Year","Primary Applicant Email Address","Primary Applicant Phone Number","Primary Applicant Phone Type","Primary Applicant Additional Phone Number","Primary Applicant Preferred Contact Type","Primary Applicant Street","Primary Applicant Street 2","Primary Applicant City","Primary Applicant State","Primary Applicant Zip Code","Primary Applicant Mailing Street","Primary Applicant Mailing Street 2","Primary Applicant Mailing City","Primary Applicant Mailing State","Primary Applicant Mailing Zip Code","Primary Applicant Work Street","Primary Applicant Work Street 2","Primary Applicant Work City","Primary Applicant Work State","Primary Applicant Work Zip Code","Alternate Contact First Name","Alternate Contact Last Name","Alternate Contact Type","Alternate Contact Agency","Alternate Contact Other Type","Alternate Contact Email Address","Alternate Contact Phone Number","Alternate Contact Street","Alternate Contact Street 2","Alternate Contact City","Alternate Contact State","Alternate Contact Zip Code","Income","Income Period","Accessibility Mobility","Accessibility Vision","Accessibility Hearing","Expecting Household Changes","Household Includes Student or Member Nearing 18","Vouchers or Subsidies","Requested Unit Types","Preference text 0","Preference text 0 - text - Address","Program text 1","Household Size","Household Member (1) First Name","Household Member (1) Middle Name","Household Member (1) Last Name","Household Member (1) First Name","Household Member (1) Birth Day","Household Member (1) Birth Month","Household Member (1) Birth Year","Household Member (1) Same as Primary Applicant","Household Member (1) Relationship","Household Member (1) Work in Region","Household Member (1) Street","Household Member (1) Street 2","Household Member (1) City","Household Member (1) State","Household Member (1) Zip Code","Marked As Duplicate","Flagged As Duplicate"';
    const firstApp =
      '"application 0 firstName","application 0 middleName","application 0 lastName","application 0 birthDay","application 0 birthMonth","application 0 birthYear","application 0 emailaddress","application 0 phoneNumber","application 0 phoneNumberType","additionalPhoneNumber 0",,"application 0 applicantAddress street","application 0 applicantAddress street2","application 0 applicantAddress city","application 0 applicantAddress state","application 0 applicantAddress zipCode",,,,,,"application 0 applicantWorkAddress street","application 0 applicantWorkAddress street2","application 0 applicantWorkAddress city","application 0 applicantWorkAddress state","application 0 applicantWorkAddress zipCode",,,,,,,,,,,,,"income 0","per month",,,,"true","true","true","Studio,Studio",,,,,,,,,,,,,,,,,,,,';

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

    service.unitTypeToReadable = jest.fn().mockReturnValue('Studio');

    const exportResponse = await service.exportFile(
      { user: requestingUser } as unknown as ExpressRequest,
      {} as unknown as Response,
      { listingId: 'test', includeDemographics: true },
    );

    const headerRow =
      '"Application Id","Application Confirmation Code","Application Type","Application Submission Date","Application Received At","Application Received By","Primary Applicant First Name","Primary Applicant Middle Name","Primary Applicant Last Name","Primary Applicant Birth Day","Primary Applicant Birth Month","Primary Applicant Birth Year","Primary Applicant Email Address","Primary Applicant Phone Number","Primary Applicant Phone Type","Primary Applicant Additional Phone Number","Primary Applicant Preferred Contact Type","Primary Applicant Street","Primary Applicant Street 2","Primary Applicant City","Primary Applicant State","Primary Applicant Zip Code","Primary Applicant Mailing Street","Primary Applicant Mailing Street 2","Primary Applicant Mailing City","Primary Applicant Mailing State","Primary Applicant Mailing Zip Code","Primary Applicant Work Street","Primary Applicant Work Street 2","Primary Applicant Work City","Primary Applicant Work State","Primary Applicant Work Zip Code","Alternate Contact First Name","Alternate Contact Last Name","Alternate Contact Type","Alternate Contact Agency","Alternate Contact Other Type","Alternate Contact Email Address","Alternate Contact Phone Number","Alternate Contact Street","Alternate Contact Street 2","Alternate Contact City","Alternate Contact State","Alternate Contact Zip Code","Income","Income Period","Accessibility Mobility","Accessibility Vision","Accessibility Hearing","Expecting Household Changes","Household Includes Student or Member Nearing 18","Vouchers or Subsidies","Requested Unit Types","Preference text 0","Program text 1","Household Size","Marked As Duplicate","Flagged As Duplicate","Race","Gender","Sexual Orientation","Spoken Language","How did you Hear?"';
    const firstApp =
      '"application 0 firstName","application 0 middleName","application 0 lastName","application 0 birthDay","application 0 birthMonth","application 0 birthYear","application 0 emailaddress","application 0 phoneNumber","application 0 phoneNumberType","additionalPhoneNumber 0",,"application 0 applicantAddress street","application 0 applicantAddress street2","application 0 applicantAddress city","application 0 applicantAddress state","application 0 applicantAddress zipCode",,,,,,"application 0 applicantWorkAddress street","application 0 applicantWorkAddress street2","application 0 applicantWorkAddress city","application 0 applicantWorkAddress state","application 0 applicantWorkAddress zipCode",,,,,,,,,,,,,"income 0","per month",,,,"true","true","true","Studio,Studio",,,,,,"Indigenous",,,,"Other"';

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

    service.unitTypeToReadable = jest.fn().mockReturnValue('Studio');
    const exportResponse = await service.exportFile(
      { user: requestingUser } as unknown as ExpressRequest,
      {} as unknown as Response,
      { listingId: randomUUID() },
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

    service.unitTypeToReadable = jest.fn().mockReturnValue('Studio');
    const exportResponse = await service.exportFile(
      { user: requestingUser } as unknown as ExpressRequest,
      {} as unknown as Response,
      {
        listingId: randomUUID(),
        timeZone: 'America/New_York',
      },
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

  describe('Testing lotteryExport()', () => {
    it('should generate lottery results ', async () => {
      process.env.TIME_ZONE = 'America/Los_Angeles';
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01'));

      const listingId = randomUUID();

      const requestingUser = {
        firstName: 'requesting fName',
        lastName: 'requesting lName',
        email: 'requestingUser@email.com',
        jurisdictions: [{ id: 'juris id' }],
      } as unknown as User;

      const applications = mockApplicationSet(5, new Date(), undefined, true);
      prisma.applications.findMany = jest.fn().mockReturnValue(applications);
      prisma.listings.findUnique = jest.fn().mockResolvedValue({
        id: listingId,
        lotteryLastRunAt: new Date(),
        lotteryStatus: LotteryStatusEnum.ran,
      });
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

      service.unitTypeToReadable = jest.fn().mockReturnValue('Studio');
      const exportResponse = await service.lotteryExport(
        { user: requestingUser } as unknown as ExpressRequest,
        {} as unknown as Response,
        { listingId },
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

      expect(readable).toContain('Raw Lottery Rank');
    });
  });
});
