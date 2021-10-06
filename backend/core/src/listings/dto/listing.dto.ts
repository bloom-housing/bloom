import { Listing } from "../entities/listing.entity"
import { Expose, plainToClass, Transform, Type } from "class-transformer"
import { IsDefined, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import moment from "moment"
import { OmitType } from "@nestjs/swagger"
import { AddressDto } from "../../shared/dto/address.dto"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ListingStatus } from "../types/listing-status-enum"
import { UnitDto } from "../../units/dto/unit.dto"
import { ReservedCommunityTypeDto } from "../../reserved-community-type/dto/reserved-community-type.dto"
import { AssetDto } from "../../assets/dto/asset.dto"
import { ListingEventDto } from "./listing-event.dto"
import { listingUrlSlug } from "../../shared/url-helper"
import { IdNameDto } from "../../shared/dto/idName.dto"
import { UserBasicDto } from "../../auth/dto/user-basic.dto"
import { ApplicationMethodDto } from "../../application-methods/dto/application-method.dto"
import { UnitsSummaryDto } from "../../units-summary/dto/units-summary.dto"
import { ListingPreferenceDto } from "../../preferences/dto/listing-preference.dto"

export class ListingDto extends OmitType(Listing, [
  "applicationAddress",
  "applicationPickUpAddress",
  "applicationDropOffAddress",
  "applicationMailingAddress",
  "applications",
  "applicationMethods",
  "buildingSelectionCriteriaFile",
  "events",
  "image",
  "jurisdiction",
  "leasingAgents",
  "leasingAgentAddress",
  "listingPreferences",
  "property",
  "reservedCommunityType",
  "result",
  "unitsSummary",
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
  applicationAddress?: AddressDto | null

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
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => AssetDto)
  image?: AssetDto | null

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
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => ListingPreferenceDto)
  listingPreferences: ListingPreferenceDto[]

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdNameDto)
  jurisdiction: IdNameDto

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
  @Transform(
    (_value, listing) => {
      if (moment(listing.applicationDueDate).isBefore()) {
        listing.status = ListingStatus.closed
      }

      return listing.status
    },
    { toClassOnly: true }
  )
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
  @Type(() => UnitsSummaryDto)
  unitsSummary?: UnitsSummaryDto[]

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
}
