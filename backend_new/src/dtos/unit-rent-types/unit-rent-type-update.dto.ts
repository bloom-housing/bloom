import { OmitType } from '@nestjs/swagger';
import { UnitRentType } from './unit-rent-type.dto';

export class UnitRentTypeUpdate extends OmitType(UnitRentType, [
  'createdAt',
  'updatedAt',
]) {}
