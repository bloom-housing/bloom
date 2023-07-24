import { OmitType } from '@nestjs/swagger';
import { MultiselectQuestion } from './multiselect-question-get.dto';

export class MultiselectQuestionUpdate extends OmitType(MultiselectQuestion, [
  'createdAt',
  'updatedAt',
  'untranslatedText',
  'untranslatedText',
]) {}
