import { AbstractDTO } from '../shared/abstract.dto';
import { Expose, Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AmiChartItem } from './ami-chart-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UnitAmiChartOverride extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AmiChartItem)
  @ApiProperty({ required: true, isArray: true, type: AmiChartItem })
  items: AmiChartItem[];
}
