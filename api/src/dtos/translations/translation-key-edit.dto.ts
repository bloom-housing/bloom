import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsDefined, IsString, MaxLength } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { NoExecutableMarkup } from '../../decorators/no-executable-markup.decorator';

// Matches the editor's textarea limit, and sits well above the longest bundled base value.
const MAX_VALUE_LENGTH = 5000;
const MAX_KEY_LENGTH = 255;

export class TranslationKeyEdit {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(MAX_KEY_LENGTH, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  key: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(MAX_VALUE_LENGTH, { groups: [ValidationsGroupsEnum.default] })
  @NoExecutableMarkup({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  value: string;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  lastUpdatedAt?: Date;
}
