import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class EmailAndAppUrl {
  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  @EnforceLowerCase()
  email: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: false })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  appUrl?: string;
}
