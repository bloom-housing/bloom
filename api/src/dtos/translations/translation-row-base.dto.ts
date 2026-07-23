import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TranslationOrigin } from '@prisma/client';
import { IsDate, IsEnum, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

// Fields shared by the translation editor response rows.
export class TranslationRowBase {
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
  @Type(() => Date)
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
}
