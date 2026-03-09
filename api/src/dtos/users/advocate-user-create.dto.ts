import { OmitType } from '@nestjs/swagger';
import { AdvocateUserUpdate } from './advocate-user-update.dto';
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
