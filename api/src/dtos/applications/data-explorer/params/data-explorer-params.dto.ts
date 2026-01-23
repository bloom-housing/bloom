import { Expose, Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../../../enums/shared/validation-groups-enum';

class DateRangeFilter {
  @IsOptional()
  @IsString()
  preset?: 'day' | 'week' | 'month' | 'year';

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;
}

class HouseholdSizeFilter {
  @IsOptional()
  min?: number;

  @IsOptional()
  max?: number;
}

class HouseholdIncomeFilter {
  @IsOptional()
  min?: number;

  @IsOptional()
  max?: number;
}

class HouseholdFilter {
  @IsOptional()
  @ValidateNested()
  @Type(() => HouseholdSizeFilter)
  household_size?: HouseholdSizeFilter;

  @IsOptional()
  @ValidateNested()
  @Type(() => HouseholdIncomeFilter)
  household_income?: HouseholdIncomeFilter;

  @IsOptional()
  household_ami?: string[];

  @IsOptional()
  income_vouchers?: boolean;

  @IsOptional()
  accessibility?: string[];
}

class AgeFilter {
  @IsOptional()
  min?: number;

  @IsOptional()
  max?: number;
}

class DemographicsFilter {
  @IsOptional()
  race?: string[];

  @IsOptional()
  ethnicity?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => AgeFilter)
  age?: AgeFilter;
}

class GeographyFilter {
  @IsOptional()
  cities?: string[];

  @IsOptional()
  census_tracts?: string[];

  @IsOptional()
  zip_codes?: string[];
}

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
    type: 'object',
    description:
      'Date range filter with start_date and end_date in ISO 8601 format',
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DateRangeFilter)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  date_range?: DateRangeFilter;

  @Expose()
  @ApiPropertyOptional({
    type: 'object',
    description:
      'Household filters including size, income, vouchers, and accessibility',
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => HouseholdFilter)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  household?: HouseholdFilter;

  @Expose()
  @ApiPropertyOptional({
    type: 'object',
    description: 'Demographics filters including race, ethnicity, and age',
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DemographicsFilter)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  demographics?: DemographicsFilter;

  @Expose()
  @ApiPropertyOptional({
    type: 'object',
    description:
      'Geography filters including cities, census tracts, and zip codes',
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GeographyFilter)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  geography?: GeographyFilter;
}
