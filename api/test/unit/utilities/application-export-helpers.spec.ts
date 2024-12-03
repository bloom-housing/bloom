import { randomUUID } from 'crypto';
import { ApplicationFlaggedSet } from '../../../src/dtos/application-flagged-sets/application-flagged-set.dto';
import { ApplicationMultiselectQuestion } from '../../../src/dtos/applications/application-multiselect-question.dto';
import { CsvHeader } from '../../../src/types/CsvExportInterface';
import { UnitType } from '../../../src/dtos/unit-types/unit-type.dto';
import { InputType } from '../../../src/enums/shared/input-type-enum';
import {
  addressToString,
  convertDemographicRaceToReadable,
  getExportHeaders,
  getHouseholdCsvHeaders,
  multiselectQuestionFormat,
  unitTypeToReadable,
} from '../../../src/utilities/application-export-helpers';

describe('Testing application export helpers', () => {
  const address = {
    id: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    street: '123 4th St',
    street2: '#5',
    city: 'City',
    state: 'State',
    zipCode: '67890',
  };

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
        return val.map((unit) => unitTypeToReadable(unit.name)).join(',');
      },
    },
  ];

  describe('Testing unitTypeToReadable', () => {
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
        expect(unitTypeToReadable(types[i])).toBe(readableTypes[i]);
      }
    });

    it('tests unitTypeToRedable with type not in typeMap', () => {
      const custom = 'FiveBdrm';
      expect(unitTypeToReadable(custom)).toBe(custom);
    });
  });

  describe('Testing convertDemographicRaceToReadable', () => {
    it('tests convertDemographicRaceToReadable with valid type', () => {
      const keys = [
        'indigenous-alaskanNative',
        'pacificIslander-nativeHawaiian',
      ];

      const values = [
        'Indigenous[Alaskan Native]',
        'Pacific Islander[Native Hawaiian]',
      ];

      for (let i = 0; i < keys.length; i++) {
        expect(convertDemographicRaceToReadable(keys[i])).toBe(values[i]);
      }
    });

    it('tests convertDemographicRaceToReadable with valid type and custom value', () => {
      expect(
        convertDemographicRaceToReadable(
          'pacificIslander-otherPacificIslander:Fijian',
        ),
      ).toBe('Pacific Islander[Other Pacific Islander:Fijian]');
    });

    it('tests convertDemographicRaceToReadable with type not in typeMap', () => {
      const custom = 'This is a custom value';
      expect(convertDemographicRaceToReadable(custom)).toBe(custom);
    });
  });

  describe('Testing multiselectQuestionFormat', () => {
    it('tests multiselectQuestionFormat with undefined question passed', () => {
      expect(multiselectQuestionFormat(undefined, undefined, undefined)).toBe(
        '',
      );
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

      expect(multiselectQuestionFormat(question, 'option 1', 'address')).toBe(
        '123 4th St #5 City, State 67890',
      );
    });
  });

  describe('Testing addressToString', () => {
    it('tests addressToString without street 2', () => {
      const testAddress = { ...address, street2: undefined };
      expect(addressToString(testAddress)).toBe('123 4th St City, State 67890');
    });
  });

  describe('Testing getExportHeaders', () => {
    it('tests getCsvHeaders with no houshold members, multiselect questions or demographics', async () => {
      const headers = await getExportHeaders(0, [], process.env.TIME_ZONE);
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
      const headers = await getExportHeaders(3, [], process.env.TIME_ZONE);
      const testHeaders = [
        ...csvHeaders,
        {
          path: 'householdSize',
          label: 'Household Size',
        },
        ...getHouseholdCsvHeaders(3),
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
});
