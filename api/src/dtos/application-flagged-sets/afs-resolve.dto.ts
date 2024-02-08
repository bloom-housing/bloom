import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { FlaggedSetStatusEnum } from '@prisma/client';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { IdDTO } from '../shared/id.dto';

export class AfsResolve {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  afsId: string;

  @Expose()
  @IsEnum(FlaggedSetStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: FlaggedSetStatusEnum, enumName: 'FlaggedSetStatusEnum' })
  status: FlaggedSetStatusEnum;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(512, { groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => IdDTO)
  @ApiProperty({ type: IdDTO, isArray: true })
  applications: IdDTO[];
}
