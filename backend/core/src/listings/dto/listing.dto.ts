import { Listing } from "../entities/listing.entity"
import { Expose, plainToClass, Transform, Type } from "class-transformer"
import { IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { ApiProperty, OmitType } from "@nestjs/swagger"
import { Column } from "typeorm"
import { AddressDto } from "../../shared/dto/address.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ListingStatus } from "../types/listing-status-enum"
import { UnitDto } from "../../units/dto/unit.dto"
import { ReservedCommunityTypeDto } from "../../reserved-community-type/dto/reserved-community-type.dto"
import { AssetDto } from "../../assets/dto/asset.dto"
import { ListingEventDto } from "./listing-event.dto"
import { listingUrlSlug } from "../../shared/url-helper"
import { JurisdictionSlimDto } from "../../jurisdictions/dto/jurisdiction.dto"
import { UserBasicDto } from "../../auth/dto/user-basic.dto"
import { ApplicationMethodDto } from "../../application-methods/dto/application-method.dto"
import { UnitGroupDto } from "../../units-summary/dto/unit-group.dto"
import { ListingFeaturesDto } from "./listing-features.dto"
import { ListingUtilitiesDto } from "./listing-utilities.dto"
import { Region } from "../../property/types/region-enum"
import { ListingPreferenceDto } from "../../preferences/dto/listing-preference.dto"
import { ListingProgramDto } from "../../program/dto/listing-program.dto"
import { ListingImageDto } from "./listing-image.dto"
import { ListingNeighborhoodAmenitiesDto } from "./listing-neighborhood-amenities.dto"

export class ListingDto extends OmitType(Listing, [
  "applicationPickUpAddress",
  "applicationDropOffAddress",
  "applicationMailingAddress",
  "applications",
  "applicationMethods",
  "buildingSelectionCriteriaFile",
  "events",
  "images",
  "jurisdiction",
  "leasingAgents",
  "leasingAgentAddress",
  "listingPreferences",
  "listingPrograms",
  "neighborhoodAmenities",
  "property",
  "reservedCommunityType",
  "result",
  "unitGroups",
  "features",
  "utilities",
] as const) {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ApplicationMethodDto)
  applicationMethods: ApplicationMethodDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  applicationPickUpAddress?: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  applicationDropOffAddress: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  applicationMailingAddress: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetDto)
  buildingSelectionCriteriaFile?: AssetDto | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingEventDto)
  events: ListingEventDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingImageDto)
  images?: ListingImageDto[] | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  leasingAgentAddress?: AddressDto | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UserBasicDto)
  leasingAgents?: UserBasicDto[] | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default], each: true })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingProgramDto)
  listingPrograms?: ListingProgramDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingPreferenceDto)
  listingPreferences: ListingPreferenceDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ListingNeighborhoodAmenitiesDto)
  neighborhoodAmenities?: ListingNeighborhoodAmenitiesDto | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => JurisdictionSlimDto)
  jurisdiction: JurisdictionSlimDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ReservedCommunityTypeDto)
  reservedCommunityType?: ReservedCommunityTypeDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetDto)
  result?: AssetDto | null

  @Expose()
  @IsEnum(ListingStatus, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ListingStatus, enumName: "ListingStatus" })
  status: ListingStatus

  @Expose()
  @Type(() => UnitDto)
  @Transform(
    (value, obj: Listing) => {
      return plainToClass(UnitDto, obj.property?.units)
    },
    { toClassOnly: true }
  )
  units: UnitDto[]

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.accessibility
    },
    { toClassOnly: true }
  )
  accessibility?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.amenities
    },
    { toClassOnly: true }
  )
  amenities?: string | null

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AddressDto)
  @Transform(
    (value, obj: Listing) => {
      return plainToClass(AddressDto, obj.property.buildingAddress)
    },
    { toClassOnly: true }
  )
  buildingAddress: AddressDto

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.buildingTotalUnits
    },
    { toClassOnly: true }
  )
  buildingTotalUnits?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.developer
    },
    { toClassOnly: true }
  )
  developer?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.householdSizeMax
    },
    { toClassOnly: true }
  )
  householdSizeMax?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.householdSizeMin
    },
    { toClassOnly: true }
  )
  householdSizeMin?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.neighborhood
    },
    { toClassOnly: true }
  )
  neighborhood?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.petPolicy
    },
    { toClassOnly: true }
  )
  petPolicy?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.smokingPolicy
    },
    { toClassOnly: true }
  )
  smokingPolicy?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.unitsAvailable
    },
    { toClassOnly: true }
  )
  unitsAvailable?: number | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.unitAmenities
    },
    { toClassOnly: true }
  )
  unitAmenities?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.servicesOffered
    },
    { toClassOnly: true }
  )
  servicesOffered?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.yearBuilt
    },
    { toClassOnly: true }
  )
  yearBuilt?: number | null

  @Column({ type: "enum", enum: Region, nullable: true })
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(Region, { groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.property?.region
    },
    { toClassOnly: true }
  )
  @ApiProperty({
    enum: Region,
    enumName: "Region",
  })
  region?: Region | null

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return listingUrlSlug(obj)
    },
    { toClassOnly: true }
  )
  urlSlug: string

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => UnitGroupDto)
  unitGroups?: UnitGroupDto[]

  // Keep countyCode so we don't have to update frontend apps yet
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @Transform(
    (value, obj: Listing) => {
      return obj.jurisdiction?.name
    },
    { toClassOnly: true }
  )
  countyCode?: string

  @Expose()
  @Type(() => ListingFeaturesDto)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  features?: ListingFeaturesDto

  @Expose()
  @Type(() => ListingUtilitiesDto)
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  utilities?: ListingUtilitiesDto
}
