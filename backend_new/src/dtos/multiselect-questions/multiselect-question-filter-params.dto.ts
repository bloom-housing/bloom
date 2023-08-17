import { BaseFilter } from '../shared/base-filter.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { MultiselectQuestionFilterKeys } from '../../enums/multiselect-questions/filter-key-enum';
import { MultiselectQuestionsApplicationSectionEnum } from '@prisma/client';

export class MultiselectQuestionFilterParams extends BaseFilter {
  @Expose()
  @ApiProperty({
    example: 'uuid',
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  [MultiselectQuestionFilterKeys.jurisdiction]?: string;

  @Expose()
  @ApiProperty({
    enum: MultiselectQuestionsApplicationSectionEnum,
    enumName: 'MultiselectQuestionsApplicationSectionEnum',
    example: 'preferences',
    required: false,
  })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  [MultiselectQuestionFilterKeys.applicationSection]?: MultiselectQuestionsApplicationSectionEnum;
}
