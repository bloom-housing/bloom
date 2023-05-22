import { BaseFilter } from '../shared/base-filter.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingFilterKeys } from '../../enums/listings/filter-key-enum';
import { ListingsStatusEnum } from '@prisma/client';

export class ListingFilterParams extends BaseFilter {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'Coliseum',
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.name]?: string;

  @Expose()
  @ApiProperty({
    enum: Object.keys(ListingsStatusEnum),
    example: 'active',
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingsStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.status]?: ListingsStatusEnum;

  @Expose()
  @ApiProperty({
    type: String,
    example: 'Fox Creek',
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.neighborhood]?: string;

  @Expose()
  @ApiProperty({
    type: Number,
    example: '3',
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.bedrooms]?: number;

  @Expose()
  @ApiProperty({
    type: String,
    example: '48211',
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.zipcode]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: 'FAB1A3C6-965E-4054-9A48-A282E92E9426',
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.leasingAgents]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: 'bab6cb4f-7a5a-4ee5-b327-0c2508807780',
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.jurisdiction]?: string;
}
