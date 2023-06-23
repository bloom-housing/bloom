import { OmitType } from '@nestjs/swagger';
import { UnitTypeUpdate } from './unit-type-update.dto';

export class UnitTypeCreate extends OmitType(UnitTypeUpdate, ['id']) {}
