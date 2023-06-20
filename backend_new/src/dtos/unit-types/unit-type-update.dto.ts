import { OmitType } from '@nestjs/swagger';
import { UnitType } from './unit-type.dto';

export class UnitTypeUpdate extends OmitType(UnitType, [
  'createdAt',
  'updatedAt',
]) {}
