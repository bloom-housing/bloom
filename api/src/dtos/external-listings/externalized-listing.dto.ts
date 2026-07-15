import { Type, Expose } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IdDTO } from '../shared/id.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ExternalizedListing extends IdDTO {
  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  contentUpdatedAt: Date;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  jurisdictionId: string;
}
