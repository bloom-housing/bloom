import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AddressUpdate } from '../addresses/address-update.dto';
import { AlternateContact } from './alternate-contact.dto';

export class AlternateContactUpdate extends OmitType(AlternateContact, [
  'id',
  'createdAt',
  'updatedAt',
  'address',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiProperty({ type: AddressUpdate })
  address: AddressUpdate;
}
