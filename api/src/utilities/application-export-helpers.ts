import {
  ApplicationSubmissionTypeEnum,
  MultiselectQuestionsApplicationSectionEnum,
} from '@prisma/client';
import { Address } from '../dtos/addresses/address.dto';
import { ApplicationFlaggedSet } from '../dtos/application-flagged-sets/application-flagged-set.dto';
import { ApplicationLotteryPosition } from '../dtos/applications/application-lottery-position.dto';
import { ApplicationMultiselectQuestion } from '../dtos/applications/application-multiselect-question.dto';
import { ApplicationSelection } from '../dtos/applications/application-selection.dto';
import { MultiselectQuestion } from '../dtos/multiselect-questions/multiselect-question.dto';
import { UnitType } from '../dtos/unit-types/unit-type.dto';
import { CsvHeader } from '../types/CsvExportInterface';
import { formatLocalDate } from '../utilities/format-local-date';

/**
 *
 * @param maxHouseholdMembers the max number of household members on an application
 * @param multiSelectQuestions the set of multiselect questions on the listing
 * @param timeZone the timezone to output dates in
 * @param enableV2MSQ when true, the new multiselectQuestion logic will be used
 * @param forLottery whether this is for lottery or not
 * @param includeDemographics whether to include demographic info or not
 * @param swapCommunityTypeWithPrograms when true, the programs section on the frontend is displayed as community types
 * @returns the set of export headers
 */
