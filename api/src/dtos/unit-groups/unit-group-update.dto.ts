import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IdDTO } from '../shared/id.dto';
import { IsString, IsUUID, ValidateNested } from 'class-validator';
import { UnitGroupAmiLevelUpdate } from './unit-group-ami-level-update.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import UnitGroup from './unit-group.dto';

export class UnitGroupUpdate extends OmitType(UnitGroup, [
  'createdAt',
  'id',
  'unitAccessibilityPriorityTypes',
  'unitGroupAmiLevels',
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
  unitAccessibilityPriorityTypes?: IdDTO;

  @Expose()
  @Type(() => IdDTO)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional({ type: [IdDTO] })
  unitTypes?: IdDTO[];

  @Expose()
  @Type(() => UnitGroupAmiLevelUpdate)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional({ type: [UnitGroupAmiLevelUpdate] })
  unitGroupAmiLevels?: UnitGroupAmiLevelUpdate[];
}
