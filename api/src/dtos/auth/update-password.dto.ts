import { IsBoolean, IsString, Matches, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { passwordRegex } from '../../utilities/password-regex';
import { Match } from '../../decorators/match-decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePassword {
  @Expose()
  @ApiProperty()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Matches(passwordRegex, {
    message: 'passwordTooWeak',
    groups: [ValidationsGroupsEnum.default],
  })
  password: string;

  @Expose()
  @ApiProperty()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @Match('password')
  passwordConfirmation: string;

  @Expose()
  @ApiProperty()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  token: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  agreedToTermsOfService?: boolean;
}
