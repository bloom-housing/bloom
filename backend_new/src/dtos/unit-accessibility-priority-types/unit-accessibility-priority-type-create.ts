import { OmitType } from '@nestjs/swagger';
import { UnitAccessibilityPriorityType } from './unit-accessibility-priority-type-get.dto';

export class UnitAccessibilityPriorityTypeCreate extends OmitType(
  UnitAccessibilityPriorityType,
  ['id', 'createdAt', 'updatedAt'],
) {}
