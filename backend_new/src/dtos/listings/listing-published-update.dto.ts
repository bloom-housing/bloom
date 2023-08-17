import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  MaxLength,
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
]) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreate)
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: AssetCreate, isArray: true, required: true })
  assets: AssetCreate[];

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreate)
  @ApiProperty({ type: AddressCreate, required: true })
  listingsBuildingAddress: AddressCreate;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  depositMin: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  depositMax: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  developer: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  digitalApplication: boolean;

  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImageCreate)
  @ApiProperty({ type: ListingImageCreate, isArray: true, required: true })
  listingImages: ListingImageCreate[];

  @Expose()
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  @EnforceLowerCase()
  @ApiProperty({ required: true })
  leasingAgentEmail: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  leasingAgentName: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsPhoneNumber('US', { groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  leasingAgentPhone: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  name: string;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  paperApplication: boolean;

  @Expose()
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  referralOpportunity: boolean;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ required: true })
  rentalAssistance: string;

  @Expose()
  @IsEnum(ReviewOrderTypeEnum, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({
    enum: ReviewOrderTypeEnum,
    enumName: 'ReviewOrderTypeEnum',
    required: true,
  })
  reviewOrderType: ReviewOrderTypeEnum;

  @Expose()
  @ApiProperty({ required: true, isArray: true, type: UnitCreate })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMinSize(1, { groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitCreate)
  units: UnitCreate[];
}
