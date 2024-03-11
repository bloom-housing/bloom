import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class RequestMfaCodeResponse {
  @Expose()
  @IsPhoneNumber('US', { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  phoneNumber?: string;

  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @ApiPropertyOptional()
  email?: string;

  @Expose()
  @ApiPropertyOptional()
  phoneNumberVerified?: boolean;
}
