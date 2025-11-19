import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class APIFilters {
  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['1', '2', '3', '4+'],
    description: 'Filter by household size categories',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  householdSize?: string[] | null;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 30000,
    description: 'Minimum household income in USD',
  })
  @IsOptional()
  @IsNumber({}, { message: 'minIncome must be a valid number' })
  @Min(0, { message: 'minIncome cannot be negative' })
  minIncome?: number | null;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 120000,
    description: 'Maximum household income in USD',
  })
  @IsOptional()
  @IsNumber({}, { message: 'maxIncome must be a valid number' })
  @Min(0, { message: 'maxIncome cannot be negative' })
  maxIncome?: number | null;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['0-30 AMI', '31-50 AMI', '51-80 AMI', '81-120 AMI'],
    description: 'Area Median Income level categories',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amiLevels?: string[] | null;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['Section 8', 'VASH', 'None'],
    description: 'Housing voucher or subsidy status',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  voucherStatuses?: string[] | null;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: [
      'Wheelchair Accessible',
      'Hearing Impaired',
      'Vision Impaired',
      'None',
    ],
    description: 'Accessibility accommodation types',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessibilityTypes?: string[] | null;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['Asian', 'Black or African American', 'White', 'Other'],
    description: 'Racial categories for filtering',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  races?: string[] | null;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['Hispanic or Latino', 'Not Hispanic or Latino'],
    description: 'Ethnicity categories for filtering',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ethnicities?: string[] | null;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['Alameda County', 'San Francisco County', 'Contra Costa County'],
    description: 'Counties where applicants currently reside',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicantResidentialCounties?: string[] | null;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['Alameda County', 'San Francisco County'],
    description: 'Counties where applicants work',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicantWorkCounties?: string[] | null;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 18,
    description: 'Minimum age of applicant',
  })
  @IsOptional()
  @IsNumber({}, { message: 'minAge must be a valid number' })
  @Min(0, { message: 'minAge cannot be negative' })
  @Max(150, { message: 'minAge cannot exceed 150' })
  minAge?: number | null;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 65,
    description: 'Maximum age of applicant',
  })
  @IsOptional()
  @IsNumber({}, { message: 'maxAge must be a valid number' })
  @Min(0, { message: 'maxAge cannot be negative' })
  @Max(150, { message: 'maxAge cannot exceed 150' })
  maxAge?: number | null;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: '2023-01-01T00:00:00.000Z',
    description: 'Start date for filtering applications (ISO 8601 format)',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'startDate must be a valid ISO 8601 date string' },
  )
  startDate?: string | null;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: '2023-12-31T23:59:59.999Z',
    description: 'End date for filtering applications (ISO 8601 format)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid ISO 8601 date string' })
  endDate?: string | null;
}
