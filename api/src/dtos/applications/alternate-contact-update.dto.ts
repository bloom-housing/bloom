import { AddressUpdate } from '../addresses/address-update.dto';
import { AlternateContact } from './alternate-contact.dto';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class AlternateContactUpdate extends OmitType(AlternateContact, [
  'id',
  'address',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiProperty({ type: AddressUpdate })
  address: AddressUpdate;
}
