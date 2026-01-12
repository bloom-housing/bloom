import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
} from '@prisma/client';
import { BaseFilter } from '../shared/base-filter.dto';
import { MultiselectQuestionFilterKeys } from '../../enums/multiselect-questions/filter-key-enum';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class MultiselectQuestionFilterParams extends BaseFilter {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    enum: MultiselectQuestionsApplicationSectionEnum,
    enumName: 'MultiselectQuestionsApplicationSectionEnum',
    example: 'preferences',
  })
  [MultiselectQuestionFilterKeys.applicationSection]?: MultiselectQuestionsApplicationSectionEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    example: 'uuid',
  })
  [MultiselectQuestionFilterKeys.jurisdiction]?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({
    enum: MultiselectQuestionsStatusEnum,
    enumName: 'MultiselectQuestionsStatusEnum',
    example: 'active',
  })
  [MultiselectQuestionFilterKeys.status]?: MultiselectQuestionsStatusEnum;
}
