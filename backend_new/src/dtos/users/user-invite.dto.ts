import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  ValidateNested,
} from 'class-validator';
import { UserUpdate } from './user-update.dto';

import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { IdDTO } from '../shared/id.dto';

export class UserInvite extends OmitType(UserUpdate, [
  'id',
  'password',
  'currentPassword',
  'email',
  'agreedToTermsOfService',
  'jurisdictions',
]) {
  @Expose()
  @ApiProperty()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  email: string;

  @Expose()
  @Type(() => IdDTO)
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMinSize(1, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiProperty({ type: IdDTO, isArray: true })
  jurisdictions: IdDTO[];
}
