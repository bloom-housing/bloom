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
import { Asset } from '../assets/asset-get.dto';

export class ListingEvent extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingEventsTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ListingEventsTypeEnum,
    enumName: 'ListingEventsTypeEnum',
  })
  type: ListingEventsTypeEnum;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  startDate?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  startTime?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  endTime?: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  url?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  note?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  label?: string | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  assets?: Asset;
}
