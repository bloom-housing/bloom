import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UnsubscribeAllDto {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  email: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  sig: string;
}
