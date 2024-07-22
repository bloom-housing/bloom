import { BaseFilter } from '../shared/base-filter.dto';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumberString,
  IsString,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingFilterKeys } from '../../enums/listings/filter-key-enum';
import { ListingsStatusEnum } from '@prisma/client';
import { FilterAvailabilityEnum } from '../../enums/listings/filter-availability-enum';

export class ListingFilterParams extends BaseFilter {
  @Expose()
  @ApiPropertyOptional({
    example: 'Coliseum',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.name]?: string;

  @Expose()
  @ApiPropertyOptional({
    enum: ListingsStatusEnum,
    enumName: 'ListingsStatusEnum',
    example: 'active',
  })
  @IsEnum(ListingsStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.status]?: ListingsStatusEnum;

  @Expose()
  @ApiPropertyOptional({
    example: 'Fox Creek',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.neighborhood]?: string;

  @Expose()
  @ApiPropertyOptional({
    example: '3',
  })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.bedrooms]?: number;

  @Expose()
  @ApiPropertyOptional({
    example: '3',
  })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.bathrooms]?: number;

  @Expose()
  @ApiPropertyOptional({
    example: '48211',
  })
  [ListingFilterKeys.zipcode]?: string;

  @Expose()
  @ApiPropertyOptional({
    example: 'FAB1A3C6-965E-4054-9A48-A282E92E9426',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.leasingAgents]?: string;

  @Expose()
  @ApiPropertyOptional({
    example: 'bab6cb4f-7a5a-4ee5-b327-0c2508807780',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.jurisdiction]?: string;

  @Expose()
  @ApiPropertyOptional({
    type: Boolean,
    example: false,
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform((params: TransformFnParams) => {
    switch (params.value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return undefined;
    }
  })
  [ListingFilterKeys.isExternal]?: boolean;

  @Expose()
  @ApiPropertyOptional({
    enum: FilterAvailabilityEnum,
    enumName: 'FilterAvailabilityEnum',
    example: 'waitlistOpen',
  })
  @IsEnum(FilterAvailabilityEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  [ListingFilterKeys.availability]?: FilterAvailabilityEnum;

  @Expose()
  @ApiPropertyOptional({
    type: String,
    example: 'San Jose',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.city]?: string;

  @Expose()
  @ApiPropertyOptional({
    type: Number,
    example: '1000',
  })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.monthlyRent]?: number;

  @Expose()
  @ApiPropertyOptional({
    type: Array,
    example: ['Santa Clara'],
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.counties]?: string[];
}
