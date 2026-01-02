import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { ApplicationSelectionUpdate } from './application-selection-update.dto';
import { ApplicationSelectionOptionCreate } from './application-selection-option-create.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationSelectionCreate extends OmitType(
  ApplicationSelectionUpdate,
  ['id', 'application', 'selections'],
) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationSelectionOptionCreate)
  @ApiProperty({
    type: ApplicationSelectionOptionCreate,
    isArray: true,
  })
  selections: ApplicationSelectionOptionCreate[];
}
