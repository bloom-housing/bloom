import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AddressUpdate } from '../addresses/address-update.dto';
import { HouseholdMember } from './household-member.dto';

export class HouseholdMemberUpdate extends OmitType(HouseholdMember, [
  'id',
  'createdAt',
  'updatedAt',
  'householdMemberAddress',
  'householdMemberWorkAddress',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiProperty({ type: AddressUpdate })
  householdMemberAddress: AddressUpdate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiProperty({ type: AddressUpdate })
  householdMemberWorkAddress: AddressUpdate;
}
