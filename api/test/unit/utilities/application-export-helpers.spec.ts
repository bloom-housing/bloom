import { randomUUID } from 'crypto';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';
import { randomNoun } from '../../../prisma/seed-helpers/word-generator';
import { ApplicationSelection } from '../../../src/dtos/applications/application-selection.dto';
import { ApplicationMultiselectQuestion } from '../../../src/dtos/applications/application-multiselect-question.dto';
import { ApplicationFlaggedSet } from '../../../src/dtos/application-flagged-sets/application-flagged-set.dto';
import MultiselectQuestion from '../../../src/dtos/multiselect-questions/multiselect-question.dto';
import { UnitType } from '../../../src/dtos/unit-types/unit-type.dto';
import { ValidationMethod } from '../../../src/enums/multiselect-questions/validation-method-enum';
import { InputType } from '../../../src/enums/shared/input-type-enum';
import { CsvHeader } from '../../../src/types/CsvExportInterface';
import {
  addressToString,
  applicationSelectionDataFormatter,
  constructHouseholdHeaders,
  constructMultiselectQuestionHeaders,
  convertDemographicRaceToReadable,
  getExportHeaders,
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

  const getCsvHeader = (disableWorkInRegion?: boolean): CsvHeader[] => [
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
    ...(!disableWorkInRegion
      ? [
          {
            path: 'applicant.workInRegion',
            label: `Primary Applicant Work in Region`,
          },
        ]
      : []),
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
      path: 'accessibility.other',
      label: 'Accessibility Other',
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

  const mockMultiselectQuestion = (params?: {
    applicationSection?: MultiselectQuestionsApplicationSectionEnum;
    optionId?: string;
    optionName?: string;
    questionId?: string;
    questionName?: string;
    shouldCollectAddress?: boolean;
    shouldCollectName?: boolean;
    shouldCollectRelationship?: boolean;
    validationMethod?: ValidationMethod;
  }): MultiselectQuestion => {
    return {
      id: params.questionId ?? randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      applicationSection:
        params.applicationSection ??
        MultiselectQuestionsApplicationSectionEnum.preferences,
      jurisdictions: [],
      multiselectOptions: [
        {
          id: params.optionId ?? randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          name: params.optionName ?? randomNoun(),
          ordinal: 0,
          shouldCollectAddress: params.shouldCollectAddress ?? false,
          shouldCollectName: params.shouldCollectName ?? false,
          shouldCollectRelationship: params.shouldCollectRelationship ?? false,
          // TODO: Can be removed after MSQ refactor
          text: '',
          validationMethod: params.validationMethod ?? ValidationMethod.none,
        },
      ],
      name: params.questionName ?? randomNoun(),
      status: 'draft',
      // TODO: Can be removed after MSQ refactor
      text: '',
    };
  };

  describe('Testing getExportHeaders', () => {
    it('tests getCsvHeaders with no household members, multiselect questions or demographics', () => {
      const headers = getExportHeaders(0, [], process.env.TIME_ZONE, {
        enableAdaOtherOption: true,
      });
      const testHeaders = [
        ...getCsvHeader(),
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

    it('tests getCsvHeaders with household members and no multiselect questions or demographics', () => {
      const headers = getExportHeaders(3, [], process.env.TIME_ZONE, {
        enableAdaOtherOption: true,
      });

      const testHeaders = [
        ...getCsvHeader(),
        {
          path: 'householdSize',
          label: 'Household Size',
        },
        ...constructHouseholdHeaders(3),
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

    it('tests getCsvHeaders with household members with no work in region', () => {
      const headers = getExportHeaders(3, [], process.env.TIME_ZONE, {
        disableWorkInRegion: true,
        enableAdaOtherOption: true,
      });

      const testHeaders = [
        ...getCsvHeader(true),
        {
          path: 'householdSize',
          label: 'Household Size',
        },
        ...constructHouseholdHeaders(3, false, true),
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

    it('should return csv headers with v2 multiselect questions', () => {
      const applicationSection =
        MultiselectQuestionsApplicationSectionEnum.preferences;
      const questionId = randomUUID();
      const questionName = randomNoun();
      const multiselectQuestion = mockMultiselectQuestion({
        applicationSection,
        questionId,
        questionName,
      });

      const headers = getExportHeaders(
        0,
        [multiselectQuestion],
        process.env.TIME_ZONE,
        {
          enableAdaOtherOption: true,
          enableV2MSQ: true,
        },
      );
      const testHeaders = [
        ...getCsvHeader(),
        {
          path: `multiselectQuestion.${questionId}`,
          label: `Preference ${questionName}`,
        },
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
  });

  describe('Testing addressToString', () => {
    it('tests addressToString without street 2', () => {
      const testAddress = { ...address, street2: undefined };
      expect(addressToString(testAddress)).toEqual(
        '123 4th St City, State 67890',
      );
    });
  });

  describe('Testing applicationSelectionDataFormatter', () => {
    const optionId = randomUUID();
    const applicationSelection = (
      geocoding?: boolean,
    ): ApplicationSelection => {
      return {
        application: { id: randomUUID() },
        multiselectQuestion: { id: randomUUID() },
        selections: [
          {
            addressHolderAddress: address,
            addressHolderName: 'name',
            addressHolderRelationship: 'relationship',
            isGeocodingVerified: geocoding,
            multiselectOption: { id: optionId },
          },
        ],
      } as unknown as ApplicationSelection;
    };
    it('should return empty string if selection is null', () => {
      const res = applicationSelectionDataFormatter(null, '', '');

      expect(res).toEqual('');
    });

    it('should return address string if addressHolderAddress is the key', () => {
      const res = applicationSelectionDataFormatter(
        applicationSelection(),
        optionId,
        'addressHolderAddress',
      );

      expect(res).toEqual('123 4th St #5 City, State 67890');
    });

    it('should return name string if addressHolderName is the key', () => {
      const res = applicationSelectionDataFormatter(
        applicationSelection(),
        optionId,
        'addressHolderName',
      );
      expect(res).toEqual('name');
    });

    it('should return relationship string if addressHolderRelationship is the key', () => {
      const res = applicationSelectionDataFormatter(
        applicationSelection(),
        optionId,
        'addressHolderRelationship',
      );
      expect(res).toEqual('relationship');
    });

    it('should return geocoding verified string if isGeocodingVerified is the key and value is null', () => {
      const res = applicationSelectionDataFormatter(
        applicationSelection(null),
        optionId,
        'isGeocodingVerified',
      );
      expect(res).toEqual('Needs Manual Verification');
    });

    it('should return geocoding verified string if isGeocodingVerified is the key and value is true', () => {
      const res = applicationSelectionDataFormatter(
        applicationSelection(true),
        optionId,
        'isGeocodingVerified',
      );
      expect(res).toEqual('true');
    });

    it('should return geocoding verified string if isGeocodingVerified is the key and value is false', () => {
      const res = applicationSelectionDataFormatter(
        applicationSelection(false),
        optionId,
        'isGeocodingVerified',
      );
      expect(res).toEqual('false');
    });
  });

  describe('Testing constructMultiselectQuestionHeaders', () => {
    it('should return header for a preference', () => {
      const applicationSection =
        MultiselectQuestionsApplicationSectionEnum.preferences;
      const questionId = randomUUID();
      const questionName = randomNoun();
      const multiselectQuestion = mockMultiselectQuestion({
        applicationSection,
        questionId,
        questionName,
      });
      const res = constructMultiselectQuestionHeaders([multiselectQuestion]);
      expect(res.length).toEqual(1);
      expect(res[0].label).toEqual(`Preference ${questionName}`);
      expect(res[0].path).toEqual(`multiselectQuestion.${questionId}`);
    });

    it('should return header for a program', () => {
      const applicationSection =
        MultiselectQuestionsApplicationSectionEnum.programs;
      const questionId = randomUUID();
      const questionName = randomNoun();
      const multiselectQuestion = mockMultiselectQuestion({
        applicationSection,
        questionId,
        questionName,
      });
      const res = constructMultiselectQuestionHeaders([multiselectQuestion]);
      expect(res.length).toEqual(1);
      expect(res[0].label).toEqual(`Program ${questionName}`);
      expect(res[0].path).toEqual(`multiselectQuestion.${questionId}`);
    });

    it('should return header for a community type with swapCommunityTypeWithPrograms as true', () => {
      const applicationSection =
        MultiselectQuestionsApplicationSectionEnum.programs;
      const questionId = randomUUID();
      const questionName = randomNoun();
      const multiselectQuestion = mockMultiselectQuestion({
        applicationSection,
        questionId,
        questionName,
      });
      const res = constructMultiselectQuestionHeaders(
        [multiselectQuestion],
        true,
      );
      expect(res.length).toEqual(1);
      expect(res[0].label).toEqual(`Community Type ${questionName}`);
      expect(res[0].path).toEqual(`multiselectQuestion.${questionId}`);
    });

    it('should return headers for preferences and programs', () => {
      const preferenceId = randomUUID();
      const preferenceName = randomNoun();
      const preference = mockMultiselectQuestion({
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        questionId: preferenceId,
        questionName: preferenceName,
      });
      const programId = randomUUID();
      const programName = randomNoun();
      const program = mockMultiselectQuestion({
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
        questionId: programId,
        questionName: programName,
      });
      const res = constructMultiselectQuestionHeaders([preference, program]);
      expect(res.length).toEqual(2);
      expect(res[0].label).toEqual(`Preference ${preferenceName}`);
      expect(res[0].path).toEqual(`multiselectQuestion.${preferenceId}`);
      expect(res[1].label).toEqual(`Program ${programName}`);
      expect(res[1].path).toEqual(`multiselectQuestion.${programId}`);
    });

    it('should return headers for a preference with shouldCollectAddress as true', () => {
      const applicationSection =
        MultiselectQuestionsApplicationSectionEnum.preferences;
      const optionId = randomUUID();
      const optionName = randomNoun();
      const questionId = randomUUID();
      const questionName = randomNoun();
      const multiselectQuestion = mockMultiselectQuestion({
        applicationSection,
        optionId,
        optionName,
        questionId,
        questionName,
        shouldCollectAddress: true,
      });
      const res = constructMultiselectQuestionHeaders([multiselectQuestion]);
      expect(res.length).toEqual(2);
      expect(res[1].label).toEqual(
        `Preference ${questionName} - ${optionName} - Address`,
      );
      expect(res[1].path).toEqual(
        `multiselectQuestion.${questionId}.${optionId}.addressHolderAddress`,
      );
    });

    it('should return headers for a preference with shouldCollectName as true', () => {
      const applicationSection =
        MultiselectQuestionsApplicationSectionEnum.preferences;
      const optionId = randomUUID();
      const optionName = randomNoun();
      const questionId = randomUUID();
      const questionName = randomNoun();
      const multiselectQuestion = mockMultiselectQuestion({
        applicationSection,
        optionId,
        optionName,
        questionId,
        questionName,
        shouldCollectAddress: true,
        shouldCollectName: true,
      });
      const res = constructMultiselectQuestionHeaders([multiselectQuestion]);
      expect(res.length).toEqual(3);
      expect(res[2].label).toEqual(
        `Preference ${questionName} - ${optionName} - Name of Address Holder`,
      );
      expect(res[2].path).toEqual(
        `multiselectQuestion.${questionId}.${optionId}.addressHolderName`,
      );
    });

    it('should return headers for a preference with shouldCollectRelationship as true', () => {
      const applicationSection =
        MultiselectQuestionsApplicationSectionEnum.preferences;
      const optionId = randomUUID();
      const optionName = randomNoun();
      const questionId = randomUUID();
      const questionName = randomNoun();
      const multiselectQuestion = mockMultiselectQuestion({
        applicationSection,
        optionId,
        optionName,
        questionId,
        questionName,
        shouldCollectAddress: true,
        shouldCollectRelationship: true,
      });
      const res = constructMultiselectQuestionHeaders([multiselectQuestion]);
      expect(res.length).toEqual(3);
      expect(res[2].label).toEqual(
        `Preference ${questionName} - ${optionName} - Relationship to Address Holder`,
      );
      expect(res[2].path).toEqual(
        `multiselectQuestion.${questionId}.${optionId}.addressHolderRelationship`,
      );
    });

    it('should return headers for a preference with validationMethod set', () => {
      const applicationSection =
        MultiselectQuestionsApplicationSectionEnum.preferences;
      const optionId = randomUUID();
      const optionName = randomNoun();
      const questionId = randomUUID();
      const questionName = randomNoun();
      const multiselectQuestion = mockMultiselectQuestion({
        applicationSection,
        optionId,
        optionName,
        questionId,
        questionName,
        shouldCollectAddress: true,
        validationMethod: ValidationMethod.map,
      });
      const res = constructMultiselectQuestionHeaders([multiselectQuestion]);
      expect(res.length).toEqual(3);
      expect(res[2].label).toEqual(
        `Preference ${questionName} - ${optionName} - Passed Address Check`,
      );
      expect(res[2].path).toEqual(
        `multiselectQuestion.${questionId}.${optionId}.isGeocodingVerified`,
      );
    });
  });

  describe('Testing convertDemographicRaceToReadable', () => {
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
        expect(convertDemographicRaceToReadable(keys[i])).toEqual(values[i]);
      }
    });

    it('tests convertDemographicRaceToReadable with valid type and custom value', () => {
      expect(
        convertDemographicRaceToReadable(
          'nativeHawaiianOtherPacificIslander-otherPacificIslander:Fijian',
        ),
      ).toEqual(
        'Native Hawaiian / Other Pacific Islander[Other Pacific Islander:Fijian]',
      );
    });

    it('tests convertDemographicRaceToReadable with valid type and empty custom value', () => {
      expect(convertDemographicRaceToReadable('otherMultiracial')).toEqual(
        'Other / Multiracial',
      );
    });

    it('tests convertDemographicRaceToReadable with type not in typeMap', () => {
      const custom = 'This is a custom value';
      expect(convertDemographicRaceToReadable(custom)).toEqual(custom);
    });
  });

  describe('Testing multiselectQuestionFormat', () => {
    it('tests multiselectQuestionFormat with undefined question passed', () => {
      expect(
        multiselectQuestionFormat(undefined, undefined, undefined),
      ).toEqual('');
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
        multiselectQuestionFormat(question, 'option 1', 'address'),
      ).toEqual('123 4th St #5 City, State 67890');
    });
  });

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
        expect(unitTypeToReadable(types[i])).toEqual(readableTypes[i]);
      }
    });

    it('tests unitTypeToReadable with type not in typeMap', () => {
      const custom = 'FiveBdrm';
      expect(unitTypeToReadable(custom)).toEqual(custom);
    });
  });
});
