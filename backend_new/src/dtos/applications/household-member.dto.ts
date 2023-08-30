import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { YesNoEnum } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { Address } from '../addresses/address-get.dto';

export class HouseholdMember extends AbstractDTO {
  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  orderId?: number;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  firstName?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  middleName?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  lastName?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(8, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  birthMonth?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(8, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  birthDay?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(8, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  birthYear?: string;

  @Expose()
  @IsEnum(YesNoEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ enum: YesNoEnum, enumName: 'YesNoEnum' })
  sameAddress?: YesNoEnum;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  relationship?: string;

  @Expose()
  @IsEnum(YesNoEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ enum: YesNoEnum, enumName: 'YesNoEnum' })
  workInRegion?: YesNoEnum;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiPropertyOptional({ type: Address })
  householdMemberWorkAddress?: Address;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  householdMemberAddress: Address;
}
