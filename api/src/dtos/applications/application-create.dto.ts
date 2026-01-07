import { Expose, Type } from 'class-transformer';
import { ArrayMaxSize, ValidateNested } from 'class-validator';
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ApplicationUpdate } from './application-update.dto';
import { ApplicationSelectionCreate } from './application-selection-create.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationCreate extends OmitType(ApplicationUpdate, [
  'id',
  'applicationSelections',
]) {
  // TODO: Temporarily optional until after MSQ refactor
  @Expose()
  // @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(64, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationSelectionCreate)
  @ApiPropertyOptional({
    type: ApplicationSelectionCreate,
    isArray: true,
  })
  applicationSelections?: ApplicationSelectionCreate[];
}
