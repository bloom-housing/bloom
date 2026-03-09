import { AddressCreate } from '../addresses/address-create.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApplicantUpdate } from './applicant-update.dto';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicantCreate extends OmitType(ApplicantUpdate, [
  'id',
  'applicantAddress',
  'applicantWorkAddress',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate })
  applicantAddress: AddressCreate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate })
  applicantWorkAddress: AddressCreate;
}
