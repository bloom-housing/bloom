import { AddressCreate } from '../addresses/address-create.dto';
import { AlternateContactUpdate } from './alternate-contact-update.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class AlternateContactCreate extends OmitType(AlternateContactUpdate, [
  'id',
  'address',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate })
  address: AddressCreate;
}
