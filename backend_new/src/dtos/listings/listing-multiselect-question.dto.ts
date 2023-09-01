import { MultiselectQuestion } from '../multiselect-questions/multiselect-question.dto';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsDefined } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ListingMultiselectQuestion {
  @Expose()
  @Type(() => MultiselectQuestion)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: MultiselectQuestion })
  multiselectQuestions: MultiselectQuestion;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  ordinal?: number;
}
