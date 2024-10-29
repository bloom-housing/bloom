import { Expose } from 'class-transformer';
import { IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ListingMapMarker {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  id: string;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  lat: number;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  lng: number;
}
