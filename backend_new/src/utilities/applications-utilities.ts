import { randomBytes } from 'crypto';

export const generateConfirmationCode = (): string => {
  return randomBytes(4).toString('hex').toUpperCase();
};

export const raceMap = {
  americanIndianAlaskanNative: 'American Indian / Alaskan Native',
  asian: 'Asian',
  'asian-asianIndian': 'Asian[Asian Indian]',
  'asian-otherAsian': (customValue: string) =>
    `Asian[Other Asian:${customValue}]`,
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
  otherMultiracial: (customValue: string) =>
    `Other / Multiracial:${customValue}`,
  'nativeHawaiianOtherPacificIslander-otherPacificIslander': (
    customValue: string,
  ) =>
    `Native Hawaiian / Other Pacific Islander[Other Pacific Islander:${customValue}]`,
  'nativeHawaiianOtherPacificIslander-samoan':
    'Native Hawaiian / Other Pacific Islander[Samoan]',
  'asian-vietnamese': 'Asian[Vietnamese]',
  white: 'White',
};
