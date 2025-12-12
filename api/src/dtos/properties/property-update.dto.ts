import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import Property from './property.dto';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class PropertyUpdate extends OmitType(Property, [
  'createdAt',
  'updatedAt',
  'name',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  name?: string;
}
