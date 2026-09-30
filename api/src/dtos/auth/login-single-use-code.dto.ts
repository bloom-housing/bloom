import { IsBoolean, IsEmail, IsString, MaxLength } from 'class-validator';
import { Expose } from 'class-transformer';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginViaSingleUseCode {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @ApiProperty()
  email: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  singleUseCode: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  agreedToTermsOfService?: boolean;
}
