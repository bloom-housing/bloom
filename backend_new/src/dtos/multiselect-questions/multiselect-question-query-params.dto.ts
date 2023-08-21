import { Expose, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { MultiselectQuestionFilterParams } from './multiselect-question-filter-params.dto';
import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class MultiselectQuestionQueryParams {
  @Expose()
  @ApiPropertyOptional({
    name: 'filter',
    type: MultiselectQuestionFilterParams,
    isArray: true,
    example: { $comparison: '=', applicationSection: 'programs' },
  })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(16, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => MultiselectQuestionFilterParams)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  filter?: MultiselectQuestionFilterParams[];
}
