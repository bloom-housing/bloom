import { Expose, Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { YesNoEnum } from '@prisma/client';
import { Address } from '../addresses/address-get.dto';

export class HouseholdMember extends AbstractDTO {
  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  orderId?: number | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
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
  @ApiProperty()
  lastName?: string | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(8, { groups: [ValidationsGroupsEnum.default] })
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
  @IsEnum(YesNoEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: YesNoEnum, enumName: 'YesNoEnum' })
  sameAddress?: YesNoEnum | null;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  relationship?: string | null;

  @Expose()
  @IsEnum(YesNoEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: YesNoEnum, enumName: 'YesNoEnum' })
  workInRegion?: YesNoEnum | null;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty()
  householdMemberWorkAddress?: Address | null;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty()
  householdMemberAddress: Address;
}
