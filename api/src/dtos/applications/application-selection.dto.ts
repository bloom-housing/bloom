import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested, IsBoolean, IsDefined } from 'class-validator';
import { ApplicationSelectionOption } from './application-selection-option.dto';
import { AbstractDTO } from '../shared/abstract.dto';
import { IdDTO } from '../shared/id.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationSelection extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO })
  application: IdDTO;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  hasOptedOut?: boolean;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO })
  multiselectQuestion: IdDTO;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ApplicationSelectionOption)
  @ApiProperty({ type: ApplicationSelectionOption })
  selections: ApplicationSelectionOption[];
}
