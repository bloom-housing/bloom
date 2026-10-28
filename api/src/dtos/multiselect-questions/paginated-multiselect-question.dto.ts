import MultiselectQuestion from './multiselect-question.dto';
import { PaginationFactory } from '../shared/pagination.dto';

export class PaginatedMultiselectQuestionDto extends PaginationFactory<MultiselectQuestion>(
  MultiselectQuestion,
) {}
