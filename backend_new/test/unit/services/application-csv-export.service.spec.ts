import { randomUUID } from 'crypto';
import { PassThrough } from 'stream';
import { Test, TestingModule } from '@nestjs/testing';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';
import { PrismaService } from '../../../src/services/prisma.service';
import {
  ApplicationCsvExporterService,
  CsvHeader,
} from '../../../src/services/application-csv-export.service';
import { MultiselectQuestionService } from '../../../src/services/multiselect-question.service';
import MultiselectQuestion from '../../../src/dtos/multiselect-questions/multiselect-question.dto';
import { ApplicationMultiselectQuestion } from '../../../src/dtos/applications/application-multiselect-question.dto';
import { InputType } from '../../../src/enums/shared/input-type-enum';
import { UnitType } from 'src/dtos/unit-types/unit-type.dto';
import { Address } from '../../../src/dtos/addresses/address.dto';
import { ApplicationFlaggedSet } from '../../../src/dtos/application-flagged-sets/application-flagged-set.dto';
import { User } from '../../../src/dtos/users/user.dto';
import { mockApplicationSet } from './application.service.spec';
import { mockMultiselectQuestion } from './multiselect-question.service.spec';

describe('Testing application CSV export service', () => {
  let service: ApplicationCsvExporterService;
  let address: Address;
  let prisma: PrismaService;
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
      path: 'alternateContact.middleName',
      label: 'Alternate Contact Middle Name',
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
      path: 'accessibilityMobility',
      label: 'Accessibility Mobility',
    },
    {
      path: 'accessibilityVision',
      label: 'Accessibility Vision',
    },
    {
      path: 'accessibilityHearing',
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
      ],
    }).compile();

    service = module.get<ApplicationCsvExporterService>(
      ApplicationCsvExporterService,
    );
    prisma = module.get<PrismaService>(PrismaService);

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

    const multiselectQuestions: MultiselectQuestion[] = [
      {
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        jurisdictions: [],
        text: 'Test Preference 1',
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        options: [
          {
            text: 'option 1',
            collectAddress: true,
            ordinal: 0,
          },
        ],
      },
    ];
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
      'americanIndianAlaskanNative',
      'declineToRespond',
      'nativeHawaiianOtherPacificIslander-nativeHawaiian',
    ];

    const values = [
      'American Indian / Alaskan Native',
      'Decline to Respond',
      'Native Hawaiian / Other Pacific Islander[Native Hawaiian]',
    ];

    for (let i = 0; i < keys.length; i++) {
      expect(service.convertDemographicRaceToReadable(keys[i])).toBe(values[i]);
    }
  });

  it('tests convertDemographicRaceToReadable with valid type and custom value', () => {
    expect(
      service.convertDemographicRaceToReadable(
        'nativeHawaiianOtherPacificIslander-otherPacificIslander:Fijian',
      ),
    ).toBe(
      'Native Hawaiian / Other Pacific Islander[Other Pacific Islander:Fijian]',
    );
  });

  it('tests convertDemographicRaceToReadable with type not in typeMap', () => {
    const custom = 'This is a custom value';
    expect(service.convertDemographicRaceToReadable(custom)).toBe(custom);
  });

  it('tests multiselectQuestionFormat with undefined question passed', () => {
    expect(service.multiselectQuestionFormat(undefined)).toBe('');
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
              key: 'key 1',
              type: InputType.address,
              value: address,
            },
          ],
        },
      ],
    };

    expect(service.multiselectQuestionFormat(question)).toBe(
      '123 4th St #5 City, State 67890',
    );
  });

  it('tests addressToString without street 2', () => {
    const testAddress = { ...address, street2: undefined };
    expect(service.addressToString(testAddress)).toBe(
      '123 4th St City, State 67890',
    );
  });

  it('tests getCsvHeaders with no houshold members, multiselect questions or demographics', async () => {
    const headers = await service.getCsvHeaders(0, []);
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
    const headers = await service.getCsvHeaders(3, []);
    const testHeaders = [
      ...csvHeaders,
      {
        path: 'householdSize',
        label: 'Household Size',
      },
      ...service.getHousholdCsvHeaders(3),
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

    prisma.applications.findMany = jest
      .fn()
      .mockReturnValue(mockApplicationSet(5, new Date()));

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

    const exportResponse = await service.export(
      { listingId: 'test', includeDemographics: false },
      requestingUser,
    );

    const headerRow = `Application Id,Application Confirmation Code,Application Type,Application Submission Date,Primary Applicant First Name,Primary Applicant Middle Name,Primary Applicant Last Name,Primary Applicant Birth Day,Primary Applicant Birth Month,Primary Applicant Birth Year,Primary Applicant Email Address,Primary Applicant Phone Number,Primary Applicant Phone Type,Primary Applicant Additional Phone Number,Primary Applicant Preferred Contact Type,Primary Applicant Street,Primary Applicant Street 2,Primary Applicant City,Primary Applicant State,Primary Applicant Zip Code,Primary Applicant Mailing Street,Primary Applicant Mailing Street 2,Primary Applicant Mailing City,Primary Applicant Mailing State,Primary Applicant Mailing Zip Code,Primary Applicant Work Street,Primary Applicant Work Street 2,Primary Applicant Work City,Primary Applicant Work State,Primary Applicant Work Zip Code,Alternate Contact First Name,Alternate Contact Middle Name,Alternate Contact Last Name,Alternate Contact Type,Alternate Contact Agency,Alternate Contact Other Type,Alternate Contact Email Address,Alternate Contact Phone Number,Alternate Contact Street,Alternate Contact Street 2,Alternate Contact City,Alternate Contact State,Alternate Contact Zip Code,Income,Income Period,Accessibility Mobility,Accessibility Vision,Accessibility Hearing,Expecting Household Changes,Household Includes Student or Member Nearing 18,Vouchers or Subsidies,Requested Unit Types,Preference text 0,Preference text 0 - Address,Household Size,Marked As Duplicate,Flagged As Duplicate`;

    const firstApp = `application 0 firstName,application 0 middleName,application 0 lastName,application 0 birthDay,application 0 birthMonth,application 0 birthYear,application 0 emailaddress,application 0 phoneNumber,application 0 phoneNumberType,additionalPhoneNumber 0,,application 0 applicantAddress street,application 0 applicantAddress street2,application 0 applicantAddress city,application 0 applicantAddress state,application 0 applicantAddress zipCode,,,,,,application 0 applicantWorkAddress street,application 0 applicantWorkAddress street2,application 0 applicantWorkAddress city,application 0 applicantWorkAddress state,application 0 applicantWorkAddress zipCode,,,,,,,,,,,,,,income 0,per month,,,,true,true,true,Studio,Studio,,,0,false,false`;

    const mockedStream = new PassThrough();
    exportResponse.getStream().pipe(mockedStream);
    let readable;
    mockedStream.on('data', async (d) => {
      readable = Buffer.from(d).toString();
      await expect(readable).toContain(headerRow);
      await expect(readable).toContain(firstApp);
      mockedStream.end();
      mockedStream.destroy();
    });
  });

  it('should build csv headers with demographics', async () => {
    const requestingUser = {
      firstName: 'requesting fName',
      lastName: 'requesting lName',
      email: 'requestingUser@email.com',
      jurisdictions: [{ id: 'juris id' }],
    } as unknown as User;

    const apps = mockApplicationSet(3, new Date());

    prisma.applications.findMany = jest.fn().mockReturnValue(apps);

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

    const exportResponse = await service.export(
      { listingId: 'test', includeDemographics: true },
      requestingUser,
    );

    const headerRow = `Application Id,Application Confirmation Code,Application Type,Application Submission Date,Primary Applicant First Name,Primary Applicant Middle Name,Primary Applicant Last Name,Primary Applicant Birth Day,Primary Applicant Birth Month,Primary Applicant Birth Year,Primary Applicant Email Address,Primary Applicant Phone Number,Primary Applicant Phone Type,Primary Applicant Additional Phone Number,Primary Applicant Preferred Contact Type,Primary Applicant Street,Primary Applicant Street 2,Primary Applicant City,Primary Applicant State,Primary Applicant Zip Code,Primary Applicant Mailing Street,Primary Applicant Mailing Street 2,Primary Applicant Mailing City,Primary Applicant Mailing State,Primary Applicant Mailing Zip Code,Primary Applicant Work Street,Primary Applicant Work Street 2,Primary Applicant Work City,Primary Applicant Work State,Primary Applicant Work Zip Code,Alternate Contact First Name,Alternate Contact Middle Name,Alternate Contact Last Name,Alternate Contact Type,Alternate Contact Agency,Alternate Contact Other Type,Alternate Contact Email Address,Alternate Contact Phone Number,Alternate Contact Street,Alternate Contact Street 2,Alternate Contact City,Alternate Contact State,Alternate Contact Zip Code,Income,Income Period,Accessibility Mobility,Accessibility Vision,Accessibility Hearing,Expecting Household Changes,Household Includes Student or Member Nearing 18,Vouchers or Subsidies,Requested Unit Types,Preference text 0,Household Size,Marked As Duplicate,Flagged As Duplicate,Ethnicity,Race,How did you Hear?`;

    const firstApp = `application 0 firstName,application 0 middleName,application 0 lastName,application 0 birthDay,application 0 birthMonth,application 0 birthYear,application 0 emailaddress,application 0 phoneNumber,application 0 phoneNumberType,additionalPhoneNumber 0,,application 0 applicantAddress street,application 0 applicantAddress street2,application 0 applicantAddress city,application 0 applicantAddress state,application 0 applicantAddress zipCode,,,,,,application 0 applicantWorkAddress street,application 0 applicantWorkAddress street2,application 0 applicantWorkAddress city,application 0 applicantWorkAddress state,application 0 applicantWorkAddress zipCode,,,,,,,,,,,,,,income 0,per month,,,,true,true,true,Studio,Studio,,0,false,false,,Decline to Respond`;

    const mockedStream = new PassThrough();
    exportResponse.getStream().pipe(mockedStream);
    let readable;
    mockedStream.on('data', async (d) => {
      readable = Buffer.from(d).toString();
      await expect(readable).toContain(headerRow);
      await expect(readable).toContain(firstApp);
      mockedStream.end();
      mockedStream.destroy();
    });
  });
});