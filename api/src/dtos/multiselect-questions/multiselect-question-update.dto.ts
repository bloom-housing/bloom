import { OmitType } from '@nestjs/swagger';
import { MultiselectQuestion } from './multiselect-question.dto';

export class MultiselectQuestionUpdate extends OmitType(MultiselectQuestion, [
  'createdAt',
  'updatedAt',
  'status',
  'untranslatedText',
  'untranslatedText',
]) {}
