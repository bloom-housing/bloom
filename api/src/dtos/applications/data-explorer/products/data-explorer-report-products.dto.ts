import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsObject } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../enums/shared/validation-groups-enum';
import { AccessibilityFrequency } from './frequency/accessibility-frequency.dto';
import { AgeFrequency } from './frequency/age-frequency.dto';
import { EthnicityFrequency } from './frequency/ethnicity-frequency.dto';
import { LanguageFrequency } from './frequency/language-frequency.dto';
import { LocationFrequency } from './frequency/location-frequency.dto';
import { RaceFrequency } from './frequency/race-frequency.dto';
import { SubsidyFrequency } from './frequency/subsidy-frequency.dto';

export class ReportProducts {
  @Expose()
  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'object',
      additionalProperties: {
        type: 'number',
      },
    },
    example: {
      '1': {
        '0-30 AMI': 45,
        '31-50 AMI': 78,
        '51-80 AMI': 92,
        '81-120 AMI': 34,
      },
      '2': {
        '0-30 AMI': 67,
        '31-50 AMI': 89,
        '51-80 AMI': 112,
        '81-120 AMI': 56,
      },
      '3': {
        '0-30 AMI': 82,
        '31-50 AMI': 95,
        '51-80 AMI': 78,
        '81-120 AMI': 45,
      },
      '4+': {
        '0-30 AMI': 93,
        '31-50 AMI': 88,
        '51-80 AMI': 65,
        '81-120 AMI': 40,
      },
    },
    description:
      'Cross-tabulation of income bands by household size. Keys are household sizes, values are income band distributions.',
  })
  @IsObject({ groups: [ValidationsGroupsEnum.default] })
  incomeHouseholdSizeCrossTab: Record<string, Record<string, number>>;

  @Expose()
  @ApiProperty({
    type: [RaceFrequency],
    description: 'Frequency distribution by race',
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ each: true, groups: [ValidationsGroupsEnum.default] })
  @Type(() => RaceFrequency)
  raceFrequencies: RaceFrequency[];

  @Expose()
  @ApiProperty({
    type: [EthnicityFrequency],
    description: 'Frequency distribution by ethnicity',
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ each: true, groups: [ValidationsGroupsEnum.default] })
  @Type(() => EthnicityFrequency)
  ethnicityFrequencies: EthnicityFrequency[];

  @Expose()
  @ApiProperty({
    type: [SubsidyFrequency],
    description: 'Frequency distribution by subsidy or voucher type',
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ each: true, groups: [ValidationsGroupsEnum.default] })
  @Type(() => SubsidyFrequency)
  subsidyOrVoucherTypeFrequencies: SubsidyFrequency[];

  @Expose()
  @ApiProperty({
    type: [AccessibilityFrequency],
    description: 'Frequency distribution by accessibility type',
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ each: true, groups: [ValidationsGroupsEnum.default] })
  @Type(() => AccessibilityFrequency)
  accessibilityTypeFrequencies: AccessibilityFrequency[];

  @Expose()
  @ApiProperty({
    type: [AgeFrequency],
    description: 'Frequency distribution by age range',
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ each: true, groups: [ValidationsGroupsEnum.default] })
  @Type(() => AgeFrequency)
  ageFrequencies: AgeFrequency[];

  @Expose()
  @ApiProperty({
    type: [LocationFrequency],
    description: 'Frequency distribution by residential location',
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ each: true, groups: [ValidationsGroupsEnum.default] })
  @Type(() => LocationFrequency)
  residentialLocationFrequencies: LocationFrequency[];

  @Expose()
  @ApiProperty({
    type: [LanguageFrequency],
    description: 'Frequency distribution by language preference',
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ each: true, groups: [ValidationsGroupsEnum.default] })
  @Type(() => LanguageFrequency)
  languageFrequencies: LanguageFrequency[];
}
