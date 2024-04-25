import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsDefined,
  IsString,
  ValidateNested,
  ValidateIf,
  IsUrl,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingEventsTypeEnum } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDTO } from '../shared/abstract.dto';
import { Asset } from '../assets/asset.dto';

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
  @ApiPropertyOptional()
  startDate?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  startTime?: Date;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  endTime?: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @ValidateIf((o) => o.url && o.url.length > 0, {
    groups: [ValidationsGroupsEnum.default],
  })
  @IsUrl(
    { require_protocol: true },
    { groups: [ValidationsGroupsEnum.default] },
  )
  url?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  note?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  label?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  @ApiPropertyOptional({ type: Asset })
  assets?: Asset;
}
