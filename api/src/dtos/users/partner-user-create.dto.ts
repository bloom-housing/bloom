import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { PartnerUserUpdate } from './partner-user-update.dto';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { passwordRegex } from 'src/utilities/password-regex';
import { Match } from '../../decorators/match-decorator';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';

export class PartnerUserCreate extends OmitType(PartnerUserUpdate, [
  'id',
  'newEmail',
  'password',
  'currentPassword',
] as const) {
  /* Fields inherited from PartnerUserUpdate:
   * - firstName (inherited as required from PartnerUserUpdate)
   * - lastName (inherited as required from PartnerUserUpdate)
   * - email (inherited as required from PartnerUserUpdate)
   * - userRoles (inherited as required from PartnerUserUpdate)
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
