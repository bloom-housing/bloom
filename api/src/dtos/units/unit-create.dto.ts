import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UnitAmiChartOverrideCreate } from './ami-chart-override-create.dto';
import { UnitUpdate } from './unit-update.dto';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UnitCreate extends OmitType(UnitUpdate, [
  'id',
  'unitAmiChartOverrides',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverrideCreate)
  @ApiPropertyOptional({ type: UnitAmiChartOverrideCreate })
  unitAmiChartOverrides?: UnitAmiChartOverrideCreate;
}
