import { MultiselectQuestion } from '../multiselect-questions/multiselect-question.dto';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsDefined } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingGet } from './listing-get.dto';

export class ListingMultiselectQuestion {
  @Type(() => ListingGet)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  listings: ListingGet;

  @Expose()
  @Type(() => MultiselectQuestion)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  multiselectQuestions: MultiselectQuestion;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  ordinal?: number | null;
}
