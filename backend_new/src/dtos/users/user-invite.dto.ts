import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail } from 'class-validator';
import { UserUpdate } from './user-update.dto';

import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UserInvite extends OmitType(UserUpdate, [
  'id',
  'password',
  'currentPassword',
  'email',
]) {
  @Expose()
  @ApiProperty({ required: true })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  email: string;
}
