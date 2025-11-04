import { OmitType } from '@nestjs/swagger';
import { MultiselectOption } from './multiselect-option.dto';

export class MultiselectOptionUpdate extends OmitType(MultiselectOption, [
  'createdAt',
  'updatedAt',
  'untranslatedName',
  'untranslatedText',
]) {}
