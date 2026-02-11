import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { AdvocateUserUpdate } from './advocate-user-update.dto';
import { IsEmail, IsString, Matches, MaxLength } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { passwordRegex } from 'src/utilities/password-regex';
import { Match } from '../../decorators/match-decorator';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { Expose } from 'class-transformer';

export class AdvocateUserCreate extends OmitType(AdvocateUserUpdate, [
  'id',
  'newEmail',
  'currentPassword',
  'password',
  'title',
  'phoneNumber',
  'phoneType',
  'phoneExtension',
  'additionalPhoneNumber',
  'additionalPhoneNumberType',
  'additionalPhoneExtension',
] as const) {
  /* Fields inherited from AdvocateUserUpdate:
   * - firstName (inherited as required from AdvocateUserUpdate)
   * - middleName (inherited as optional from AdvocateUserUpdate)
   * - lastName (inherited as required from AdvocateUserUpdate)
   * - agency (inherited as required from AdvocateUserUpdate)
   * - email (inherited as required from AdvocateUserUpdate)
   **/
}
