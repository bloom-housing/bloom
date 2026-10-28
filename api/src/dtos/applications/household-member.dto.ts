import { Address } from '../addresses/address.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { HouseholdMemberRelationship } from '../../enums/applications/household-member-relationship-enum';
import { IdOnlyDTO } from '../shared/id-only.dto';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { YesNoEnum } from '@prisma/client';

export class HouseholdMember extends IdOnlyDTO {
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
  @IsEnum(HouseholdMemberRelationship, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: HouseholdMemberRelationship,
    enumName: 'HouseholdMemberRelationship',
  })
  relationship?: HouseholdMemberRelationship;

  @Expose()
  @IsEnum(YesNoEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ enum: YesNoEnum, enumName: 'YesNoEnum' })
  workInRegion?: YesNoEnum;

  @Expose()
  @IsEnum(YesNoEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ enum: YesNoEnum, enumName: 'YesNoEnum' })
  fullTimeStudent?: YesNoEnum;

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
