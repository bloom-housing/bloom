import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';

export class ReportFilters {
  @Expose()
  @ApiProperty({
    type: String,
    example: '01/01/2025 - 06/30/2025',
    description: 'Date range for the report',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  dateRange: string;
}

export class FrequencyData {
  @Expose()
  @ApiProperty({
    type: Number,
    example: 120,
    description: 'Count of occurrences',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  count: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 0.1,
    description: 'Percentage of total',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  percentage?: number;
}

export class RaceFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Asian',
    description: 'Race category',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  race: string;
}

export class EthnicityFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Hispanic or Latino',
    description: 'Ethnicity category',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  ethnicity: string;
}

export class SubsidyFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Section 8',
    description: 'Subsidy or voucher type',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  subsidyType: string;
}

export class AccessibilityFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Wheelchair Accessible',
    description: 'Accessibility type',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  accessibilityType: string;
}

export class AgeFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: '25-34',
    description: 'Age range',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  age: string;
}

export class LocationFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Oakland',
    description: 'Residential location',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  location: string;
}

export class LanguageFrequency extends FrequencyData {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'English',
    description: 'Language preference',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  language: string;
}

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

export class DataExplorerReport extends AbstractDTO {
  @Expose()
  @ApiProperty({
    type: ReportFilters,
    description: 'Filters applied to generate this report',
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ReportFilters)
  reportFilters: ReportFilters;

  @Expose()
  @ApiProperty({
    type: Number,
    example: 1200,
    description: 'Total number of processed applications',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  totalProcessedApplications: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 1200,
    description: 'Total number of applicants',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  totalApplicants?: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 5,
    description: 'Total number of listings',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  totalListings?: number;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    description:
      'Whether the data passes k-anonymity requirements and has no errors',
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  validResponse: boolean;

  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    description:
      'Whether there is sufficient data for analysis (alias for validResponse)',
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  isSufficient: boolean;

  @Expose()
  @ApiProperty({
    type: Number,
    example: 10,
    description: 'K-anonymity score for the dataset',
  })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  kAnonScore: number;

  @Expose()
  @ApiProperty({
    type: ReportProducts,
    description:
      'Report data products containing various frequency distributions',
  })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ReportProducts)
  products: ReportProducts;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: [],
    description: 'Any errors encountered during report generation',
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ each: true, groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  reportErrors?: string[];
}
