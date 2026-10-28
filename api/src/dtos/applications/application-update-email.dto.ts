import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ApplicationDeclineReasonEnum,
  ApplicationStatusEnum,
} from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationUpdateEmailDto {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ApplicationStatusEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: ApplicationStatusEnum,
    enumName: 'ApplicationStatusEnum',
  })
  previousStatus?: ApplicationStatusEnum;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ApplicationDeclineReasonEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: ApplicationDeclineReasonEnum,
    enumName: 'ApplicationDeclineReasonEnum',
  })
  previousApplicationDeclineReason?: ApplicationDeclineReasonEnum;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Number)
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  previousAccessibleUnitWaitlistNumber?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Number)
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  previousConventionalUnitWaitlistNumber?: number;
}
