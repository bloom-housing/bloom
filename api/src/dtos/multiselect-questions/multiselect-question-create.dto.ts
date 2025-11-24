import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayMaxSize, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { MultiselectOptionCreate } from './multiselect-option-create.dto';
import { MultiselectQuestionUpdate } from './multiselect-question-update.dto';

export class MultiselectQuestionCreate extends OmitType(
  MultiselectQuestionUpdate,
  ['id', 'multiselectOptions', 'options'],
) {
  // TODO: Temporarily optional until after MSQ refactor
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectOptionCreate)
  @ApiPropertyOptional({ type: MultiselectOptionCreate, isArray: true })
  multiselectOptions?: MultiselectOptionCreate[];

  // TODO: This will be sunseted after MSQ refactor
  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => MultiselectOptionCreate)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional({ type: MultiselectOptionCreate, isArray: true })
  options?: MultiselectOptionCreate[];
}
