import { OmitType } from '@nestjs/swagger';
import UnitGroup from './unit-group.dto';

export class UnitGroupCreate extends OmitType(UnitGroup, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
