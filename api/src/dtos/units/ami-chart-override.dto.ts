import { AbstractDTO } from '../shared/abstract.dto';
import { Expose, Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AmiChartOverrideItem } from './ami-chart-override-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UnitAmiChartOverride extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AmiChartOverrideItem)
  @ApiProperty({ isArray: true, type: AmiChartOverrideItem })
  items: AmiChartOverrideItem[];
}
