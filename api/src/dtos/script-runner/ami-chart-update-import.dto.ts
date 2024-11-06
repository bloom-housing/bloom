import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';
import { AmiChartImportDTO } from './ami-chart-import.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class AmiChartUpdateImportDTO extends OmitType(AmiChartImportDTO, [
  'jurisdictionId',
  'name',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  amiId: string;
}
