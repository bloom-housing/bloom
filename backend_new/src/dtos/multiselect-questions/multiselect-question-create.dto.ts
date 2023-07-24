import { OmitType } from '@nestjs/swagger';
import { MultiselectQuestionUpdate } from './multiselect-question-update.dto';

export class MultiselectQuestionCreate extends OmitType(
  MultiselectQuestionUpdate,
  ['id'],
) {}
