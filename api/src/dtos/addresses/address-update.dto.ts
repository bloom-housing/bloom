import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Address } from './address.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class AddressUpdate extends OmitType(Address, [
  'id',
  'createdAt',
  'updatedAt',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;
}
