import { AddressUpdate } from '../addresses/address-update.dto';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { HouseholdMember } from './household-member.dto';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class HouseholdMemberUpdate extends OmitType(HouseholdMember, [
  'id',
  'householdMemberAddress',
  'householdMemberWorkAddress',
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
  householdMemberAddress: AddressUpdate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiPropertyOptional({ type: AddressUpdate })
  householdMemberWorkAddress?: AddressUpdate;
}