export const getExportHeaders = (
  maxHouseholdMembers: number,
  multiSelectQuestions: MultiselectQuestion[],
  timeZone: string,
  optionalParams?: {
    disableWorkInRegion?: boolean;
    enableAdaOtherOption?: boolean;
    enableApplicationStatus?: boolean;
    enableFullTimeStudentQuestion?: boolean;
    enableV2MSQ?: boolean;
    forLottery?: boolean;
    includeDemographics?: boolean;
    swapCommunityTypeWithPrograms?: boolean;
  },
): CsvHeader[] => {
  const dateFormat = 'MM-DD-YYYY hh:mm:ssA z';
  const {
    disableWorkInRegion,
    enableAdaOtherOption,
    enableApplicationStatus,
    enableFullTimeStudentQuestion,
    enableV2MSQ,
    forLottery,
    includeDemographics,
    swapCommunityTypeWithPrograms,
  } = optionalParams;

  const headers: CsvHeader[] = [
    {
      path: 'id',
      label: 'Application Id',
    },
    {
      path: 'confirmationCode',
      label: 'Application Confirmation Code',
    },
  ];

  // if its for the lottery insert the lottery position
  if (forLottery) {
    headers.push({
      path: 'applicationLotteryPositions',
      label: 'Raw Lottery Rank',
      format: (val: ApplicationLotteryPosition[]): number => {
        if (val?.length) {
          return val[0].ordinal;
        }
      },
    });
  }

  headers.push(
    ...[
      {
        path: 'submissionType',
        label: 'Application Type',
        format: (val: string): string =>
          val === ApplicationSubmissionTypeEnum.electronical
            ? 'electronic'
            : val,
      },
      {
        path: 'submissionDate',
        label: 'Application Submission Date',
        format: (val: string): string =>
          formatLocalDate(val, dateFormat, timeZone ?? process.env.TIME_ZONE),
      },
    ],
  );

  if (enableApplicationStatus) {
    headers.push(
      ...[
        {
          path: 'status',
          label: 'Application Status',
        },
        {
          path: 'manualLotteryPositionNumber',
          label: 'Lottery Position Number',
        },
        {
          path: 'accessibleUnitWaitlistNumber',
          label: 'Waitlist Position (Accessible Unit)',
        },
        {
          path: 'conventionalUnitWaitlistNumber',
          label: 'Waitlist Position (Conventional Unit)',
        },
      ],
    );
  }

  headers.push(
    ...[
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
    ],
  );

  if (!disableWorkInRegion) {
    headers.push({
      path: 'applicant.workInRegion',
      label: 'Primary Applicant Work in Region',
    });
  }

  if (enableFullTimeStudentQuestion) {
    headers.push({
      path: 'applicant.fullTimeStudent',
      label: 'Primary Applicant Full-Time Student',
    });
  }

  headers.push(
    ...[
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
      ...(enableAdaOtherOption
        ? [
            {
              path: 'accessibility.other',
              label: 'Accessibility Other',
            },
          ]
        : []),
      {
        path: 'householdExpectingChanges',
        label: 'Expecting Household Changes',
      },
      {
        path: 'householdStudent',
        label: enableFullTimeStudentQuestion
          ? 'All Household Members Students'
          : 'Household Includes Student or Member Nearing 18',
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
    ],
  );

  if (enableV2MSQ) {
    const multiselectQuestionHeaders = constructMultiselectQuestionHeaders(
      multiSelectQuestions,
      swapCommunityTypeWithPrograms,
    );
    headers.push(...multiselectQuestionHeaders);
  } else {
    // add preferences to csv headers
    const preferenceHeaders = constructSpecificMultiselectQuestionHeaders(
      'preferences',
      'Preference',
      multiSelectQuestions,
    );
    headers.push(...preferenceHeaders);

    // add programs to csv headers
    const programHeaders = constructSpecificMultiselectQuestionHeaders(
      'programs',
      swapCommunityTypeWithPrograms ? 'Community Type' : 'Program',
      multiSelectQuestions,
    );
    headers.push(...programHeaders);
  }

  headers.push({
    path: 'householdSize',
    label: 'Household Size',
  });

  // add household member headers to csv
  if (maxHouseholdMembers) {
    headers.push(
      ...getHouseholdCsvHeaders(
        maxHouseholdMembers,
        enableFullTimeStudentQuestion,
        disableWorkInRegion,
      ),
    );
  }

  headers.push(
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
  );

  if (includeDemographics) {
    headers.push(
      {
        path: 'demographics.ethnicity',
        label: 'Ethnicity',
      },
      {
        path: 'demographics.race',
        label: 'Race',
        format: (val: string[]): string =>
          val.map((race) => convertDemographicRaceToReadable(race)).join(','),
      },
      {
        path: 'demographics.howDidYouHear',
        label: 'How did you Hear?',
      },
    );
  }
  return headers;
};

/**
 *
 * @param multiSelectQuestions the set of multiselect questions on the listing
 * @param swapCommunityTypeWithPrograms when true, the programs section on the frontend is displayed as community types
 * @returns the set of headers
 */
export const constructMultiselectQuestionHeaders = (
  multiSelectQuestions: MultiselectQuestion[],
  swapCommunityTypeWithPrograms?: boolean,
): CsvHeader[] => {
  const headers: CsvHeader[] = [];

  multiSelectQuestions.forEach((question) => {
    let labelString: string;
    const applicationSection = question.applicationSection;
    if (
      applicationSection ===
      MultiselectQuestionsApplicationSectionEnum.preferences
    ) {
      labelString = 'Preference';
    } else if (
      applicationSection ===
        MultiselectQuestionsApplicationSectionEnum.programs &&
      swapCommunityTypeWithPrograms
    ) {
      labelString = 'Community Type';
    } else if (
      applicationSection === MultiselectQuestionsApplicationSectionEnum.programs
    ) {
      labelString = 'Program';
    }

    headers.push({
      path: `multiselectQuestion.${question.id}`,
      label: `${labelString} ${question.name}`,
      format: (val: any): string => {
        const claimedString: string[] = [];
        val?.selections?.forEach((selection) => {
          // Note: the selection can be the opt out text. That is intended behavior
          claimedString.push(selection.multiselectOption.name);
        });
        return claimedString.join(', ');
      },
    });
    /**
     * handle other collected data
     */
    question.multiselectOptions.forEach((option) => {
      if (!option.shouldCollectAddress) {
        return;
      }
      headers.push({
        path: `multiselectQuestion.${question.id}.${option.id}.addressHolderAddress`,
        label: `${labelString} ${question.name} - ${option.name} - Address`,
        format: (val: ApplicationSelection): string => {
          return applicationSelectionDataFormatter(
            val,
            option.id,
            'addressHolderAddress',
          );
        },
      });

      if (option.shouldCollectName) {
        headers.push({
          path: `multiselectQuestion.${question.id}.${option.id}.addressHolderName`,
          label: `${labelString} ${question.name} - ${option.name} - Name of Address Holder`,
          format: (val: ApplicationSelection): string => {
            return applicationSelectionDataFormatter(
              val,
              option.id,
              'addressHolderName',
            );
          },
        });
      }
      if (option.shouldCollectRelationship) {
        headers.push({
          path: `multiselectQuestion.${question.id}.${option.id}.addressHolderRelationship`,
          label: `${labelString} ${question.text} - ${option.text} - Relationship to Address Holder`,
          format: (val: ApplicationSelection): string => {
            return applicationSelectionDataFormatter(
              val,
              option.id,
              'addressHolderRelationship',
            );
          },
        });
      }
      if (option.validationMethod) {
        headers.push({
          path: `multiselectQuestion.${question.id}.${option.id}.isGeocodingVerified`,
          label: `${labelString} ${question.name} - ${option.name} - Passed Address Check`,
          format: (val: ApplicationSelection): string => {
            return applicationSelectionDataFormatter(
              val,
              option.id,
              'isGeocodingVerified',
            );
          },
        });
      }
    });
  });

  return headers;
};

/**
 *
 * @param applicationSection is this for programs or preferences
 * @param labelString prefix for header output
 * @param multiSelectQuestions the set of multiselect questions on the listing
 * @returns the set of headers
 */
export const constructSpecificMultiselectQuestionHeaders = (
  applicationSection: string,
  labelString: string,
  multiSelectQuestions: MultiselectQuestion[],
): CsvHeader[] => {
  const headers: CsvHeader[] = [];

  multiSelectQuestions
    .filter((question) => question.applicationSection === applicationSection)
    .forEach((question) => {
      headers.push({
        path: `${applicationSection}.${question.id}.claimed`,
        label: `${labelString} ${question.text}`,
        format: (val: any): string => {
          const claimedString: string[] = [];
          val?.options?.forEach((option) => {
            // Note: the option can be the opt out text so if it is checked
            // the opt out text will appear. That is intended behavior
            if (option.checked) {
              claimedString.push(option.key);
            }
          });
          return claimedString.join(', ');
        },
      });
      /**
       * there are other input types for extra data besides address
       * that are not used on the old backend, but could be added here
       */
      question.options
        ?.filter((option) => option.collectAddress)
        .forEach((option) => {
          headers.push({
            path: `${applicationSection}.${question.id}.${option.text.replace(
              '.',
              '',
            )}.address`,
            label: `${labelString} ${question.text} - ${option.text} - Address`,
            format: (val: ApplicationMultiselectQuestion): string => {
              return multiselectQuestionFormat(val, option.text, 'address');
            },
          });
          if (option.validationMethod) {
            headers.push({
              path: `${applicationSection}.${question.id}.${option.text.replace(
                '.',
                '',
              )}.geocodingVerified`,
              label: `${labelString} ${question.text} - ${option.text} - Passed Address Check`,
              format: (val: ApplicationMultiselectQuestion): string => {
                return multiselectQuestionFormat(
                  val,
                  option.text,
                  'geocodingVerified',
                );
              },
            });
          }
          if (option.collectName) {
            headers.push({
              path: `${applicationSection}.${question.id}.${option.text.replace(
                '.',
                '',
              )}.addressHolderName`,
              label: `${labelString} ${question.text} - ${option.text} - Name of Address Holder`,
              format: (val: ApplicationMultiselectQuestion): string => {
                return multiselectQuestionFormat(
                  val,
                  option.text,
                  'addressHolderName',
                );
              },
            });
          }
          if (option.collectRelationship) {
            headers.push({
              path: `${applicationSection}.${question.id}.${option.text.replace(
                '.',
                '',
              )}.addressHolderRelationship`,
              label: `${labelString} ${question.text} - ${option.text} - Relationship to Address Holder`,
              format: (val: ApplicationMultiselectQuestion): string => {
                return multiselectQuestionFormat(
                  val,
                  option.text,
                  'addressHolderRelationship',
                );
              },
            });
          }
        });
    });

  return headers;
};

/**
 *
 * @param question the multiselect question to format
 * @param optionText the option to consider selected
 * @param key additional formatting (address or geocodingVerified)
 * @returns the string representation of the multiselect format
 */
export const multiselectQuestionFormat = (
  question: ApplicationMultiselectQuestion,
  optionText: string,
  key: string,
): string => {
  if (!question) return '';
  const selectedOption = question.options.find(
    (option) => option.key === optionText,
  );
  const extraData = selectedOption?.extraData?.find((data) => data.key === key);
  if (!extraData) {
    return '';
  }
  if (key === 'address') {
    return addressToString(extraData.value as Address);
  }
  if (key === 'geocodingVerified') {
    return extraData.value === 'unknown'
      ? 'Needs Manual Verification'
      : extraData.value.toString();
  }
  return extraData.value as string;
};

/**
 *
 * @param selection the application selection made
 * @param optionId the option to consider selected
 * @param key the field on the ApplicationSelectionOption to format
 * @returns the string representation of the multiselect format
 */
export const applicationSelectionDataFormatter = (
  selection: ApplicationSelection,
  optionId: string,
  key: string,
): string => {
  if (!selection) return '';
  const selectedOption = selection.selections.find(
    (selectedOption) => selectedOption.multiselectOption.id === optionId,
  );
  const value = selectedOption[key];
  if (key === 'addressHolderAddress') {
    return addressToString(value);
  }
  if (key === 'isGeocodingVerified') {
    return value === null ? 'Needs Manual Verification' : value.toString();
  }
  return value;
};

/**
 *
 * @param address the address to convert to a string
 * @returns a string representation of the address
 */
export const addressToString = (address: Address): string => {
  return `${address.street}${address.street2 ? ' ' + address.street2 : ''} ${
    address.city
  }, ${address.state} ${address.zipCode}`;
};

/**
 *
 * @param maxHouseholdMembers the maximum number of household members across all applications
 * @param enableFullTimeStudentQuestion should the 'Full-time Student' column be included from the headers
 * @param disableWorkInRegion should the `Work In Region` columns be excluded from the headers
 * @returns the headers and formatters for the household member columns
 */
export const getHouseholdCsvHeaders = (
  maxHouseholdMembers: number,
  enableFullTimeStudentQuestion?: boolean,
  disableWorkInRegion?: boolean,
): CsvHeader[] => {
  const headers = [];
  for (let i = 0; i < maxHouseholdMembers; i++) {
    const j = i + 1;
    headers.push(
      {
        path: `householdMember.${i}.firstName`,
        label: `Household Member (${j}) First Name`,
      },
      {
        path: `householdMember.${i}.middleName`,
        label: `Household Member (${j}) Middle Name`,
      },
      {
        path: `householdMember.${i}.lastName`,
        label: `Household Member (${j}) Last Name`,
      },
      {
        path: `householdMember.${i}.birthDay`,
        label: `Household Member (${j}) Birth Day`,
      },
      {
        path: `householdMember.${i}.birthMonth`,
        label: `Household Member (${j}) Birth Month`,
      },
      {
        path: `householdMember.${i}.birthYear`,
        label: `Household Member (${j}) Birth Year`,
      },
      {
        path: `householdMember.${i}.relationship`,
        label: `Household Member (${j}) Relationship`,
      },
      {
        path: `householdMember.${i}.sameAddress`,
        label: `Household Member (${j}) Same as Primary Applicant`,
      },
    );
    if (!disableWorkInRegion) {
      headers.push({
        path: `householdMember.${i}.workInRegion`,
        label: `Household Member (${j}) Work in Region`,
      });
    }
    if (enableFullTimeStudentQuestion) {
      headers.push({
        path: `householdMember.${i}.fullTimeStudent`,
        label: `Household Member (${j}) Full-Time Student`,
      });
    }
    headers.push(
      {
        path: `householdMember.${i}.householdMemberAddress.street`,
        label: `Household Member (${j}) Street`,
      },
      {
        path: `householdMember.${i}.householdMemberAddress.street2`,
        label: `Household Member (${j}) Street 2`,
      },
      {
        path: `householdMember.${i}.householdMemberAddress.city`,
        label: `Household Member (${j}) City`,
      },
      {
        path: `householdMember.${i}.householdMemberAddress.state`,
        label: `Household Member (${j}) State`,
      },
      {
        path: `householdMember.${i}.householdMemberAddress.zipCode`,
        label: `Household Member (${j}) Zip Code`,
      },
    );
  }

  return headers;
};

/**
 *
 * @param type takes in the demographic string
 * @returns outputs the readable version of the string
 */
export const convertDemographicRaceToReadable = (type: string): string => {
  const [rootKey, customValue = ''] = type.split(':');
  //only show colon if user entered a custom value
  const customValueFormatted = customValue ? `:${customValue}` : '';
  const typeMap = {
    americanIndianAlaskanNative: 'American Indian / Alaskan Native',
    asian: 'Asian',
    'asian-asianIndian': 'Asian[Asian Indian]',
    'asian-otherAsian': `Asian[Other Asian${customValueFormatted}]`,
    blackAfricanAmerican: 'Black / African American',
    'asian-chinese': 'Asian[Chinese]',
    declineToRespond: 'Decline to Respond',
    'asian-filipino': 'Asian[Filipino]',
    'nativeHawaiianOtherPacificIslander-guamanianOrChamorro':
      'Native Hawaiian / Other Pacific Islander[Guamanian or Chamorro]',
    'asian-japanese': 'Asian[Japanese]',
    'asian-korean': 'Asian[Korean]',
    'nativeHawaiianOtherPacificIslander-nativeHawaiian':
      'Native Hawaiian / Other Pacific Islander[Native Hawaiian]',
    nativeHawaiianOtherPacificIslander:
      'Native Hawaiian / Other Pacific Islander',
    otherMultiracial: `Other / Multiracial${customValueFormatted}`,
    'nativeHawaiianOtherPacificIslander-otherPacificIslander': `Native Hawaiian / Other Pacific Islander[Other Pacific Islander${customValueFormatted}]`,
    'nativeHawaiianOtherPacificIslander-samoan':
      'Native Hawaiian / Other Pacific Islander[Samoan]',
    'asian-vietnamese': 'Asian[Vietnamese]',
    white: 'White',
  };
  return typeMap[rootKey] ?? rootKey;
};

export const typeMap = {
  SRO: 'SRO',
  studio: 'Studio',
  oneBdrm: 'One Bedroom',
  twoBdrm: 'Two Bedroom',
  threeBdrm: 'Three Bedroom',
  fourBdrm: 'Four+ Bedroom',
  fiveBdrm: 'Five Bedroom',
};

/**
 * @param type the unit type we are converting from type to string
 * @returns the string representation of that unit type
 */
export const unitTypeToReadable = (type: string): string => {
  return typeMap[type] ?? type;
};
