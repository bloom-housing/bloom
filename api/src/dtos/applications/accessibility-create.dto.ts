import { AccessibilityUpdate } from './accessibility-update.dto';
import { OmitType } from '@nestjs/swagger';

export class AccessibilityCreate extends OmitType(AccessibilityUpdate, [
  'id',
]) {}
