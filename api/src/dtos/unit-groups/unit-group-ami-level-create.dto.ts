import { OmitType } from '@nestjs/swagger';
import { UnitGroupAmiLevelUpdate } from './unit-group-ami-level-update.dto';

export class UnitGroupAmiLevelCreate extends OmitType(UnitGroupAmiLevelUpdate, [
  'id',
]) {}
