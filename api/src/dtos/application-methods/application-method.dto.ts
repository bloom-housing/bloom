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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationMethodsTypeEnum } from '@prisma/client';
import { PaperApplication } from '../paper-applications/paper-application.dto';

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
  @ApiPropertyOptional()
  label?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  externalReference?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  acceptsPostmarkedApplications?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  phoneNumber?: string;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => PaperApplication)
  @ApiPropertyOptional({ type: PaperApplication, isArray: true })
  paperApplications?: PaperApplication[];
}
