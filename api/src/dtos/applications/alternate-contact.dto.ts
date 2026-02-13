import { Address } from '../addresses/address.dto';
import { AlternateContactRelationship } from '../../enums/applications/alternate-contact-relationship-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { Expose, Type } from 'class-transformer';
import { IdOnlyDTO } from '../shared/id-only.dto';
import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class AlternateContact extends IdOnlyDTO {
  @Expose()
  @IsEnum(AlternateContactRelationship, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiPropertyOptional({
    enum: AlternateContactRelationship,
    enumName: 'AlternateContactRelationship',
  })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  type?: AlternateContactRelationship;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  otherType?: string;

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
  lastName?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(128, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  agency?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(16, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiPropertyOptional()
  phoneNumber?: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @ApiPropertyOptional()
  emailAddress?: string;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Address)
  @ApiProperty({ type: Address })
  address: Address;
}
