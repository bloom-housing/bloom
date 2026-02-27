import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { User } from './user.dto';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { passwordRegex } from '../../utilities/password-regex';
import { AddressUpdate } from '../addresses/address-update.dto';
import { IdDTO } from '../shared/id.dto';

export class AdvocateUserUpdate extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'agency',
  'address',
  'phoneNumber',
  'passwordUpdatedAt',
  'passwordValidForDays',
  'passwordUpdatedAt',
  'jurisdictions',
  'isAdvocate',
] as const) {
  /* Fields inherited from BaseUser:
   * - firstName (inherited as required from BaseUser)
   * - middleName (inherited as optional from BaseUser)
   * - lastName (inherited as required from BaseUser)
   * - email (inherited as required from BaseUser)
   * - title (inherited as optional from BaseUserUpdate)
   * - phoneExtension (inherited as optional from BaseUserUpdate)
   * - additionalPhoneNumber (inherited as optional from BaseUserUpdate)
   * - additionalPhoneNumberType (inherited as optional from BaseUserUpdate)
   * - additionalPhoneExtension (inherited as optional from BaseUserUpdate)
   **/

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO })
  agency: IdDTO;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressUpdate)
  @ApiProperty({ type: AddressUpdate })
  address: AddressUpdate;

  @Expose()
  @IsPhoneNumber('US', { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  phoneNumber: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  phoneType: string;

  @Expose()
  @ApiPropertyOptional()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  newEmail?: string;

  @Expose()
  @ApiPropertyOptional()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(passwordRegex, {
    message: 'passwordTooWeak',
    groups: [ValidationsGroupsEnum.default],
  })
  password?: string;

  @Expose()
  @ValidateIf((o) => o.password, { groups: [ValidationsGroupsEnum.default] })
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  currentPassword?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  appUrl?: string;

  @Expose()
  @Type(() => IdDTO)
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: IdDTO, isArray: true })
  jurisdictions?: IdDTO[];
}
