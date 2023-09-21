import { OmitType } from '@nestjs/swagger';
import { Accessibility } from './accessibility.dto';

export class AccessibilityUpdate extends OmitType(Accessibility, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
