import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

/*
  this DTO is used to take in a user's email address and the url from which the user is sending the api request
  the url is option as each endpoint handles a default case for this
*/
export class EmailAndAppUrl {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @EnforceLowerCase()
  email: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl?: string;
}
