import { BaseFilter } from '../shared/base-filter.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { MultiselectQuestionFilterKeys } from '../../enums/multiselect-questions/filter-key-enum';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';

export class MultiselectQuestionFilterParams extends BaseFilter {
  @Expose()
  @ApiProperty({
    type: String,
    example: 'uuid',
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [MultiselectQuestionFilterKeys.jurisdiction]?: string;

  @Expose()
  @ApiProperty({
    type: String,
    example: 'preferences',
    required: false,
  })
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [MultiselectQuestionFilterKeys.applicationSection]?: MultiselectQuestionsApplicationSectionEnum;
}
