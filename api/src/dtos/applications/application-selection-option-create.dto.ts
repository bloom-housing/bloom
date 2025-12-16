import { OmitType } from '@nestjs/swagger';
import ApplicationSelectionOptionUpdate from './application-selection-option-update.dto';

class ApplicationSelectionOptionCreate extends OmitType(
  ApplicationSelectionOptionUpdate,
  ['id'],
) {}

export {
  ApplicationSelectionOptionCreate as default,
  ApplicationSelectionOptionCreate,
};
