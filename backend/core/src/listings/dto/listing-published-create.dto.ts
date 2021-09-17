import { AssetCreateDto } from "../../assets/dto/asset.dto"
import { ListingReviewOrder } from "../types/listing-review-order-enum"
import { AddressCreateDto } from "../../shared/dto/address.dto"
import { ListingCreateDto } from "./listing-create.dto"
import { Expose, Type } from "class-transformer"
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDefined,
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
} from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { UnitCreateDto } from "../../units/dto/unit.dto"
import { OmitType } from "@nestjs/swagger"

// TODO blocked by:
//   missing - Is there a digital application? - boolean
//   missing - Is there a paper application? - boolean
//   missing - Is this a referral opportunity? - boolean
//   what exactly is - Is the waitlist open?
//   replace assets validator with Custom validator checking what kind of asset should exactly be passed

export class ListingPublishedCreateDto extends OmitType(ListingCreateDto, [
  "assets",
  "buildingAddress",
  "depositMin",
  "depositMax",
  "developer",
  "image",
  "leasingAgentEmail",
  "leasingAgentName",
  "leasingAgentPhone",
  "leasingAgentAddress",
  "name",
  "rentalAssistance",
  "reviewOrderType",
  "units",
] as const) {
  @Expose()
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => AssetCreateDto)
  @ArrayMinSize(1, { groups: [ValidationsGroupsEnum.default] })
  assets: AssetCreateDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  buildingAddress: AddressCreateDto

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  depositMin: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  depositMax: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  developer: string

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetCreateDto)
  image: AssetCreateDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressCreateDto)
  leasingAgentAddress?: AddressCreateDto | null

  @Expose()
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @IsEmail({}, { groups: [ValidationsGroupsEnum.default] })
  leasingAgentEmail: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  leasingAgentName: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(64, { groups: [ValidationsGroupsEnum.default] })
  leasingAgentPhone: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  name: string

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsNotEmpty({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  rentalAssistance: string

  @Expose()
  @IsEnum(ListingReviewOrder, { groups: [ValidationsGroupsEnum.default] })
  reviewOrderType: ListingReviewOrder

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @ArrayMinSize(1, { groups: [ValidationsGroupsEnum.default] })
  @ArrayMaxSize(256, { groups: [ValidationsGroupsEnum.default] })
  @Type(() => UnitCreateDto)
  units: UnitCreateDto[]
}
