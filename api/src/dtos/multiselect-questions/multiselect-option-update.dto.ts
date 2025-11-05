import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { MultiselectOption } from './multiselect-option.dto';
import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class MultiselectOptionUpdate extends OmitType(MultiselectOption, [
  // TODO: Temporarily optional until after MSQ refactor
  'id',
  'createdAt',
  'updatedAt',
  'untranslatedName',
  'untranslatedText',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  // TODO: Temporarily optional until after MSQ refactor
  // @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;
}
