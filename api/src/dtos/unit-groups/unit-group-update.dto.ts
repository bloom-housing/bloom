import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IdDTO } from '../shared/id.dto';
import { IsEnum, IsString, IsUUID, ValidateNested } from 'class-validator';
import { UnitGroupAmiLevelUpdate } from './unit-group-ami-level-update.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { UnitAccessibilityPriorityTypeEnum } from '../../enums/units/accessibility-priority-type-enum';
import UnitGroup from './unit-group.dto';

export class UnitGroupUpdate extends OmitType(UnitGroup, [
  'createdAt',
  'id',
  'accessibilityPriorityType',
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
  @IsEnum(UnitAccessibilityPriorityTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: UnitAccessibilityPriorityTypeEnum,
    enumName: 'UnitAccessibilityPriorityTypeEnum',
  })
  accessibilityPriorityType?: UnitAccessibilityPriorityTypeEnum;

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
