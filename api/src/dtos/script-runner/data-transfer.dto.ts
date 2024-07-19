import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class DataTransferDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  connectionString: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  jurisdiction: string;
}
