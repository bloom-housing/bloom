import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AddressCreate } from '../addresses/address-create.dto';
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
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate })
  householdMemberAddress: AddressCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate })
  householdMemberWorkAddress: AddressCreate;
}
