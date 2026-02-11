import { OmitType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from './user.dto';
import { Expose, Type } from 'class-transformer';
import { UserRole } from './user-role.dto';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { passwordRegex } from '../../utilities/password-regex';

export class PartnerUserUpdate extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'userRoles',
  'passwordUpdatedAt',
  'passwordValidForDays',
  'passwordUpdatedAt',
] as const) {
  /* Fields inherited from User:
   * - firstName (inherited as required from User)
   * - lastName (inherited as required from User)
   * - email (inherited as required from User)
   **/

  @Expose()
  @Type(() => UserRole)
  @ApiProperty({ type: UserRole })
  userRoles: UserRole;

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
}
