import { MultiselectQuestion } from '../multiselect-questions/multiselect-question-get.dto';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsDefined } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty } from '@nestjs/swagger';

export class ListingMultiselectQuestion {
  @Expose()
  @Type(() => MultiselectQuestion)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  multiselectQuestions: MultiselectQuestion;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  ordinal?: number | null;
}
