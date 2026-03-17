import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class CreateS3UploadMetadata {
  @Expose()
  @ApiProperty()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  contentType: string;

  @Expose()
  @ApiProperty()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  contentDisposition: string;
}
