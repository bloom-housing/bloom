import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

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
    description: 'Filter by household size',
  })
  @IsArray()
  @IsOptional()
  householdSize?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 30000,
    description: 'Minimum income',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minIncome?: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 100000,
    description: 'Maximum income',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxIncome?: number;

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['0-30% AMI', '31-50% AMI'],
    description: 'Filter by AMI levels',
  })
  @IsArray()
  @IsOptional()
  amiLevels?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['yes', 'no'],
    description: 'Filter by voucher statuses',
  })
  @IsArray()
  @IsOptional()
  voucherStatuses?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['mobility', 'hearing'],
    description: 'Filter by accessibility types',
  })
  @IsArray()
  @IsOptional()
  accessibilityTypes?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['Asian', 'White'],
    description: 'Filter by races',
  })
  @IsArray()
  @IsOptional()
  races?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['Hispanic or Latino', 'Not Hispanic or Latino'],
    description: 'Filter by ethnicities',
  })
  @IsArray()
  @IsOptional()
  ethnicities?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['San Francisco County', 'Alameda County'],
    description: 'Filter by applicant residential counties',
  })
  @IsArray()
  @IsOptional()
  applicantResidentialCounties?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: [String],
    example: ['San Francisco County', 'Alameda County'],
    description: 'Filter by applicant work counties',
  })
  @IsArray()
  @IsOptional()
  applicantWorkCounties?: string[];

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 18,
    description: 'Minimum age',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  minAge?: number;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: 65,
    description: 'Maximum age',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  maxAge?: number;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: '2025-01-01',
    description: 'Start date for filtering',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  startDate?: string;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: '2025-06-30',
    description: 'End date for filtering',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsOptional()
  endDate?: string;
}
