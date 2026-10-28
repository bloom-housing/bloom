import { AddressCreate } from '../addresses/address-create.dto';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { HouseholdMember } from './household-member.dto';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class HouseholdMemberCreate extends OmitType(HouseholdMember, [
  'id',
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
  @ApiPropertyOptional({ type: AddressCreate })
  householdMemberWorkAddress?: AddressCreate;
}
