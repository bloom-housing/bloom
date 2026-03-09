import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { PublicUserUpdate } from './public-user-update.dto';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { passwordRegex } from '../../utilities/password-regex';
import { Match } from '../../decorators/match-decorator';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';

export class PublicUserCreate extends OmitType(PublicUserUpdate, [
  'id',
  'newEmail',
  'password',
  'currentPassword',
] as const) {
  /* Fields inherited from PublicUserUpdate:
   * - firstName (inherited as required from PublicUserUpdate)
   * - middleName (inherited as optional from PublicUserUpdate)
   * - lastName (inherited as required from PublicUserUpdate)
   * - email (inherited as required from PublicUserUpdate)
   * - dob (inherited as required from PublicUserUpdate)
   **/

  @Expose()
  @ApiProperty()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(passwordRegex, {
    message: 'passwordTooWeak',
    groups: [ValidationsGroupsEnum.default],
  })
  password: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @Match('password', { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  passwordConfirmation: string;

  @Expose()
  @ApiPropertyOptional()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @Match('email', { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  emailConfirmation?: string;
}
