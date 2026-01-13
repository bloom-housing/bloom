import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDefined, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ApplicationSelection } from './application-selection.dto';
import { ApplicationSelectionOptionUpdate } from './application-selection-option-update.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationSelectionUpdate extends OmitType(ApplicationSelection, [
  'id',
  'createdAt',
  'updatedAt',
  'selections',
]) {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  id?: string;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationSelectionOptionUpdate)
  @ApiProperty({
    type: ApplicationSelectionOptionUpdate,
    isArray: true,
  })
  selections: ApplicationSelectionOptionUpdate[];
}
