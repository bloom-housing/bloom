import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AddressCreate } from '../addresses/address-create.dto';
import { Applicant } from './applicant.dto';

export class ApplicantUpdate extends OmitType(Applicant, [
  'id',
  'createdAt',
  'updatedAt',
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
