import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class CreatePresignedUploadMetadata {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  parametersToSign: Record<string, string>;
}
