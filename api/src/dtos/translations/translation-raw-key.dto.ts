import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TranslationOrigin } from '@prisma/client';
import { IsBoolean, IsDate, IsEnum, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

// One editable override key for a (site, language) scope, with staleness for the editor.
export class TranslationRawKey {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  key: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  value: string;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  updatedAt: Date;

  @Expose()
  @IsEnum(TranslationOrigin, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: TranslationOrigin,
    enumName: 'TranslationOrigin',
    nullable: true,
  })
  origin: TranslationOrigin | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  stale: boolean;
}
