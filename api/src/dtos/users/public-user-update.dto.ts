import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { User } from './user.dto';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { passwordRegex } from '../../utilities/password-regex';
import { IdDTO } from '../shared/id.dto';

export class PublicUserUpdate extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'dob',
  'passwordUpdatedAt',
  'passwordValidForDays',
  'passwordUpdatedAt',
  'jurisdictions',
] as const) {
  /* Fields inherited from BaseUser:
   * - firstName (inherited as required from BaseUser)
   * - middleName (inherited as optional from BaseUser)
   * - lastName (inherited as required from BaseUser)
   * - email (inherited as required from BaseUser)
   **/

  @Expose()
  @Type(() => Date)
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  dob: Date;

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
