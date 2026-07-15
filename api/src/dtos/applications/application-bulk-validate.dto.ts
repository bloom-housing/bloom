import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, MinLength } from 'class-validator';
import { ValidationsGroupsEnum } from 'src/enums/shared/validation-groups-enum';

export class ApplicationBulkValidate {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MinLength(1, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  s3Key: string;
}
