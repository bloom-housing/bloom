import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UnitGroupAmiLevelCreate } from './unit-group-ami-level-create.dto';
import { UnitGroupUpdate } from './unit-group-update.dto';
import { ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UnitGroupCreate extends OmitType(UnitGroupUpdate, [
  'id',
  'unitGroupAmiLevels',
]) {
  @Expose()
  @Type(() => UnitGroupAmiLevelCreate)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional({ type: [UnitGroupAmiLevelCreate] })
  unitGroupAmiLevels?: UnitGroupAmiLevelCreate[];
}
