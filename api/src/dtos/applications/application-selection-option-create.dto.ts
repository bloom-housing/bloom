import { OmitType } from '@nestjs/swagger';
import { ApplicationSelectionOptionUpdate } from './application-selection-option-update.dto';

export class ApplicationSelectionOptionCreate extends OmitType(
  ApplicationSelectionOptionUpdate,
  ['id'],
) {}
