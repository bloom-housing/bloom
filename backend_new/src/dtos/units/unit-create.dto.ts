import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ type: IdDTO, required: false })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  unitTypes?: IdDTO;

  @Expose()
  @Type(() => IdDTO)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: IdDTO, required: false })
  amiChart?: IdDTO;

  @Expose()
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO, required: false })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  unitAccessibilityPriorityTypes?: IdDTO;

  @Expose()
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO, required: false })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  unitRentTypes?: IdDTO;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitAmiChartOverrideCreate)
  @ApiProperty({ type: UnitAmiChartOverrideCreate, required: false })
  unitAmiChartOverrides?: UnitAmiChartOverrideCreate;
}
