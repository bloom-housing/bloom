import { Expose, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../enums/shared/validation-groups-enum';

export class DataExplorerParams {
  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'jurisdictionId',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  jurisdictionId?: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'userId',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  userId?: string;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['1', '2', '3', '4+'],
    description: 'Filter by household size categories',
  })
  @IsArray()
  @IsOptional()
  householdSize?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 30000,
    description: 'Minimum household income in USD',
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  minIncome?: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 100000,
    description: 'Maximum household income in USD',
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  maxIncome?: number;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['0-30% AMI', '31-50% AMI'],
    description: 'Area Median Income level categories',
  })
  @IsArray()
  @IsOptional()
  amiLevels?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['yes', 'no'],
    description: 'Housing voucher or subsidy status',
  })
  @IsArray()
  @IsOptional()
  voucherStatuses?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['mobility', 'hearing'],
    description: 'Accessibility accommodation types',
  })
  @IsArray()
  @IsOptional()
  accessibilityTypes?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['Asian', 'White'],
    description: 'Racial categories for filtering',
  })
  @IsArray()
  @IsOptional()
  races?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['Hispanic or Latino', 'Not Hispanic or Latino'],
    description: 'Ethnicity categories for filtering',
  })
  @IsArray()
  @IsOptional()
  ethnicities?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['San Francisco County', 'Alameda County'],
    description: 'Counties where applicants currently reside',
  })
  @IsArray()
  @IsOptional()
  applicantResidentialCounties?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['San Francisco County', 'Alameda County'],
    description: 'Counties where applicants work',
  })
  @IsArray()
  @IsOptional()
  applicantWorkCounties?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 18,
    description: 'Minimum age of applicant',
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(150)
  @IsOptional()
  minAge?: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 65,
    description: 'Maximum age of applicant',
  })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @Max(150)
  @IsOptional()
  maxAge?: number;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: '2025-01-01',
    description: 'Start date for filtering applications (ISO 8601 format)',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  startDate?: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: '2025-06-30',
    description: 'End date for filtering applications (ISO 8601 format)',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  endDate?: string;
}
