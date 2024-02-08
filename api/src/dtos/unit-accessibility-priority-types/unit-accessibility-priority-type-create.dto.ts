import { OmitType } from '@nestjs/swagger';
import { UnitAccessibilityPriorityTypeUpdate } from './unit-accessibility-priority-type-update.dto';

export class UnitAccessibilityPriorityTypeCreate extends OmitType(
  UnitAccessibilityPriorityTypeUpdate,
  ['id'],
) {}
