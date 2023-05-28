import { OmitType } from '@nestjs/swagger';
import { UnitRentType } from './unit-rent-type-get.dto';

export class UnitRentTypeCreate extends OmitType(UnitRentType, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
