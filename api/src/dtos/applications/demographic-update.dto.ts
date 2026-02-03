import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Demographic } from './demographic.dto';
import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { ValidationsGroupsEnum } from '../../../src/enums/shared/validation-groups-enum';

export class DemographicUpdate extends OmitType(Demographic, ['id']) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;
}
