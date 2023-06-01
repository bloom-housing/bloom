import { Expose, Type } from 'class-transformer';
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
import { AbstractDTO } from '../shared/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { YesNoEnum } from '@prisma/client';
import { Address } from '../addresses/address-get.dto';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';

export class Applicant extends AbstractDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @MinLength(1, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  firstName?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  middleName?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @MinLength(1, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  lastName?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(8, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  birthMonth?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(8, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  birthDay?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(8, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  birthYear?: string | null;

  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @ApiProperty()
  emailAddress?: string | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  noEmail?: boolean | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  phoneNumber?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  phoneNumberType?: string | null;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  noPhone?: boolean | null;

  @Expose()
  @IsEnum(YesNoEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: YesNoEnum, enumName: 'YesNoEnum' })
  workInRegion?: YesNoEnum;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty()
  applicantWorkAddress: Address;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty()
  applicantAddress: Address;
}
