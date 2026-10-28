import { Address } from '../addresses/address.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { Expose, Type } from 'class-transformer';
import { IdOnlyDTO } from '../shared/id-only.dto';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { YesNoEnum } from '@prisma/client';

export class Applicant extends IdOnlyDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @MinLength(1, { groups: [ValidationsGroupsEnum.default] })
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
  @MinLength(1, { groups: [ValidationsGroupsEnum.default] })
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
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @ApiPropertyOptional()
  emailAddress?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  noEmail?: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  phoneNumber?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  phoneNumberType?: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  noPhone?: boolean;

  @Expose()
  @IsEnum(YesNoEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ enum: YesNoEnum, enumName: 'YesNoEnum' })
  workInRegion?: YesNoEnum;

  @Expose()
  @IsEnum(YesNoEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ enum: YesNoEnum, enumName: 'YesNoEnum' })
  fullTimeStudent?: YesNoEnum;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  applicantWorkAddress: Address;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  applicantAddress: Address;
}
