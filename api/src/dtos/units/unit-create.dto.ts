import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { IdDTO } from '../shared/id.dto';
import { Unit } from './unit.dto';
import { UnitAmiChartOverrideCreate } from './ami-chart-override-create.dto';

export class UnitCreate extends OmitType(Unit, [
  'id',
  'createdAt',
  'updatedAt',
  'amiChart',
  'unitTypes',
  'unitAccessibilityPriorityTypes',
  'unitRentTypes',
  'unitAmiChartOverrides',
]) {
  @Expose()
  @Type(() => IdDTO)
  @ApiPropertyOptional({ type: IdDTO })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  unitTypes?: IdDTO;

  @Expose()
  @Type(() => IdDTO)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ type: IdDTO })
  amiChart?: IdDTO;

  @Expose()
  @Type(() => IdDTO)
  @ApiPropertyOptional({ type: IdDTO })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  unitAccessibilityPriorityTypes?: IdDTO;

  @Expose()
  @Type(() => IdDTO)
  @ApiPropertyOptional({ type: IdDTO })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  unitRentTypes?: IdDTO;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverrideCreate)
  @ApiPropertyOptional({ type: UnitAmiChartOverrideCreate })
  unitAmiChartOverrides?: UnitAmiChartOverrideCreate;
}
