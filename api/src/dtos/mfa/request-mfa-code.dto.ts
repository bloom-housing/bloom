import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsPhoneNumber, IsEnum } from 'class-validator';
import { MfaType } from '../../enums/mfa/mfa-type-enum';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class RequestMfaCode {
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
  @IsEnum(MfaType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: MfaType, enumName: 'MfaType' })
  mfaType: MfaType;

  @Expose()
  @IsPhoneNumber('US', { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  phoneNumber?: string;
}
