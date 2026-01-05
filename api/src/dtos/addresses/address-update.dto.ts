import { Address } from './address.dto';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class AddressUpdate extends OmitType(Address, [
  'createdAt',
  'id',
  'updatedAt',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;
}
