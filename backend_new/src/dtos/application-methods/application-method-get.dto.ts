import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsDefined,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationMethodsTypeEnum } from '@prisma/client';
import { PaperApplication } from '../paper-applications/paper-application-get.dto';

export class ApplicationMethod extends AbstractDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ApplicationMethodsTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: ApplicationMethodsTypeEnum,
    enumName: 'ApplicationMethodsTypeEnum',
  })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  type: ApplicationMethodsTypeEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  label?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  externalReference?: string | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  acceptsPostmarkedApplications?: boolean | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  phoneNumber?: string | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PaperApplication)
  paperApplications?: PaperApplication[] | null;
}
