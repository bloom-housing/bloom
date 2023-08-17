import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsDefined,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingEventsTypeEnum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDTO } from '../shared/abstract.dto';
import { Asset } from '../assets/asset.dto';

export class ListingEvent extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingEventsTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingEventsTypeEnum,
    enumName: 'ListingEventsTypeEnum',
    required: true,
  })
  type: ListingEventsTypeEnum;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty({ required: false })
  startDate?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty({ required: false })
  startTime?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty({ required: false })
  endTime?: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  url?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  note?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  label?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  @ApiProperty({ required: false, type: Asset })
  assets?: Asset;
}
