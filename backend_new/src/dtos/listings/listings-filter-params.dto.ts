import { BaseFilter } from '../shared/base-filter.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingFilterKeys } from '../../enums/listings/filter-key-enum';
import { ListingsStatusEnum } from '@prisma/client';

export class ListingFilterParams extends BaseFilter {
  @Expose()
  @ApiProperty({
    example: 'Coliseum',
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.name]?: string;

  @Expose()
  @ApiProperty({
    enum: ListingsStatusEnum,
    enumName: 'ListingStatusEnum',
    example: 'active',
    required: false,
  })
  @IsEnum(ListingsStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.status]?: ListingsStatusEnum;

  @Expose()
  @ApiProperty({
    example: 'Fox Creek',
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.neighborhood]?: string;

  @Expose()
  @ApiProperty({
    example: '3',
    required: false,
  })
  @IsNumberString({}, { groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.bedrooms]?: number;

  @Expose()
  @ApiProperty({
    example: '48211',
    required: false,
  })
  [ListingFilterKeys.zipcode]?: string;

  @Expose()
  @ApiProperty({
    example: 'FAB1A3C6-965E-4054-9A48-A282E92E9426',
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.leasingAgents]?: string;

  @Expose()
  @ApiProperty({
    example: 'bab6cb4f-7a5a-4ee5-b327-0c2508807780',
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [ListingFilterKeys.jurisdiction]?: string;
}
