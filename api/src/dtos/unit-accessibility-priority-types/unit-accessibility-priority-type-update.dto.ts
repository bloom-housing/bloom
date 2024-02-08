import { OmitType } from '@nestjs/swagger';
import { UnitAccessibilityPriorityType } from './unit-accessibility-priority-type.dto';

export class UnitAccessibilityPriorityTypeUpdate extends OmitType(
  UnitAccessibilityPriorityType,
  ['createdAt', 'updatedAt'],
) {}
