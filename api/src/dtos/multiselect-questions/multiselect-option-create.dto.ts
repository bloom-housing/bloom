import { OmitType } from '@nestjs/swagger';
import { MultiselectOptionUpdate } from './multiselect-option-update.dto';

export class MultiselectOptionCreate extends OmitType(MultiselectOptionUpdate, [
  'id',
]) {}
