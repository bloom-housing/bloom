import { IsString, Matches, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { passwordRegex } from '../../utilities/password-regex';
import { ApiProperty } from '@nestjs/swagger';

export class Confirm {
  @Expose()
  @ApiProperty()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  token: string;

  @Expose()
  @ApiProperty({ required: false })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(passwordRegex, {
    message: 'passwordTooWeak',
    groups: [ValidationsGroupsEnum.default],
  })
  password?: string;
}
