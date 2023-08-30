import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AddressUpdate } from '../addresses/address-update.dto';
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
  @Type(() => AddressUpdate)
  @ApiProperty({ type: AddressUpdate })
  applicantAddress: AddressUpdate;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiProperty({ type: AddressUpdate })
  applicantWorkAddress: AddressUpdate;
}
