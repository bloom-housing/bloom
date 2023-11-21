import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsDefined,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FlaggedSetStatusEnum, RuleEnum } from '@prisma/client';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { IdDTO } from '../shared/id.dto';
import { Application } from '../applications/application.dto';

export class ApplicationFlaggedSet extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: IdDTO })
  @Type(() => IdDTO)
  resolvingUser: IdDTO;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: IdDTO })
  @Type(() => IdDTO)
  listing: IdDTO;

  @Expose()
  @IsEnum(RuleEnum, { groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: RuleEnum, enumName: 'RuleEnum' })
  rule: RuleEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  ruleKey: string;

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiPropertyOptional()
  resolvedTime?: Date | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  listingId: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  showConfirmationAlert: boolean;

  @Expose()
  @IsEnum(FlaggedSetStatusEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: FlaggedSetStatusEnum, enumName: 'FlaggedSetStatusEnum' })
  status: FlaggedSetStatusEnum;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Application)
  @ApiProperty({ type: Application, isArray: true })
  applications: Application[];
}
