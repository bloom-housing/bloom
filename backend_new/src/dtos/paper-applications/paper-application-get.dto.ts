import { AbstractDTO } from '../shared/abstract.dto';
import { LanguagesEnum } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsDefined, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty } from '@nestjs/swagger';
import { Asset } from '../assets/asset-get.dto';

export class PaperApplication extends AbstractDTO {
  @Expose()
  @IsEnum(LanguagesEnum, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: LanguagesEnum, enumName: 'LanguagesEnum' })
  language: LanguagesEnum;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Asset)
  assets: Asset;
}
