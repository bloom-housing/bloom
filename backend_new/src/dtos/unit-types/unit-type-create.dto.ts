import { OmitType } from '@nestjs/swagger';
import { UnitType } from './unit-type-get.dto';

export class UnitTypeCreate extends OmitType(UnitType, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
