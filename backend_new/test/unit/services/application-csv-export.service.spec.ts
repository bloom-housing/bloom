import { randomUUID } from 'crypto';
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

describe('Testing ami chart service', () => {
  let service: ApplicationCsvExporterService;
  let address: Address;
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

  it('tests getCsvHeaders with houshold members and no  multiselect questions or demographics', async () => {
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
});
