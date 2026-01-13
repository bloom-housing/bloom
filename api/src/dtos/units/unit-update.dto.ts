import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IdDTO } from '../shared/id.dto';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { Unit } from './unit.dto';
import { UnitAmiChartOverrideUpdate } from './ami-chart-override-update.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UnitUpdate extends OmitType(Unit, [
  'amiChart',
  'createdAt',
  'id',
  'unitAccessibilityPriorityTypes',
  'unitAmiChartOverrides',
  'unitRentTypes',
  'unitTypes',
  'updatedAt',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;

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
  @Type(() => UnitAmiChartOverrideUpdate)
  @ApiPropertyOptional({ type: UnitAmiChartOverrideUpdate })
  unitAmiChartOverrides?: UnitAmiChartOverrideUpdate;
}
