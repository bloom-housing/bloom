import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationSelectionOption } from './application-selection-option.dto';
import { Expose, Type } from 'class-transformer';
import { IdDTO } from '../shared/id.dto';
import { IdOnlyDTO } from '../shared/id-only.dto';
import { ValidateNested, IsBoolean, IsDefined } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationSelection extends IdOnlyDTO {
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
