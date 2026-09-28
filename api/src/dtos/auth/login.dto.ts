import { IsEmail, IsString, MaxLength, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { MfaType } from '../../enums/mfa/mfa-type-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Login {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @ApiProperty()
  email: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  password: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  mfaCode?: string;

  @Expose()
  @IsEnum(MfaType, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ enum: MfaType, enumName: 'MfaType' })
  mfaType?: MfaType;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  reCaptchaToken?: string;
}
