import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { TranslationRowBase } from './translation-row-base.dto';

// One editable override key for a (site, language) scope, with staleness for the editor.
export class TranslationRawKey extends TranslationRowBase {
  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  stale: boolean;
}
