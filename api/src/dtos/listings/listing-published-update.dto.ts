import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDate,
  IsDefined,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ListingUpdate } from './listing-update.dto';
import { UnitCreate } from '../units/unit-create.dto';
import { AssetCreate } from '../assets/asset-create.dto';
import { ListingImageCreate } from './listing-image-create.dto';
import { AddressCreate } from '../addresses/address-create.dto';
import { EnforceLowerCase } from '../../decorators/enforce-lower-case.decorator';
import { ReviewOrderTypeEnum } from '@prisma/client';

export class ListingPublishedUpdate extends OmitType(ListingUpdate, [
  'assets',
  'depositMax',
  'depositMin',
  'developer',
  'digitalApplication',
  'listingImages',
  'leasingAgentEmail',
  'leasingAgentName',
  'leasingAgentPhone',
  'name',
  'paperApplication',
  'referralOpportunity',
  'rentalAssistance',
  'reviewOrderType',
  'units',
  'listingsBuildingAddress',
  'applicationDueDate',
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreate)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: AssetCreate, isArray: true })
  assets: AssetCreate[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: AddressCreate })
  listingsBuildingAddress: AddressCreate;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  depositMin: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  depositMax: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  developer: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  digitalApplication: boolean;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImageCreate)
  @ArrayMinSize(1, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: ListingImageCreate, isArray: true })
  listingImages: ListingImageCreate[];

  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  leasingAgentEmail: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  leasingAgentName: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsPhoneNumber('US', { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  leasingAgentPhone: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  name: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  paperApplication: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  referralOpportunity: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  rentalAssistance: string;

  @Expose()
  @IsEnum(ReviewOrderTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ReviewOrderTypeEnum,
    enumName: 'ReviewOrderTypeEnum',
  })
  reviewOrderType: ReviewOrderTypeEnum;

  @Expose()
  @ApiProperty({ isArray: true, type: UnitCreate })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMinSize(1, { groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitCreate)
  units: UnitCreate[];

  @Expose()
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @ValidateIf(
    (o) =>
      !(
        o.applicationDueDate == undefined &&
        o.reviewOrderType == ReviewOrderTypeEnum.waitlist
      ),
    {
      groups: [ValidationsGroupsEnum.default],
    },
  )
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  @ApiProperty()
  applicationDueDate: Date;
}
