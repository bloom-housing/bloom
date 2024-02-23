import { OmitType } from '@nestjs/swagger';
import { UnitRentTypeUpdate } from './unit-rent-type-update.dto';

export class UnitRentTypeCreate extends OmitType(UnitRentTypeUpdate, ['id']) {}
