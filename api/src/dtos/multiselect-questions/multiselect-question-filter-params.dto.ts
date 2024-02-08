import { BaseFilter } from '../shared/base-filter.dto';
import { Expose } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { MultiselectQuestionFilterKeys } from '../../enums/multiselect-questions/filter-key-enum';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';

export class MultiselectQuestionFilterParams extends BaseFilter {
  @Expose()
  @ApiPropertyOptional({
    example: 'uuid',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [MultiselectQuestionFilterKeys.jurisdiction]?: string;

  @Expose()
  @ApiPropertyOptional({
    enum: MultiselectQuestionsApplicationSectionEnum,
    enumName: 'MultiselectQuestionsApplicationSectionEnum',
    example: 'preferences',
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [MultiselectQuestionFilterKeys.applicationSection]?: MultiselectQuestionsApplicationSectionEnum;
}
