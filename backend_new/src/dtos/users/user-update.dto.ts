import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { User } from './user.dto';

import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { passwordRegex } from '../../utilities/password-regex';

export class UserUpdate extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'email',
  'mfaEnabled',
  'passwordUpdatedAt',
  'passwordValidForDays',
  'lastLoginAt',
  'failedLoginAttemptsCount',
  'confirmedAt',
  'lastLoginAt',
  'phoneNumberVerified',
  'agreedToTermsOfService',
  'hitConfirmationURL',
  'activeAccessToken',
  'activeRefreshToken',
]) {
  @Expose()
  @ApiProperty({ required: false })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  email?: string;

  @Expose()
  @ApiProperty({ required: false })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  newEmail?: string;

  @Expose()
  @ApiProperty({ required: false })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(passwordRegex, {
    message: 'passwordTooWeak',
    groups: [ValidationsGroupsEnum.default],
  })
  password?: string;

  @Expose()
  @ValidateIf((o) => o.password, { groups: [ValidationsGroupsEnum.default] })
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  currentPassword?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  appUrl?: string;
}
