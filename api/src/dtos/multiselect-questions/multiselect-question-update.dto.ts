import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ArrayMaxSize, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { MultiselectOptionUpdate } from './multiselect-option-update.dto';
import { MultiselectQuestion } from './multiselect-question.dto';

export class MultiselectQuestionUpdate extends OmitType(MultiselectQuestion, [
  'createdAt',
  'updatedAt',
  'multiselectOptions',
  'options',
  'untranslatedName',
  'untranslatedText',
]) {
  // TODO: Temporarily optional until after MSQ refactor
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => MultiselectOptionUpdate)
  @ApiPropertyOptional({ type: MultiselectOptionUpdate, isArray: true })
  multiselectOptions?: MultiselectOptionUpdate[];

  // TODO: This will be sunseted after MSQ refactor
  @Expose()
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => MultiselectOptionUpdate)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ApiPropertyOptional({ type: MultiselectOptionUpdate, isArray: true })
  options?: MultiselectOptionUpdate[];
}
